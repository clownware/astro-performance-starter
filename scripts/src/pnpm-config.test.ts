import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const packageJson: { packageManager?: string; pnpm?: unknown } = JSON.parse(
  readFileSync(join(repoRoot, "package.json"), "utf8"),
);

const workspacePath = join(repoRoot, "pnpm-workspace.yaml");
const workspace = existsSync(workspacePath) ? readFileSync(workspacePath, "utf8") : "";

/**
 * Reads one top-level mapping out of pnpm-workspace.yaml. The file is
 * deliberately flat — scalar settings plus the `overrides` map — so a line
 * reader is enough and avoids importing a YAML parser that is only a
 * transitive dependency here.
 */
function readMap(yaml: string, key: string): Record<string, string> {
  const entries: Record<string, string> = {};
  let inside = false;

  for (const line of yaml.split("\n")) {
    if (/^\S/.test(line)) {
      inside = line.startsWith(`${key}:`);
      continue;
    }
    if (!inside) continue;
    const match = /^\s+(['"]?)(.+?)\1:\s*(['"]?)(.+?)\3\s*(?:#.*)?$/.exec(line);
    if (match) entries[match[2]] = match[4];
  }

  return entries;
}

function readScalar(yaml: string, key: string): string | undefined {
  return new RegExp(`^${key}:\\s*(.+?)\\s*(?:#.*)?$`, "m").exec(yaml)?.[1];
}

/**
 * pnpm 11 stopped reading settings from the `pnpm` field of package.json
 * (pnpm/pnpm#10086). It does not warn: overrides left there are silently
 * dropped, and every advisory they pin past comes back. This repo kept all of
 * its overrides in that field until the pnpm 11 migration (#409).
 */
describe("pnpm settings live where pnpm 11 reads them", () => {
  it("keeps no `pnpm` field in package.json", () => {
    expect(
      packageJson.pnpm,
      "pnpm >= 11 ignores package.json#pnpm without warning — move these settings to pnpm-workspace.yaml",
    ).toBeUndefined();
  });

  it("declares the overrides in pnpm-workspace.yaml", () => {
    const overrides = readMap(workspace, "overrides");

    // The two live advisory guards from #423. If either goes missing the
    // corresponding Dependabot alert reopens.
    expect(overrides).toMatchObject({
      "devalue@<5.9.2": "^5.9.2",
      "smol-toml@<1.7.1": "^1.7.1",
    });
  });
});

/**
 * ADR-065: stay on pnpm 11 (the TypeScript CLI) rather than 12 (the Rust
 * port, GA 2026-08-26), and keep pnpm 11's supply-chain default of a one-day
 * minimumReleaseAge instead of opting out.
 */
describe("pnpm version and supply-chain policy (ADR-065)", () => {
  it("pins pnpm 11 via packageManager", () => {
    expect(packageJson.packageManager).toMatch(/^pnpm@11\.\d+\.\d+/);
  });

  it("does not disable the minimumReleaseAge gate", () => {
    const age = readScalar(workspace, "minimumReleaseAge");

    expect(
      age === undefined || Number(age) >= 1440,
      `minimumReleaseAge is ${age}; ADR-065 keeps pnpm's one-day default. Exempt a specific urgent fix with minimumReleaseAgeExclude (pnpm audit --fix adds it) rather than lowering the gate for everything.`,
    ).toBe(true);
  });

  it("gives Dependabot's npm updates a cooldown at least as long as the gate", () => {
    // pnpm 11 re-verifies every lockfile entry against minimumReleaseAge, so a
    // Dependabot version update that picked a version younger than a day would
    // fail CI's frozen install. Dependabot applies its cooldown to transitive
    // resolutions too, and never to security updates (dependabot-core
    // `update_cooldown: job.security_updates_only? ? nil : job.cooldown`).
    const dependabot = readFileSync(join(repoRoot, ".github/dependabot.yml"), "utf8");
    const npmBlock =
      dependabot.split(/\n\s*- package-ecosystem:/).find((block) => /"npm"/.test(block)) ?? "";
    const days = /cooldown:\s*\n\s+default-days:\s*(\d+)/.exec(npmBlock)?.[1];

    expect(Number(days ?? 0)).toBeGreaterThanOrEqual(1);
  });
});
