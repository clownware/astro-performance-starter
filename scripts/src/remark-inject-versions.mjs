// scripts/remark-inject-versions.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { visit } from "unist-util-visit";

/**
 * Cache versions to avoid re-reading file on every transform
 */
let versionsCache = null;
let lastVersionsPath = null;

function loadVersions(versionsPath) {
  // Return cached versions if same path
  if (versionsCache && lastVersionsPath === versionsPath) {
    return versionsCache;
  }

  try {
    const content = readFileSync(versionsPath, "utf8");
    versionsCache = load(content) || {};
    lastVersionsPath = versionsPath;

    // Add template version with "v" prefix if missing
    if (versionsCache.template && !versionsCache.template.startsWith("v")) {
      versionsCache.template = `v${versionsCache.template}`;
    }

    console.log(`[remark-inject-versions] Loaded ${Object.keys(versionsCache).length} versions`);
    return versionsCache;
  } catch (err) {
    console.warn("[remark-inject-versions] Unable to read versions.yml:", err?.message ?? err);
    return {};
  }
}

/**
 * @typedef {{ rootDir?: string, strict?: boolean }} Options
 * @param {Options} opts
 */
export function remarkInjectVersions(opts = {}) {
  const { rootDir = process.cwd(), strict = false } = opts;
  const versionsPath = join(rootDir, "src", "content", "docs", "meta", "versions.yml");

  return function transformer(tree, _file) {
    const versions = loadVersions(versionsPath);
    const usedVersions = new Set();
    const missingVersions = new Set();

    visit(tree, (node) => {
      // Skip code blocks and inline code
      if (node.type === "code" || node.type === "inlineCode") {
        return;
      }

      if (node.type === "text" && typeof node.value === "string") {
        node.value = node.value.replace(/{{\s*versions\.([\w-]+)\s*}}/g, (_match, key) => {
          usedVersions.add(key);

          if (versions[key]) {
            return versions[key];
          }
          missingVersions.add(key);
          if (strict) {
            throw new Error(`Missing version key: ${key} in ${versionsPath}`);
          }
          return "(version unknown)";
        });
      }
    });

    // Report missing versions in development
    if (missingVersions.size > 0) {
      console.warn(
        `[remark-inject-versions] Missing versions in ${file.path || "unknown file"}: ${Array.from(missingVersions).join(", ")}`,
      );
    }
  };
}

/**
 * @typedef {{ rootDir?: string, strict?: boolean }} Options
 * @param {Options} opts
 */
export function rehypeInjectVersions(opts = {}) {
  const { rootDir = process.cwd(), strict = false } = opts;
  const versionsPath = join(rootDir, "src", "content", "docs", "meta", "versions.yml");

  return function transformer(tree, _file) {
    const versions = loadVersions(versionsPath);

    visit(tree, "text", (node) => {
      if (typeof node.value === "string") {
        node.value = node.value.replace(/{{\s*versions\.([\w-]+)\s*}}/g, (_match, key) => {
          if (versions[key]) {
            return versions[key];
          }
          if (strict) {
            throw new Error(`Missing version key: ${key} in ${versionsPath}`);
          }
          console.warn(`[rehype-inject-versions] Missing version: ${key}`);
          return "(version unknown)";
        });
      }
    });
  };
}
