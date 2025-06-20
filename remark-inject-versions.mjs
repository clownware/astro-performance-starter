// remark-inject-versions.mjs
import { readFileSync } from 'fs';
import { join } from 'path';
import { visit } from 'unist-util-visit';
import { load } from 'js-yaml';

let versions = null;

// Load versions once
function loadVersions(rootDir) {
  if (!versions) {
    try {
      const versionsPath = join(rootDir, 'docs', 'meta', 'versions.yml');
      const fileContents = readFileSync(versionsPath, 'utf8');
      versions = load(fileContents);
    } catch (error) {
      console.warn('Warning: Could not load versions.yml:', error.message);
      versions = {};
    }
  }
  return versions;
}

// Remark plugin to replace version placeholders
export function remarkInjectVersions(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  
  return function transformer(tree, file) {
    const versionData = loadVersions(rootDir);
    
    // Visit all text nodes
    visit(tree, 'text', (node) => {
      // Replace {{versions.xxx}} with actual values
      node.value = node.value.replace(/\{\{versions\.([^}]+)\}\}/g, (match, key) => {
        return versionData[key] || match;
      });
    });
    
    // Also handle inline code
    visit(tree, 'inlineCode', (node) => {
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
    
    visit(tree, 'text', (node) => {
      if (node.value) {
        node.value = node.value.replace(/\{\{versions\.([^}]+)\}\}/g, (match, key) => {
          return versionData[key] || match;
        });
      }
    });
  };
}