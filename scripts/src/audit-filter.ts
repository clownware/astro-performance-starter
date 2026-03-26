#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Define types for the pnpm audit report structure
interface Advisory {
  // biome-ignore lint/style/useNamingConvention: external JSON key from pnpm audit output
  module_name: string;
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  findings: { version: string }[];
}

interface PnpmAuditReport {
  advisories: Record<string, Advisory>;
}

interface AllowlistEntry {
  module: string;
  reason: string;
  expires?: string;
}

// Load allowlist from budget-overrides.json if it contains an "audit-allowlist" key,
// or from a dedicated .audit-allowlist.json file.
function loadAllowlist(): AllowlistEntry[] {
  const allowlistPath = join(process.cwd(), ".audit-allowlist.json");
  if (existsSync(allowlistPath)) {
    try {
      const raw = readFileSync(allowlistPath, "utf8");
      const entries: AllowlistEntry[] = JSON.parse(raw);
      const now = new Date();
      return entries.filter((entry) => {
        if (entry.expires && new Date(entry.expires) < now) {
          console.warn(
            `\u26a0\ufe0f  Allowlist entry for ${entry.module} expired on ${entry.expires}`,
          );
          return false;
        }
        return true;
      });
    } catch {
      console.warn("\u26a0\ufe0f  Could not parse .audit-allowlist.json, ignoring allowlist.");
    }
  }
  return [];
}

const allowlist = loadAllowlist();
const allowedModules = new Set(allowlist.map((e) => e.module));

// Run pnpm audit and capture JSON output
// Use pnpm.cmd on Windows for proper execution
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(pnpmCommand, ["audit", "--prod", "--json"], {
  encoding: "utf8",
  stdio: ["inherit", "pipe", "inherit"],
  shell: true, // Use shell on Windows to resolve .cmd files
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

const allowedAdvisories = seriousAdvisories.filter((a) => allowedModules.has(a.module_name));
const blockingAdvisories = seriousAdvisories.filter((a) => !allowedModules.has(a.module_name));

if (allowedAdvisories.length > 0) {
  console.warn(
    `\u26a0\ufe0f  ${allowedAdvisories.length} High/Critical vulnerabilities allowed by .audit-allowlist.json:`,
  );
  for (const advisory of allowedAdvisories) {
    const finding = advisory.findings[0];
    const entry = allowlist.find((e) => e.module === advisory.module_name);
    console.warn(
      `  - ${advisory.module_name}@${finding?.version ?? "unknown"} – ${advisory.severity} – ${advisory.title} (reason: ${entry?.reason ?? "unspecified"})`,
    );
  }
}

if (blockingAdvisories.length > 0) {
  console.error(`\u274c Found ${blockingAdvisories.length} High/Critical vulnerabilities:`);
  for (const advisory of blockingAdvisories) {
    const finding = advisory.findings[0];
    console.error(
      `- ${advisory.module_name}@${finding?.version ?? "unknown"} – ${advisory.severity} – ${advisory.title}`,
    );
  }
  console.error("\nTo allowlist a transitive dependency, add it to .audit-allowlist.json");
  process.exit(1);
}

console.log("\u2705 No unallowed high-severity vulnerabilities found");
process.exit(0);
