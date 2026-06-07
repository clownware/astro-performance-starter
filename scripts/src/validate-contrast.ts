#!/usr/bin/env tsx
/**
 * Validate WCAG-AA contrast ratios for the semantic colour roles, in BOTH
 * light and dark mode. Fails (exit code 1) if any body-text pair is below
 * 4.5:1, or any large-text / non-text pair is below 3:1.
 * Usage: pnpm run design:validate (mapped in package.json)
 *
 * History: the previous version expected an older token shape
 * (foreground.default/muted/subtle/inverted) that the v2 cold-minimal tokens
 * (ADR-047) no longer use, so every pair hit the missing-token skip and the
 * gate passed vacuously. It also only ever checked light mode. This rewrite
 * resolves the flat role tokens (refs *and* literal HSL), and sweeps both
 * modes so a dark-only regression cannot slip through.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const base: Record<string, unknown> = JSON.parse(
  readFileSync(join(root, "..", "..", "tokens", "base.json"), "utf-8"),
);

interface TokenLeaf {
  value: string;
  dark?: string;
}
const semantic: Record<string, TokenLeaf | Record<string, TokenLeaf>> = JSON.parse(
  readFileSync(join(root, "..", "..", "tokens", "semantic.json"), "utf-8"),
).semantic;

type Rgb = [number, number, number];

function hslStringToRgb(hsl: string): Rgb {
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
    [r, g, b] = [c, x, 0];
  } else if (hNum < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hNum < 180) {
    [r, g, b] = [0, c, x];
  } else if (hNum < 240) {
    [r, g, b] = [0, x, c];
  } else if (hNum < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  return [r + m, g + m, b + m].map((v) => Math.round(v * 255)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrast(a: Rgb, b: Rgb): number {
  const l1 = luminance(a) + 0.05;
  const l2 = luminance(b) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

// Resolve a {color.x.y} reference against base.json; pass literal HSL through.
function deref(token: string): string {
  if (!token.startsWith("{")) {
    return token;
  }
  const path = token.replace(/[{}]/g, "").split(".");
  let current: unknown = base;
  for (const segment of path) {
    current = (current as Record<string, unknown> | undefined)?.[segment];
  }
  if (current && typeof current === "object" && "value" in current) {
    return (current as TokenLeaf).value;
  }
  throw new Error(`Unable to resolve token reference: ${token}`);
}

type Mode = "light" | "dark";

// Resolve a role (or a scale step like primary.600) to HSL for the given mode.
function channel(role: string, mode: Mode): string {
  const parts = role.split(".");
  let entry: unknown = semantic;
  for (const p of parts) {
    entry = (entry as Record<string, unknown> | undefined)?.[p];
  }
  const leaf = entry as TokenLeaf | undefined;
  if (!leaf?.value) {
    throw new Error(`Unknown semantic role: ${role}`);
  }
  const raw = mode === "dark" ? (leaf.dark ?? leaf.value) : leaf.value;
  return deref(raw);
}

const aaNormal = 4.5; // body text
const aaLarge = 3.0; // large text (>=18pt / 14pt bold) and non-text UI

interface Pair {
  fg: string;
  bg: string;
  min: number;
  note?: string;
}

// Body-text roles over the two surfaces they sit on.
const pairs: Pair[] = [
  { fg: "foreground", bg: "background", min: aaNormal },
  { fg: "foreground", bg: "surface", min: aaNormal },
  { fg: "mutedForeground", bg: "background", min: aaNormal },
  { fg: "mutedForeground", bg: "surface", min: aaNormal },
  { fg: "link", bg: "background", min: aaNormal },
  { fg: "link", bg: "surface", min: aaNormal },
  { fg: "success", bg: "background", min: aaNormal },
  { fg: "success", bg: "surface", min: aaNormal },
  { fg: "error", bg: "background", min: aaNormal },
  { fg: "error", bg: "surface", min: aaNormal },
  { fg: "primaryForeground", bg: "primary.600", min: aaNormal },
  // warning is amber — it cannot reach 4.5:1 on a white surface without going
  // muddy, and its real usages are decorative (aria-hidden checkmarks), badge
  // fills, and large Callout headings — so it is held to the 3:1 large-text /
  // non-text bar. Promote to AA_NORMAL if warning ever styles body copy.
  { fg: "warning", bg: "background", min: aaLarge, note: "large-text/non-text only" },
  { fg: "warning", bg: "surface", min: aaLarge, note: "large-text/non-text only" },
];

const modes: Mode[] = ["light", "dark"];
const failures: string[] = [];

for (const { fg, bg, min, note } of pairs) {
  for (const mode of modes) {
    const ratio = contrast(hslStringToRgb(channel(fg, mode)), hslStringToRgb(channel(bg, mode)));
    if (ratio < min) {
      const tag = note ? ` (${note})` : "";
      failures.push(`${fg} on ${bg} [${mode}]${tag}: ${ratio.toFixed(2)}:1 (<${min})`);
    }
  }
}

if (failures.length) {
  console.error("❌ WCAG-AA contrast failures:");
  for (const f of failures) {
    console.error(`  ${f}`);
  }
  process.exit(1);
}
console.log(`✅ All ${pairs.length} semantic colour pairs meet WCAG-AA contrast (light + dark).`);
