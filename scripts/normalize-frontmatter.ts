#!/usr/bin/env tsx
/*
 * Normalize front-matter across docs so it matches docsSchema.
 *
 * Usage:  pnpm tsx scripts/normalize-frontmatter.ts [path]
 * The optional [path] defaults to 'docs'.
 *
 * The script performs the following adjustments:
 * 1. Renames legacy date keys (`updated`, `lastUpdatedAt`) -> `lastUpdated`.
 * 2. Converts `lastUpdated` to a Date object.
 * 3. Leaves `version` untouched but preserves it if present.
 * 4. Writes back the file only when a change is made.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

type DocFM = Record<string, unknown> & {
  updated?: unknown;
  lastUpdatedAt?: unknown;
  title?: unknown;
  description?: unknown;
  lastUpdated?: unknown;
};

const DOCS_DIR = path.resolve(process.argv[2] || "docs");

async function processFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  let data: DocFM = { ...parsed.data } as DocFM;

  // ---- Normalisation rules ----
  // Promote legacy keys to lastUpdated if not already present
  if (!("lastUpdated" in data)) {
    const legacyDate = data.updated ?? data.lastUpdatedAt;
    if (legacyDate !== undefined) {
      data.lastUpdated = legacyDate;
    }
  }
  // Remove legacy keys without using delete (avoid hidden-class deopts)
  const { updated, lastUpdatedAt, ...rest } = data;
  data = rest;

  // Ensure required schema fields ----------
  // Title
  if (!data.title) {
    const headingMatch = parsed.content.match(/^#\s+(.+)/m);
    const fallback = path.parse(filePath).name.replace(/[-_]/g, " ");
    data.title = (headingMatch?.[1] ?? fallback).replace(/\s+/g, " ").trim();
  }
  // Description (first non-heading paragraph, max 160 chars)
  if (!data.description) {
    const cleaned = parsed.content
      .replace(/<!--.*?-->/gs, "")
      .replace(/^#.*$/gm, "")
      .trim();
    const firstPara = cleaned.split(/\n\s*\n/)[0].replace(/\n+/g, " ");
    data.description = firstPara.slice(0, 160);
  }

  // Ensure lastUpdated is a Date object (so YAML serializes without quotes)
  if (data.lastUpdated !== undefined) {
    const lu = data.lastUpdated;
    if (lu instanceof Date) {
      // already a Date – nothing to do
    } else if (typeof lu === "string" || typeof lu === "number") {
      const parsedDate = new Date(lu);
      if (!Number.isNaN(parsedDate.valueOf())) {
        data.lastUpdated = parsedDate;
      }
    }
  }

  // --------------------------------

  const newRaw = matter.stringify(parsed.content, data);
  if (newRaw !== raw) {
    await fs.writeFile(filePath, newRaw);
    console.log("Updated", path.relative(process.cwd(), filePath));
  }
}

async function walk(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(res);
    } else if (entry.isFile() && (res.endsWith(".md") || res.endsWith(".mdx"))) {
      await processFile(res);
    }
  }
}

(async () => {
  try {
    await walk(DOCS_DIR);
    console.log("Front-matter normalization complete.");
  } catch (err) {
    console.error("Error during normalization:", err);
    process.exit(1);
  }
})();
