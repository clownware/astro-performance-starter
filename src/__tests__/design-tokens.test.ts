import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Lightweight regression test for design tokens that components depend on.
 * Reads the generated `tokens/dist/tokens.css` and asserts that critical
 * tokens exist with the expected references. The full WCAG-AA contrast
 * sweep lives in `scripts/src/validate-contrast.ts` (run via
 * `pnpm design:validate`); this test only locks in the *presence* and
 * *resolution* of the new `border-emphasis` semantic so the Button
 * secondary variant doesn't silently regress to invisible borders.
 */

const here = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(resolve(here, "../../tokens/dist/tokens.css"), "utf-8");

const lightBlockMatch = tokensCss.match(/:root\s*{([^}]*)}/);
const darkBlockMatch = tokensCss.match(/\.dark\s*{([^}]*)}/);
const lightBlock = lightBlockMatch?.[1] ?? "";
const darkBlock = darkBlockMatch?.[1] ?? "";

function getVar(block: string, name: string): string | null {
  const m = block.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
}

describe("design tokens — border.emphasis", () => {
  it("is defined in :root (light mode)", () => {
    expect(getVar(lightBlock, "color-border-emphasis")).not.toBeNull();
  });

  it("is defined in .dark (dark mode override)", () => {
    expect(getVar(darkBlock, "color-border-emphasis")).not.toBeNull();
  });

  it("light mode resolves to gray-600 (semantic source of truth)", () => {
    // The semantic.json maps border.emphasis → color.gray.600 for light
    // mode. If this assertion fails, either the build script regressed or
    // someone changed the semantic mapping without updating this guard.
    const emphasis = getVar(lightBlock, "color-border-emphasis");
    const gray600 = getVar(lightBlock, "color-gray-600");
    expect(emphasis).toBe(gray600);
  });

  it("dark mode resolves to gray-300", () => {
    const emphasis = getVar(darkBlock, "color-border-emphasis");
    const gray300 = getVar(lightBlock, "color-gray-300");
    expect(emphasis).toBe(gray300);
  });

  it("differs from border.primary (the lower-contrast variant)", () => {
    // border.primary is gray-300 light / gray-700 dark; border.emphasis is
    // gray-600 / gray-300. They must not collapse to the same value or the
    // Button secondary variant loses its contrast fix.
    expect(getVar(lightBlock, "color-border-emphasis")).not.toBe(
      getVar(lightBlock, "color-border-primary"),
    );
    expect(getVar(darkBlock, "color-border-emphasis")).not.toBe(
      getVar(darkBlock, "color-border-primary"),
    );
  });
});
