import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const devDependencies: Record<string, string> = JSON.parse(
  readFileSync(join(repoRoot, "package.json"), "utf8"),
).devDependencies;

/**
 * The Vitest major that @stryker-mutator/vitest-runner actually drives.
 *
 * The runner declares `vitest: ">=2.0.0"` as a peer range, so npm installs
 * cleanly against any major and nothing warns. That range is not true: on
 * Vitest 5 the runner's per-mutant `ctx.provide("activeMutant", …)` no longer
 * reaches the test worker, so `activeMutant` is undefined, every instrumented
 * branch takes its original path, and every mutant survives.
 *
 * The failure is silent and looks like a catastrophic test-quality collapse
 * rather than a tooling break: per-test coverage still resolves (it rides the
 * dry-run path), so the report names the tests that "ran" for each survivor.
 * Measured on this repo, same commit, same tests:
 *
 *   vitest 4.1.11 → 82.49% (410 killed / 79 survived)
 *   vitest 5.0.0  →  0.00% (  0 killed / 489 survived)
 *
 * 0.00 is below the `break: 50` threshold in stryker.conf.json, so the weekly
 * run exits 1 and files a tracking issue (#420) that reads like a test
 * regression. The runner's latest release (10.0.0, 2026-08-14) predates Vitest
 * 5, so there is no version to move to yet.
 *
 * This is a tripwire, not a permanent ceiling: when the runner ships Vitest 5
 * support, raise this number and delete the Dependabot ignore beside it.
 */
const supportedVitestMajor = 4;

function declaredMajor(range: string): number {
  const match = /(\d+)\./.exec(range);

  if (!match) {
    throw new Error(`Could not read a major version out of "${range}"`);
  }

  return Number(match[1]);
}

describe("vitest stays on the major the Stryker runner can drive", () => {
  for (const pkg of ["vitest", "@vitest/coverage-v8"]) {
    it(`pins ${pkg} to ${supportedVitestMajor}.x`, () => {
      const range = devDependencies[pkg];

      expect(range, `${pkg} is missing from devDependencies`).toBeDefined();
      expect(
        declaredMajor(range),
        `${pkg} is on ${range}. Vitest ${supportedVitestMajor + 1} silently breaks mutant activation in @stryker-mutator/vitest-runner — pnpm test:mutate scores 0.00 with every mutant surviving. Verify a full mutation run before raising SUPPORTED_VITEST_MAJOR.`,
      ).toBe(supportedVitestMajor);
    });
  }

  it("keeps Dependabot from grouping the major back in", () => {
    const dependabotConfig = readFileSync(join(repoRoot, ".github/dependabot.yml"), "utf8");

    expect(
      dependabotConfig,
      "The pin above only holds if Dependabot stops proposing the major — .github/dependabot.yml must ignore semver-major updates for vitest.",
    ).toMatch(/dependency-name:\s*"vitest"/);
  });
});
