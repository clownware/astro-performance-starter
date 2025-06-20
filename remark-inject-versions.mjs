// remark-inject-versions.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { visit } from "unist-util-visit";

let versions = null;

// Load versions once
function loadVersions(rootDir) {
  if (!versions) {
    try {
      const versionsPath = join(rootDir, "docs", "meta", "versions.yml");
      const fileContents = readFileSync(versionsPath, "utf8");
      versions = load(fileContents);
    } catch (error) {
      console.warn("Warning: Could not load versions.yml:", error.message);
      versions = {};
    }
  }
  return versions;
}

// Remark plugin to replace version placeholders
export function remarkInjectVersions(options = {}) {
  const rootDir = options.rootDir || process.cwd();

  return function transformer(tree, _file) {
    const versionData = loadVersions(rootDir);

    // Visit all text nodes
    visit(tree, "text", (node) => {
      // Replace {{versions.xxx}} with actual values
      node.value = node.value.replace(/\{\{versions\.([^}]+)\}\}/g, (match, key) => {
        return versionData[key] || match;
      });
    });

    // Also handle inline code
    visit(tree, "inlineCode", (node) => {
      node.value = node.value.replace(/\{\{versions\.([^}]+)\}\}/g, (match, key) => {
        return versionData[key] || match;
      });
    });
  };
}

// Optional: Rehype plugin for HTML content
export function rehypeInjectVersions(options = {}) {
  const rootDir = options.rootDir || process.cwd();

  return function transformer(tree) {
    const versionData = loadVersions(rootDir);

    visit(tree, "text", (node) => {
      if (node.value) {
        node.value = node.value.replace(/\{\{versions\.([^}]+)\}\}/g, (match, key) => {
          return versionData[key] || match;
        });
      }
    });
  };
}
