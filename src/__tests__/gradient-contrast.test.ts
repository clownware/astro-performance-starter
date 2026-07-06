import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Drift guard for the signature gradient headline's light-mode legibility.
 *
 * The AnimatedGradientText sweep interpolates `in oklch longer hue`, so the
 * text passes through every hue between its two stops. Yellow-green hues have
 * a much higher WCAG relative luminance than the violet/crimson endpoints, so
 * the *midpoint* of the sweep — not the stops — is the contrast worst case on
 * the light background. This test recomputes that worst case from the
 * component's declared light-mode stops and the built tokens, and fails if it
 * drops below the WCAG AA large-text minimum (the headline renders ≥24px bold).
 */

const here = dirname(fileURLToPath(import.meta.url));
const componentSource = readFileSync(
  resolve(here, "../components/atoms/AnimatedGradientText.astro"),
  "utf-8",
);
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

const aaLargeText = 3;

// --- extract the light-mode gradient stops from the component ---

function lightModeStopVars(source: string): string[] {
  // The first `.animated-gradient-text` rule holds the light-mode (default)
  // declarations; `.dark` overrides live in their own rule.
  const ruleStart = source.indexOf(".animated-gradient-text {");
  const ruleEnd = source.indexOf("}", ruleStart);
  const rule = source.slice(ruleStart, ruleEnd);
  const vars = [...rule.matchAll(/var\((--color-[a-z]+-\d+)\)/g)].map((m) => m[1]);
  return [...new Set(vars)];
}

// --- resolve HSL triplets from the committed token sources (light values) ---

function tokenLeaf(tree: TokenTree, path: string[]): TokenLeaf {
  let node: TokenTree | TokenLeaf = tree;
  for (const key of path) {
    node = (node as TokenTree)[key];
    if (!node) {
      throw new Error(`token path ${path.join(".")} not found`);
    }
  }
  return node as TokenLeaf;
}

function parseHsl(raw: string): [number, number, number] {
  const match = raw.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) {
    throw new Error(`unparseable HSL value: "${raw}"`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Resolve a `--color-…` custom-property name to its light-mode HSL triplet. */
function resolveLightHsl(varName: string): [number, number, number] {
  // "--color-primary-600" → semantic primary.600; "--color-background" → semantic background
  const name = varName.replace(/^--color-/, "");
  const stepMatch = name.match(/^([a-z]+)-(\d+)$/);
  const path = stepMatch ? [stepMatch[1], stepMatch[2]] : [name];
  let raw = tokenLeaf(semantic, path).value;
  // follow {color.family.step} / {color.name} references into base.json
  const ref = raw.match(/^\{color\.([a-zA-Z]+)(?:\.(\w+))?\}$/);
  if (ref) {
    raw = tokenLeaf(base, ref[2] ? [ref[1], ref[2]] : [ref[1]]).value;
  }
  return parseHsl(raw);
}

// --- colour math: HSL → sRGB → OKLab/OKLCh, longer-hue interpolation, WCAG ---

type Rgb = [number, number, number];

function hslToRgb([h, s, l]: [number, number, number]): Rgb {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

const srgbToLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const linearToSrgb = (c: number) => {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, Math.round(v * 255)));
};

function rgbToOklab([r, g, b]: Rgb): [number, number, number] {
  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([lab0, lab1, lab2]: [number, number, number]): Rgb {
  const l = (lab0 + 0.3963377774 * lab1 + 0.2158037573 * lab2) ** 3;
  const m = (lab0 - 0.1055613458 * lab1 - 0.0638541728 * lab2) ** 3;
  const s = (lab0 - 0.0894841775 * lab1 - 1.291485548 * lab2) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const relativeLuminance = ([r, g, b]: Rgb) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Minimum WCAG contrast along the `in oklch longer hue` path between two stops. */
function worstContrastLongerHue(stopA: Rgb, stopB: Rgb, background: Rgb): number {
  const [la, aa, ba] = rgbToOklab(stopA);
  const [lb, ab, bb] = rgbToOklab(stopB);
  const [ca, ha] = [Math.hypot(aa, ba), (Math.atan2(ba, aa) * 180) / Math.PI];
  const [cb, hb] = [Math.hypot(ab, bb), (Math.atan2(bb, ab) * 180) / Math.PI];
  const shortDelta = (((hb - ha) % 360) + 360) % 360;
  const longDelta = shortDelta <= 180 ? shortDelta - 360 : shortDelta;
  let worst = Number.POSITIVE_INFINITY;
  for (let t = 0; t <= 1.0001; t += 0.02) {
    const lightness = la + (lb - la) * t;
    const chroma = ca + (cb - ca) * t;
    const hue = ((ha + longDelta * t) * Math.PI) / 180;
    const rgb = oklabToRgb([lightness, chroma * Math.cos(hue), chroma * Math.sin(hue)]);
    worst = Math.min(worst, contrastRatio(rgb, background));
  }
  return worst;
}

describe("AnimatedGradientText light-mode contrast (WCAG AA large text)", () => {
  it("declares exactly two distinct gradient stops", () => {
    expect(lightModeStopVars(componentSource)).toHaveLength(2);
  });

  it("keeps the longer-hue sweep's worst point at or above 3:1 on the light background", () => {
    const [varA, varB] = lightModeStopVars(componentSource);
    const stopA = hslToRgb(resolveLightHsl(varA));
    const stopB = hslToRgb(resolveLightHsl(varB));
    const background = hslToRgb(resolveLightHsl("--color-background"));

    const worst = worstContrastLongerHue(stopA, stopB, background);
    expect(worst).toBeGreaterThanOrEqual(aaLargeText);
  });
});
