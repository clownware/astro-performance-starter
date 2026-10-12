/**
 * Write-time ADR guard (ADR-068): the PreToolUse hook for Edit, Write and
 * MultiEdit, wired in `.claude/settings.json`.
 *
 * ADR-066 put the governance files behind `permissions.ask` rules but left
 * existing ADRs out, because a path rule cannot tell a new Proposed record
 * from an edit to an Accepted one. A hook can: it looks at whether the file
 * is already there.
 *
 * - An existing record: **ask**. An interactive session puts the edit in front
 *   of the maintainer; a session with nobody to approve is refused.
 * - A new record: nothing to say, so it can be added (ADR-066).
 * - `AGENTS.md`: **deny**. It is generated (ADR-045) and has no legal hand-edit.
 *
 * Imports nothing but Node built-ins, so the hook starts with plain `node`.
 */
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

export interface Verdict {
  decision: "ask" | "deny";
  reason: string;
}

const recordPath = /^docs\/adr\/\d{3}-[^/]+\.md$/;

/** The guard's verdict on one write, or null to leave the normal permission flow alone. */
export function decide(
  root: string,
  filePath: string,
  exists: (abs: string) => boolean,
): Verdict | null {
  const abs = isAbsolute(filePath) ? filePath : resolve(root, filePath);
  const rel = relative(root, abs).split(sep).join("/");
  if (rel === "" || rel.startsWith("..")) {
    return null;
  }

  if (rel === "AGENTS.md") {
    return {
      decision: "deny",
      reason:
        "AGENTS.md is generated (ADR-045). Legal move: edit CLAUDE.md or a .claude/ layer file, then run `pnpm agents:build`.",
    };
  }
  if (recordPath.test(rel) && exists(abs)) {
    return {
      decision: "ask",
      reason: `${rel} is an existing ADR, and the log is append-only (ADR-068). Legal moves: append a dated note or a graduation-log entry, change the Status line, or supersede it with a new Proposed ADR. Never rewrite its text to make a request comply. This edit needs the maintainer's approval.`,
    };
  }
  return null;
}

/** The hook's stdout for one PreToolUse payload: a permission decision, or nothing. */
export function hookOutput(payload: string, exists: (abs: string) => boolean): string {
  // biome-ignore lint/style/useNamingConvention: keys are Claude Code's hook schema
  let input: { cwd?: string; tool_input?: { file_path?: string } };
  try {
    input = JSON.parse(payload);
  } catch {
    return "";
  }
  const filePath = input.tool_input?.file_path;
  if (!filePath) {
    return "";
  }
  const verdict = decide(input.cwd || process.cwd(), filePath, exists);
  if (!verdict) {
    return "";
  }
  return JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: verdict.decision,
      permissionDecisionReason: verdict.reason,
    },
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = hookOutput(readFileSync(0, "utf-8"), existsSync);
  if (out) {
    console.log(out);
  }
}
