// Identity guard for the E2E server.
//
// Playwright's `reuseExistingServer` adopts whatever answers on the configured
// port. Liveness is not identity: any server returning 200 on `/` passes that
// probe, so a sibling project holding the port gets tested instead of this one,
// silently. ADR-063 records two prior incidents (Playwright and local
// Lighthouse); a third happened on 2026-09-08 against a clone of this template
// that served `/` but 404'd every other route the suite needs.
//
// This asserts the server serves the surface the specs actually exercise, and
// fails naming exactly what was missing. Pure functions here; the network call
// is injected so the failure path is unit-testable without a server.

/**
 * Routes the E2E specs navigate to. Kept to one representative route per
 * top-level section — enough that a different app cannot satisfy all of them,
 * short enough to stay fast. Derived from the `page.goto` calls in `e2e/`.
 */
export const requiredRoutes = [
  "/",
  "/about/",
  "/adr/",
  "/blog/",
  "/contact/",
  "/how-it-works/",
  "/showcase/",
] as const;

export interface RouteProbe {
  route: string;
  /** HTTP status, or `"unreachable"` when the request itself failed. */
  status: number | "unreachable";
}

type FetchLike = (url: string) => Promise<{ status: number }>;

/** Probes every route against `baseURL`. Never throws — transport errors become `"unreachable"`. */
export async function probeRoutes(
  baseUrl: string,
  routes: readonly string[],
  fetchImpl: FetchLike,
): Promise<RouteProbe[]> {
  const base = baseUrl.replace(/\/$/, "");
  return Promise.all(
    routes.map(async (route) => {
      try {
        const { status } = await fetchImpl(`${base}${route}`);
        return { route, status };
      } catch {
        return { route, status: "unreachable" as const };
      }
    }),
  );
}

/** Routes that did not answer with a 2xx. */
export function failedProbes(probes: readonly RouteProbe[]): RouteProbe[] {
  return probes.filter((p) => p.status === "unreachable" || p.status < 200 || p.status >= 300);
}

/**
 * Returns a diagnostic when the probed server is not this app, or `null` when
 * every route answered. The message names the port and the offending routes,
 * because the failure it describes is easy to misread as a broken test suite.
 */
export function formatIdentityFailure(
  baseUrl: string,
  probes: readonly RouteProbe[],
): string | null {
  const failed = failedProbes(probes);
  if (failed.length === 0) {
    return null;
  }

  const allUnreachable =
    failed.length === probes.length && failed.every((p) => p.status === "unreachable");
  const detail = failed.map((p) => `  ${p.route} → ${p.status}`).join("\n");

  if (allUnreachable) {
    return [
      `No server answered at ${baseUrl}.`,
      "",
      detail,
      "",
      "Build first (`pnpm run build`), or set E2E_PORT/E2E_BASE_URL if the",
      "server is somewhere else.",
    ].join("\n");
  }

  return [
    `The server at ${baseUrl} is not this application.`,
    "",
    "It answered, but these routes did not:",
    detail,
    "",
    "Something else is on that port. Without this check the suite would have",
    "run against it and reported the mismatch as failing tests (ADR-063).",
    "Stop the other server, or point this run elsewhere with E2E_PORT /",
    "E2E_BASE_URL.",
  ].join("\n");
}
