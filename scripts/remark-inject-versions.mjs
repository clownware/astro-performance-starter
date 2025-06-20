// scripts/remark-inject-versions.mjs
// Temporary no-op plugins to satisfy Astro config during local/CI checks.
// TODO: replace with real implementation that injects package versions into docs.

/**
 * @typedef {{ rootDir: string }} Options
 * @param {Options} opts
 */
export function remarkInjectVersions(_opts = {}) {
  // Remark plugin signature
  return function transformer(tree) {
    // Currently no-op
    return tree;
  };
}

/**
 * @typedef {{ rootDir: string }} Options
 * @param {Options} opts
 */
export function rehypeInjectVersions(_opts = {}) {
  // Rehype plugin signature
  return function transformer(tree) {
    return tree;
  };
}
