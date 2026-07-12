#!/usr/bin/env tsx
/**
 * Version-consistency guard. Asserts two things can't silently drift from
 * `package.json` (both drifts shipped at least once):
 *   1. the README footer version (`• vX.Y.Z`) vs. package.json "version"
 *      (README said v0.2.0 while package.json was 0.9.0); and
 *   2. the exact pins in `versions.json` vs. the matching package.json deps
 *      (versions.json had biome 2.4.9 / playwright 1.58.2 while package.json
 *      was ^2.4.11 / ^1.59.1). Loose `.x` ranges in versions.json are ignored.
 * Runs in `quality:ci` alongside the other no-drift guards (cf. `agents:check`).
 *
 * Usage: pnpm run version:check          — assert, exit 1 on drift
 *        pnpm run version:fix            — rewrite drifted versions.json pins
 */
import { readFileSync, writeFileSync } from "node:fs";
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

interface PackageJsonDeps {
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

/**
 * Returns a diagnostic when the `template` field in `versions.json` doesn't
 * equal `v{pkgVersion}`, or is missing entirely; null means consistent.
 * versions.json is a public consumption contract (ADR-061) — external
 * consumers read `template` as this template's own release version, so it is
 * stamped from package.json rather than hand-maintained.
 */
export function findTemplateMismatch(
  pkgVersion: string,
  versions: Record<string, string>,
): string | null {
  const template = versions.template;
  if (!template) {
    return `template: versions.json has no template field; package.json version is ${pkgVersion}`;
  }
  if (template !== `v${pkgVersion}`) {
    return `template: versions.json ${template} ≠ package.json version ${pkgVersion}`;
  }
  return null;
}

/**
 * Maps `versions.json` keys to the `package.json` dependency they mirror. Only
 * keys that hold an EXACT pin in `versions.json` get a meaningful comparison;
 * loose ranges (e.g. "4.x") are skipped at the value level below.
 */
const versionsJsonToPackage: Record<string, string> = {
  astro: "astro",
  tailwindcss: "tailwindcss",
  biome: "@biomejs/biome",
  typescript: "typescript",
  preact: "preact",
  "tailwindcss-vite": "@tailwindcss/vite",
  "astro-check": "@astrojs/check",
  playwright: "@playwright/test",
  vitest: "vitest",
  sharp: "sharp",
  husky: "husky",
  "style-dictionary": "style-dictionary",
  "tailwindcss-themer": "tailwindcss-themer",
  "tailwindcss-typography": "@tailwindcss/typography",
};

/** Strips a leading range operator (^, ~, >=, etc.) from a semver range. */
function baseVersion(range: string): string {
  return range.replace(/^[\^~>=<\s]+/, "");
}

/**
 * Returns a message for every `versions.json` key that holds an exact version
 * which no longer matches the base version of its `package.json` dependency.
 * Keys with a loose `.x` value, or with no matching dependency, are skipped.
 */
export function findVersionsJsonMismatches(
  pkg: PackageJsonDeps,
  versions: Record<string, string>,
): string[] {
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.optionalDependencies,
  };
  const mismatches: string[] = [];
  for (const [versionsKey, depName] of Object.entries(versionsJsonToPackage)) {
    const pinned = versions[versionsKey];
    if (!pinned || pinned.includes("x")) {
      continue;
    }
    const range = allDeps[depName];
    if (!range) {
      continue;
    }
    if (pinned !== baseVersion(range)) {
      mismatches.push(`${versionsKey}: versions.json ${pinned} ≠ package.json ${depName} ${range}`);
    }
  }
  return mismatches;
}

/**
 * Returns a copy of `versions` with every drifted exact pin rewritten to the
 * base version of its `package.json` dependency, and — when `pkg.version` is
 * present — the `template` field stamped to `v{pkg.version}`. Loose `.x`
 * ranges and keys without a mapped dependency pass through unchanged; key
 * order is preserved.
 */
export function syncVersionsJson(
  pkg: PackageJsonDeps,
  versions: Record<string, string>,
): Record<string, string> {
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.optionalDependencies,
  };
  const synced: Record<string, string> = {};
  for (const [key, pinned] of Object.entries(versions)) {
    if (key === "template" && pkg.version) {
      synced[key] = `v${pkg.version}`;
      continue;
    }
    const depName = versionsJsonToPackage[key];
    const range = depName ? allDeps[depName] : undefined;
    const isExactPin = !pinned.includes("x");
    synced[key] = isExactPin && range ? baseVersion(range) : pinned;
  }
  return synced;
}

function main(): void {
  const fix = process.argv.includes("--fix");
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
  const pkgVersion = pkg.version as string;
  const readme = readFileSync(join(root, "README.md"), "utf-8");
  const versions = JSON.parse(readFileSync(join(root, "versions.json"), "utf-8"));

  if (fix) {
    const synced = syncVersionsJson(pkg, versions);
    const changed = Object.keys(versions).filter((key) => versions[key] !== synced[key]);
    if (changed.length) {
      writeFileSync(join(root, "versions.json"), `${JSON.stringify(synced, null, 2)}\n`);
      for (const key of changed) {
        console.log(`✏️  versions.json ${key}: ${versions[key]} → ${synced[key]}`);
      }
    } else {
      console.log("✅ versions.json already matches package.json — nothing to fix.");
    }
    return;
  }

  const readmeMismatches = findVersionMismatches(pkgVersion, readme);
  const versionsMismatches = findVersionsJsonMismatches(pkg, versions);
  const templateMismatch = findTemplateMismatch(pkgVersion, versions);

  if (readmeMismatches.length) {
    console.error(
      `❌ README version footer drifted from package.json (v${pkgVersion}): ${readmeMismatches.join(", ")}`,
    );
    console.error("   Update the `**Status**: … • vX.Y.Z` footer in README.md to match.");
  }
  if (versionsMismatches.length) {
    console.error("❌ versions.json drifted from package.json:");
    for (const message of versionsMismatches) {
      console.error(`   - ${message}`);
    }
    console.error("   Run `pnpm run version:fix` to sync versions.json.");
  }
  if (templateMismatch) {
    console.error(`❌ ${templateMismatch}`);
    console.error(
      "   versions.json is a public consumption contract (ADR-061). Run `pnpm run version:fix` to stamp the template field.",
    );
  }
  if (readmeMismatches.length || versionsMismatches.length || templateMismatch) {
    process.exit(1);
  }
  console.log(`✅ README footer and versions.json match package.json (v${pkgVersion}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
