import { describe, expect, it } from "vitest";
import {
  findNodeFieldMismatches,
  findTemplateMismatch,
  findVersionMismatches,
  findVersionsJsonMismatches,
  syncVersionsJson,
} from "../check-version-consistency.ts";

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

  it("guards the formerly-loose keys once pinned exactly (2026-08 audit)", () => {
    const auditPkg = {
      dependencies: { "@astrojs/mdx": "^7.0.5" },
      devDependencies: {
        "@astrojs/sitemap": "^3.7.3",
        "@lhci/cli": "^0.15.1",
        lighthouse: "^13.4.1",
      },
    };
    const versions = {
      "astro-mdx": "5.0.0",
      "astro-sitemap": "3.7.3",
      "lighthouse-ci": "0.15.1",
      lighthouse: "13.4.1",
    };
    expect(findVersionsJsonMismatches(auditPkg, versions)).toEqual([
      "astro-mdx: versions.json 5.0.0 ≠ package.json @astrojs/mdx ^7.0.5",
    ]);
  });
});

/**
 * Guards against the `template` field in `versions.json` drifting from
 * package.json "version" (the drift that shipped: versions.json said
 * "template": "v0.2.0" while package.json — and the latest git tag — was
 * 0.9.0). versions.json is a public consumption contract (docs drift gate,
 * clownware.org facts layer), so its self-reported version must be stamped,
 * not hand-maintained.
 */
describe("findTemplateMismatch", () => {
  it("returns null when template matches v{package.json version}", () => {
    expect(findTemplateMismatch("0.9.0", { template: "v0.9.0" })).toBeNull();
  });

  it("flags a drifted template field", () => {
    expect(findTemplateMismatch("0.9.0", { template: "v0.2.0" })).toBe(
      "template: versions.json v0.2.0 ≠ package.json version 0.9.0",
    );
  });

  it("flags a missing template field", () => {
    expect(findTemplateMismatch("0.9.0", { astro: "6.4.8" })).toBe(
      "template: versions.json has no template field; package.json version is 0.9.0",
    );
  });

  it("matches prerelease versions exactly", () => {
    expect(findTemplateMismatch("1.0.0-rc.1", { template: "v1.0.0-rc.1" })).toBeNull();
    expect(findTemplateMismatch("1.0.0", { template: "v1.0.0-rc.1" })).toBe(
      "template: versions.json v1.0.0-rc.1 ≠ package.json version 1.0.0",
    );
  });
});

/**
 * `--fix` support: rewrites drifted exact pins from package.json so Dependabot
 * bumps need one `pnpm run version:check --fix` instead of a hand edit (the
 * friction that blocked the preact 10.29.6 bump: versions.json still said
 * 10.29.4 and CI failed on the drift guard).
 */
describe("syncVersionsJson", () => {
  const pkg = {
    dependencies: { tailwindcss: "4.2.2", preact: "^10.29.6" },
    devDependencies: { "@biomejs/biome": "^2.4.11" },
  };

  it("rewrites drifted exact pins to the package.json base version", () => {
    const versions = { preact: "10.29.4", biome: "2.4.11" };
    expect(syncVersionsJson(pkg, versions)).toEqual({ preact: "10.29.6", biome: "2.4.11" });
  });

  it("leaves loose '.x' ranges untouched", () => {
    const versions = { preact: "10.x", vitest: "4.x" };
    expect(syncVersionsJson(pkg, versions)).toEqual({ preact: "10.x", vitest: "4.x" });
  });

  it("leaves unmapped keys (template, node, pnpm) untouched", () => {
    const versions = { template: "v0.2.0", node: "24.14.1", preact: "10.29.4" };
    expect(syncVersionsJson(pkg, versions)).toEqual({
      template: "v0.2.0",
      node: "24.14.1",
      preact: "10.29.6",
    });
  });

  it("preserves key order and does not mutate the input", () => {
    const versions = { tailwindcss: "4.2.2", preact: "10.29.4" };
    const synced = syncVersionsJson(pkg, versions);
    expect(Object.keys(synced)).toEqual(["tailwindcss", "preact"]);
    expect(versions.preact).toBe("10.29.4");
  });

  it("stamps the template field from package.json version when provided", () => {
    const versions = { template: "v0.2.0", preact: "10.29.4" };
    const synced = syncVersionsJson({ ...pkg, version: "0.9.0" }, versions);
    expect(synced.template).toBe("v0.9.0");
  });

  it("leaves the template field untouched when package.json version is absent", () => {
    const versions = { template: "v0.2.0" };
    expect(syncVersionsJson(pkg, versions)).toEqual({ template: "v0.2.0" });
  });

  it("rewrites node and node-minimum when nvmrc and engines are provided", () => {
    const versions = { node: "24.14.1", "node-minimum": "24.0.0", preact: "10.29.4" };
    const withEngines = { ...pkg, engines: { node: ">=24.15.0" } };
    expect(syncVersionsJson(withEngines, versions, "24.19.0")).toEqual({
      node: "24.19.0",
      "node-minimum": "24.15.0",
      preact: "10.29.6",
    });
  });

  it("leaves node fields untouched when nvmrc is not provided (back-compat)", () => {
    const versions = { node: "24.14.1", "node-minimum": "24.0.0" };
    expect(syncVersionsJson(pkg, versions)).toEqual({ node: "24.14.1", "node-minimum": "24.0.0" });
  });
});

/**
 * Guards the drift that shipped in the 2026-08 Node bump: versions.json still
 * said node 24.14.1 / node-minimum 24.0.0 after .nvmrc moved to 24.19.0 and
 * engines to >=24.15.0 — version:check only compared package.json deps, so the
 * ADR-061 consumption contract silently lied about the Node floor.
 */
describe("findNodeFieldMismatches", () => {
  it("returns no mismatches when node matches .nvmrc and node-minimum matches the engines floor", () => {
    const versions = { node: "24.19.0", "node-minimum": "24.15.0" };
    expect(findNodeFieldMismatches("24.19.0", ">=24.15.0", versions)).toEqual([]);
  });

  it("flags a node field that drifted from .nvmrc", () => {
    const versions = { node: "24.14.1", "node-minimum": "24.15.0" };
    expect(findNodeFieldMismatches("24.19.0", ">=24.15.0", versions)).toEqual([
      "node: versions.json 24.14.1 ≠ .nvmrc 24.19.0",
    ]);
  });

  it("flags a node-minimum field that drifted from the engines floor", () => {
    const versions = { node: "24.19.0", "node-minimum": "24.0.0" };
    expect(findNodeFieldMismatches("24.19.0", ">=24.15.0", versions)).toEqual([
      "node-minimum: versions.json 24.0.0 ≠ package.json engines.node >=24.15.0",
    ]);
  });

  it("tolerates surrounding whitespace in the .nvmrc content", () => {
    const versions = { node: "24.19.0", "node-minimum": "24.15.0" };
    expect(findNodeFieldMismatches("24.19.0\n", ">=24.15.0", versions)).toEqual([]);
  });

  it("skips fields that are absent from versions.json or inputs that are unavailable", () => {
    expect(findNodeFieldMismatches("24.19.0", ">=24.15.0", {})).toEqual([]);
    expect(findNodeFieldMismatches(undefined, undefined, { node: "24.19.0" })).toEqual([]);
  });
});
