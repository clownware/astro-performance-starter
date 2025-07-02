// scripts/src/vite-plugin-inject-versions.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";

let versionsCache = null;

// This function now reads from versions.json
function loadVersions(rootDir) {
  if (versionsCache) {
    return versionsCache;
  }

  // The update:versions script creates versions.json in the root.
  const versionsPath = join(rootDir, "versions.json");

  try {
    const content = readFileSync(versionsPath, "utf8");
    versionsCache = JSON.parse(content) || {};
    console.log(
      `[vite-inject-versions] Loaded ${Object.keys(versionsCache).length} versions from versions.json`,
    );
    return versionsCache;
  } catch (err) {
    console.warn(`[vite-inject-versions] Unable to read versions.json: ${err?.message ?? err}`);
    return {};
  }
}

/**
 * Vite plugin to inject version placeholders ({{versions.*}}) in *any* text-based
 * asset. This ensures that front-matter strings processed by Starlight (such as
 * banner.content) also get replaced—something remark/rehype plugins cannot see.
 * @param {{ rootDir?: string }} opts
 * @returns {import('vite').Plugin}
 */
export function viteInjectVersions(opts = {}) {
  const { rootDir = process.cwd() } = opts;
  // This regex is robust and handles whitespace.
  const regex = /{{\s*versions\.([\w-]+)\s*}}/g;

  return {
    name: "vite-inject-versions",
    enforce: "pre",
    configResolved() {
      // Load versions once when Vite configuration is resolved.
      loadVersions(rootDir);
    },
    transform(code, _id) {
      // Quick check to avoid processing files that don't have placeholders
      if (!code.includes("{{versions.")) {
        return null;
      }

      const versions = versionsCache || {};

      const transformedCode = code.replace(regex, (_match, key) => {
        if (versions[key] !== undefined) {
          return versions[key];
        }
        // If key is not found, leave the placeholder as is.
        // This prevents breaking things if a key is missing.
        return _match;
      });

      // Only return if changes were made to avoid unnecessary processing
      if (transformedCode !== code) {
        return { code: transformedCode, map: null };
      }

      return null;
    },
  };
}
