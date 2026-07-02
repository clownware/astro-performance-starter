import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectRasterAssets, findImageBudgetViolations } from "../check-image-budget.ts";

/**
 * Per-image budget gate (ADR-057). The pure `findImageBudgetViolations` is the
 * enforceable core; `collectRasterAssets` is the filesystem walk. Both are
 * tested — the second against a fixtures directory holding a compliant raster,
 * an oversized raster, and an SVG that must be ignored.
 */

// Vitest runs from the repo root; resolve fixtures relative to it.
const fixturesDir = join(process.cwd(), "scripts", "src", "__tests__", "fixtures", "images");

describe("findImageBudgetViolations", () => {
  it("returns nothing when every asset is under budget", () => {
    const assets = [
      { path: "a.png", bytes: 1000 },
      { path: "b.webp", bytes: 199_000 },
    ];
    expect(findImageBudgetViolations(assets, 200 * 1024)).toEqual([]);
  });

  it("flags an asset that exceeds the budget", () => {
    const assets = [
      { path: "ok.png", bytes: 1000 },
      { path: "huge.png", bytes: 1_400_000 },
    ];
    expect(findImageBudgetViolations(assets, 200 * 1024)).toEqual([
      { path: "huge.png", bytes: 1_400_000 },
    ]);
  });

  it("treats a file exactly at the budget as compliant (strict greater-than)", () => {
    const assets = [{ path: "edge.png", bytes: 200 * 1024 }];
    expect(findImageBudgetViolations(assets, 200 * 1024)).toEqual([]);
  });

  it("orders violations worst-offender first", () => {
    const assets = [
      { path: "small-over.png", bytes: 300_000 },
      { path: "biggest.png", bytes: 900_000 },
      { path: "mid-over.png", bytes: 500_000 },
    ];
    expect(findImageBudgetViolations(assets, 200 * 1024).map((a) => a.path)).toEqual([
      "biggest.png",
      "mid-over.png",
      "small-over.png",
    ]);
  });
});

describe("collectRasterAssets", () => {
  it("finds raster files recursively and ignores SVG", () => {
    const assets = collectRasterAssets([fixturesDir]);
    const names = assets.map((a) => a.path.split("/").pop()).sort();
    // nested/deep-raster.png proves the walk recurses — the same way it must
    // catch emitted raster under dist/_astro when CI scans the build output.
    expect(names).toEqual(["deep-raster.png", "tiny-ok.png", "too-big.png"]);
    expect(names).not.toContain("vector.svg");
  });

  it("fails an oversized fixture and passes a compliant one against a low budget", () => {
    const assets = collectRasterAssets([fixturesDir]);
    const violations = findImageBudgetViolations(assets, 2 * 1024); // 2KB test budget
    const offenders = violations.map((a) => a.path.split("/").pop());
    expect(offenders).toEqual(["too-big.png"]);
  });

  it("passes every fixture under the real 200KB budget", () => {
    const assets = collectRasterAssets([fixturesDir]);
    expect(findImageBudgetViolations(assets, 200 * 1024)).toEqual([]);
  });
});
