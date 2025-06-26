#!/usr/bin/env node

import { copyFile, mkdir, readdir, stat, unlink, rmdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const docsSource = join(projectRoot, "docs");
const docsTarget = join(projectRoot, "docs-site", "src", "content", "docs");

// Track copied files for potential rollback
const copiedFiles = [];
const copiedDirs = [];

// Configuration
const SUPPORTED_EXTENSIONS = [".md", ".yml", ".yaml", ".json"];
const SKIP_DIRECTORIES = ["node_modules", ".git", ".astro", ".next", "dist", "build"];
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class CopyError extends Error {
  constructor(message, operation, path) {
    super(message);
    this.name = "CopyError";
    this.operation = operation;
    this.path = path;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
    copiedDirs.push(dir);
    console.log(`📁 Created directory: ${relative(projectRoot, dir)}`);
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw new CopyError(`Failed to create directory: ${error.message}`, "mkdir", dir);
    }
  }
}

async function validatePaths() {
  try {
    const sourceStats = await stat(docsSource);
    if (!sourceStats.isDirectory()) {
      throw new CopyError("Source docs directory is not a directory", "validate", docsSource);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new CopyError("Source docs directory does not exist", "validate", docsSource);
    }
    throw error;
  }

  // Ensure target parent directory exists
  await ensureDir(dirname(docsTarget));
}

async function copyFileWithRetry(sourcePath, targetPath, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await copyFile(sourcePath, targetPath);
      copiedFiles.push(targetPath);
      
      // Verify the copy was successful
      const sourceStats = await stat(sourcePath);
      const targetStats = await stat(targetPath);
      
      if (sourceStats.size !== targetStats.size) {
        throw new CopyError("File size mismatch after copy", "verify", targetPath);
      }
      
      return;
    } catch (error) {
      if (attempt === retries) {
        throw new CopyError(`Failed to copy file after ${retries} attempts: ${error.message}`, "copy", sourcePath);
      }
      console.warn(`⚠️  Copy attempt ${attempt} failed for ${relative(projectRoot, sourcePath)}, retrying...`);
      await sleep(RETRY_DELAY * attempt);
    }
  }
}

function isSupportedFile(filename) {
  return SUPPORTED_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));
}

async function copyDirectory(source, target, basePath = "") {
  let entries;
  try {
    entries = await readdir(source, { withFileTypes: true });
  } catch (error) {
    throw new CopyError(`Failed to read directory: ${error.message}`, "readdir", source);
  }

  for (const entry of entries) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);
    const relativePath = join(basePath, entry.name);

    try {
      if (entry.isDirectory()) {
        // Skip certain directories
        if (SKIP_DIRECTORIES.includes(entry.name)) {
          console.log(`⏭️  Skipping directory: ${relativePath}`);
          continue;
        }

        await ensureDir(targetPath);
        await copyDirectory(sourcePath, targetPath, relativePath);
      } else if (entry.isFile() && isSupportedFile(entry.name)) {
        console.log(`📄 Copying file: ${relativePath}`);
        await ensureDir(dirname(targetPath));
        await copyFileWithRetry(sourcePath, targetPath);
      } else if (entry.isFile()) {
        console.log(`⏭️  Skipping unsupported file: ${relativePath}`);
      }
    } catch (error) {
      throw new CopyError(`Failed to process ${relativePath}: ${error.message}`, "process", sourcePath);
    }
  }
}

async function copyRootDocs() {
  const rootFiles = [
    "index.md", // Homepage for Starlight – must be copied first
    "README.md",
    "CONTRIBUTING.md",
    "FAQ.md",
    "ROADMAP.md",
    "quick-track-deploy.md",
    "git-workflow.md",
    "github-template-structure.md",
    "how-to-use-design-tokens.md",
    "design-system-changelog.md",
    "DOCUMENTATION-REVIEW-CADENCE.md",
    "LINK-MIGRATION-GUIDE.md",
  ];

  console.log(`📋 Copying ${rootFiles.length} root files...`);

  for (const file of rootFiles) {
    const sourcePath = join(docsSource, file);
    const targetPath = join(docsTarget, file.toLowerCase().replace(/_/g, "-"));

    try {
      await stat(sourcePath);
      console.log(`📄 Copying root file: ${file}`);
      await copyFileWithRetry(sourcePath, targetPath);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`⚠️  Warning: Root file not found: ${file}`);
      } else {
        throw new CopyError(`Failed to copy root file ${file}: ${error.message}`, "copy-root", sourcePath);
      }
    }
  }
}

