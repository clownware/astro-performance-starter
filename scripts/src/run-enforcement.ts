#!/usr/bin/env tsx
/**
 * ADR enforcement suite runner (ADR-064).
 *
 * Builds a repo snapshot, applies every internal check from
 * `checks/enforcement.config.json`, and reports in the house format:
 * BLOCKER | WARNING | PASS | DELEGATED. Exit is non-zero only when a
 * block-status check fails — warn-status findings are report-only while
 * the check calibrates (graduation rules in ADR-064).
 *
 * Mirrors the gate-script pattern (ADR-057/058): the checks themselves are
 * pure and unit-tested in `enforcement-checks.ts`; this file is the I/O shell.
 *
 * Usage: pnpm run enforce            (human + JSON report)
 *        pnpm run enforce --json     (JSON only, for tooling)
 */
import { type Dirent, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { CHECKS, type EnforcementConfig, type RepoSnapshot, runCheck } from "./enforcement-checks";

const configPath = "checks/enforcement.config.json";
const reportPath = "enforcement-report.json";

const skipDirs = new Set([
  "node_modules",
  ".git",
  "dist",
  ".astro",
  "coverage",
  ".husky",
  "reports",
  "test-results",
  "playwright-report",
]);

const textExts = [
  ".md",
  ".mdx",
  ".astro",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".js",
  ".css",
  ".json",
  ".jsonc",
  ".yml",
  ".yaml",
  ".txt",
  ".toml",
];

const maxTextBytes = 2 * 1024 * 1024;

/** Walk the repo into a path → content snapshot (binary files map to ""). */
export function buildSnapshot(root: string): RepoSnapshot {
  const files: Record<string, string> = {};
  const walk = (dir: string): void => {
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      const rel = relative(root, full);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) walk(full);
        continue;
      }
      const isText = textExts.some((e) => entry.name.endsWith(e)) || entry.name === "_headers";
      if (!isText) {
        files[rel] = "";
        continue;
      }
      try {
        files[rel] = statSync(full).size > maxTextBytes ? "" : readFileSync(full, "utf-8");
      } catch {
        files[rel] = "";
      }
    }
  };
  walk(root);
  return { files };
}

interface ResultRow {
  id: string;
  adr: string;
  tc: string;
  status: "warn" | "block";
  outcome: "PASS" | "WARNING" | "BLOCKER" | "DELEGATED";
  findings: string[];
  remedy?: string;
  external?: string;
}

function main(): void {
  const jsonOnly = process.argv.includes("--json");
  const cfg: EnforcementConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  const snap = buildSnapshot(process.cwd());

  const rows: ResultRow[] = [];
  const registry = new Map(CHECKS.map((c) => [c.id, c]));
  let configError = false;

  for (const entry of cfg.checks) {
    if (entry.external) {
      rows.push({ ...entry, outcome: "DELEGATED", findings: [], external: entry.external });
      continue;
    }
    const def = registry.get(entry.id);
    if (!def) {
      configError = true;
      rows.push({
        ...entry,
        outcome: "BLOCKER",
        findings: [`config references unknown check \`${entry.id}\` — registry/config drift`],
      });
      continue;
    }
    const findings = runCheck(entry.id, snap, cfg);
    rows.push({
      ...entry,
      outcome: findings.length === 0 ? "PASS" : entry.status === "block" ? "BLOCKER" : "WARNING",
      findings,
      remedy: def.remedy,
    });
  }

  for (const def of CHECKS) {
    if (!cfg.checks.some((e) => e.id === def.id)) {
      rows.push({
        id: def.id,
        adr: def.adr,
        tc: def.tc,
        status: "warn",
        outcome: "WARNING",
        findings: ["check implemented but missing from enforcement.config.json"],
        remedy: "Add a config entry so the check has an auditable status.",
      });
    }
  }

  const order = { BLOCKER: 0, WARNING: 1, DELEGATED: 2, PASS: 3 } as const;
  rows.sort((a, b) => order[a.outcome] - order[b.outcome] || a.id.localeCompare(b.id));

  const summary = {
    blockers: rows.filter((r) => r.outcome === "BLOCKER").length,
    warnings: rows.filter((r) => r.outcome === "WARNING").length,
    passes: rows.filter((r) => r.outcome === "PASS").length,
    delegated: rows.filter((r) => r.outcome === "DELEGATED").length,
  };

  writeFileSync(
    reportPath,
    JSON.stringify({ generated: new Date().toISOString(), summary, results: rows }, null, 2),
  );

  if (jsonOnly) {
    console.log(JSON.stringify({ summary, results: rows }));
  } else {
    console.log("ADR Enforcement Suite (ADR-064)\n");
    for (const row of rows) {
      const head = `${row.outcome.padEnd(9)} ${row.id} (${row.adr} ${row.tc})`;
      if (row.outcome === "DELEGATED") {
        console.log(`${head} — enforced by: ${row.external}`);
      } else if (row.findings.length === 0) {
        console.log(head);
      } else {
        console.log(head);
        for (const f of row.findings) console.log(`          ${f}`);
        if (row.remedy) console.log(`          ↳ remedy: ${row.remedy}`);
      }
    }
    console.log(
      `\nSummary: ${summary.passes} pass, ${summary.warnings} warning, ${summary.blockers} blocker, ${summary.delegated} delegated → ${reportPath}`,
    );
    if (summary.warnings > 0) {
      console.log("Warn-status findings do not fail the run (graduation rules: ADR-064).");
    }
  }

  if (summary.blockers > 0 || configError) process.exit(1);
}

main();
