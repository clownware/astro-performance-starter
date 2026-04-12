import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Lightweight regression test for design tokens that components depend on.
 * Reads the committed `tokens/semantic.json` directly (the source of truth)
 * rather than `tokens/dist/tokens.css` (generated, not present until build).
 *
 * The full WCAG-AA contrast sweep lives in `scripts/src/validate-contrast.ts`
 * (run via `pnpm design:validate`); this test only locks in the *presence*
 * and *resolution* of the new `border-emphasis` semantic so the Button
 * secondary variant can't silently regress to invisible borders.
 */

interface TokenLeaf {
  value: string;
  dark?: string;
}
interface SemanticTokens {
  semantic: {
    border: {
      primary: TokenLeaf;
      emphasis: TokenLeaf;
    };
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const semantic: SemanticTokens = JSON.parse(
  readFileSync(resolve(here, "../../tokens/semantic.json"), "utf-8"),
);

describe("design tokens — border.emphasis", () => {
  it("is defined in the semantic schema", () => {
    expect(semantic.semantic.border.emphasis).toBeDefined();
    expect(semantic.semantic.border.emphasis.value).toBeTruthy();
  });

  it("has both light (value) and dark overrides", () => {
    expect(semantic.semantic.border.emphasis.value).toBeTruthy();
    expect(semantic.semantic.border.emphasis.dark).toBeTruthy();
  });

  it("light value resolves to gray-600 (semantic source of truth)", () => {
    // If this assertion fails, either someone changed the semantic
    // mapping without updating this guard, or the gray scale was
    // renumbered. Either way, the secondary button border contrast
    // fix needs re-validation.
    expect(semantic.semantic.border.emphasis.value).toBe("{color.gray.600}");
  });

  it("dark value resolves to gray-300", () => {
    expect(semantic.semantic.border.emphasis.dark).toBe("{color.gray.300}");
  });

  it("differs from border.primary (the lower-contrast variant)", () => {
    // border.primary is gray-300 light / gray-700 dark; border.emphasis is
    // gray-600 / gray-300. They must not collapse to the same references
    // or the Button secondary variant loses its contrast fix.
    expect(semantic.semantic.border.emphasis.value).not.toBe(
      semantic.semantic.border.primary.value,
    );
    expect(semantic.semantic.border.emphasis.dark).not.toBe(semantic.semantic.border.primary.dark);
  });
});
