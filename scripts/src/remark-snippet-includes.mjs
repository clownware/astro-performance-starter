import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
// remark-snippet-includes.mjs
import { visit } from "unist-util-visit";

/** Validates snippet names to prevent path traversal (e.g. ../../etc/passwd) */
const safeSnippetName = /^[a-zA-Z0-9_-]+$/;

/**
 * Remark plugin to include code snippets using shortcode syntax
 *
 * Usage: {% snippet "snippet-name" %}
 *
 * Looks for snippets in /docs/snippets/{snippet-name}.md
 * Includes the raw content (typically markdown code blocks)
 *
 * @param {Object} options
 * @param {string} options.rootDir - Project root directory
 * @param {string} options.snippetsDir - Snippets directory (relative to rootDir)
 */
export function remarkSnippetIncludes(options = {}) {
  const { rootDir = process.cwd(), snippetsDir = "docs/snippets" } = options;

  const snippetsPath = resolve(rootDir, snippetsDir);

  return function transformer(tree, file) {
    const errors = [];

    visit(tree, "text", (node, _index, _parent) => {
      if (!node.value) {
        return;
      }

      const snippetRegex = /{%\s*snippet\s+"([^"]+)"\s*%}/g;
      let hasReplacements = false;
      let newValue = node.value;

      let match = snippetRegex.exec(node.value);
      while (match !== null) {
        const [fullMatch, snippetName] = match;

        if (!safeSnippetName.test(snippetName)) {
          const error = `Invalid snippet name: "${snippetName}" — only alphanumeric, hyphens, and underscores are allowed`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
          match = snippetRegex.exec(node.value);
          continue;
        }

        const snippetFile = join(snippetsPath, `${snippetName}.md`);

        if (!existsSync(snippetFile)) {
          const error = `Snippet not found: ${snippetName} (looked for ${snippetFile})`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
          match = snippetRegex.exec(node.value); // Update match before continuing
          continue;
        }

        try {
          const snippetContent = readFileSync(snippetFile, "utf-8").trim();
          newValue = newValue.replace(fullMatch, snippetContent);
          hasReplacements = true;
        } catch (err) {
          const error = `Failed to read snippet: ${snippetName} - ${err.message}`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
        }
        match = snippetRegex.exec(node.value); // Update match at the end of the loop body
      }

      if (hasReplacements) {
        node.value = newValue;
      }
    });

    // Deliberately no visit of code/inlineCode/html nodes: code contexts are
    // where the shortcode syntax is documented (e.g. ADR-062's literal
    // `{% snippet "name" %}` example) and must never be expanded.

    if (errors.length > 0 && options.strict !== false) {
      throw new Error(`Snippet include errors found:\n${errors.join("\n")}`);
    }
  };
}
