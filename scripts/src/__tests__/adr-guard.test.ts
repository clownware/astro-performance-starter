/**
 * Unit tests for the write-time ADR guard (ADR-068), the PreToolUse hook for
 * Edit/Write/MultiEdit. Written before the implementation per ADR-037.
 */
import { describe, expect, it } from "vitest";
import { decide, hookOutput } from "../adr-guard";

const root = "/repo";

describe("adr-guard decide", () => {
  const cases: { name: string; path: string; exists: boolean; want: "ask" | "deny" | null }[] = [
    {
      name: "an existing record needs the maintainer",
      path: "/repo/docs/adr/052-script-taxonomy.md",
      exists: true,
      want: "ask",
    },
    {
      name: "a new record may be created",
      path: "/repo/docs/adr/067-new-record.md",
      exists: false,
      want: null,
    },
    {
      name: "the template is not a record",
      path: "/repo/docs/adr/template.md",
      exists: true,
      want: null,
    },
    {
      name: "the generated index is not a record",
      path: "/repo/docs/adr/README.md",
      exists: true,
      want: null,
    },
    {
      name: "the generated spine is never hand-edited",
      path: "/repo/AGENTS.md",
      exists: true,
      want: "deny",
    },
    {
      name: "ordinary source is untouched",
      path: "/repo/src/components/atoms/Badge.astro",
      exists: true,
      want: null,
    },
    {
      name: "a nested file with a record-like name is untouched",
      path: "/repo/docs/adr/drafts/052-x.md",
      exists: true,
      want: null,
    },
    {
      name: "a path outside the repo is not the guard's business",
      path: "/elsewhere/docs/adr/052-x.md",
      exists: true,
      want: null,
    },
    {
      name: "a relative path resolves against the repo",
      path: "docs/adr/001-preact-island-usage-policy.md",
      exists: true,
      want: "ask",
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      expect(decide(root, c.path, () => c.exists)?.decision ?? null).toBe(c.want);
    });
  }

  it("the reason names the ADR and the legal moves", () => {
    const reason = decide(root, "/repo/docs/adr/052-script-taxonomy.md", () => true)?.reason ?? "";
    expect(reason).toContain("ADR-068");
    expect(reason).toMatch(/append/i);
    expect(reason).toMatch(/supersed/i);
  });
});

describe("adr-guard hookOutput", () => {
  it("emits a PreToolUse permission decision for a guarded path", () => {
    const out = hookOutput(
      `{"cwd":"${root}","tool_input":{"file_path":"/repo/AGENTS.md"}}`,
      () => true,
    );
    const parsed = JSON.parse(out);
    expect(parsed.hookSpecificOutput.hookEventName).toBe("PreToolUse");
    expect(parsed.hookSpecificOutput.permissionDecision).toBe("deny");
    expect(parsed.hookSpecificOutput.permissionDecisionReason).toContain("ADR-045");
  });

  it("says nothing for an unguarded path, so the normal permission flow applies", () => {
    expect(
      hookOutput(`{"cwd":"${root}","tool_input":{"file_path":"/repo/src/x.ts"}}`, () => true),
    ).toBe("");
  });

  it("says nothing for a payload it cannot read", () => {
    expect(hookOutput("not json", () => true)).toBe("");
    expect(hookOutput(`{"cwd":"${root}","tool_input":{}}`, () => true)).toBe("");
  });
});
