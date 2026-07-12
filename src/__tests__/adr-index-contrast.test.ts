import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Drift guard for the ADR index's reserved-row de-emphasis (#279).
 *
 * Reserved rows were dimmed with `opacity-50`, which axe folds into the
 * effective text colour: muted-foreground at 50% opacity over the dark
 * background composites to 2.74:1 and fails WCAG AA (the rows contain 12px
 * text, so the 4.5:1 normal-text minimum applies). Opacity is not a viable
 * de-emphasis tool for this pairing — the light-mode combination only clears
 * 4.5:1 above ~0.9 opacity, which is no visible dimming at all. This test
 * recomputes the composited contrast from the committed token sources for
 * every opacity utility the page applies, in both modes, so reintroduced
 * dimming fails here instead of resurfacing as a Lighthouse a11y regression.
 */

const here = dirname(fileURLToPath(import.meta.url));
const pageSource = readFileSync(resolve(here, "../pages/adr/index.astro"), "utf-8");
// Read the committed token sources, NOT tokens/dist/tokens.css — dist is a
// gitignored build artifact that does not exist when CI runs the unit tests
// (same rationale as design-tokens.test.ts).
interface TokenLeaf {
  value: string;
  dark?: string;
}
type TokenTree = { [key: string]: TokenTree | TokenLeaf };
const semantic = JSON.parse(readFileSync(resolve(here, "../../tokens/semantic.json"), "utf-8"))
  .semantic as TokenTree;
const base = JSON.parse(readFileSync(resolve(here, "../../tokens/base.json"), "utf-8"))
  .color as TokenTree;

const aaNormalText = 4.5;

// The strongest (lowest) opacity utility applied anywhere on the page is the
// worst case for text compositing. No opacity utilities → fully opaque.
const opacityUtilities = [...pageSource.matchAll(/\bopacity-(\d{1,3})\b/g)].map(
  (m) => Number(m[1]) / 100,
);
const worstOpacity = Math.min(1, ...opacityUtilities);

// --- resolve HSL triplets from the committed token sources ---

function parseHsl(raw: string): [number, number, number] {
  const match = raw.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) {
    throw new Error(`unparseable HSL value: "${raw}"`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Resolve a semantic token (e.g. "mutedForeground") to its HSL triplet for a mode. */
function resolveHsl(tokenName: string, mode: "light" | "dark"): [number, number, number] {
  const leaf = semantic[tokenName] as TokenLeaf;
  if (!leaf?.value) {
    throw new Error(`semantic token "${tokenName}" not found`);
  }
  let raw = mode === "dark" ? (leaf.dark ?? leaf.value) : leaf.value;
  // follow {color.family.step} / {color.name} references into base.json
  const ref = raw.match(/^\{color\.([a-zA-Z]+)(?:\.(\w+))?\}$/);
  if (ref) {
    const node = ref[2]
      ? ((base[ref[1]] as TokenTree)?.[ref[2]] as TokenLeaf)
      : (base[ref[1]] as TokenLeaf);
    if (!node?.value) {
      throw new Error(`base token reference "${raw}" not found`);
    }
    raw = node.value;
  }
  return parseHsl(raw);
}

// --- colour math: HSL → sRGB, alpha compositing, WCAG contrast ---

type Rgb = [number, number, number];

function hslToRgb([h, s, l]: [number, number, number]): Rgb {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** Composite a foreground over a background at the given opacity, in gamma
 * sRGB space — matching how browsers rasterise `opacity` and how axe-core
 * derives the effective text colour it measures. */
function composite(fg: Rgb, bg: Rgb, alpha: number): Rgb {
  return [0, 1, 2].map((i) => Math.round(fg[i] * alpha + bg[i] * (1 - alpha))) as Rgb;
}

const srgbToLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = ([r, g, b]: Rgb) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("ADR index muted text contrast (WCAG AA normal text)", () => {
  it.each([
    "light",
    "dark",
  ] as const)("keeps composited muted-foreground at or above 4.5:1 on the %s background", (mode) => {
    const fg = hslToRgb(resolveHsl("mutedForeground", mode));
    const bg = hslToRgb(resolveHsl("background", mode));
    const effective = composite(fg, bg, worstOpacity);
    expect(contrastRatio(effective, bg)).toBeGreaterThanOrEqual(aaNormalText);
  });
});
