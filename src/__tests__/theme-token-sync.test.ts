import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guards against `@theme inline` drift (ADR-047). The non-color tokens
 * (radius, shadow, motion) must reference the generated token vars from
 * tokens.css — not hardcode stale Tailwind defaults — so the design system's
 * rounding, elevation and motion feel actually reach components.
 */

const here = dirname(fileURLToPath(import.meta.url));
const globalCss = readFileSync(resolve(here, "../styles/global.css"), "utf-8");

// Isolate the @theme inline block so assertions don't match motion CSS below it.
const themeBlock = (() => {
  const start = globalCss.indexOf("@theme inline");
  expect(start).toBeGreaterThan(-1);
  // Balance braces from the first "{" after the directive.
  let depth = 0;
  let i = globalCss.indexOf("{", start);
  const open = i;
  for (; i < globalCss.length; i++) {
    if (globalCss[i] === "{") {
      depth++;
    } else if (globalCss[i] === "}" && --depth === 0) {
      break;
    }
  }
  return globalCss.slice(open, i + 1);
})();

describe("@theme inline — non-color tokens reference the token source", () => {
  it("references the border-radius token vars", () => {
    expect(themeBlock).toContain("var(--border-radius-lg)");
  });

  it("uses the warm HSL shadow values from the token source", () => {
    // Shadows are literal (not var()) because the @theme key collides with the
    // tokens.css --shadow-* namespace; assert the design-system HSL value.
    expect(themeBlock).toContain("0 6px 16px -6px hsl(230 40% 3% / 0.35)");
  });

  it("references the motion-duration token vars", () => {
    expect(themeBlock).toContain("var(--motion-duration-base)");
  });

  it("references the motion-ease token vars", () => {
    expect(themeBlock).toContain("var(--motion-ease-in-out)");
  });

  it("no longer hardcodes the stale rem radius", () => {
    expect(themeBlock).not.toContain("--radius-lg: 0.5rem");
  });

  it("no longer hardcodes the stale flat-black shadow", () => {
    expect(themeBlock).not.toContain("rgb(0 0 0 / 0.1)");
  });

  it("no longer hardcodes the stale 250ms base duration", () => {
    expect(themeBlock).not.toContain("--duration-base: 250ms");
  });
});

describe("@theme inline — v2.1 token additions are wired", () => {
  it("maps the raised + accent surfaces to their token vars", () => {
    expect(themeBlock).toContain("--color-surface-raised: hsl(var(--color-surface-raised))");
    expect(themeBlock).toContain("--color-surface-accent: hsl(var(--color-surface-accent))");
  });

  it("exposes the gradient glow shadow (literal, mirrors base.json shadow.glow)", () => {
    expect(themeBlock).toContain("--shadow-glow: 0 0 44px -10px hsl(256 86% 63% / 0.45)");
  });

  it("extends the type scale with 7xl / 8xl", () => {
    expect(themeBlock).toContain("--text-7xl: 4.5rem");
    expect(themeBlock).toContain("--text-8xl: 6rem");
  });

  it("extends the spacing scale with steps 28 / 32", () => {
    expect(themeBlock).toContain("--spacing-28: 7rem");
    expect(themeBlock).toContain("--spacing-32: 8rem");
  });
});
