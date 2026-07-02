#!/usr/bin/env tsx
/**
 * Font preload budget gate (ADR-058). Over-preloading fonts competes with the
 * LCP resource for high-priority bandwidth — the failure is silent (the page
 * just gets slower). The JS, CSS, image, and Lighthouse budgets are all gated;
 * font preloads were not. This gate counts `<link rel="preload" as="font">`
 * tags per built page and fails when any page exceeds the cap.
 *
 * Mirrors the image-budget gate (ADR-057): a pure, unit-tested core
 * (`findFontPreloadViolations`) plus HTML helpers, wired together by `main()`
 * and run in CI after the build alongside the other build-output gates.
 *
 * Config: default cap is 2 preloads per page (one per font family — the
 * deliberate current count). Override with `MAX_FONT_PRELOADS=<n>`.
 *
 * Usage: pnpm run build && pnpm run fonts:gate
 */
import { type Dirent, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/** Per-page count of preloaded font files. */
export interface FontPreloadCount {
  /** Path to the HTML file. */
  path: string;
  /** Number of `<link rel="preload" as="font">` tags on the page. */
  count: number;
}

/** Default cap: one preload per font family (Geist + Inter). */
export const DEFAULT_MAX_PRELOADS = 2;

/** Built-output directory scanned by the CLI. */
export const DIST_DIR = "dist";

/**
 * Count `<link rel="preload" … as="font">` tags in a page. Robust to attribute
 * order and quote style; ignores non-font preloads and non-preload font links.
 */
export function countFontPreloads(html: string): number {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  return linkTags.filter(
    (tag) => /\brel=["']preload["']/i.test(tag) && /\bas=["']font["']/i.test(tag),
  ).length;
}

/**
 * The enforceable core: returns every page over `maxPreloads`, worst offender
 * first. Pure — no filesystem access — so it is trivially unit-testable.
 */
export function findFontPreloadViolations(
  pages: FontPreloadCount[],
  maxPreloads: number,
): FontPreloadCount[] {
  return pages.filter((page) => page.count > maxPreloads).sort((a, b) => b.count - a.count);
}

/**
 * Recursively walk `distDir`, counting font preloads in every `.html` file.
 * A missing directory yields an empty list (the CLI reports that explicitly).
 */
export function collectHtmlPreloadCounts(distDir: string): FontPreloadCount[] {
  const pages: FontPreloadCount[] = [];

  const walk = (dir: string): void => {
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        pages.push({ path: fullPath, count: countFontPreloads(readFileSync(fullPath, "utf-8")) });
      }
    }
  };

  walk(distDir);
  return pages;
}

function main(): void {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const maxPreloads =
    Number.parseInt(process.env.MAX_FONT_PRELOADS ?? "", 10) || DEFAULT_MAX_PRELOADS;
  const distDir = join(root, DIST_DIR);

  const pages = collectHtmlPreloadCounts(distDir);
  if (pages.length === 0) {
    console.error(`❌ No built HTML found in ${DIST_DIR}/. Run \`pnpm run build\` first.`);
    process.exit(1);
  }

  const violations = findFontPreloadViolations(pages, maxPreloads);
  if (violations.length) {
    console.error(`❌ Font preload budget exceeded — max ${maxPreloads} per page (ADR-058):`);
    for (const v of violations) {
      console.error(`   - ${relative(root, v.path)}: ${v.count} preloaded fonts > ${maxPreloads}`);
    }
    console.error(
      "   Over-preloading fonts competes with LCP. Reduce preloads or raise MAX_FONT_PRELOADS.",
    );
    process.exit(1);
  }

  const maxSeen = pages.reduce((m, p) => Math.max(m, p.count), 0);
  console.log(
    `✅ ${pages.length} page(s) within the font preload budget (max ${maxPreloads}; highest seen ${maxSeen}).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
