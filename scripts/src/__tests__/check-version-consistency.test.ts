import { describe, expect, it } from "vitest";
import { findVersionMismatches, findVersionsJsonMismatches } from "../check-version-consistency.ts";

/**
 * Guards against the README footer version drifting from package.json (the
 * exact drift that shipped: README said v0.2.0 while package.json was 0.9.0).
 * Matches the `• vX.Y.Z` footer pattern and compares against the package version.
 */
describe("findVersionMismatches", () => {
  it("returns no mismatches when the footer matches package.json", () => {
    const readme = "Some intro\n\n**Status**: Active development • v0.9.0\n";
    expect(findVersionMismatches("0.9.0", readme)).toEqual([]);
  });

  it("flags a stale footer version", () => {
    const readme = "**Status**: Active development • v0.2.0\n";
    expect(findVersionMismatches("0.9.0", readme)).toEqual(["v0.2.0"]);
  });

  it("flags every drifted occurrence", () => {
    const readme = "• v0.1.0 ... later • v0.9.0 ... • v0.2.0";
    expect(findVersionMismatches("0.9.0", readme)).toEqual(["v0.1.0", "v0.2.0"]);
  });

  it("matches prerelease versions exactly", () => {
    const readme = "• v1.0.0-rc.1";
    expect(findVersionMismatches("1.0.0-rc.1", readme)).toEqual([]);
    expect(findVersionMismatches("1.0.0", readme)).toEqual(["v1.0.0-rc.1"]);
  });

  it("returns nothing when the README has no version footer", () => {
    expect(findVersionMismatches("0.9.0", "no version here")).toEqual([]);
  });
});

/**
 * Guards against `versions.json` drifting from `package.json` for the keys that
 * hold an EXACT pin (the drift that shipped: versions.json had biome 2.4.9 /
 * playwright 1.58.2 while package.json was ^2.4.11 / ^1.59.1). Loose ranges
 * (e.g. "4.x") and keys with no matching dependency are intentionally skipped.
 */
describe("findVersionsJsonMismatches", () => {
  const pkg = {
    dependencies: { tailwindcss: "4.2.2", preact: "^10.29.0" },
    devDependencies: { "@biomejs/biome": "^2.4.11", "@playwright/test": "^1.59.1" },
  };

  it("returns no mismatches when exact pins match (ignoring the ^ range op)", () => {
    const versions = { biome: "2.4.11", playwright: "1.59.1", tailwindcss: "4.2.2" };
    expect(findVersionsJsonMismatches(pkg, versions)).toEqual([]);
  });

  it("flags an exact pin that drifted from package.json", () => {
    const versions = { biome: "2.4.9", playwright: "1.59.1" };
    expect(findVersionsJsonMismatches(pkg, versions)).toEqual([
      "biome: versions.json 2.4.9 ≠ package.json @biomejs/biome ^2.4.11",
    ]);
  });

  it("skips loose '.x' ranges that are intentionally fuzzy", () => {
    const versions = { vitest: "4.x", biome: "2.4.11" };
    expect(findVersionsJsonMismatches(pkg, versions)).toEqual([]);
  });

  it("skips keys whose mapped dependency is absent from package.json", () => {
    const versions = { typescript: "5.9.3" };
    expect(findVersionsJsonMismatches(pkg, versions)).toEqual([]);
  });
});
