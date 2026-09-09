import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

interface StrykerConfig {
  ignorePatterns?: string[];
  tempDirName?: string;
}

const config: StrykerConfig = JSON.parse(readFileSync(join(repoRoot, "stryker.conf.json"), "utf8"));

/**
 * Directories this repository's own tooling writes into while tests run.
 *
 * Stryker copies the project into a fresh sandbox for every run. A directory
 * that is being written to during that copy makes the run crash outright: on
 * 2026-09-08 a concurrent Playwright run killed mutation testing with
 * `ENOENT: copyfile 'test-results/.last-run.json'`. They are also pure waste to
 * copy — none of them is an input to a mutant.
 *
 * Deliberately not derived from `.gitignore`: that file also lists editor and
 * framework directories this project never produces, and an allowlist for those
 * would be noisier than naming the real ones here.
 */
const volatileOutputDirs = [
  "test-results", // Playwright failure artefacts and .last-run.json
  "playwright-report", // Playwright's html reporter
  "playwright/.cache", // Playwright browser cache
  ".lighthouseci", // lhci autorun
  "lighthouse-ci-reports",
  "lighthouse-ci-reports-mobile",
];

/**
 * Large directories that are never mutation inputs. The sandbox resolves
 * dependencies through a `node_modules` symlink, so a package store sitting in
 * the working tree is copied for nothing — a local `.pnpm/store` measured
 * ~595MB, and it is copied once per concurrent sandbox.
 */
const nonInputStores = [".pnpm", ".pnpm-store", "node_modules"];

describe("stryker.conf.json", () => {
  it("excludes every directory the test and perf runs write to", () => {
    const ignored = new Set(config.ignorePatterns ?? []);
    const missing = volatileOutputDirs.filter((dir) => !ignored.has(dir));

    expect(
      missing,
      `stryker.conf.json must ignore these — a run writing to one mid-sandbox crashes mutation testing: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("excludes package stores, which the sandbox reaches by symlink anyway", () => {
    const ignored = new Set(config.ignorePatterns ?? []);
    const missing = nonInputStores.filter((dir) => !ignored.has(dir));

    expect(
      missing,
      `stryker.conf.json must ignore these — each is copied per sandbox for no benefit: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("still excludes the build and dependency output it always did", () => {
    const ignored = new Set(config.ignorePatterns ?? []);
    for (const dir of ["node_modules", "dist", ".astro", "coverage", "reports", "tokens/dist"]) {
      expect(ignored.has(dir), `${dir} must stay ignored`).toBe(true);
    }
  });

  it("excludes its own sandbox directory, so runs cannot nest", () => {
    const tempDir = config.tempDirName ?? ".stryker-tmp";
    expect(config.ignorePatterns ?? []).toContain(tempDir);
  });
});
