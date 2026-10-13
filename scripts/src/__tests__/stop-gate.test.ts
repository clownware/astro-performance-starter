/**
 * Unit tests for the Stop-gate (ADR-069), the Stop hook that runs the unit
 * tests and the enforcement suite when an agent tries to finish a turn.
 * Written before the implementation per ADR-037.
 */
import { mkdtempSync, readdirSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { decideStop, runGate, sessionId, sweepStaleCounters } from "../stop-gate";

const failing = { label: "unit tests failed (`pnpm test:unit`)", detail: "FAIL src/x.test.ts" };

describe("decideStop", () => {
  const cases: {
    name: string;
    failure: typeof failing | null;
    blocks: number;
    max: number;
    exit: number;
    counter: number | null;
    warns: boolean;
  }[] = [
    {
      name: "a clean tree finishes and clears the counter",
      failure: null,
      blocks: 1,
      max: 2,
      exit: 0,
      counter: null,
      warns: false,
    },
    {
      name: "a failure blocks the first stop",
      failure: failing,
      blocks: 0,
      max: 2,
      exit: 2,
      counter: 1,
      warns: false,
    },
    {
      name: "still failing blocks a second time",
      failure: failing,
      blocks: 1,
      max: 2,
      exit: 2,
      counter: 2,
      warns: false,
    },
    {
      name: "the third failing stop is let through with a warning",
      failure: failing,
      blocks: 2,
      max: 2,
      exit: 0,
      counter: null,
      warns: true,
    },
    {
      name: "the block limit is configurable",
      failure: failing,
      blocks: 1,
      max: 1,
      exit: 0,
      counter: null,
      warns: true,
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const d = decideStop(c.failure, c.blocks, c.max);
      expect(d.exit).toBe(c.exit);
      expect(d.counter).toBe(c.counter);
      expect(d.stdout.includes('"systemMessage"')).toBe(c.warns);
    });
  }

  it("a block says what failed, which block it is, and how to finish honestly", () => {
    const d = decideStop(failing, 0, 2);
    expect(d.stderr).toContain("Stop-gate BLOCKER");
    expect(d.stderr).toContain("ADR-069");
    expect(d.stderr).toContain("block 1 of 2");
    expect(d.stderr).toContain("FAIL src/x.test.ts");
    expect(d.stderr).toContain("GATE FAILING:");
  });

  it("the operator warning is valid JSON that names the failure", () => {
    const d = decideStop({ label: 'a "quoted" failure', detail: "" }, 2, 2);
    const parsed = JSON.parse(d.stdout);
    expect(parsed.systemMessage).toContain("Stop-gate");
    expect(parsed.systemMessage).toContain('a "quoted" failure');
    expect(parsed.systemMessage).toContain("pnpm quality:ci");
  });
});

describe("runGate", () => {
  const ok = { status: 0, output: "" };
  it("passes when the tests and the suite pass", () => {
    expect(runGate(() => ok)).toBeNull();
  });

  it("reports failing unit tests and does not go on to the suite", () => {
    const ran: string[] = [];
    const failure = runGate((script) => {
      ran.push(script);
      return script === "test:unit" ? { status: 1, output: "line 1\nFAIL x" } : ok;
    });
    expect(failure?.label).toContain("test:unit");
    expect(failure?.detail).toContain("FAIL x");
    expect(ran).toEqual(["test:unit"]);
  });

  it("reports a block-status enforcement finding", () => {
    const failure = runGate((script) =>
      script === "enforce" ? { status: 1, output: "BLOCKER   no-client-load (ADR-001 TC-1)" } : ok,
    );
    expect(failure?.label).toContain("enforce");
    expect(failure?.detail).toContain("no-client-load");
  });

  it("keeps only the tail of a long report", () => {
    const long = Array.from({ length: 200 }, (_, i) => `line ${i}`).join("\n");
    const failure = runGate(() => ({ status: 1, output: long }));
    expect(failure?.detail.split("\n").length).toBeLessThanOrEqual(30);
    expect(failure?.detail).toContain("line 199");
  });
});

describe("sessionId", () => {
  it("reads the session from the hook payload", () => {
    expect(sessionId('{"session_id":"abc-123","hook_event_name":"Stop"}')).toBe("abc-123");
  });
  it("falls back for a payload it cannot read", () => {
    expect(sessionId("not json")).toBe("unknown");
    expect(sessionId("{}")).toBe("unknown");
  });
  it("never yields a path separator", () => {
    expect(sessionId('{"session_id":"../../etc/passwd"}')).not.toMatch(/[/\\]/);
  });
});

describe("sweepStaleCounters", () => {
  it("removes this hook's counters older than a day and nothing else", () => {
    const dir = mkdtempSync(join(tmpdir(), "stop-gate-test-"));
    const old = new Date(Date.now() - 72 * 3600 * 1000);
    for (const [name, stale] of [
      ["stop-gate-dead.count", true],
      ["stop-gate-live.count", false],
      ["unrelated.count", true],
    ] as const) {
      writeFileSync(join(dir, name), "1\n");
      if (stale) {
        utimesSync(join(dir, name), old, old);
      }
    }
    sweepStaleCounters(dir, Date.now());
    expect(readdirSync(dir).sort()).toEqual(["stop-gate-live.count", "unrelated.count"]);
  });
});
