#!/usr/bin/env tsx
/**
 * Version-consistency guard. Asserts the README footer version (`• vX.Y.Z`)
 * matches `package.json` "version", so the two can't silently drift (they did:
 * README said v0.2.0 while package.json was 0.9.0). Runs in `quality:ci`
 * alongside the other no-drift guards (cf. `agents:check`).
 *
 * Usage: pnpm run version:check
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Returns every `• vX.Y.Z` footer version in `readme` that does NOT equal
 * `v{pkgVersion}`. Empty array means consistent.
 */
export function findVersionMismatches(pkgVersion: string, readme: string): string[] {
  const expected = `v${pkgVersion}`;
  const found = [...readme.matchAll(/•\s*(v\d+\.\d+\.\d+[\w.-]*)/g)].map((m) => m[1]);
  return found.filter((version) => version !== expected);
}

function main(): void {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const pkgVersion = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"))
    .version as string;
  const readme = readFileSync(join(root, "README.md"), "utf-8");

  const mismatches = findVersionMismatches(pkgVersion, readme);
  if (mismatches.length) {
    console.error(
      `❌ README version footer drifted from package.json (v${pkgVersion}): ${mismatches.join(", ")}`,
    );
    console.error("   Update the `**Status**: … • vX.Y.Z` footer in README.md to match.");
    process.exit(1);
  }
  console.log(`✅ README version footer matches package.json (v${pkgVersion}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
