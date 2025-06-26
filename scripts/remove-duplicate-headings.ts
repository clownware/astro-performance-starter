import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const DOCS_DIR = path.join(process.cwd(), "docs");

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getMarkdownFiles(res);
      }
      return res.endsWith(".md") || res.endsWith(".mdx") ? res : [];
    }),
  );
  return Array.prototype.concat(...files);
}

async function processFile(filePath: string) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    if (!data.title) {
      return;
    }

    const title = data.title.trim();
    const h1Regex = new RegExp(
      `^#\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s*\\n)?`,
      "i",
    );

    if (h1Regex.test(content.trim())) {
      const newContent = content.trim().replace(h1Regex, "");
      const newFileContent = matter.stringify(newContent, data);
      await fs.writeFile(filePath, newFileContent, "utf8");
      console.log(`✅ Fixed duplicate heading in: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
  }
}

async function main() {
  console.log("🔍 Starting to scan for duplicate headings in the /docs directory...");
  const files = await getMarkdownFiles(DOCS_DIR);
  await Promise.all(files.map(processFile));
  console.log("✨ Scan complete. All duplicate headings have been removed.");
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
