// scripts/validate-versions.ts
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

interface ValidationResult {
  file: string;
  usedVersions: string[];
  missingVersions: string[];
}

const VERSIONS_PATH = join(process.cwd(), "docs", "meta", "versions.yml");
const DOCS_PATH = join(process.cwd(), "src", "content", "docs");

function loadVersions(): Record<string, string> {
  try {
    const content = readFileSync(VERSIONS_PATH, "utf8");
    return load(content) as Record<string, string>;
  } catch (error) {
    console.error("❌ Could not load versions.yml:", error);
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

function scanDocsFiles(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const versions = loadVersions();

  function scanDirectory(dir: string): void {
    const items = readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(dir, item.name);

      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.name.endsWith(".md") || item.name.endsWith(".mdx")) {
        const content = readFileSync(fullPath, "utf8");
        const usedVersions = findVersionReferences(content);

        if (usedVersions.length > 0) {
          const missingVersions = usedVersions.filter((version) => !versions[version]);

          results.push({
            file: fullPath.replace(process.cwd(), "."),
            usedVersions,
            missingVersions,
          });
        }
      }
    }
  }

  scanDirectory(DOCS_PATH);
  return results;
}

function validateVersions(): void {
  console.log("🔍 Validating version references in documentation...\n");

  const results = scanDocsFiles();
  let hasErrors = false;

  for (const result of results) {
    if (result.missingVersions.length > 0) {
      console.error(`❌ ${result.file}`);
      console.error(`   Missing versions: ${result.missingVersions.join(", ")}`);
      hasErrors = true;
    } else if (result.usedVersions.length > 0) {
      console.log(`✅ ${result.file}`);
      console.log(`   Valid versions: ${result.usedVersions.join(", ")}`);
    }
  }

  if (hasErrors) {
    console.error("\n❌ Version validation failed!");
    console.error("Add missing versions to docs/meta/versions.yml or fix references.");
    process.exit(1);
  } else {
    console.log("\n✅ All version references are valid!");
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  validateVersions();
}
