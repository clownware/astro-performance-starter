// scripts/vite-plugin-inject-versions.mjs
// Vite plugin to inject version placeholders ({{versions.*}}) in *any* text-based
// asset.  This ensures that front-matter strings processed by Starlight (such as
// banner.content) also get replaced – something remark/rehype plugins cannot see.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
export function viteInjectVersions(opts = {}) {
  const { rootDir = process.cwd() } = opts;
  const versions = (() => {
    try {
      return load(readFileSync(join(rootDir, "docs", "meta", "versions.yml"), "utf8")) || {};
    } catch {
      return {};
    }
  })();
  const regex = /{{\s*versions\.([\w-]+)\s*}}/g;
  return {
    name: "vite-inject-versions",
    enforce: "pre",
    transform(code) {
      if (!regex.test(code)) {
        return null;
      }
      return code.replace(regex, (_m, k) => versions[k] ?? "(version unknown)");
    },
  };
}
