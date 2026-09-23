import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const homepagePath = "src/pages/index.astro";
const homepage = readFileSync(join(repoRoot, homepagePath), "utf8");

/**
 * Every `.svg` the homepage imports is rendered inline as an Astro SVG
 * component, so the Pulci Nella state portraits keep their embedded CSS
 * animation without the ADR-030 raw-`<img>` exemption (#414).
 *
 * Inlining has a cost the `<img>` path never had: an SVG's markup joins the
 * page's DOM. Astro's SVG component inlines the file body untouched — no id
 * prefixing, no style scoping — so two portraits that each declare
 * `id="g"` put duplicate ids on one page, and `url(#g)` silently resolves to
 * whichever came first. Classes and `<style>` rules inside the file become
 * page-wide selectors, so a `.d1` in a portrait would restyle any `.d1`
 * elsewhere on the site. Both are invisible until two of these files, or a
 * portrait and some unrelated markup, disagree.
 */
const inlineSvgImports = [
  ...homepage.matchAll(/^import\s+(\w+)\s+from\s+["']@\/(assets\/[^"']+\.svg)["'];?$/gm),
].map((match) => ({ binding: match[1], path: `src/${match[2]}` }));

const inlineSvgs = inlineSvgImports.map(({ path }) => ({
  path,
  source: readFileSync(join(repoRoot, path), "utf8"),
}));

const namespace = "pn-";

describe("homepage renders its SVGs inline", () => {
  it("finds the SVG imports it is meant to be guarding", () => {
    // A renamed alias or a moved asset directory would otherwise leave the
    // assertions below checking an empty list.
    expect(inlineSvgImports.length).toBeGreaterThanOrEqual(3);
  });

  it("uses no raw <img>, so it no longer relies on the ADR-030 exemption", () => {
    const lines = homepage
      .split("\n")
      .map((text, index) => ({ text, line: index + 1 }))
      .filter(({ text }) => /<img\b/.test(text))
      .map(({ line, text }) => `${homepagePath}:${line} — ${text.trim()}`);

    expect(lines).toEqual([]);
  });

  it("renders each imported SVG as a component, never through its .src URL", () => {
    const viaSrc = inlineSvgImports
      .filter(({ binding }) => new RegExp(`\\b${binding}\\.src\\b`).test(homepage))
      .map(({ binding }) => binding);

    expect(viaSrc, "these are still rendered through their .src URL").toEqual([]);
  });
});

describe("inlined SVGs cannot collide with each other or the page", () => {
  it("declares document-unique ids across every inlined SVG", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const { path, source } of inlineSvgs) {
      for (const [, id] of source.matchAll(/\bid="([^"]+)"/g)) {
        const firstSeenIn = seen.get(id);
        if (firstSeenIn) {
          duplicates.push(`id="${id}" in ${path} (already declared in ${firstSeenIn})`);
        } else {
          seen.set(id, path);
        }
      }
    }

    expect(duplicates).toEqual([]);
  });

  it(`namespaces every id and class with "${namespace}"`, () => {
    const unscoped: string[] = [];

    for (const { path, source } of inlineSvgs) {
      for (const [, id] of source.matchAll(/\bid="([^"]+)"/g)) {
        if (!id.startsWith(namespace)) unscoped.push(`${path}: id="${id}"`);
      }
      for (const [, classList] of source.matchAll(/\bclass="([^"]+)"/g)) {
        for (const name of classList.split(/\s+/)) {
          if (!name.startsWith(namespace)) unscoped.push(`${path}: class="${name}"`);
        }
      }
      for (const [, selector] of source.matchAll(/(?:^|[\s,{}])\.([a-zA-Z][\w-]*)\s*[{,]/g)) {
        if (!selector.startsWith(namespace))
          unscoped.push(`${path}: <style> selector .${selector}`);
      }
    }

    expect(
      unscoped,
      "An inlined SVG's ids and classes join the page's global namespace; prefix them so they cannot match anything else.",
    ).toEqual([]);
  });
});
