// scripts/remark-base-prefix.mjs
import { visit } from "unist-util-visit";

/**
 * Prefix root-relative Markdown links with your site base path.
 * @param {{ base: string }} opts
 */
export default function remarkBasePrefix(opts = {}) {
  // Ensure base starts with "/" and has *no* trailing slash.
  const base = String(opts.base || "").replace(/\/$/, "");

  return (tree) => {
    visit(tree, "link", (node) => {
      const url = node.url || "";

      // Only patch absolute paths that START with a single "/"
      //  • Ignore mailto:, http(s):, #hash, ../../foo, etc.
      //  • Don’t double-prefix if author ever inlines the base.
      if (url.startsWith("/") && !url.startsWith(`${base}/`)) {
        node.url = base + url;
      }
    });
  };
}
