#!/usr/bin/env tsx
/**
 * Per-image size budget gate (ADR-057). The JS bundle, CSS, and Lighthouse
 * scores are all gated in CI; images — the number-one real-world perf killer —
 * were only ever *analysed* (`images:analyze`), never enforced. Analysis
 * without enforcement contradicts halt-on-violation (ADR-039), so this gate
 * fails the build when a raster asset exceeds the documented per-file ceiling.
 *
 * Mirrors the `check-doc-counts` / `check-version-consistency` pattern: a pure,
 * unit-tested `findImageBudgetViolations()` plus a `collectRasterAssets()`
 * filesystem walk, wired together by `main()` and run in CI alongside the JS
 * bundle-size gate.
 *
 * Config: default ceiling is 200KB per raster file — the number
 * `.claude/stack.md` already documents. Override with `IMAGE_BUDGET_KB=<kb>`.
 *
 * Usage: pnpm run images:gate
 */
import { type Dirent, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/** A raster asset discovered on disk. */
export interface ImageAsset {
  /** Path to the file (absolute from the walk; relativised for display). */
  path: string;
  /** File size in bytes. */
  bytes: number;
}

/** Raster formats the gate enforces. SVG is intentionally excluded (vector). */
export const RASTER_EXTENSIONS: ReadonlySet<string> = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
]);

/** Default per-file ceiling; matches the documented budget in `.claude/stack.md`. */
export const DEFAULT_BUDGET_KB = 200;

/** Source roots scanned by the CLI. `public/` is served as-is; `src/` holds assets and content. */
export const DEFAULT_ROOTS = ["public", "src"] as const;

/**
 * The enforceable core: returns every asset over `budgetBytes`, worst offender
 * first. Strictly greater-than, so a file exactly at the budget passes. Pure —
 * no filesystem access — so it is trivially unit-testable.
 */
export function findImageBudgetViolations(assets: ImageAsset[], budgetBytes: number): ImageAsset[] {
  return assets.filter((asset) => asset.bytes > budgetBytes).sort((a, b) => b.bytes - a.bytes);
}

/**
 * Recursively walk each existing directory in `absDirs`, returning raster
 * assets. Skips dotfiles/dotdirs and `node_modules`. Non-existent roots are
 * silently skipped so the CLI works whether or not `public/`/`src/` exist.
 */
export function collectRasterAssets(absDirs: string[]): ImageAsset[] {
  const assets: ImageAsset[] = [];

  const walk = (dir: string): void => {
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // missing directory — nothing to scan
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") {
        continue;
      }
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && RASTER_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
        assets.push({ path: fullPath, bytes: statSync(fullPath).size });
      }
    }
  };

  for (const dir of absDirs) {
    walk(dir);
  }
  return assets;
}

/** Extension-specific remediation hint for the violation report. */
function suggestFix(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === ".png" || ext === ".gif") {
    return "convert to AVIF/WebP, or reduce dimensions if it must stay lossless";
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return "re-encode to AVIF/WebP, or lower quality/dimensions";
  }
  return "reduce dimensions or quality";
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function main(): void {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const budgetKb = Number.parseInt(process.env.IMAGE_BUDGET_KB ?? "", 10) || DEFAULT_BUDGET_KB;
  const budgetBytes = budgetKb * 1024;

  const assets = collectRasterAssets(DEFAULT_ROOTS.map((r) => join(root, r)));
  const violations = findImageBudgetViolations(assets, budgetBytes);

  if (violations.length) {
    console.error(`❌ Image budget exceeded — ${budgetKb}KB per raster file (ADR-057):`);
    for (const v of violations) {
      console.error(
        `   - ${relative(root, v.path)}: ${formatKb(v.bytes)} > ${budgetKb}KB — ${suggestFix(v.path)}`,
      );
    }
    console.error(
      "   Ceiling is configurable via IMAGE_BUDGET_KB. See docs/adr/057-image-budget-gate.md.",
    );
    process.exit(1);
  }

  console.log(`✅ ${assets.length} raster asset(s) all within the ${budgetKb}KB per-image budget.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
