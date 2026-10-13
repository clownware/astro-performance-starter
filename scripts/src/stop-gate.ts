/**
 * Stop-gate (ADR-069): the Stop hook, wired in `.claude/settings.json`.
 *
 * When an agent tries to finish a turn it runs the unit tests and the
 * enforcement suite. A failing test or a block-status finding sends the agent
 * back with the report. The gate blocks the same session at most
 * `STOP_GATE_MAX_BLOCKS` times (default 2); after that it lets the turn end,
 * so a failure the agent cannot fix does not loop forever, and tells the
 * maintainer in a message the harness shows them that the gate is still
 * failing. It informs and delays. `pnpm quality:ci` in CI remains the gate.
 *
 * Kill-switch: `STOP_GATE_OFF=1` disables it for one session.
 *
 * Imports nothing but Node built-ins, so the hook starts with plain `node`.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface Failure {
  /** What failed, in one line. */
  label: string;
  /** The tail of the failing command's output. */
  detail: string;
}

export interface StopDecision {
  /** 2 blocks the stop and feeds stderr back to the agent; 0 lets the turn end. */
  exit: 0 | 2;
  stdout: string;
  stderr: string;
  /** The block count to store for this session, or null to clear it. */
  counter: number | null;
}

export interface ScriptResult {
  status: number;
  output: string;
}

const counterName = /^stop-gate-.*\.count$/;
const tailLines = 25;
const dayMs = 24 * 60 * 60 * 1000;

const tail = (text: string): string => text.trimEnd().split("\n").slice(-tailLines).join("\n");

/** Run the two legs in order. Null means the tree is clean. */
export function runGate(run: (script: "test:unit" | "enforce") => ScriptResult): Failure | null {
  const tests = run("test:unit");
  if (tests.status !== 0) {
    return { label: "unit tests failed (`pnpm test:unit`)", detail: tail(tests.output) };
  }
  const suite = run("enforce");
  if (suite.status !== 0) {
    return {
      label: "a block-status enforcement check failed (`pnpm enforce`)",
      detail: tail(suite.output),
    };
  }
  return null;
}

/** What the hook does for one stop, given what failed and how often this session was blocked. */
export function decideStop(
  failure: Failure | null,
  blocks: number,
  maxBlocks: number,
): StopDecision {
  if (!failure) {
    return { exit: 0, stdout: "", stderr: "", counter: null };
  }
  if (blocks < maxBlocks) {
    const n = blocks + 1;
    return {
      exit: 2,
      stdout: "",
      stderr: [
        `Stop-gate BLOCKER (ADR-069): ${failure.label}. Halt and fix before finishing (block ${n} of ${maxBlocks}).`,
        failure.detail,
        "If you cannot fix it, do not edit a test, a check or its status to get past this. Start your final message with the line 'GATE FAILING:' and say what is failing and what you need.",
      ].join("\n"),
      counter: n,
    };
  }
  // Out of blocks: let the stop through, and tell the maintainer.
  return {
    exit: 0,
    stdout: JSON.stringify({
      systemMessage: `Stop-gate: this turn ended with the gate still FAILING after ${maxBlocks} blocks: ${failure.label}. Run pnpm quality:ci before trusting the result.`,
    }),
    stderr: "",
    counter: null,
  };
}

/** The session this stop belongs to, safe to use in a file name. */
export function sessionId(payload: string): string {
  try {
    // biome-ignore lint/style/useNamingConvention: key is Claude Code's hook schema
    const id = (JSON.parse(payload) as { session_id?: unknown }).session_id;
    if (typeof id === "string" && id !== "") {
      return id.replace(/[^A-Za-z0-9_-]/g, "_");
    }
  } catch {
    // fall through
  }
  return "unknown";
}

/** Remove this hook's counters left by sessions that died more than a day ago. */
export function sweepStaleCounters(dir: string, now: number): void {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    if (!counterName.test(name)) {
      continue;
    }
    try {
      if (now - statSync(join(dir, name)).mtimeMs > dayMs) {
        rmSync(join(dir, name), { force: true });
      }
    } catch {
      // another session removed it first
    }
  }
}

function runScript(script: string): ScriptResult {
  const r = spawnSync("pnpm", ["--silent", "run", script], {
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: r.status ?? 1, output: `${r.stdout ?? ""}${r.stderr ?? ""}${r.error ?? ""}` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.env.STOP_GATE_OFF === "1") {
    process.exit(0);
  }
  const dir = tmpdir();
  const state = join(dir, `stop-gate-${sessionId(readFileSync(0, "utf-8"))}.count`);
  sweepStaleCounters(dir, Date.now());

  let blocks = 0;
  try {
    blocks = Number.parseInt(readFileSync(state, "utf-8"), 10) || 0;
  } catch {
    // no counter yet
  }
  const max = Number.parseInt(process.env.STOP_GATE_MAX_BLOCKS ?? "", 10) || 2;
  const decision = decideStop(runGate(runScript), blocks, max);

  if (decision.counter === null) {
    rmSync(state, { force: true });
  } else {
    writeFileSync(state, `${decision.counter}\n`);
  }
  if (decision.stdout) {
    console.log(decision.stdout);
  }
  if (decision.stderr) {
    console.error(decision.stderr);
  }
  process.exit(decision.exit);
}
