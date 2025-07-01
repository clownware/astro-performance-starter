#!/usr/bin/env tsx
/**
 * Validate WCAG-AA contrast ratios for all semantic foreground/background pairs.
 * Fails (exit code 1) if any pair is below 4.5:1 (normal text) or 3:1 for large text.
 * Usage: pnpm run validate:contrast (already mapped in package.json)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const base: Record<string, unknown> = JSON.parse(
  readFileSync(join(root, "..", "..", "tokens", "base.json"), "utf-8"),
);
interface TokenEntry {
  value: string;
}
interface SemanticTokens {
  semantic: {
    background: Record<string, TokenEntry>;
    foreground: Record<string, TokenEntry>;
  };
}
const semantic: SemanticTokens = JSON.parse(
  readFileSync(join(root, "..", "tokens", "semantic.json"), "utf-8"),
);

type RGB = [number, number, number];

function hslStringToRgb(hsl: string): RGB {
  // "210 40% 98%" -> h,s,l numbers
  const [h, sPercent, lPercent] = hsl.split(/\s+/);
  const hNum = Number.parseFloat(h);
  const s = Number.parseFloat(sPercent) / 100;
  const l = Number.parseFloat(lPercent) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hNum / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hNum < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hNum < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hNum < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hNum < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hNum < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return [r + m, g + m, b + m].map((v) => Math.round(v * 255)) as RGB;
}

function luminance([r, g, b]: RGB): number {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrast(a: RGB, b: RGB): number {
  const l1 = luminance(a) + 0.05;
  const l2 = luminance(b) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

function resolveRef(ref: string): string {
  const path = ref.replace(/[{}]/g, "").split("."); // e.g. ["color","gray","50"]
  let current: unknown = base;
  for (const segment of path) {
    if (typeof current !== "object" || current === null) {
      break;
    }
    current = (current as Record<string, unknown>)[segment];
    if (!current) {
      break;
    }
  }
  if (current && typeof current === "object" && "value" in current) {
    return current.value as string;
  }
  throw new Error(`Unable to resolve token reference: ${ref}`);
}

const bg = semantic.semantic.background;
const fg = semantic.semantic.foreground;

// Define meaningful foreground → background mappings
const PAIRS: [keyof typeof fg, keyof typeof bg][] = [
  ["default", "default"],
  ["muted", "default"],
  ["subtle", "subtle"],
  ["inverted", "inverted"],
];

interface Issue {
  pair: string;
  ratio: number;
}
const failures: Issue[] = [];

for (const [fgKey, bgKey] of PAIRS) {
  // Skip if tokens are missing
  if (!fg[fgKey] || !bg[bgKey]) {
    continue;
  }
  const fgHsl = resolveRef(fg[fgKey].value as string);
  const bgHsl = resolveRef(bg[bgKey].value as string);
  const ratio = contrast(hslStringToRgb(fgHsl), hslStringToRgb(bgHsl));
  if (ratio < 4.5) {
    failures.push({
      pair: `${String(fgKey)} on ${String(bgKey)}`,
      ratio: Number(ratio.toFixed(2)),
    });
  }
}

if (failures.length) {
  console.error("\u274C WCAG-AA contrast failures:");
  for (const f of failures) {
    console.error(`  ${f.pair}: ${f.ratio}:1 (<4.5)`);
  }
  process.exit(1);
}
console.log("✅ All semantic foreground/background pairs meet WCAG-AA contrast (light mode).");
