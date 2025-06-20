// remark-snippet-includes.mjs
import { visit } from 'unist-util-visit';
import { resolve, join } from 'path';
import { readFileSync, existsSync } from 'fs';

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
  const {
    rootDir = process.cwd(),
    snippetsDir = 'docs/snippets'
  } = options;
  
  const snippetsPath = resolve(rootDir, snippetsDir);
  
  return function transformer(tree, file) {
    const errors = [];
    
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value) return;
      
      // Look for snippet shortcode pattern: {% snippet "name" %}
      const snippetRegex = /{%\s*snippet\s+"([^"]+)"\s*%}/g;
      let match;
      let hasReplacements = false;
      let newValue = node.value;
      
      while ((match = snippetRegex.exec(node.value)) !== null) {
        const [fullMatch, snippetName] = match;
        const snippetFile = join(snippetsPath, `${snippetName}.md`);
        
        if (!existsSync(snippetFile)) {
          const error = `Snippet not found: ${snippetName} (looked for ${snippetFile})`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
          continue;
        }
        
        try {
          const snippetContent = readFileSync(snippetFile, 'utf-8').trim();
          newValue = newValue.replace(fullMatch, snippetContent);
          hasReplacements = true;
        } catch (err) {
          const error = `Failed to read snippet: ${snippetName} - ${err.message}`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
        }
      }
      
      // Update the node value if we made replacements
      if (hasReplacements) {
        node.value = newValue;
      }
    });
    
    // Also check code blocks and other text nodes
    visit(tree, ['code', 'inlineCode', 'html'], (node) => {
      if (!node.value) return;
      
      const snippetRegex = /{%\s*snippet\s+"([^"]+)"\s*%}/g;
      let match;
      let hasReplacements = false;
      let newValue = node.value;
      
      while ((match = snippetRegex.exec(node.value)) !== null) {
        const [fullMatch, snippetName] = match;
        const snippetFile = join(snippetsPath, `${snippetName}.md`);
        
        if (!existsSync(snippetFile)) {
          const error = `Snippet not found: ${snippetName} (looked for ${snippetFile})`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
          continue;
        }
        
        try {
          const snippetContent = readFileSync(snippetFile, 'utf-8').trim();
          newValue = newValue.replace(fullMatch, snippetContent);
          hasReplacements = true;
        } catch (err) {
          const error = `Failed to read snippet: ${snippetName} - ${err.message}`;
          errors.push(error);
          console.error(`❌ ${error} in ${file.path}`);
        }
      }
      
      if (hasReplacements) {
        node.value = newValue;
      }
    });
    
    // Fail build if there were errors and strict mode is enabled
    if (errors.length > 0 && options.strict !== false) {
      throw new Error(`Snippet include errors found:\n${errors.join('\n')}`);
    }
  };
}
