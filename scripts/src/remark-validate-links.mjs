import { existsSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

// remark-validate-links.mjs
import { visit } from "unist-util-visit";

/**
 * Remark plugin to validate internal links at build time
 *
 * Supports:
 * - Relative links: ./file.md, ../dir/file.md
 * - Absolute docs links: /docs/file.md (for future content collections)
 * - Section anchors: #section-name
 * - Combined: ./file.md#section
 *
 * Fails build on:
 * - Missing files
 * - Invalid relative paths
 * - Broken internal references
 *
 * @param {Object} options
 * @param {string} options.rootDir - Project root directory
 * @param {string[]} options.basePaths - Base paths to search (['/docs', '/src/content'])
 * @param {string[]} options.excludePaths - Paths to exclude from validation (e.g., ['src/content/docs'])
 * @param {boolean} options.validateAnchors - Whether to validate section anchors
 * @param {boolean} options.strict - Whether to fail build on broken links
 */
export function remarkValidateLinks(options = {}) {
  const {
    rootDir = process.cwd(),
    basePaths = ["/docs"],
    excludePaths = [],
    validateAnchors = false, // TODO: implement anchor validation
    strict = true,
  } = options;

  const errors = [];

  return function transformer(tree, file) {
    const currentFilePath = file.path || file.history?.[0];
    if (!currentFilePath) {
      return;
    }

    // Skip files in excluded paths
    const normalizedCurrentPath = relative(rootDir, currentFilePath).replace(/\\/g, "/");
    for (const excludePath of excludePaths) {
      if (normalizedCurrentPath.startsWith(excludePath)) {
        return;
      }
    }

    const currentDir = dirname(currentFilePath);

    visit(tree, "link", (node) => {
      const url = node.url;

      // Skip external links, email, and hash-only anchors
      if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) {
        return;
      }

      // Extract file path and anchor
      const [filePath, anchor] = url.split("#");
      if (!filePath) {
        return;
      } // Hash-only link

      let targetPath;
      let isValid = false;

      // Handle absolute docs paths (/docs/file.md)
      if (filePath.startsWith("/")) {
        for (const basePath of basePaths) {
          if (filePath.startsWith(basePath)) {
            targetPath = join(rootDir, filePath.slice(1)); // Remove leading /
            if (existsSync(targetPath) && statSync(targetPath).isFile()) {
              isValid = true;
              break;
            }
          }
        }
      }
      // Handle relative paths (./file.md, ../dir/file.md)
      else {
        targetPath = resolve(currentDir, filePath);
        isValid = existsSync(targetPath) && statSync(targetPath).isFile();

        // Try with .md extension if not found
        if (!isValid && !extname(filePath)) {
          const mdPath = `${targetPath}.md`;
          if (existsSync(mdPath) && statSync(mdPath).isFile()) {
            targetPath = mdPath;
            isValid = true;

            // Suggest adding .md extension
            errors.push({
              type: "suggestion",
              message: `Consider adding .md extension to link: ${url} → ${filePath}.md`,
              file: relative(rootDir, currentFilePath),
              line: node.position?.start?.line || "unknown",
            });
          }
        }
      }

      if (!isValid) {
        const error = {
          type: "error",
          message: `Broken internal link: ${url}`,
          file: relative(rootDir, currentFilePath),
          line: node.position?.start?.line || "unknown",
          targetPath: targetPath ? relative(rootDir, targetPath) : filePath,
        };
        errors.push(error);
      }

      // TODO: Validate anchors if validateAnchors is true
      if (anchor && validateAnchors) {
        // This would require parsing the target file and checking for headings
        // Implementation omitted for now
      }
    });

    // Report errors at the end of processing
    if (errors.length > 0 && strict) {
      const errorMessages = errors
        .filter((e) => e.type === "error")
        .map((e) => `${e.file}:${e.line} - ${e.message}`)
        .join("\n");

      if (errorMessages) {
        throw new Error(`Link validation failed:\n${errorMessages}`);
      }
    }

    // Report suggestions (non-fatal)
    const suggestions = errors.filter((e) => e.type === "suggestion");
    if (suggestions.length > 0) {
      console.warn("Link validation suggestions:");
      for (const s of suggestions) {
        console.warn(`  ${s.file}:${s.line} - ${s.message}`);
      }
    }
  };
}

/**
 * Alternative approach for Content Collections migration
 * Converts relative links to absolute content collection references
 *
 * @param {Object} options
 * @param {string} options.rootDir - Project root directory
 * @param {Object} options.collections - Collection mappings
 */
export function remarkContentCollectionLinks(options = {}) {
  const {
    rootDir = process.cwd(),
    collections = {
      "/docs/": "docs",
      "/src/content/docs/": "docs",
    },
  } = options;

  return function transformer(tree, file) {
    const currentFilePath = file.path || file.history?.[0];
    if (!currentFilePath) {
      return;
    }

    visit(tree, "link", (node) => {
      const url = node.url;

      // Skip external links and anchors
      if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) {
        return;
      }

      // Convert relative paths to content collection references
      if (url.startsWith("./") || url.startsWith("../")) {
        const currentDir = dirname(currentFilePath);
        const absolutePath = resolve(currentDir, url);
        const relativePath = relative(rootDir, absolutePath);

        // Convert to collection reference if in known collection directory
        for (const [dirPath, collectionName] of Object.entries(collections)) {
          if (relativePath.startsWith(dirPath.slice(1))) {
            // Remove leading /
            const collectionPath = relativePath.slice(dirPath.length - 1);
            const slug = collectionPath.replace(/\.mdx?$/, "").replace(/\\/g, "/");

            // Update the link to use collection reference
            node.url = `/${collectionName}/${slug}`;
            break;
          }
        }
      }
    });
  };
}

export default remarkValidateLinks;
