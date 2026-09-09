import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import type { FullConfig } from "@playwright/test";
import {
	formatIdentityFailure,
	probeRoutes,
	requiredRoutes,
} from "../scripts/src/e2e-app-identity";

const run = promisify(execFile);

const READY_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 250;

const probe = (baseUrl: string) =>
	probeRoutes(baseUrl, requiredRoutes, (url) => fetch(url, { redirect: "manual" }));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Starts and stops the preview server for the E2E run.
 *
 * Playwright's own `webServer` cannot do this. `astro preview` detaches on some
 * platforms and blocks in the foreground on others, so Playwright's launcher
 * either exited immediately — aborting with "Process from config.webServer
 * exited early", or winning a race against the detached server binding its port
 * — and, never having owned the process, could not stop it afterwards. Every
 * run leaked a daemon, and those leaked daemons are what later runs silently
 * adopted. That is the mechanism behind the port collisions in ADR-063.
 *
 * The server is therefore spawned detached and never awaited: whether it
 * daemonises (macOS, observed) or stays in the foreground (CI, observed), setup
 * only polls until the app answers. Teardown covers both shapes.
 */
export default async function globalSetup(config: FullConfig) {
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

	// Detached and deliberately not awaited: `astro preview` blocks in the
	// foreground under CI, where awaiting it hung the run until the job timeout.
	const child = spawn("pnpm", ["exec", "astro", "preview", "--port", port], {
		detached: true,
		stdio: "ignore",
		env: { ...process.env, SITE_URL: process.env.SITE_URL ?? baseUrl },
	});
	child.unref();

	const stop = async () => {
		// Covers the daemonising shape…
		await run("pnpm", ["exec", "astro", "preview", "stop"]).catch(() => {});
		// …and the foreground one, where the spawned group is itself the server.
		if (child.pid !== undefined && child.exitCode === null) {
			try {
				process.kill(-child.pid, "SIGTERM");
			} catch {
				// Already exited, or it daemonised and the group is gone.
			}
		}
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