async function copySubdirectories() {
  const subdirs = [
    "adr",
    "implementation-guides",
    "patterns",
    "snippets",
    "tracks",
    "ai-context",
    "meta",
    "content",
  ];

  console.log(`📂 Copying ${subdirs.length} subdirectories...`);

  for (const subdir of subdirs) {
    const sourcePath = join(docsSource, subdir);
    const targetPath = join(docsTarget, subdir);

    try {
      await stat(sourcePath);
      console.log(`📁 Copying directory: ${subdir}`);
      await ensureDir(targetPath);
      await copyDirectory(sourcePath, targetPath, subdir);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`⚠️  Warning: Subdirectory not found: ${subdir}`);
      } else {
        throw new CopyError(`Failed to copy directory ${subdir}: ${error.message}`, "copy-dir", sourcePath);
      }
    }
  }
}

async function rollback() {
  console.log("🔄 Rolling back changes...");
  const rollbackErrors = [];

  // Remove copied files in reverse order
  for (const file of copiedFiles.reverse()) {
    try {
      await unlink(file);
      console.log(`🗑️  Removed file: ${relative(projectRoot, file)}`);
    } catch (error) {
      rollbackErrors.push(`Failed to remove file ${file}: ${error.message}`);
    }
  }

  // Remove copied directories in reverse order
  for (const dir of copiedDirs.reverse()) {
    try {
      // Only remove if empty
      const entries = await readdir(dir);
      if (entries.length === 0) {
        await rmdir(dir);
        console.log(`🗑️  Removed directory: ${relative(projectRoot, dir)}`);
      }
    } catch (_error) {
      // Ignore errors when removing directories - they might not be empty
    }
  }

  if (rollbackErrors.length > 0) {
    console.warn("⚠️  Some rollback operations failed:");
    for (const error of rollbackErrors) {
      console.warn(`   ${error}`);
    }
  }
}

async function generateSummary() {
  const totalFiles = copiedFiles.length;
  const totalDirs = copiedDirs.length;
  
  console.log("\n📊 Copy Summary:");
  console.log(`   Files copied: ${totalFiles}`);
  console.log(`   Directories created: ${totalDirs}`);
  console.log(`   Target directory: ${relative(projectRoot, docsTarget)}`);
}

async function main() {
  const startTime = Date.now();
  
  try {
    console.log("🚀 Starting bulletproof documentation copy process...");
    console.log(`📁 Source: ${relative(projectRoot, docsSource)}`);
    console.log(`📁 Target: ${relative(projectRoot, docsTarget)}`);
    console.log(`📋 Supported extensions: ${SUPPORTED_EXTENSIONS.join(", ")}`);
    console.log();

    // Validate paths before starting
    await validatePaths();

    // Ensure target directory exists
    await ensureDir(docsTarget);

    // Copy root documentation files
    await copyRootDocs();

    // Copy all subdirectories
    await copySubdirectories();

    // Generate summary
    await generateSummary();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Documentation copy completed successfully in ${duration}s!`);

  } catch (error) {
    console.error("\n❌ Error during documentation copy:");
    
    if (error instanceof CopyError) {
      console.error(`   Operation: ${error.operation}`);
      console.error(`   Path: ${error.path}`);
      console.error(`   Error: ${error.message}`);
    } else {
      console.error(`   ${error.message}`);
    }

    console.log();
    await rollback();
    
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', async (error) => {
  console.error('\n💥 Uncaught Exception:', error.message);
  await rollback();
  process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
  console.error('\n💥 Unhandled Rejection:', reason);
  await rollback();
  process.exit(1);
});

main();
