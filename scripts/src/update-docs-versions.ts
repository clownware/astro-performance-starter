#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { glob } from "glob";
import { dump, load } from "js-yaml";

interface Versions {
  [key: string]: string;
}

const VERSIONS_YAML_PATH = join(process.cwd(), "versions.yml");
const VERSIONS_JSON_PATH = join(process.cwd(), "versions.json");

// === VERSION UPDATING FUNCTIONS ===

function loadVersions(): Versions {
  try {
    const content = readFileSync(VERSIONS_YAML_PATH, "utf8");
    return load(content) as Versions;
  } catch (_error) {
    console.error("Error loading versions.yml:", _error);
    return {};
  }
}

function saveVersions(versions: Versions): void {
  const yamlContent = dump(versions, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false,
  });
  writeFileSync(VERSIONS_YAML_PATH, yamlContent);

  // Save to JSON for docs processing
  const jsonContent = JSON.stringify(versions, null, 2);
  writeFileSync(VERSIONS_JSON_PATH, jsonContent);
}

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
  } catch (_error) {
    console.warn(`Could not get version for ${packageName}`);
    return null;
  }
}

async function updateVersionsFile(): Promise<void> {
  console.log("🔍 Updating versions.json with current package versions...\n");

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
  const nodeVersion = process.version.substring(1);
  const nodeMajor = `${nodeVersion.split(".")[0]}.x`;
  if (versions.node !== nodeVersion) {
    console.log(`node: ${versions.node} → ${nodeVersion}`);
    versions.node = nodeVersion;
    versions.nodeMajor = nodeMajor;
    updated = true;
  }

  if (updated) {
    saveVersions(versions);
    console.log("\n✅ Versions updated successfully!");
  } else {
    console.log("\n✅ All versions are up to date!");
  }
}

// === DOCS PROCESSING FUNCTIONS ===

async function loadVersionsJson(): Promise<Versions> {
  try {
    return JSON.parse(readFileSync(VERSIONS_JSON_PATH, "utf-8"));
  } catch (error) {
    console.error("❌ Could not load versions.json:", error);
    console.error("Run with --update-versions first to create versions.json");
    process.exit(1);
  }
}

function findVersionReferences(content: string): string[] {
  const matches = content.match(/{{\s*versions\.([\w-]+)\s*}}/g) || [];
  return matches
    .map((match) => {
      const key = match.match(/{{\s*versions\.([\w-]+)\s*}}/)?.[1];
      return key || "";
    })
    .filter(Boolean);
}

async function validateVersionReferences(): Promise<boolean> {
  console.log("🔍 Validating version references in documentation...\n");

  const versions = await loadVersionsJson();
  const availableVersions = Object.keys(versions);

  const markdownFiles = await glob("docs/**/*.{md,mdx}", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  for (const filePath of markdownFiles) {
    const fullPath = join(process.cwd(), filePath);
    const content = readFileSync(fullPath, "utf-8");
    const usedVersions = findVersionReferences(content);

    if (usedVersions.length > 0) {
      const missingVersions = usedVersions.filter(
        (version) => !availableVersions.includes(version),
      );

      if (missingVersions.length > 0) {
        console.error("\n❌ Missing versions found:");
        missingVersions.forEach((version) => console.error(`  - ${version}`));
        console.error("Add missing versions to versions.yml or fix references.");
        return false;
      }
    }
  }

  console.log("\n✅ All version references are valid!");
  return true;
}

async function processDocsVersions(): Promise<void> {
  console.log("🔄 Processing version placeholders in documentation...\n");

  const versions = await loadVersionsJson();

  const markdownFiles = await glob("docs/**/*.{md,mdx}", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  let processedFiles = 0;

  for (const filePath of markdownFiles) {
    const fullPath = join(process.cwd(), filePath);
    let content = readFileSync(fullPath, "utf-8");
    let hasChanges = false;

    for (const [key, version] of Object.entries(versions)) {
      const placeholder = `{{versions.${key}}}`;
      if (content.includes(placeholder)) {
        content = content.replaceAll(placeholder, version);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      writeFileSync(fullPath, content, "utf-8");
      processedFiles++;
    }
  }

  console.log(`✅ Processed versions in ${processedFiles} docs files`);
}

// === MAIN FUNCTION ===

async function main() {
  const args = process.argv.slice(2);
  const updateVersions = args.includes("--update-versions");
  const validateOnly = args.includes("--validate");
  const skipValidation = args.includes("--skip-validation");

  if (updateVersions) {
    // Update versions.json first
    await updateVersionsFile();

    if (!args.includes("--no-process")) {
      console.log(`\n${"=".repeat(50)}`);
      await processDocsVersions();
    }
  } else if (validateOnly) {
    // Validate only mode
    const isValid = await validateVersionReferences();
    process.exit(isValid ? 0 : 1);
  } else if (skipValidation) {
    // Process only mode
    await processDocsVersions();
  } else {
    // Default: validate then process
    console.log("🔍 Running validation before processing...\n");
    const isValid = await validateVersionReferences();

    if (!isValid) {
      console.error("\n❌ Validation failed. Fix version references before processing.");
      console.error("Or run with --update-versions to update versions.json first.");
      process.exit(1);
    }

    console.log(`\n${"=".repeat(50)}`);
    await processDocsVersions();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { updateVersionsFile, processDocsVersions, validateVersionReferences };
