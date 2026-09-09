import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { FullConfig } from "@playwright/test";
import {
	formatIdentityFailure,
	probeRoutes,
	requiredRoutes,
} from "../scripts/src/e2e-app-identity";

const run = promisify(execFile);

const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 250;

const probe = (baseURL: string) =>
	probeRoutes(baseURL, requiredRoutes, (url) => fetch(url, { redirect: "manual" }));

/**
 * Starts and stops the preview server for the E2E run.
 *
 * Playwright's own `webServer` cannot do this here: `astro preview` detaches
 * into a background process and the launching command exits immediately, so
 * Playwright either aborts with "Process from config.webServer exited early"
 * or wins a race against the detached server binding its port. Worse, because
 * Playwright never owned the process it could not stop it either — every run
 * leaked a daemon, and those leaked daemons are what later runs silently
 * adopted. That is the mechanism behind the port collisions in ADR-063.
 *
 * Owning the lifecycle here makes a cold `pnpm test:e2e` work, leaves nothing
 * behind, and refuses to run against a server that is not this application.
 */
export default async function globalSetup(config: FullConfig) {
	const baseURL = config.projects[0]?.use?.baseURL;
	if (!baseURL) return;

	const port = new URL(baseURL).port;

	// A server already serving this app is reused as-is: `astro preview` reads
	// dist/ per request, so a rebuilt site is picked up without a restart.
	if (formatIdentityFailure(baseURL, await probe(baseURL)) === null) {
		return;
	}

	// Anything else answering on this port is another application. Stop rather
	// than test it — this is the failure the guard exists for.
	const reachable = (await probe(baseURL)).some((p) => p.status !== "unreachable");
	if (reachable) {
		throw new Error(formatIdentityFailure(baseURL, await probe(baseURL)) as string);
	}

	await run("pnpm", ["exec", "astro", "preview", "--port", port], {
		env: { ...process.env, SITE_URL: process.env.SITE_URL ?? baseURL },
	});

	const deadline = Date.now() + READY_TIMEOUT_MS;
	let failure = formatIdentityFailure(baseURL, await probe(baseURL));
	while (failure !== null && Date.now() < deadline) {
		await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
		failure = formatIdentityFailure(baseURL, await probe(baseURL));
	}
	if (failure !== null) {
		await run("pnpm", ["exec", "astro", "preview", "stop"]).catch(() => {});
		throw new Error(`Preview server never became ready.\n\n${failure}`);
	}

	// Returned function runs as Playwright's global teardown.
	return async () => {
		await run("pnpm", ["exec", "astro", "preview", "stop"]).catch(() => {});
	};
}
