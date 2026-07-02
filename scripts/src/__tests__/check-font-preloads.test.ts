import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectHtmlPreloadCounts,
  countFontPreloads,
  findFontPreloadViolations,
} from "../check-font-preloads.ts";

/**
 * Font preload budget gate (ADR-058). `countFontPreloads` counts the
 * LCP-relevant `<link rel="preload" as="font">` tags in a page;
 * `findFontPreloadViolations` is the pure enforceable core; the fixture pages
 * exercise the filesystem walk (2 preloads passes, 3 fails at cap 2).
 */

const fixturesDir = join(process.cwd(), "scripts", "src", "__tests__", "fixtures", "html");

describe("countFontPreloads", () => {
  it("counts font preload links regardless of attribute order or quote style", () => {
    const html = `
      <link rel="preload" href="/a.woff2" as="font" type="font/woff2" crossorigin>
      <link as='font' rel='preload' href='/b.woff2'>
    `;
    expect(countFontPreloads(html)).toBe(2);
  });

  it("ignores preloads that are not fonts and non-preload font links", () => {
    const html = `
      <link rel="preload" href="/hero.avif" as="image">
      <link rel="stylesheet" href="/site.css">
      <link rel="preload" href="/only-font.woff2" as="font" crossorigin>
    `;
    expect(countFontPreloads(html)).toBe(1);
  });

  it("returns 0 when there are no font preloads", () => {
    expect(countFontPreloads("<html><head></head><body></body></html>")).toBe(0);
  });
});

describe("findFontPreloadViolations", () => {
  it("returns nothing when every page is within the cap", () => {
    const pages = [
      { path: "a.html", count: 2 },
      { path: "b.html", count: 1 },
    ];
    expect(findFontPreloadViolations(pages, 2)).toEqual([]);
  });

  it("flags pages over the cap, worst offender first", () => {
    const pages = [
      { path: "a.html", count: 3 },
      { path: "b.html", count: 2 },
      { path: "c.html", count: 5 },
    ];
    expect(findFontPreloadViolations(pages, 2)).toEqual([
      { path: "c.html", count: 5 },
      { path: "a.html", count: 3 },
    ]);
  });
});

describe("collectHtmlPreloadCounts (fixtures)", () => {
  it("passes a 2-preload page and fails a 3-preload page at cap 2", () => {
    const pages = collectHtmlPreloadCounts(fixturesDir);
    const byName = Object.fromEntries(pages.map((p) => [p.path.split("/").pop(), p.count]));
    expect(byName["ok-2preloads.html"]).toBe(2);
    expect(byName["too-many-3preloads.html"]).toBe(3);

    const violations = findFontPreloadViolations(pages, 2).map((p) => p.path.split("/").pop());
    expect(violations).toEqual(["too-many-3preloads.html"]);
  });
});
