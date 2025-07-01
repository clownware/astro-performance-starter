#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { glob } from "glob";
import matter from "gray-matter";

// --- CONFIGURATION ---
const DOCS_ROOT = "src/content/docs";
const WARNING_DAYS = 90; // Warn if review is due in 90 days
const OVERDUE_DAYS = 180; // Error if review is overdue by 180 days
const IGNORE_PATTERNS = ["**/index.mdx"];
const CRITICAL_FILES = ["src/content/docs/getting-started/introduction.md"];
const CRITICAL_CONTENT_PATTERNS = [/roadmap/i, /security/i];
// --- END CONFIGURATION ---

interface Frontmatter {
  last_reviewed_on?: string;
  [key: string]: any;
}

interface ReviewResult {
  file: string;
  status: "ok" | "warn" | "overdue" | "missing" | "invalid";
  daysRemaining?: number;
  isCritical: boolean;
}

const today = new Date();

function checkFile(filePath: string): ReviewResult {
  const content = readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(content) as { data: Frontmatter; content: string };
  const lastReviewedOn = data.last_reviewed_on;

  const isCritical =
    CRITICAL_FILES.includes(filePath) || CRITICAL_CONTENT_PATTERNS.some((p) => p.test(body));

  if (!lastReviewedOn) {
    return { file: filePath, status: "missing", isCritical };
  }

  let reviewDate: Date;
  try {
    reviewDate = new Date(lastReviewedOn);
    if (Number.isNaN(reviewDate.getTime())) {
      throw new Error("Invalid date format");
    }
  } catch (_e) {
    return { file: filePath, status: "invalid", isCritical };
  }

  const diffTime = reviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < -OVERDUE_DAYS) {
    return { file: filePath, status: "overdue", daysRemaining: diffDays, isCritical };
  }
  if (diffDays < WARNING_DAYS) {
    return { file: filePath, status: "warn", daysRemaining: diffDays, isCritical };
  }

  return { file: filePath, status: "ok", daysRemaining: diffDays, isCritical };
}

async function main() {
  const files = await glob(`${DOCS_ROOT}/**/*.md`, { ignore: IGNORE_PATTERNS });
  const results = files.map(checkFile);

  const overdue = results.filter((r) => r.status === "overdue");
  const warnings = results.filter((r) => r.status === "warn");
  const missing = results.filter((r) => r.status === "missing");
  const invalid = results.filter((r) => r.status === "invalid");

  let hasError = false;

  console.log("--- Documentation Review Status ---");

  if (overdue.length > 0) {
    hasError = true;
    console.error(
      `\n\x1b[31m❌ ${overdue.length} file(s) are seriously overdue for review (>${OVERDUE_DAYS} days):\x1b[0m`,
    );
    overdue.forEach((r) =>
      console.error(
        `  - ${relative(process.cwd(), r.file)} (Overdue by ${Math.abs(r.daysRemaining ?? 0)} days)`,
      ),
    );
  }

  if (warnings.length > 0) {
    console.warn(
      `\n\x1b[33m⚠️ ${warnings.length} file(s) need review soon (<${WARNING_DAYS} days):\x1b[0m`,
    );
    warnings.forEach((r) =>
      console.warn(`  - ${relative(process.cwd(), r.file)} (${r.daysRemaining} days remaining)`),
    );
  }

  if (missing.length > 0) {
    hasError = true;
    console.error(
      `\n\x1b[31m❌ ${missing.length} file(s) are missing the 'last_reviewed_on' frontmatter:\x1b[0m`,
    );
    missing.forEach((r) => console.error(`  - ${relative(process.cwd(), r.file)}`));
  }

  if (invalid.length > 0) {
    hasError = true;
    console.error(
      `\n\x1b[31m❌ ${invalid.length} file(s) have an invalid date format in 'last_reviewed_on':\x1b[0m`,
    );
    invalid.forEach((r) => console.error(`  - ${relative(process.cwd(), r.file)}`));
  }

  const criticalOverdue = overdue.filter((r) => r.isCritical);
  if (criticalOverdue.length > 0) {
    hasError = true;
    console.error(
      `\n\x1b[31;1m❗ CRITICAL: ${criticalOverdue.length} critical document(s) are overdue for review!\x1b[0m`,
    );
    criticalOverdue.forEach((r) => console.error(`  - ${relative(process.cwd(), r.file)}`));
  }

  if (!hasError && warnings.length === 0) {
    console.log("\n\x1b[32m✅ All documentation review dates are current.\x1b[0m");
  } else if (!hasError) {
    console.log("\n\x1b[32m✅ No errors, but some documents need review soon.\x1b[0m");
  }

  console.log("-----------------------------------");

  if (hasError) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
