// scripts/src/vite-plugin-inject-versions.mjs
// Vite plugin to inject version placeholders ({{versions.*}}) in *any* text-based
// asset. This ensures that front-matter strings processed by Starlight (such as
// banner.content) also get replaced—something remark/rehype plugins cannot see.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

let versionsCache = null;

function loadVersions(rootDir, strict = false) {
  if (versionsCache) {
    return versionsCache;
  }

  const versionsPath = join(rootDir, "src", "content", "docs", "meta", "versions.yml");

  try {
    const content = readFileSync(versionsPath, "utf8");
    versionsCache = load(content) || {};

    if (versionsCache.template && !versionsCache.template.startsWith("v")) {
      versionsCache.template = `v${versionsCache.template}`;
    }

    console.log(`[vite-inject-versions] Loaded ${Object.keys(versionsCache).length} versions`);
    return versionsCache;
  } catch (err) {
    if (strict) {
      throw new Error(`[vite-inject-versions] Unable to read versions.yml: ${err?.message ?? err}`);
    }
    console.warn(`[vite-inject-versions] Unable to read versions.yml: ${err?.message ?? err}`);
    return {};
  }
}

/**
 * @param {{ rootDir?: string, strict?: boolean }} opts
 * @returns {import('vite').Plugin}
 */
export function viteInjectVersions(opts = {}) {
  const { rootDir = process.cwd(), strict = false } = opts;
  const regex = /{{\s*versions\.([\w-]+)\s*}}/g;

  return {
    name: "vite-inject-versions",
    enforce: "pre",
    configResolved() {
      // Load versions once when Vite configuration is resolved.
      loadVersions(rootDir, strict);
    },
    transform(code, id) {
      if (!code.match(regex)) {
        return null;
      }

      const versions = versionsCache || {};
      const missingVersions = new Set();

      const transformedCode = code.replace(regex, (_match, key) => {
        if (versions[key]) {
          return versions[key];
        }

        missingVersions.add(key);
        if (strict) {
          throw new Error(`Missing version key: ${key} in ${id}`);
        }
        return "(version unknown)";
      });

      if (missingVersions.size > 0) {
        console.warn(
          `[vite-inject-versions] Missing versions in ${id}: ${[...missingVersions].join(", ")}`,
        );
      }

      return transformedCode;
    },
  };
}
