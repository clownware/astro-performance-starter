import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guards the token migration (ADR-047): component and page source must not
 * reach past the design tokens to raw Tailwind colour utilities. These bypass
 * the role system, so they do NOT re-skin and — for the `gray-*` family, which
 * is no longer the neutral (the palette is now `slate`) — silently mismatch.
 *
 * Scope: `.astro` / `.tsx` UI source only. `.mdx` content is excluded because
 * the docs deliberately name these utilities as counter-examples ("use
 * text-foreground instead of text-gray-900").
 *
 * Allowed and intentionally NOT flagged: literal `hsl(0 0% 100% / …)` (sheen),
 * mask stencils like `#000` in ScrollSpy, and `<meta name="theme-color">`
 * hex in Head.astro — HTML attributes cannot reference CSS vars.
 */

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, "..");

const uiFiles = readdirSync(srcRoot, { recursive: true, encoding: "utf-8" })
  .filter((f) => /\.(astro|tsx)$/.test(f))
  .filter((f) => !f.includes("__tests__"))
  .map((f) => join(srcRoot, f));

const bypassPatterns: Array<{ label: string; re: RegExp }> = [
  { label: "text-white", re: /\btext-white\b/ },
  { label: "bg-white", re: /\bbg-white\b/ },
  {
    label: "gray-* (palette is slate)",
    re: /\b(?:text|bg|border|ring|from|via|to|divide)-gray-\d/,
  },
];

describe("token migration — no bypass colour utilities in UI source", () => {
  it.each(bypassPatterns)("uses no $label", ({ re }) => {
    const offenders = uiFiles.filter((file) => re.test(readFileSync(file, "utf-8")));
    expect(offenders, `bypass utility found in:\n${offenders.join("\n")}`).toEqual([]);
  });
});
