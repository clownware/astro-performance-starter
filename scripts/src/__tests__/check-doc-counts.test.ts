import { describe, expect, it } from "vitest";
import { findCountMismatches } from "../check-doc-counts.ts";

/**
 * Guards documented counts (e.g. "57 ADRs in docs/adr/") against the live
 * filesystem so the docs can't silently drift again (.claude/stack.md said 56
 * when the truth was 57, plus the showcase CounterBadge stat). Matches the
 * `version:check` pattern: pure function, unit-tested, wired into quality:ci.
 *
 * Each claim is an integer prefix the doc renders inline, e.g. `57 ADRs in`.
 * The guard reports mismatches; "57+" / "40+" markers are out of scope because
 * the suffix already telegraphs approximation.
 */
describe("findCountMismatches", () => {
  it("returns no mismatches when every documented integer matches the source", () => {
    const claims = [
      { file: "a.md", pattern: /\b(\d+) ADRs\b/g, expected: 57, label: "ADRs" },
      { file: "b.md", pattern: /\b(\d+) routes\b/g, expected: 14, label: "routes" },
    ];
    const sources = {
      "a.md": "We have 57 ADRs in docs/adr/.",
      "b.md": "There are 14 routes total.",
    };
    expect(findCountMismatches(claims, sources)).toEqual([]);
  });

  it("flags a stale documented count against the live source-of-truth", () => {
    const claims = [{ file: "stack.md", pattern: /\b(\d+) ADRs\b/g, expected: 57, label: "ADRs" }];
    const sources = { "stack.md": "We have 56 ADRs in docs/adr/." };
    expect(findCountMismatches(claims, sources)).toEqual([
      "stack.md: claims 56 ADRs but the source has 57",
    ]);
  });

  it("flags every drifted occurrence, not just the first", () => {
    const claims = [{ file: "stack.md", pattern: /\b(\d+) ADRs\b/g, expected: 57, label: "ADRs" }];
    const sources = { "stack.md": "Was 56 ADRs. Earlier I said 55 ADRs." };
    expect(findCountMismatches(claims, sources)).toEqual([
      "stack.md: claims 56 ADRs but the source has 57",
      "stack.md: claims 55 ADRs but the source has 57",
    ]);
  });

  it("only inspects what the caller registers — '+'-suffixed claims are ignored when no '+' pattern is registered", () => {
    // The callsite chooses which claims are 'exact'. Approximate markers like
    // "40+ Components" are simply not registered as patterns, so they pass
    // silently even when the live count diverges.
    const claims = [{ file: "x.md", pattern: /\b(\d+) ADRs\b/g, expected: 57, label: "ADRs" }];
    const sources = { "x.md": "Roughly 40+ Components and 57 ADRs." };
    expect(findCountMismatches(claims, sources)).toEqual([]);
  });

  it("returns nothing when the doc has no matching claim", () => {
    const claims = [{ file: "x.md", pattern: /\b(\d+) ADRs\b/g, expected: 57, label: "ADRs" }];
    expect(findCountMismatches(claims, { "x.md": "no counts here at all" })).toEqual([]);
  });
});
