#!/usr/bin/env node

import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const docsSource = join(projectRoot, 'docs');
const docsTarget = join(projectRoot, 'docs-site', 'src', 'content', 'docs');

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function copyDirectory(source, target, basePath = '') {
  const entries = await readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);
    const relativePath = join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', '.astro'].includes(entry.name)) {
        continue;
      }
      
      console.log(`📁 Creating directory: ${relativePath}`);
      await ensureDir(targetPath);
      await copyDirectory(sourcePath, targetPath, relativePath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      console.log(`📄 Copying file: ${relativePath}`);
      await ensureDir(dirname(targetPath));
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function copyRootDocs() {
  const rootFiles = [
    'README.md',
    'CONTRIBUTING.md',
    'FAQ.md',
    'ROADMAP.md',
    'quick-track-deploy.md',
    'git-workflow.md',
    'github-template-structure.md',
    'how-to-use-design-tokens.md',
    'design-system-changelog.md',
    'DOCUMENTATION-REVIEW-CADENCE.md',
    'LINK-MIGRATION-GUIDE.md'
  ];
  
  for (const file of rootFiles) {
    const sourcePath = join(docsSource, file);
    const targetPath = join(docsTarget, file.toLowerCase().replace(/_/g, '-'));
    
    try {
      await stat(sourcePath);
      console.log(`📄 Copying root file: ${file}`);
      await copyFile(sourcePath, targetPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  Warning: Could not copy ${file}:`, error.message);
      }
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting documentation copy process...');
    
    // Ensure target directory exists
    await ensureDir(docsTarget);
    
    // Copy root documentation files
    await copyRootDocs();
    
    // Copy all subdirectories
    const subdirs = ['adr', 'implementation-guides', 'patterns', 'snippets', 'tracks', 'ai-context', 'meta'];
    
    for (const subdir of subdirs) {
      const sourcePath = join(docsSource, subdir);
      const targetPath = join(docsTarget, subdir);
      
      try {
        await stat(sourcePath);
        console.log(`📁 Copying directory: ${subdir}`);
        await ensureDir(targetPath);
        await copyDirectory(sourcePath, targetPath, subdir);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn(`⚠️  Warning: Could not copy directory ${subdir}:`, error.message);
        }
      }
    }
    
    console.log('✅ Documentation copy completed successfully!');
  } catch (error) {
    console.error('❌ Error copying documentation:', error);
    process.exit(1);
  }
}

main();
