#!/usr/bin/env tsx
/**
 * Extracts one version's section from CHANGELOG.md (Keep a Changelog format)
 * so `.github/workflows/release.yml` can publish it as the GitHub Release
 * body on `v*` tag push. Mirrors the repo's guard-script pattern: a pure,
 * unit-tested `extractChangelogSection()` plus a thin CLI.
 *
 * Usage: tsx scripts/src/extract-changelog.ts <version>
 *        (accepts "0.9.0" or "v0.9.0"; prints the section body to stdout,
 *         exits 1 when the version has no non-empty section)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Returns the body of the `## [X.Y.Z]` section for `version` (leading `v`
 * accepted), trimmed, ending at the next `## [` heading or EOF. Null when the
 * heading is absent or the section body is empty.
 */
export function extractChangelogSection(changelog: string, version: string): string | null {
  const bare = version.replace(/^v/, "");
  const escaped = bare.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = new RegExp(`^## \\[${escaped}\\][^\\n]*\\n`, "m");
  const start = changelog.match(heading);
  if (!start || start.index === undefined) {
    return null;
  }
  const bodyStart = start.index + start[0].length;
  const rest = changelog.slice(bodyStart);
  const next = rest.search(/^## \[/m);
  const body = (next === -1 ? rest : rest.slice(0, next)).trim();
  return body === "" ? null : body;
}

function main(): void {
  const version = process.argv[2];
  if (!version) {
    console.error("Usage: extract-changelog.ts <version>");
    process.exit(1);
  }
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf-8");
  const section = extractChangelogSection(changelog, version);
  if (section === null) {
    console.error(`❌ CHANGELOG.md has no non-empty section for ${version}.`);
    process.exit(1);
  }
  console.log(section);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
