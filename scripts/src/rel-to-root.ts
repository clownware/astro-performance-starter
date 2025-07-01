// scripts/one-off/rel-to-root.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { globby } from "globby";
import type { Link, Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const DOCS_DIR = "src/content/docs";
const CWD = process.cwd();

/**
 * Converts a relative file path to a root-relative Starlight link.
 * @param rel - e.g., "../getting-started/contributing.md"
 * @returns Root-relative link - e.g., "/getting-started/contributing/"
 */
function toRootRelativeLink(rel: string): string {
  // drop leading "docs/" if present
  const cleaned = rel.replace(/^docs[\\/]/i, "");
  const parsed = path.parse(cleaned);
  const dir = parsed.dir.replace(/\\/g, "/");
  const name = parsed.name === "index" || parsed.name.toLowerCase() === "readme" ? "" : parsed.name;
  const link = `/${[dir, name].filter(Boolean).join("/")}/`.replace(/\/\/+/g, "/");
  return link === "//" ? "/" : link;
}

async function processFile(filePath: string): Promise<void> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const fileDir = path.dirname(filePath);
  let changed = false;

  const mdxProcessor = unified()
    .use(remarkParse)
    .use(remarkMdx, {
      acornOptions: {
        ecmaVersion: 2022,
        allowReserved: true,
        allowAwaitOutsideFunction: true,
      },
      skipImport: true,
      skipExport: true,
    });

  let tree: Root;
  try {
    tree = mdxProcessor.parse(fileContent); // MDX + links
  } catch (_err) {
    console.warn(`⚠️  MDX parse failed in ${filePath} - falling back to Markdown`);
    tree = unified().use(remarkParse).parse(fileContent);
  }

  visit(tree, "link", (node: Link) => {
    const url = node.url;
    const currentSubdir = path.relative(DOCS_DIR, fileDir).replace(/\\/g, "/");

    // Second-pass fixer for malformed absolute URLs.
    if (url?.startsWith(`/${currentSubdir}/docs/`)) {
      const tail = url.slice(`${currentSubdir}/docs`.length + 1);
      const newUrl = toRootRelativeLink(tail);
      console.log(`  Updating link: ${url} -> ${newUrl}`);
      node.url = newUrl;
      changed = true;
      return;
    }

    // Main guard for non-relative links.
    if (!url || url.startsWith("/") || url.startsWith("#") || /^[a-zA-Z][\w+-]*:/.test(url)) {
      return;
    }

    const [linkPath] = url.split("#");
    const absoluteLinkPath = path.resolve(fileDir, linkPath);
    const relativeToDocs = path.relative(DOCS_DIR, absoluteLinkPath);

    // Skip links that resolve outside the docs folder.
    if (relativeToDocs.startsWith("..")) {
      console.warn(`  ⚠️  Skipping link that resolves outside of docs folder: ${url}`);
      return;
    }

    // Heuristics for "docs-root intent".
    // Case A: author wrote "./docs/..." → drop that leading "docs/"
    let adjusted = relativeToDocs.replace(/^docs\//i, "");

    // Case B: author wrote "./CONTRIBUTING.md" while in a nested folder
    if (currentSubdir && adjusted.startsWith(`${currentSubdir}/`)) {
      adjusted = adjusted.slice(currentSubdir.length + 1);
    }

    const newUrl = toRootRelativeLink(adjusted);

    if (newUrl !== url) {
      console.log(`  Updating link: ${url} -> ${newUrl}`);
      node.url = newUrl;
      changed = true;
    }
  });

  if (changed) {
    const newContent = mdxProcessor()
      .use(remarkStringify, { listItemIndent: "one" })
      .stringify(tree);
    console.log(`Writing changes to ${filePath}...`);
    await fs.writeFile(filePath, String(newContent));
  }
}

async function main() {
  console.log("Starting link migration to root-relative paths...");

  const files = await globby([`${DOCS_DIR}/**/*.md`, `${DOCS_DIR}/**/*.mdx`]);

  await Promise.all(
    files.map(async (file) => {
      console.log(`Processing ${file}...`);
      await processFile(path.join(CWD, file));
    }),
  );

  console.log("\nLink migration complete!");
}

main().catch((error) => {
  console.error("An error occurred during link migration:", error);
  process.exit(1);
});
