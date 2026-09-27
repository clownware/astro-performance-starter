import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const mutationWorkflow = readFileSync(join(repoRoot, ".github/workflows/mutation.yml"), "utf8");

/** The five fields of every `cron:` entry under `on.schedule`. */
function cronFields(workflow: string): string[][] {
  return [...workflow.matchAll(/^\s*-\s*cron:\s*['"]([^'"]+)['"]/gm)].map((match) =>
    match[1].trim().split(/\s+/),
  );
}

/**
 * ADR-042 TC-2: mutation testing runs monthly, plus on demand.
 *
 * The score moves only when `src/utils/**` changes, and every clone of this
 * template inherits the schedule: weekly runs billed ~60 Actions minutes a
 * month per clone to re-measure unchanged trees (#442). The silent-break case
 * that weekly runs were meant to catch — vitest 5 zeroing the score — is
 * guarded on every PR by mutation-runner-compat.test.ts instead.
 */
describe("mutation workflow cadence (ADR-042)", () => {
  it("schedules exactly one run a month", () => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronFields(mutationWorkflow)[0] ?? [];

    expect({ minute, hour, dayOfMonth, month, dayOfWeek }).toEqual({
      minute: expect.stringMatching(/^\d+$/),
      hour: expect.stringMatching(/^\d+$/),
      dayOfMonth: expect.stringMatching(/^\d+$/),
      month: "*",
      dayOfWeek: "*",
    });
  });

  it("declares a single schedule entry", () => {
    expect(cronFields(mutationWorkflow)).toHaveLength(1);
  });

  it("stays runnable on demand", () => {
    expect(mutationWorkflow).toMatch(/^\s+workflow_dispatch:/m);
  });
});
