#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import { join } from "node:path";

interface Versions {
  [key: string]: string;
}

interface SyncOptions {
  force?: boolean;
  verbose?: boolean;
}

// Configure these via environment variables if you have a separate docs repository
const docsRepoUrl = process.env.DOCS_REPO_URL;
const docsRepoRawUrl = process.env.DOCS_REPO_RAW_URL;
if (!docsRepoUrl || !docsRepoRawUrl) {
  console.error("Error: DOCS_REPO_URL and DOCS_REPO_RAW_URL environment variables must be set.");
  console.error("Example: DOCS_REPO_URL=https://github.com/your-org/your-docs-repo");
  process.exit(1);
}
const localDocsPath = join(process.cwd(), "docs");

// === VERSION DETECTION ===

function getPackageVersion(packageName: string): string | null {
  try {
    const output = execSync(`pnpm list ${packageName} --json`, { encoding: "utf8" });
    const data = JSON.parse(output);

    if (data[0]?.dependencies?.[packageName]) {
      return data[0].dependencies[packageName].version;
    }

    if (data[0]?.devDependencies?.[packageName]) {
      return data[0].devDependencies[packageName].version;
    }

    return null;
  } catch {
    return null;
  }
}

function detectCurrentVersions(): Versions {
  const versions: Versions = {};

  // Core packages to track
  const packages = [
    "astro",
    "tailwindcss",
    "typescript",
    "biome",
    "preact",
    "playwright",
    "vite",
    "vitest",
    "lighthouse-ci",
  ];

  for (const pkg of packages) {
    const version = getPackageVersion(pkg);
    if (version) {
      versions[pkg] = version;
    }
  }

  // Add Node.js version
  versions.node = process.version.replace("v", "");
  versions["node-current"] = process.version.replace("v", "");

  return versions;
}

// === DOCS REPO INTERACTION ===

async function fetchDocsRepoInfo(): Promise<{ available: boolean; branches: string[] }> {
  // TODO: Implement when repos are public
  // This will check what branches/versions are available in the docs repo
  console.log("🔍 Checking docs repo availability...");

  return {
    available: false, // Will be true when repo is public
    branches: ["main", "v5.0", "v5.1"], // Example version branches
  };
}

function mapVersionToBranch(versions: Versions): string {
  // TODO: Implement version mapping logic
  // This will map template versions to appropriate docs branch
  const astroVersion = versions.astro || "5.0.0";
  const majorMinor = astroVersion.split(".").slice(0, 2).join(".");

  // Example mapping - will be refined based on actual docs repo structure
  return `v${majorMinor}`;
}

async function downloadDocs(branch: string, options: SyncOptions): Promise<void> {
  // TODO: Implement docs download from GitHub
  console.log(`📥 Downloading docs from branch: ${branch}`);

  if (options.verbose) {
    console.log(`Source: ${docsRepoRawUrl}/${branch}/`);
    console.log(`Target: ${localDocsPath}`);
  }

  // This will download docs files from the specified branch
  // and place them in the local docs directory
}

// === MAIN FUNCTIONS ===

async function syncDocs(options: SyncOptions = {}): Promise<void> {
  console.log("🚀 Astro Starter Docs Sync");
  console.log("==========================\n");

  // Check if repos are public yet
  const repoInfo = await fetchDocsRepoInfo();

  if (!repoInfo.available) {
    console.log("⏳ Docs sync is not available yet.");
    console.log("This feature will be enabled when both repositories are public at launch.\n");
    console.log("📍 Docs repo:", docsRepoUrl);
    console.log("📍 Current status: Private (will be public at launch)\n");
    console.log("🔧 For now, use the existing docs/ directory for AI context.");
    return;
  }

  try {
    // Detect current template versions
    const versions = detectCurrentVersions();

    if (options.verbose) {
      console.log("📊 Detected versions:", versions);
    }

    // Map versions to appropriate docs branch
    const targetBranch = mapVersionToBranch(versions);
    console.log(`🎯 Target docs version: ${targetBranch}`);

    // Download docs from appropriate branch
    await downloadDocs(targetBranch, options);

    console.log("\n✅ Docs sync completed successfully!");
    console.log("🤖 AI agents now have access to current, version-matched documentation.");
  } catch (error) {
    console.error("❌ Docs sync failed:", error);
    process.exit(1);
  }
}

// === CLI INTERFACE ===

async function main() {
  const args = process.argv.slice(2);

  const options: SyncOptions = {
    force: args.includes("--force"),
    verbose: args.includes("--verbose"),
  };

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🚀 Astro Starter Docs Sync

USAGE:
  pnpm run docs:sync                    # Sync docs from remote repo
  pnpm run docs:update                  # Sync docs

OPTIONS:
  --force             Force sync even if docs exist
  --verbose           Show detailed output
  --help, -h          Show this help message

EXAMPLES:
  pnpm run docs:sync                    # Basic sync
  pnpm run docs:sync --verbose          # Sync with detailed output
  pnpm run docs:sync --force            # Force sync everything

NOTE: This feature will be available when repositories are public at launch.
`);
    return;
  }

  await syncDocs(options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { detectCurrentVersions, type SyncOptions, syncDocs };
