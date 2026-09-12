import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { chromium, firefox, type FullConfig, webkit } from "@playwright/test";
import {
	formatIdentityFailure,
	probeRoutes,
	requiredRoutes,
} from "../scripts/src/e2e-app-identity";
import {
	formatMissingBrowsers,
	isMissingBrowserError,
	selectedProjectNames,
} from "../scripts/src/e2e-browsers";

const run = promisify(execFile);

const browserTypes = { chromium, firefox, webkit };

const READY_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 250;

const probe = (baseUrl: string) =>
	probeRoutes(baseUrl, requiredRoutes, (url) => fetch(url, { redirect: "manual" }));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const lockFile = new URL("../.astro/preview.json", import.meta.url);

interface PreviewLock {
	pid: number;
	port: number;
	url: string;
}

/** The live preview lock, or null when none exists or its process is gone. */
const readLiveLock = async (): Promise<PreviewLock | null> => {
	let lock: PreviewLock;
	try {
		lock = JSON.parse(await readFile(lockFile, "utf-8")) as PreviewLock;
	} catch {
		return null;
	}
	try {
		process.kill(lock.pid, 0);
	} catch {
		return null;
	}
	return lock;
};

/**
 * Starts and stops the preview server for the E2E run.
 *
 * Playwright's own `webServer` cannot own `astro preview`: under an AI-agent
 * environment Astro detaches it automatically (ADR-063), so the launcher saw
 * the command exit and either aborted the run ("Process from config.webServer
 * exited early") or leaked a daemon that later runs silently adopted — the
 * mechanism behind the port collisions in ADR-063.
 *
 * The server is therefore started with the explicit `--background` flag Astro
 * 7.2 added, which behaves the same under an agent, in a terminal and in CI:
 * the command returns once the server is listening, records the pid in
 * `.astro/preview.json`, and `astro preview stop` finds it there. Setup still
 * polls until the app answers and asserts it is this app; teardown stops the
 * server only while the lock holds the pid this run started.
 *
 * Astro keeps one preview lock per project, and `--ignore-lock` is
 * foreground-only (rejected outright under agent detection), so a preview
 * started elsewhere — an LHCI run on 4321, one left open in a terminal — must
 * be stopped or reused; it cannot be run alongside.
 */
/**
 * Reports every browser the run needs but does not have, once, before any test
 * starts — instead of Playwright repeating the same guidance per failing test.
 *
 * A real launch is the check: it is ~230ms and, unlike testing
 * `executablePath()` for existence, it also covers the headless shell Playwright
 * actually starts, which is the binary the 1.63 bump left missing.
 */
async function assertBrowsersInstalled(config: FullConfig): Promise<void> {
	const projectNames = config.projects.map((project) => project.name);
	const selected = selectedProjectNames(process.argv.slice(2), projectNames);

	const needed = new Set<string>();
	for (const name of selected) {
		const project = config.projects.find((candidate) => candidate.name === name);
		// Project names are conventional, not required, so prefer the resolved
		// browserName that `devices[...]` sets.
		const browser = project?.use?.browserName ?? name;
		if (browser in browserTypes) needed.add(browser);
	}

	const missing: string[] = [];
	for (const browser of needed) {
		try {
			const instance = await browserTypes[browser as keyof typeof browserTypes].launch();
			await instance.close();
		} catch (error) {
			// Only the not-downloaded case is ours to report. Anything else is left
			// to the tests: a preflight must never be why a run fails.
			if (isMissingBrowserError(error)) missing.push(browser);
		}
	}

	if (missing.length > 0) throw new Error(formatMissingBrowsers(missing));
}

export default async function globalSetup(config: FullConfig) {
	await assertBrowsersInstalled(config);

	const baseUrl = config.projects[0]?.use?.baseURL;
	if (!baseUrl) return;

	const port = new URL(baseUrl).port;

	// A server already serving this app is reused as-is: `astro preview` reads
	// dist/ per request, so a rebuilt site is picked up without a restart.
	if (formatIdentityFailure(baseUrl, await probe(baseUrl)) === null) {
		return;
	}

	// Anything else answering on this port is another application. Stop rather
	// than test it — this is the failure the guard exists for.
	const probes = await probe(baseUrl);
	if (probes.some((p) => p.status !== "unreachable")) {
		throw new Error(formatIdentityFailure(baseUrl, probes) as string);
	}

	// One lock per project: a live preview on another port would make
	// `--background` report that server instead of starting ours.
	const held = await readLiveLock();
	if (held && String(held.port) !== port) {
		throw new Error(
			`Another astro preview holds this project's lock at ${held.url} (pid ${held.pid}).\n` +
				"Stop it with `pnpm exec astro preview stop`, or run the suite against it with " +
				`E2E_BASE_URL=${held.url} if it serves the current build.`,
		);
	}

	await run("pnpm", ["exec", "astro", "preview", "--background", "--port", port], {
		env: { ...process.env, SITE_URL: process.env.SITE_URL ?? baseUrl },
	});
	const ownPid = (await readLiveLock())?.pid;

	const stop = async () => {
		// Only the server this run started is ours to stop.
		if (ownPid === undefined || (await readLiveLock())?.pid !== ownPid) return;
		await run("pnpm", ["exec", "astro", "preview", "stop"]).catch(() => {});
	};

	const deadline = Date.now() + READY_TIMEOUT_MS;
	let failure = formatIdentityFailure(baseUrl, await probe(baseUrl));
	while (failure !== null && Date.now() < deadline) {
		await sleep(POLL_INTERVAL_MS);
		failure = formatIdentityFailure(baseUrl, await probe(baseUrl));
	}
	if (failure !== null) {
		await stop();
		throw new Error(`Preview server never became ready at ${baseUrl}.\n\n${failure}`);
	}

	// Returned function runs as Playwright's global teardown.
	return stop;
}
