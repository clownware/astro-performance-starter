// @vitest-environment node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Unit-level guard for the dark-first theme default (ADR-032, #247).
 *
 * The behaviour is e2e-covered; this pins the decision points in the inline
 * pre-paint script so an edit that quietly reverts to OS-preference echoing
 * fails in the unit suite, not in a viewport-dependent e2e run.
 */

const source = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../ThemeSetup.astro"),
  "utf-8",
);

describe("ThemeSetup dark-first default (ADR-032)", () => {
  it("runs as a pre-paint inline script", () => {
    expect(source).toContain("<script is:inline>");
  });

  it("lets an explicit stored choice win, then defaults to dark — not the OS preference", () => {
    const decision = source.match(/getPreferredTheme = \(\) => \{[\s\S]*?\};/)?.[0] ?? "";
    expect(decision).toContain("if (fromStorage) return fromStorage");
    expect(decision).toContain("return 'dark'");
    // the OS media query must not decide the default
    expect(decision).not.toContain("prefersDark");
  });

  it("re-applies the theme after Astro view transitions", () => {
    expect(source).toContain("astro:after-swap");
  });

  it("keeps the UA colour-scheme in lockstep with the applied theme", () => {
    expect(source).toContain("colorScheme = theme");
  });
});
