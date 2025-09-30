#!/usr/bin/env node

import { readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { glob } from "glob";

// --- CONFIGURATION ---
const buildDir = "dist";
const budgetConfigPath = "budgets.json";
const bytesInKb = 1024;
// --- END CONFIGURATION ---

type FileType = "js" | "css" | "html" | "images" | "fonts" | "other";

interface Budget {
  name: string;
  path: string;
  maxSizeKb: number;
  maxTotalSizeKb?: number;
  ignore?: string[];
}

interface BudgetConfig {
  budgets: Budget[];
}

interface FileResult {
  path: string;
  sizeKb: number;
  type: FileType;
}

function getFileType(filePath: string): FileType {
  if (filePath.endsWith(".js")) {
    return "js";
  }
  if (filePath.endsWith(".css")) {
    return "css";
  }
  if (filePath.endsWith(".html")) {
    return "html";
  }
  if (/\.(png|jpg|jpeg|gif|svg|webp|avif)$/.test(filePath)) {
    return "images";
  }
  if (/\.(woff|woff2|ttf|otf)$/.test(filePath)) {
    return "fonts";
  }
  return "other";
}

function formatSize(sizeKb: number): string {
  return `${sizeKb.toFixed(2)} KB`;
}

function checkBudgets(config: BudgetConfig): boolean {
  let allBudgetsPassed = true;

  for (const budget of config.budgets) {
    console.log(`\n\x1b[1m\x1b[36mChecking budget: ${budget.name}\x1b[0m`);
    const budgetPath = join(buildDir, budget.path);
    const files = glob.sync(`${budgetPath}/**/*`, { nodir: true, ignore: budget.ignore });

    const results: FileResult[] = files.map((file) => ({
      path: file,
      sizeKb: statSync(file).size / bytesInKb,
      type: getFileType(file),
    }));

    let totalSizeKb = 0;
    let budgetViolated = false;

    const violations: string[] = [];

    for (const file of results) {
      totalSizeKb += file.sizeKb;
      if (file.sizeKb > budget.maxSizeKb) {
        violations.push(
          `  \x1b[31m❌\x1b[0m ${relative(buildDir, file.path)} (${formatSize(
            file.sizeKb,
          )}) exceeds individual file limit of ${formatSize(budget.maxSizeKb)}`,
        );
        budgetViolated = true;
      }
    }

    if (budget.maxTotalSizeKb && totalSizeKb > budget.maxTotalSizeKb) {
      violations.push(
        `  \x1b[31m❌\x1b[0m Total size (${formatSize(totalSizeKb)}) exceeds budget of ${formatSize(
          budget.maxTotalSizeKb,
        )}`,
      );
      budgetViolated = true;
    }

    if (budgetViolated) {
      allBudgetsPassed = false;
      console.error(`\x1b[31mBudget "${budget.name}" FAILED:\x1b[0m`);
      violations.forEach((v) => {
        console.error(v);
      });

      const largestFiles = results.sort((a, b) => b.sizeKb - a.sizeKb).slice(0, 5);
      console.log("\n  \x1b[2mTop 5 largest files:\x1b[0m");
      largestFiles.forEach((f) => {
        console.log(`  \x1b[2m- ${relative(buildDir, f.path)}: ${formatSize(f.sizeKb)}\x1b[0m`);
      });
    } else {
      console.log(
        `\x1b[32m✅ Budget "${budget.name}" PASSED\x1b[0m (Total size: ${formatSize(totalSizeKb)})`,
      );
    }
  }

  return allBudgetsPassed;
}

function main() {
  console.log("--- Performance Budget Analysis ---");
  let config: BudgetConfig;
  try {
    config = JSON.parse(readFileSync(budgetConfigPath, "utf-8"));
  } catch (error) {
    console.error(`Error reading or parsing ${budgetConfigPath}:`, error);
    process.exit(1);
  }

  const success = checkBudgets(config);

  console.log("\n-----------------------------------");

  if (success) {
    console.log("\n\x1b[32m✅ All performance budgets passed!\x1b[0m");
    process.exit(0);
  } else {
    console.error("\n\x1b[31m❌ One or more performance budgets failed.\x1b[0m");
    process.exit(1);
  }
}

function _getFileType(filePath: string): FileType {
  if (filePath.endsWith(".js")) {
    return "js";
  }
  if (filePath.endsWith(".css")) {
    return "css";
  }
  if (filePath.endsWith(".html")) {
    return "html";
  }
  if (/\.(png|jpg|jpeg|gif|svg|webp|avif)$/.test(filePath)) {
    return "images";
  }
  if (/\.(woff|woff2|ttf|otf)$/.test(filePath)) {
    return "fonts";
  }
  return "other";
}

function _formatSize(sizeKb: number): string {
  return `${sizeKb.toFixed(2)} KB`;
}

main();
