/**
 * Unit tests for the generated ADR index (ADR-066). Written before the
 * implementation per ADR-037.
 */
import { describe, expect, it } from "vitest";
import { parseAdr, renderIndex, spliceIndex } from "../build-adr-index";

const adr = (title: string, status: string): string =>
  `---\ntitle: '${title}'\ndescription: >-\n  Something.\n---\n\n## Status\n\n${status}\n\n## Context\n`;

describe("parseAdr", () => {
  it("reads the number, title and canonical status word", () => {
    const parsed = parseAdr(
      "052-script-taxonomy.md",
      adr("ADR-052: Script Taxonomy — Cloner-Facing vs Maintainer", "Accepted"),
    );
    expect(parsed).toEqual({
      file: "052-script-taxonomy.md",
      id: "ADR-052",
      title: "Script Taxonomy — Cloner-Facing vs Maintainer",
      status: "Accepted",
    });
  });

  it("keeps only the canonical word when the status carries a qualifier", () => {
    const parsed = parseAdr("029-x.md", adr("ADR-029: SEO", "Accepted (amended 2026-08-02: x)"));
    expect(parsed.status).toBe("Accepted");
  });

  it("reads a double-quoted or unquoted title", () => {
    const content = '---\ntitle: "ADR-003: Unified"\n---\n\n## Status\n\nProposed\n';
    expect(parseAdr("003-x.md", content).title).toBe("Unified");
  });
});

describe("renderIndex", () => {
  const adrs = [
    { file: "001-a.md", id: "ADR-001", title: "Islands", status: "Accepted" },
    { file: "007-reserved.md", id: "ADR-007", title: "Reserved", status: "Withdrawn" },
  ];
  const checks = [
    { id: "no-client-load", adr: "ADR-001", status: "warn" },
    { id: "bundle-budget", adr: "ADR-001", status: "block", external: "CI: JS gate" },
  ];

  it("emits one linked row per record, in file order", () => {
    const out = renderIndex(adrs, checks);
    expect(out).toContain("| [ADR-001](001-a.md) | Islands | Accepted |");
    expect(out.indexOf("ADR-001")).toBeLessThan(out.indexOf("ADR-007"));
  });

  it("names each enforcing check with its status, marking external gates", () => {
    const out = renderIndex(adrs, checks);
    expect(out).toContain("`no-client-load` (warn), `bundle-budget` (block, external gate)");
  });

  it("shows a dash for a record no check enforces", () => {
    expect(renderIndex(adrs, checks)).toContain(
      "| [ADR-007](007-reserved.md) | Reserved | Withdrawn | – |",
    );
  });

  it("states the record count", () => {
    expect(renderIndex(adrs, checks)).toContain("2 records");
  });

  it("escapes a pipe in a title so the table stays intact", () => {
    const out = renderIndex(
      [{ file: "002-b.md", id: "ADR-002", title: "A | B", status: "Accepted" }],
      [],
    );
    expect(out).toContain("A \\| B");
  });
});

describe("spliceIndex", () => {
  const readme = "# Log\n\n<!-- adr-index:start -->\nold\n<!-- adr-index:end -->\n\nTail.\n";

  it("replaces only the text between the markers", () => {
    expect(spliceIndex(readme, "NEW")).toBe(
      "# Log\n\n<!-- adr-index:start -->\nNEW\n<!-- adr-index:end -->\n\nTail.\n",
    );
  });

  it("is stable when run twice", () => {
    const once = spliceIndex(readme, "NEW");
    expect(spliceIndex(once, "NEW")).toBe(once);
  });

  it("throws when a marker is missing rather than guessing a position", () => {
    expect(() => spliceIndex("# Log\n", "NEW")).toThrow(/adr-index/);
  });
});
