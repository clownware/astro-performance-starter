// Which browsers a Playwright run will actually need, and how to report the
// ones that are not installed.
//
// Playwright already prints correct guidance when a browser is missing — it
// even names the package manager — but it prints it once per failing test, so
// a version bump buries one useful message under 89 identical copies. The
// preflight in e2e/global-setup.ts says it once, before any test runs.
//
// The subtlety is knowing which browsers to check. `FullConfig.projects` is
// NOT filtered by `--project`: it lists every configured project even when the
// run is scoped to one. Checking all of them would fail a `--project=chromium`
// run on a machine that only has Chromium — which is the normal state, and CI's
// state too. So the filter is read from argv.

/** Playwright project selectors on the command line, in the order given. */
export function projectFilters(argv: readonly string[]): string[] {
  const filters: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--project=")) {
      filters.push(arg.slice("--project=".length));
    } else if (arg === "--project" && argv[i + 1] !== undefined) {
      filters.push(argv[i + 1]);
      i++;
    }
  }
  return filters;
}

/**
 * The project names a run will execute. With no `--project` flag every
 * configured project runs, which is what an unfiltered `pnpm test:e2e` does.
 */
export function selectedProjectNames(
  argv: readonly string[],
  available: readonly string[],
): string[] {
  const filters = projectFilters(argv);
  if (filters.length === 0) {
    return [...available];
  }
  return available.filter((name) => filters.includes(name));
}

/**
 * True when a launch failure means "this browser was never downloaded", rather
 * than a crash, a sandbox problem, or anything else we should not swallow. The
 * preflight must never be the reason a run fails.
 */
export function isMissingBrowserError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Executable doesn't exist");
}

export function formatMissingBrowsers(missing: readonly string[]): string {
  const plural = missing.length === 1 ? "browser is" : "browsers are";
  return [
    `Playwright ${plural} not installed: ${missing.join(", ")}.`,
    "",
    "This happens after a Playwright version bump — the browser build is",
    "pinned to the package version. Download it once with:",
    "",
    `    pnpm exec playwright install ${missing.join(" ")}`,
    "",
    "Reported here rather than once per test, which is how Playwright would",
    "otherwise surface it.",
  ].join("\n");
}
