#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { glob } from "glob";
import matter from "gray-matter";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  fixed: boolean;
}

class FrontmatterValidator {
  private issues: Map<string, ValidationResult> = new Map();

  async validateAndFix(filePath: string): Promise<ValidationResult> {
    const originalContent = await readFile(filePath, "utf-8");
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      fixed: false,
    };

    // --- 1. Attempt to parse the file with gray-matter ---
    let parsed: matter.GrayMatterFile<string>;
    try {
      // gray-matter is robust; if it fails, the YAML is seriously malformed.
      parsed = matter(originalContent);
    } catch (e: any) {
      result.valid = false;
      result.errors.push(
        `Failed to parse frontmatter. The file may be corrupted or have invalid YAML syntax. Error: ${e.message}`,
      );
      this.issues.set(filePath, result);
      return result;
    }

    // --- 2. Check for missing frontmatter or multiple blocks ---
    if (!Object.keys(parsed.data).length) {
      result.valid = false;
      result.errors.push("No frontmatter found. Each doc must have a YAML block at the top.");
      this.issues.set(filePath, result);
      return result;
    }

    // Check if the body *also* starts with what looks like frontmatter.
    // This is the most common "duplicate frontmatter" issue.
    if (parsed.content.trim().startsWith("---")) {
      result.valid = false;
      result.errors.push(
        "Duplicate frontmatter block detected. The content body starts with `---`. Manual fix is required.",
      );
      this.issues.set(filePath, result);
      return result;
    }

    const { data, content: bodyContent } = parsed;

    // --- 3. Validate and fix common, specific issues ---

    // Starlight requires a title.
    if (!data.title) {
      result.valid = false;
      result.errors.push("Missing required field: `title`.");
    }

    // Auto-quote titles with colons, which is invalid YAML syntax if unquoted.
    if (data.title && typeof data.title === "string" && data.title.includes(":")) {
      const isQuoted = data.title.startsWith("'") || data.title.startsWith('"');
      if (!isQuoted) {
        result.warnings.push("Title contains a colon and was auto-quoted to prevent YAML errors.");
        data.title = `"${data.title.replace(/"/g, '\\"')}"`; // Quote and escape existing quotes
        result.fixed = true;
      }
    }

    // Fix descriptions with newlines, which can break YAML parsing.
    if (
      data.description &&
      typeof data.description === "string" &&
      data.description.includes("\n")
    ) {
      result.warnings.push("Description contained newlines and was converted to a single line.");
      data.description = data.description.replace(/\n/g, " ").trim();
      result.fixed = true;
    }

    // Warn for long descriptions.
    if (data.description && data.description.length > 160) {
      result.warnings.push(
        `Description is long (${data.description.length} chars). Recommended < 160 for SEO.`,
      );
    }

    // --- 4. Write fixes to the file if any were made ---
    if (result.fixed) {
      try {
        const fixedContent = matter.stringify(bodyContent, data);
        await writeFile(filePath, fixedContent, "utf-8");
      } catch (e: any) {
        result.errors.push(`Failed to write fixes to file. Error: ${e.message}`);
        result.fixed = false; // Revert status
      }
    }

    this.issues.set(filePath, result);
    return result;
  }

  // The rest of your script (validateDirectory, createReport, main, etc.) can remain the same.
  // Just copy this class method over the old one.
  async validateDirectory(directory: string): Promise<void> {
    const pattern = join(directory, "**/*.{md,mdx}").replace(/\\/g, "/");
    const files = await glob(pattern, {
      ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    });

    console.log(chalk.blue(`\nValidating ${files.length} markdown files...\n`));

    let fixed = 0;
    let errors = 0;
    let warnings = 0;

    for (const file of files) {
      const result = await this.validateAndFix(file);
      const relPath = relative(process.cwd(), file);

      if (result.fixed) {
        // Log fixed files with a distinct style
        console.log(chalk.cyan(`✓ ${relPath}`));
        console.log(chalk.green(`  └─ Fixed frontmatter issues.`));
        fixed++;
        result.warnings.forEach((warn) => console.log(chalk.yellow(`  └─ ${warn}`)));
        warnings += result.warnings.length;
      } else if (!result.valid || result.errors.length > 0) {
        console.log(chalk.red(`✗ ${relPath}`));
        result.errors.forEach((err) => console.log(chalk.red(`  └─ ${err}`)));
        errors += result.errors.length;
      } else if (result.warnings.length > 0) {
        console.log(chalk.yellow(`⚠ ${relPath}`));
        result.warnings.forEach((warn) => console.log(chalk.yellow(`  └─ ${warn}`)));
        warnings += result.warnings.length;
      } else {
        console.log(chalk.green(`✓ ${relPath}`));
      }
    }

    console.log(chalk.blue("\n── Summary ──────────────────────────────"));
    console.log(`Files checked: ${files.length}`);
    console.log(chalk.cyan(`Files fixed: ${fixed}`));
    console.log(chalk.red(`Errors: ${errors}`));
    console.log(chalk.yellow(`Warnings: ${warnings}`));
  }

  async createReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: this.issues.size,
      issues: Array.from(this.issues.entries()).map(([file, result]) => ({
        file: relative(process.cwd(), file),
        ...result,
      })),
    };

    await writeFile("frontmatter-report.json", JSON.stringify(report, null, 2));
    console.log(chalk.blue("\nDetailed report saved to frontmatter-report.json"));
  }

  public hasIssues(): boolean {
    return Array.from(this.issues.values()).some(
      (r) => !r.valid || r.fixed || r.warnings.length > 0,
    );
  }
}

async function main() {
  const validator = new FrontmatterValidator();
  const directory = process.argv[2] || "./src/content/docs"; // Default to Starlight's doc directory

  console.log(chalk.blue.bold("Frontmatter Validator & Fixer"));
  console.log(chalk.gray(`Scanning directory: ${resolve(directory)}\n`));

  try {
    await validator.validateDirectory(directory);
    // Only create a report if there were issues.
    if (validator.hasIssues()) {
      await validator.createReport();
    } else {
      console.log(chalk.green.bold("\nAll files passed validation with no issues!"));
    }
  } catch (error) {
    console.error(chalk.red("A critical error occurred:"), error);
    process.exit(1);
  }
}

function isMainModule(metaUrl: string, argv1: string): boolean {
  const scriptPath = resolve(argv1);
  const modulePath = fileURLToPath(metaUrl);
  return scriptPath === modulePath;
}

if (isMainModule(import.meta.url, process.argv[1])) {
  main();
}
