import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const packageScripts: Record<string, string> = JSON.parse(
  readFileSync(join(repoRoot, "package.json"), "utf8"),
).scripts;

/**
 * Every `pnpm run <name>` a script prints is advice the reader will follow
 * literally, so a name that does not exist in package.json is a broken
 * instruction rather than a cosmetic typo.
 *
 * This guard exists because the same drift has now happened twice: the
 * `validate-env.ts` usage line fixed in #388, then `optimize-images.ts` and
 * `analyze-bundle.ts` advertising `optimize:images` / `analyze:images` when
 * the real names are `images:optimize` / `images:analyze` (#392). Both were
 * found by a human reading the source, which is not a repeatable gate.
 */
const scriptsDir = join(repoRoot, "scripts", "src");

const scriptSources = readdirSync(scriptsDir, { recursive: true, encoding: "utf8" })
  .filter((entry) => /\.(ts|mjs)$/.test(entry))
  .filter((entry) => !entry.endsWith(".test.ts") && !entry.includes("__tests__"))
  .sort();

/**
 * Matches the name in `pnpm run <name>`, stopping at whitespace so trailing
 * flags (`pnpm run enforce --json`) do not become part of the name. Covers
 * both the usage-comment form and the console.log form; quoting and backticks
 * sit outside the match.
 */
const pnpmRun = /pnpm run ([a-z][a-z0-9:-]*)/g;

interface Reference {
  readonly file: string;
  readonly line: number;
  readonly name: string;
}

function collectReferences(): Reference[] {
  const found: Reference[] = [];

  for (const file of scriptSources) {
    const lines = readFileSync(join(scriptsDir, file), "utf8").split("\n");

    lines.forEach((text, index) => {
      for (const match of text.matchAll(pnpmRun)) {
        found.push({ file, line: index + 1, name: match[1] });
      }
    });
  }

  return found;
}

describe("scripts advertise script names that exist", () => {
  const references = collectReferences();

  it("finds the `pnpm run` advice it is meant to be guarding", () => {
    // A regex that silently stops matching would make every assertion below
    // vacuously pass, so pin that the sweep still sees the real references.
    expect(references.length).toBeGreaterThan(10);
  });

  it("names only scripts defined in package.json", () => {
    const broken = references
      .filter((reference) => !(reference.name in packageScripts))
      .map(
        (reference) =>
          `scripts/src/${reference.file}:${reference.line} — \`pnpm run ${reference.name}\` is not a script in package.json`,
      );

    expect(
      broken,
      `Following this printed advice fails. Available scripts: ${Object.keys(packageScripts).sort().join(", ")}`,
    ).toEqual([]);
  });
});
