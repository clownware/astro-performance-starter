#!/usr/bin/env tsx
/*
 * Ensures all Markdown files in the docs directory have valid YAML frontmatter.
 * If missing, inserts minimal frontmatter with a title (from filename), blank description, and today's date as last_reviewed_on.
 * If frontmatter exists but is missing last_reviewed_on, adds today's date.
 * Run before normalize-frontmatter.ts for best results.
 *
 * Usage: pnpm tsx scripts/ensure-frontmatter.ts [path]
 * Defaults to 'src/content' if no path is given.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");

async function ensureFrontmatter(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  if (!raw.trimStart().startsWith("---")) {
    // No frontmatter at all - add complete frontmatter
    const filename = path.parse(filePath).name.replace(/[-_]/g, " ");
    const newRaw = `---\ntitle: "${filename}"\ndescription: ""\nlast_reviewed_on: "${todayDate}"\n---\n\n${raw}`;
    await fs.writeFile(filePath, newRaw);
    console.log(
      "[ensure-frontmatter] Added frontmatter to",
      path.relative(process.cwd(), filePath),
    );
  } else {
    // Has frontmatter - check if missing last_reviewed_on
    const parsed = matter(raw);
    if (!parsed.data.last_reviewed_on) {
      parsed.data.last_reviewed_on = todayDate;
      const newRaw = matter.stringify(parsed.content, parsed.data);
      await fs.writeFile(filePath, newRaw);
      console.log(
        "[ensure-frontmatter] Added last_reviewed_on to",
        path.relative(process.cwd(), filePath),
      );
    }
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(res)));
    } else if (entry.isFile() && (res.endsWith(".md") || res.endsWith(".mdx"))) {
      await ensureFrontmatter(res);
      files.push(res);
    }
  }
  return files;
}

(async () => {
  try {
    const files = await walk(contentDir);
    console.log("[ensure-frontmatter] All docs have frontmatter.");
    console.log(files);
  } catch (err) {
    console.error("[ensure-frontmatter] Error:", err);
    process.exit(1);
  }
})();
