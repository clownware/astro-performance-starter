#!/usr/bin/env tsx
/**
 * Doc-count drift guard. Asserts inline integer counts in the docs (e.g.
 * `.claude/stack.md` says "57 ADRs in docs/adr/") match the live filesystem
 * source of truth. Mirrors the `version:check` pattern: a pure
 * `findCountMismatches()` is unit-tested; this CLI wires it up against the
 * real filesystem and runs in `quality:ci` alongside `agents:check`,
 * `version:check`, and `og:check`.
 *
 * Approximate markers — e.g. `40+` Components — are intentionally allowed via
 * a separate regex; they telegraph "ballpark" already.
 *
 * Usage: pnpm run docs:count
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface CountClaim {
  /** Repo-relative file path that may contain the documented count. */
  file: string;
  /** Capture-group regex matching `(\d+) <label>` style claims. Use `/g`. */
  pattern: RegExp;
  /** Source-of-truth value to compare against. */
  expected: number;
  /** Human-readable label for the diagnostic. */
  label: string;
}

/**
 * Returns one diagnostic per claim occurrence that doesn't match `expected`.
 * Sources are passed in as `{ filePath: content }` so the function stays pure
 * (the CLI handles the file I/O).
 */
export function findCountMismatches(
  claims: CountClaim[],
  sources: Record<string, string>,
): string[] {
  const messages: string[] = [];
  for (const claim of claims) {
    const content = sources[claim.file];
    if (content === undefined) {
      continue;
    }
    // /g regex carries lastIndex state across runs; reset to avoid skips.
    claim.pattern.lastIndex = 0;
    for (const match of content.matchAll(claim.pattern)) {
      const found = Number.parseInt(match[1], 10);
      if (found !== claim.expected) {
        messages.push(
          `${claim.file}: claims ${found} ${claim.label} but the source has ${claim.expected}`,
        );
      }
    }
  }
  return messages;
}

function countAdrs(root: string): number {
  return readdirSync(join(root, "docs", "adr")).filter((f) => /^\d{3}-.*\.md$/.test(f)).length;
}

function main(): void {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const adrCount = countAdrs(root);

  // Every claim is an integer prefix the doc literally renders. Approximate
  // suffixed claims (e.g. "57+") are out of scope — the "+" already says
  // "ballpark"; only flag claims that pretend to be exact.
  const claims: CountClaim[] = [
    {
      file: ".claude/stack.md",
      pattern: /(\d+) ADRs in `docs\/adr\/`/g,
      expected: adrCount,
      label: "ADRs",
    },
    {
      file: "docs/adr/README.md",
      pattern: /ADRs `000`–`0(\d{2})` are the/g,
      // The range marker is exclusive — the highest ADR number, not a count.
      // Highest ADR = (count - 1) given the reserved 007/016/041 stubs still
      // occupy a number, so the prefix counts as taken.
      expected: adrCount - 1,
      label: "ADR-range-marker",
    },
  ];

  const sources: Record<string, string> = {};
  for (const claim of claims) {
    const absolute = join(root, claim.file);
    if (existsSync(absolute)) {
      sources[claim.file] = readFileSync(absolute, "utf-8");
    }
  }

  const mismatches = findCountMismatches(claims, sources);
  if (mismatches.length) {
    console.error("❌ Documented counts drifted from the source of truth:");
    for (const m of mismatches) {
      console.error(`   - ${m}`);
    }
    console.error("   Update the doc(s) above to match the live counts.");
    process.exit(1);
  }
  console.log(`✅ Documented counts match the source (ADRs=${adrCount}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
