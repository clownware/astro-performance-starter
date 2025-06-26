#!/usr/bin/env node
import { spawnSync } from "node:child_process";

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

let report;
try {
  report = JSON.parse(output);
} catch (err) {
  console.error("Could not parse pnpm audit JSON:", err);
  console.error(output.slice(0, 500));
  process.exit(1);
}

const advisories = Object.values(report.advisories ?? {});
const serious = advisories.filter((a) => ["high", "critical"].includes(a.severity));

if (serious.length) {
  console.error(`\u274c Found ${serious.length} High/Critical vulnerabilities:`);
  for (const adv of serious) {
    console.error(
      `- ${adv.module_name}@${adv.findings?.[0]?.version} – ${adv.severity} – ${adv.title}`,
    );
  }
  process.exit(1);
}

console.log("✅ No high-severity vulnerabilities found");
process.exit(0);
