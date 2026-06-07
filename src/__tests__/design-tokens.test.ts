import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Regression test for the v2 (cold-minimal) design tokens that components
 * depend on. Reads the committed `tokens/base.json` + `tokens/semantic.json`
 * directly (the source of truth) rather than `tokens/dist/tokens.css`
 * (generated, not present until build).
 *
 * The full WCAG-AA contrast sweep lives in `scripts/src/validate-contrast.ts`
 * (run via `pnpm design:validate`); this test locks in the *presence* and
 * *source mapping* of the role-based semantic tokens (ADR-047) so the rename
 * cannot silently regress component styling.
 */

interface TokenLeaf {
  value: string;
  dark?: string;
}
type Scale = Record<string, TokenLeaf>;
interface SemanticTokens {
  semantic: {
    primary: Scale;
    secondary: Scale;
    background: TokenLeaf;
    surface: TokenLeaf;
    foreground: TokenLeaf;
    mutedForeground: TokenLeaf;
    border: TokenLeaf;
    borderEmphasis: TokenLeaf;
    primaryForeground: TokenLeaf;
    link: TokenLeaf;
    success: TokenLeaf;
    warning: TokenLeaf;
    error: TokenLeaf;
  };
}
interface BaseTokens {
  fontFamily: {
    display: TokenLeaf;
    text: TokenLeaf;
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const semantic: SemanticTokens = JSON.parse(
  readFileSync(resolve(here, "../../tokens/semantic.json"), "utf-8"),
);
const base: BaseTokens = JSON.parse(readFileSync(resolve(here, "../../tokens/base.json"), "utf-8"));

describe("design tokens v2 — role tokens present with light + dark", () => {
  const roles = [
    "background",
    "surface",
    "foreground",
    "mutedForeground",
    "border",
    "borderEmphasis",
    "primaryForeground",
    "link",
    "success",
    "warning",
    "error",
  ] as const;

  it.each(roles)("defines a light value for %s", (role) => {
    expect(semantic.semantic[role].value).toBeTruthy();
  });

  it.each(roles)("defines a dark override for %s", (role) => {
    expect(semantic.semantic[role].dark).toBeTruthy();
  });
});

describe("design tokens v2 — role source mappings", () => {
  it("maps background to slate-50 / spaceCadet", () => {
    expect(semantic.semantic.background.value).toBe("{color.slate.50}");
    expect(semantic.semantic.background.dark).toBe("{color.spaceCadet}");
  });

  it("maps surface to white / slate-900", () => {
    expect(semantic.semantic.surface.value).toBe("{color.white}");
    expect(semantic.semantic.surface.dark).toBe("{color.slate.900}");
  });

  it("maps foreground to charcoal / slate-50", () => {
    expect(semantic.semantic.foreground.value).toBe("{color.charcoal}");
    expect(semantic.semantic.foreground.dark).toBe("{color.slate.50}");
  });

  it("maps mutedForeground to slate-600 / slate-400", () => {
    expect(semantic.semantic.mutedForeground.value).toBe("{color.slate.600}");
    expect(semantic.semantic.mutedForeground.dark).toBe("{color.slate.400}");
  });

  it("maps link to violet-600 / violet-300", () => {
    expect(semantic.semantic.link.value).toBe("{color.violet.600}");
    expect(semantic.semantic.link.dark).toBe("{color.violet.300}");
  });

  it("maps error to rose-700 / rose-400", () => {
    expect(semantic.semantic.error.value).toBe("{color.rose.700}");
    expect(semantic.semantic.error.dark).toBe("{color.rose.400}");
  });

  it("maps warning to amber-700 / amber-500", () => {
    expect(semantic.semantic.warning.value).toBe("{color.amber.700}");
    expect(semantic.semantic.warning.dark).toBe("{color.amber.500}");
  });
});

describe("design tokens v2 — brand scales retained", () => {
  it("keeps the full primary 50–950 scale for gradients and hover states", () => {
    expect(semantic.semantic.primary["50"].value).toBe("{color.violet.50}");
    expect(semantic.semantic.primary["950"].value).toBe("{color.violet.950}");
  });

  it("keeps the full secondary 50–950 scale", () => {
    expect(semantic.semantic.secondary["50"].value).toBe("{color.rose.50}");
    expect(semantic.semantic.secondary["950"].value).toBe("{color.rose.950}");
  });
});

describe("design tokens v2 — border emphasis stays distinct", () => {
  it("does not collapse border-emphasis into the default border token", () => {
    // border = slate-200/slate-800; border-emphasis = slate-500/slate-500.
    // Collapsing them would lose the secondary-button / interactive contrast.
    expect(semantic.semantic.borderEmphasis.value).not.toBe(semantic.semantic.border.value);
    expect(semantic.semantic.borderEmphasis.dark).not.toBe(semantic.semantic.border.dark);
  });
});

describe("design tokens v2 — typography", () => {
  it("resolves the display family Geist-first", () => {
    expect(base.fontFamily.display.value.startsWith('"Geist"')).toBe(true);
  });

  it("resolves the text family Inter-first", () => {
    expect(base.fontFamily.text.value.startsWith('"Inter"')).toBe(true);
  });
});
