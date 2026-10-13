/**
 * Every file under src/pages/ is a public route (#482).
 *
 * Astro routes any `.md` or `.mdx` file in src/pages/, and a Markdown page with
 * no `layout` in its frontmatter is emitted as a bare document: no <head>
 * metadata, no styles, no navigation, no Content-Security-Policy. A README
 * dropped in the directory was published that way at /README/ and listed in
 * the sitemap. Notes for people reading the source start with an underscore,
 * which Astro excludes from routing.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pagesDir = resolve(dirname(fileURLToPath(import.meta.url)), "../pages");

function markdownPages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.name.startsWith("_")) {
      return []; // excluded from routing, files and folders alike
    }
    if (entry.isDirectory()) {
      return markdownPages(full);
    }
    return /\.(md|mdx)$/.test(entry.name) ? [full] : [];
  });
}

describe("src/pages holds routes only", () => {
  it("has no Markdown page without a layout", () => {
    const bare = markdownPages(pagesDir).filter((file) => {
      const frontmatter =
        readFileSync(file, "utf-8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
      return !/^layout:\s*\S/m.test(frontmatter);
    });
    expect(bare.map((file) => relative(pagesDir, file))).toEqual([]);
  });

  it("publishes no README route", () => {
    const names = readdirSync(pagesDir).map((name) => name.toLowerCase());
    expect(names.filter((name) => /^readme\./.test(name))).toEqual([]);
  });
});
