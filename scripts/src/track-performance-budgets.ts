#!/usr/bin/env node

import { readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { glob } from "glob";

// --- CONFIGURATION ---
const BUILD_DIR = "dist";
const BUDGET_CONFIG_PATH = "budgets.json";
const BYTES_IN_KB = 1024;
// --- END CONFIGURATION ---

type FileType = "js" | "css" | "html" | "images" | "fonts" | "other";

interface Budget {
  name: string;
  path: string;
  maxSizeKB: number;
  maxTotalSizeKB?: number;
  ignore?: string[];
}

interface BudgetConfig {
  budgets: Budget[];
}

interface FileResult {
  path: string;
  sizeKB: number;
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

function formatSize(sizeKB: number): string {
  return `${sizeKB.toFixed(2)} KB`;
}

function checkBudgets(config: BudgetConfig): boolean {
  let allBudgetsPassed = true;

  for (const budget of config.budgets) {
    console.log(`\n\x1b[1m\x1b[36mChecking budget: ${budget.name}\x1b[0m`);
    const budgetPath = join(BUILD_DIR, budget.path);
    const files = glob.sync(`${budgetPath}/**/*`, { nodir: true, ignore: budget.ignore });

    const results: FileResult[] = files.map((file) => ({
      path: file,
      sizeKB: statSync(file).size / BYTES_IN_KB,
      type: getFileType(file),
    }));

    let totalSizeKB = 0;
    let budgetViolated = false;

    const violations: string[] = [];

    for (const file of results) {
      totalSizeKB += file.sizeKB;
      if (file.sizeKB > budget.maxSizeKB) {
        violations.push(
          `  \x1b[31m❌\x1b[0m ${relative(BUILD_DIR, file.path)} (${formatSize(
            file.sizeKB,
          )}) exceeds individual file limit of ${formatSize(budget.maxSizeKB)}`,
        );
        budgetViolated = true;
      }
    }

    if (budget.maxTotalSizeKB && totalSizeKB > budget.maxTotalSizeKB) {
      violations.push(
        `  \x1b[31m❌\x1b[0m Total size (${formatSize(totalSizeKB)}) exceeds budget of ${formatSize(
          budget.maxTotalSizeKB,
        )}`,
      );
      budgetViolated = true;
    }

    if (budgetViolated) {
      allBudgetsPassed = false;
      console.error(`\x1b[31mBudget "${budget.name}" FAILED:\x1b[0m`);
      violations.forEach((v) => console.error(v));

      const largestFiles = results.sort((a, b) => b.sizeKB - a.sizeKB).slice(0, 5);
      console.log("\n  \x1b[2mTop 5 largest files:\x1b[0m");
      largestFiles.forEach((f) =>
        console.log(`  \x1b[2m- ${relative(BUILD_DIR, f.path)}: ${formatSize(f.sizeKB)}\x1b[0m`),
      );
    } else {
      console.log(
        `\x1b[32m✅ Budget "${budget.name}" PASSED\x1b[0m (Total size: ${formatSize(totalSizeKB)})`,
      );
    }
  }

  return allBudgetsPassed;
}

function main() {
  console.log("--- Performance Budget Analysis ---");
  let config: BudgetConfig;
  try {
    config = JSON.parse(readFileSync(BUDGET_CONFIG_PATH, "utf-8"));
  } catch (error) {
    console.error(`Error reading or parsing ${BUDGET_CONFIG_PATH}:`, error);
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

function _formatSize(sizeKB: number): string {
  return `${sizeKB.toFixed(2)} KB`;
}

main();
