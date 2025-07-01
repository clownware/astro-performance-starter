import { execSync } from "node:child_process";
// scripts/update-versions.ts
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dump, load } from "js-yaml";

interface Versions {
  [key: string]: string;
}

const VERSIONS_PATH = join(process.cwd(), "src", "content", "docs", "meta", "versions.yml");

// Load current versions
function loadVersions(): Versions {
  try {
    const content = readFileSync(VERSIONS_PATH, "utf8");
    return load(content) as Versions;
  } catch (_error) {
    console.error("Error loading versions.yml:", _error);
    return {};
  }
}

// Save versions
function saveVersions(versions: Versions): void {
  const content = dump(versions, {
    lineWidth: -1, // Don't wrap lines
    quotingType: '"',
    forceQuotes: false,
  });
  writeFileSync(VERSIONS_PATH, content);
}

// Get package version from package.json
function getPackageVersion(packageName: string): string | null {
  try {
    const output = execSync(`pnpm list ${packageName} --json`, { encoding: "utf8" });
    const data = JSON.parse(output);

    // Extract version from pnpm list output
    if (data[0]?.dependencies?.[packageName]) {
      return data[0].dependencies[packageName].version;
    }

    // Try devDependencies
    if (data[0]?.devDependencies?.[packageName]) {
      return data[0].devDependencies[packageName].version;
    }

    return null;
  } catch (_error) {
    console.warn(`Could not get version for ${packageName}`);
    return null;
  }
}

// Update a specific version
function updateVersion(key: string, value: string): void {
  const versions = loadVersions();
  versions[key] = value;
  saveVersions(versions);
  console.log(`✅ Updated ${key} to ${value}`);
}

// Auto-detect and update versions
function autoUpdateVersions(): void {
  const versions = loadVersions();
  const packagesToCheck = [
    { key: "astro", package: "astro" },
    { key: "tailwindcss", package: "tailwindcss" },
    { key: "biome", package: "@biomejs/biome" },
    { key: "typescript", package: "typescript" },
    { key: "preact", package: "preact" },
    { key: "playwright", package: "@playwright/test" },
    { key: "vite", package: "vite" },
  ];

  console.log("🔍 Checking package versions...\n");

  let updated = false;
  for (const { key, package: pkg } of packagesToCheck) {
    const currentVersion = getPackageVersion(pkg);
    if (currentVersion && versions[key] !== currentVersion) {
      console.log(`${key}: ${versions[key]} → ${currentVersion}`);
      versions[key] = currentVersion;
      updated = true;
    }
  }

  // Check Node version
  const nodeVersion = process.version.substring(1); // Remove 'v' prefix
  const nodeMajor = `${nodeVersion.split(".")[0]}.x`;
  if (versions.node !== nodeVersion) {
    console.log(`node: ${versions.node} → ${nodeVersion}`);
    versions.node = nodeVersion;
    versions["node-current"] = nodeMajor;
    updated = true;
  }

  if (updated) {
    saveVersions(versions);
    console.log("\n✅ Versions updated successfully!");
  } else {
    console.log("✅ All versions are up to date!");
  }
}

// CLI interface
const args = process.argv.slice(2);

if (args.length === 0) {
  // Auto-update mode
  autoUpdateVersions();
} else if (args.length === 2) {
  // Manual update mode
  const [key, value] = args;
  updateVersion(key, value);
} else {
  console.log(`
Usage:
  pnpm run update:versions              # Auto-detect and update versions
  pnpm run update:versions <key> <value> # Manually update a version
  
Example:
  pnpm run update:versions astro 5.9.0
  `);
  process.exit(1);
}
