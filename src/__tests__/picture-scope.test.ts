import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const srcDir = join(repoRoot, "src");

/** The one file ADR-030 (amendment 2026-10-20) lets render astro:assets' <Picture>. */
const allowed = "src/pages/showcase.astro";

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(path);
    return /\.(astro|mdx|tsx?)$/.test(entry.name) ? [path] : [];
  });

// Matches `import { Picture } from "astro:assets"` and aliased or mixed named imports.
const importsPicture = /import\s*\{[^}]*\bPicture\b[^}]*\}\s*from\s*["']astro:assets["']/;

const users = sourceFiles(srcDir)
  .filter((file) => importsPicture.test(readFileSync(file, "utf8")))
  .map((file) => relative(repoRoot, file).split("\\").join("/"));

describe("<Picture> scope (ADR-030 amendment 2026-10-20)", () => {
  it("is used by the showcase demo", () => {
    // Guards the assertion below against passing on an empty list.
    expect(users).toContain(allowed);
  });

  it("is not used anywhere else: the site's images go through the AVIF-only Image wrapper", () => {
    expect(
      users.filter((file) => file !== allowed),
      "Multi-format <Picture> output is a showcase-only example. Use @/components/atoms/Image.astro, or amend ADR-030.",
    ).toEqual([]);
  });
});
