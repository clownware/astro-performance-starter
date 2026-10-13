---
title: 'ADR-069: Stop-Gate Hook'
description: >-
  Ships the Stop hook that ADR-064 recorded as sketched and not shipped. When
  an agent tries to finish a turn it runs the unit tests and the enforcement
  suite, blocks the same session at most twice, then lets the turn end and
  warns the maintainer that the gate is still failing. Ported from
  go-performance-starter
lastUpdated: 2026-10-13T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Rule 9 tells an agent to run `pnpm quality:ci` before claiming a change is complete.
[ADR-039](039-halt-on-violation-enforcement.md) records the gap: "that operators actually run
the gate locally before claiming done is process discipline; no edit-time hook automates it".
[ADR-064](064-enforcement-architecture.md) says a Stop-gate was sketched and not shipped, and
that if hooks land later they extend that record by amendment. [ADR-068](068-adr-write-guard-and-append-only.md)
landed the first hook, a PreToolUse guard. This record lands the second.

The sibling repository, go-performance-starter, has run a Stop-gate since 2026-07. Its test on
2026-10-12 (clownware/go-performance-starter#162, 108 runs) is the only evidence there is about
how one behaves, and it is mixed:

- The hook as it then was blocked once and let the second stop through. It blocked 8 runs. All 8
  finished on their next stop with a tree that still failed the gate, and nothing told the
  operator.
- With the governance documents removed, keeping the hooks made a difference of three runs in
  twenty-four. The hooks did not substitute for the documents.
- That harness refused most shell commands, so a blocked agent often could not run the command
  that would have fixed the failure. The result holds under that permission mode only.

The Go starter then changed its hook (its #165 and #169): block the same session up to twice,
tell the agent to open its final message with `GATE FAILING:` if it cannot fix the failure, then
let the turn end and emit a message the harness shows the operator. A live headless session
against an always-failing gate on 2026-10-13 behaved as designed: two blocks, then the warning
surfaced as a notice, and the agent's final message opened with `GATE FAILING:`.

**Limits.** One test, on another repository, of an earlier version of the hook. The redesigned
hook has been exercised once, by hand, and never tested for its effect on what agents ship.
Nothing here has been tested on this repository with agents.

## Decision Drivers

- **A turn should not end silently on failing tests.** Either the agent fixes them or the
  maintainer is told
- **No loop.** A failure the agent cannot fix must not hold the session forever
- **Cheap enough to run on every stop**
- **The gate stays where ADR-039 put it.** A hook an agent can be let through is not a gate

## Considered Options

### Option 1: No Stop hook (status quo)

**Pros**: nothing runs on stop; CI catches a red tree.

**Cons**: CI is the slowest feedback, and an unattended session can report success on a tree
whose unit tests fail.

### Option 2: Block until the gate passes

**Pros**: a turn can never end red.

**Cons**: an agent that cannot fix the failure never stops. In the Go test, refused shell
commands made that the common case.

### Option 3: Block twice, then warn the maintainer (this ADR)

**Pros**: two chances to fix; no loop; a failing finish is visible to the person who has to act
on it.

**Cons**: the hook can be waited out. That is stated, and CI remains the gate.

## Decision

We will go with **Option 3**.

1. **A Stop hook runs `scripts/src/stop-gate.ts`.** It runs `pnpm test:unit`, then
   `pnpm enforce`. A failing test or a block-status finding exits 2, which sends the report back
   to the agent.
2. **At most two blocks per session** (`STOP_GATE_MAX_BLOCKS`, counted per `session_id` in a file
   under the temp folder). The block message says which block it is, shows the tail of the
   report, and tells the agent not to edit a test, a check or its status to get past it, and to
   open its final message with `GATE FAILING:` if it cannot fix the failure.
3. **After the last block the turn may end**, and the hook emits a `systemMessage` telling the
   maintainer the gate is still failing and to run `pnpm quality:ci`.
4. **It informs and delays; it is not the gate.** `pnpm quality:ci` in CI is, as ADR-039 says.
5. **`STOP_GATE_OFF=1`** disables it for one session. It is the maintainer's switch, not the
   agent's.
6. **The script is a governance file**: it joins the `permissions.ask` rules and the
   `governance-diff` paths, and `stop-gate-wired` reports a settings file whose Stop hook is gone.

### Implementation Details

- The hook runs the unit tests and the suite, not the whole of `quality:ci`: about 7 seconds on
  the maintainer's machine against a chain that also formats, lints, type-checks and validates
  generated files.
- The decision logic is pure and unit-tested; the script imports only Node built-ins and starts
  with plain `node`.
- Counter files older than a day are swept on each run, so a session that died between a block
  and its next stop leaves nothing behind for long.
- Warn-status findings do not block. They are in the suite's own report.

## Consequences

### Positive

- An agent that leaves the unit tests or a block-status check failing is sent back twice
- A turn that still ends red tells the maintainer so, in the session, before CI does
- ADR-039's "no edit-time hook automates it" is no longer the whole story

### Negative

- Every stop costs about 7 seconds, in every session in this repository, including the
  maintainer's own and sessions that changed nothing
- A session that is mid-change and stops to ask a question is blocked on tests it has not
  finished. Two blocks later it is let through with the warning
- The hook can be waited out, and an agent with shell access can set the kill-switch for a
  process it starts. It does not replace review or CI

### Neutral

- [ADR-064](064-enforcement-architecture.md) and [ADR-039](039-halt-on-violation-enforcement.md)
  gain amendment notes pointing here
- The registry gains one entry; its schema is unchanged

## Validation

- **Metric 1**: over the first 20 sessions, count how often the gate blocked and how often the
  turn then ended fixed against ended with the warning. If it mostly ends with the warning, the
  hook is noise and this record should be superseded
- **Metric 2**: the maintainer sees the warning in the app they use. The Go starter verified the
  CLI notice; rendering in the desktop app has not been observed
- **Metric 3**: no report of the hook blocking a session whose tree was green

## References

- [ADR-039](039-halt-on-violation-enforcement.md), [ADR-064](064-enforcement-architecture.md),
  [ADR-066](066-constitution-calibration.md), [ADR-068](068-adr-write-guard-and-append-only.md)
- clownware/go-performance-starter#162 (the test), #165 and #169 (the redesign and its live
  check); its ADR-033 is the design this ports
- The ask-on-existing-ADR guard that the Go starter adopted in its #169 is already here, in
  ADR-068; nothing in it changes

## Enforcement

- **Testable consequences:**
  - TC-1: `.claude/settings.json` runs `scripts/src/stop-gate.ts` as a Stop hook.
  - TC-2: the gate blocks a failing session at most the configured number of times, then lets
    the turn end with a warning to the maintainer.
- **Checks:**
  - TC-1 → check `stop-gate-wired` (status: **warn**)
  - TC-2 → `scripts/src/__tests__/stop-gate.test.ts` via `test:unit` (status: **block**)
- **Not machine-checkable:** whether a `GATE FAILING:` message was acted on; whether the
  kill-switch was set by the maintainer; whether the seven seconds are worth it.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-10-13\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted
