// scripts/remark-inject-versions.mjs
// Temporary no-op plugins to satisfy Astro config during local/CI checks.
// Inject versions from docs/meta/versions.yml into Markdown/MDX at build time.
// Replaces all occurrences of `{{versions.<key>}}` with the actual version value.
// Falls back to `(version unknown)` if the key is missing.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { visit } from "unist-util-visit";

/**
 * @typedef {{ rootDir: string }} Options
 * @param {Options} opts
 */
export function remarkInjectVersions(_opts = {}) {
  // Remark plugin signature
  const { rootDir = process.cwd() } = _opts;
  const versionsPath = join(rootDir, "docs", "meta", "versions.yml");
  let versions = {};
  try {
    versions = load(readFileSync(versionsPath, "utf8")) || {};
  } catch (err) {
    console.warn("[remark-inject-versions] Unable to read versions.yml:", err?.message ?? err);
  }

  return function transformer(tree) {
    visit(tree, (node) => {
      if (node.type === "code" || node.type === "inlineCode") {
        return;
      } // Skip code blocks
      if (node.type === "text" && typeof node.value === "string") {
        node.value = node.value.replace(/{{\s*versions\.([\w-]+)\s*}}/g, (_match, key) => {
          return versions[key] ?? "(version unknown)";
        });
      }
    });
  };
}

/**
 * @typedef {{ rootDir: string }} Options
 * @param {Options} opts
 */
export function rehypeInjectVersions(_opts = {}) {
  // Rehype plugin signature
  const { rootDir = process.cwd() } = _opts;
  const versionsPath = join(rootDir, "docs", "meta", "versions.yml");
  let versions = {};
  try {
    versions = load(readFileSync(versionsPath, "utf8")) || {};
  } catch (err) {
    console.warn("[rehype-inject-versions] Unable to read versions.yml:", err?.message ?? err);
  }

  return function transformer(tree) {
    visit(tree, "text", (node) => {
      if (typeof node.value === "string") {
        node.value = node.value.replace(/{{\s*versions\.([\w-]+)\s*}}/g, (_match, key) => {
          return versions[key] ?? "(version unknown)";
        });
      }
    });
  };
}
