#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// Define all keys allowed by the default Starlight docsSchema()
const allowedKeys = new Set([
  "title",
  "description",
  "slug",
  "draft",
  "template",
  "hero",
  "banner",
  "lastUpdated",
  "tableOfContents",
  "sidebar",
  "editUrl",
  "head",
  "prev",
  "next",
  "pagefind",
]);

type DocFM = Record<string, unknown>;

const contentDir = path.resolve(process.argv[2] || "src/content");

async function processFile(filePath: string): Promise<void> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  let data: DocFM = { ...parsed.data };

  // ---- NEW: Filter out any keys not in the allowlist ----
  const filteredData: DocFM = {};
  for (const key in data) {
    if (allowedKeys.has(key)) {
      filteredData[key] = data[key];
    }
  }
  data = filteredData;
  // --------------------------------------------------------

  // ---- Normalisation rules ----

  // Add missing title
  if (!data.title) {
    const headingMatch = parsed.content.match(/^#\s+(.+)/m);
    const fallback = path.parse(filePath).name.replace(/[-_]/g, " ");
    data.title = (headingMatch?.[1] ?? fallback).replace(/\s+/g, " ").trim();
  }

  // Add missing description
  if (!data.description) {
    const cleaned = parsed.content
      .replace(/<!--.*?-->/gs, "")
      .replace(/^#.*$/gm, "")
      .trim();
    const firstPara = cleaned.split(/\n\s*\n/)[0].replace(/\n+/g, " ");
    data.description = firstPara.slice(0, 160);
  }

  // ---- NEW: Add default values for missing fields ----
  if (data.lastUpdated === undefined) {
    data.lastUpdated = true;
  }
  if (data.tableOfContents === undefined) {
    data.tableOfContents = true;
  }
  if (data.pagefind === undefined) {
    data.pagefind = true;
  }
  // ---------------------------------------------------

  const newRaw = matter.stringify(parsed.content, data);
  if (newRaw !== raw) {
    await fs.writeFile(filePath, newRaw);
    console.log("Updated", path.relative(process.cwd(), filePath));
  }
}

async function walk(dir: string): Promise<void> {
  // ... (The walk function remains the same)
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
  // ... (The main execution block remains the same)
  try {
    await walk(contentDir);
    console.log("[normalize-frontmatter] Frontmatter normalized.");
  } catch (err) {
    console.error("Error during normalization:", err);
    process.exit(1);
  }
})();
