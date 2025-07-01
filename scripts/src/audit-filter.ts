#!/usr/bin/env node
import { spawnSync } from "node:child_process";

// Define types for the pnpm audit report structure
interface Advisory {
  module_name: string;
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  findings: { version: string }[];
}

interface PnpmAuditReport {
  advisories: Record<string, Advisory>;
}

// Run pnpm audit and capture JSON output
const result = spawnSync("pnpm", ["audit", "--prod", "--json"], {
  encoding: "utf8",
  stdio: ["inherit", "pipe", "inherit"],
});

if (result.error) {
  console.error("Failed to execute pnpm audit:", result.error);
  process.exit(1);
}

const output = result.stdout.trim();
if (!output) {
  console.log("No audit report produced. Assuming no vulnerabilities.");
  process.exit(0);
}

let report: PnpmAuditReport;
try {
  report = JSON.parse(output);
} catch (err) {
  const error = err as Error;
  console.error("Could not parse pnpm audit JSON:", error.message);
  console.error("--- Start of audit output ---");
  console.error(output.slice(0, 1000));
  console.error("--- End of audit output ---");
  process.exit(1);
}

const advisories = Object.values(report.advisories ?? {});
const seriousAdvisories = advisories.filter((advisory) =>
  ["high", "critical"].includes(advisory.severity),
);

if (seriousAdvisories.length > 0) {
  console.error(`\u274c Found ${seriousAdvisories.length} High/Critical vulnerabilities:`);
  for (const advisory of seriousAdvisories) {
    const finding = advisory.findings[0];
    console.error(
      `- ${advisory.module_name}@${finding?.version ?? "unknown"} – ${advisory.severity} – ${advisory.title}`,
    );
  }
  process.exit(1);
}

console.log("✅ No high-severity vulnerabilities found");
process.exit(0);
