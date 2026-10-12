---
title: 'ADR-068: Write-Time Guard and Append-Only Check for Accepted ADRs'
description: >-
  Closes the gap ADR-066 named: existing ADRs had no machine guard because a
  permission path rule cannot tell a new Proposed record from an edit to an
  Accepted one. A PreToolUse hook asks the maintainer before any edit to an
  existing record, and a warn-status check reports accepted text that was
  removed or rewritten. Ported from go-performance-starter
lastUpdated: 2026-10-12T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

[ADR-066](066-constitution-calibration.md) put the governance files behind `permissions.ask`
rules after one run of the 240-run test read [ADR-052](052-script-taxonomy.md), renamed the
script it forecloses, and then edited 21 ADR files, a rule and a check so that everything
agreed. It left existing ADRs out, and said why: "a path rule cannot tell a new Proposed record
from an edit to an Accepted one. They are guarded by rule 1 and by review." The files that run
went through first are therefore the ones with no guard.

The sibling repository, go-performance-starter, has guarded its records since 2026-07 with a
PreToolUse hook that looks at whether the file already exists, and since 2026-10-12 with a check
that reads the diff. On 2026-10-12 that repository was tested with and without its documents
(clownware/go-performance-starter#162, 108 runs, three arms, two models). Two results bear on
this decision:

- With the documents, no run edited a record, a rule or a check to fit its change. Without them,
  every run that renamed the gate task also rewrote the check guarding it (11 of 11), five of
  them with that check at `block` and the hooks on. The documents carry the decision; the
  machinery does not replace them.
- The hook did what it was built for: it refused eleven hand-edits of generated files and no
  legitimate one. A hook only sees the edit tools. That harness refused shell writes by
  permission mode, so the shell route was closed by the harness and not by the repository.

This repository's own history bears on it too. Replaying the check below over every commit
since 2026-07-12 that modified an Accepted record: 23 commits, 11 with findings. Records here
have been amended in place, for example a cron line in [ADR-042](042-mutation-testing-with-stryker.md)
changed from nightly to weekly to monthly with no trace of the earlier values. Append-only is
therefore a change of practice in this repository, not a description of it.

**Limits.** The Go test is one repository, three runs per cell, tasks written by a Claude model
that knew the rules, and it never tested the guard as its own condition. Nothing here has been
tested on this repository.

## Decision Drivers

- **Guard the files the one observed rewrite went through**, which ADR-066 could not
- **Keep the maintainer able to amend a record** in an ordinary session, as ADR-066 does for the
  other governance files
- **Catch what a hook cannot see**: a shell write, a script, a human's editor
- **Do not launch a gate that the repository's own history fails**

## Considered Options

### Option 1: Leave existing ADRs to rule 1 and review (status quo)

**Pros**: nothing to maintain; ADR-066's `governance-diff` workflow already lists changed
records on a pull request.

**Cons**: the list says a record changed, not whether text was added or replaced. The one
rewrite the test observed went through exactly these files.

### Option 2: Deny every edit to an existing ADR, with a kill-switch

The Go starter's design: the hook denies, and `ADR_GUARD_OFF=1` lets the operator through.

**Pros**: strongest at write time.

**Cons**: an environment variable is a second mechanism beside the `ask` rules ADR-066 chose,
and the maintainer has to restart a session to amend a record.

### Option 3: Ask at write time, report at diff time (this ADR)

The hook returns `ask` for an existing record, which is the outcome ADR-066 chose for the other
governance files. A check reads the diff and reports accepted text that was removed or
rewritten, at `warn`.

## Decision

We will go with **Option 3**.

1. **Accepted records are append-only.** An amendment appends a dated note, changes the Status
   line, records a check's move between `warn` and `block`, or fills the graduation log. A
   decision that no longer holds is superseded by a new record. Text is not rewritten in place.
   Formatting that keeps the words (re-wrapping, a code fence's language tag, emphasis) is not a
   rewrite. Proposed records are drafts and may change freely.
2. **A PreToolUse hook guards existing records at write time.** `scripts/src/adr-guard.ts` runs
   on Edit, Write and MultiEdit. For a `docs/adr/NNN-*.md` file that already exists it returns
   `ask`, with the legal moves in the reason: an interactive session puts the edit in front of
   the maintainer, and a session with nobody to approve is refused. A new record gets no
   verdict, so a Proposed ADR can still be added (ADR-066). `AGENTS.md` is denied outright: it
   is generated ([ADR-045](045-cross-tool-agents-spine.md)) and has no legal hand-edit.
3. **A check reports rewritten text.** `adr-append-only` compares every record that was Accepted
   on the default branch with the working tree and lists each removed or rewritten line. It
   runs in the enforcement suite locally, and in the `governance-diff` workflow on a pull
   request, where it annotates the line. It starts at `warn`.
4. **The guard and the check are governance files.** `scripts/src/adr-guard.ts` and
   `scripts/src/adr-append-only.ts` join the `permissions.ask` rules and the `governance-diff`
   paths. `adr-guard-wired` reports a settings file whose hook is gone or no longer covers all
   three edit tools.

### Implementation Details

- Both scripts import only Node built-ins. The hook starts with plain `node` (Node 24 runs
  TypeScript directly), and the workflow runs the check without installing dependencies.
- The check's pure half takes a `git diff -U0` and is unit-tested; the runner adds the diff to
  the snapshot as `adrDiff`. With no base to compare against (a shallow clone, a fresh fork) the
  check has no findings instead of a false one.
- The CI quality job checks out shallow, so the check is skipped there by design. The
  `governance-diff` workflow already fetches full history and only runs when a governance file
  changes, so the pull-request signal costs seconds on those pull requests and nothing on the
  rest.
- The hook's `ask` and the path rules in `permissions.ask` are independent. A record edit asks
  once, through the hook.

## Consequences

### Positive

- The files the observed rewrite went through now ask before they change
- A rewritten sentence in an Accepted record is named, with its line, on the pull request
- The maintainer amends a record in an ordinary session by answering one prompt

### Negative

- Every Edit, Write and MultiEdit starts a Node process, about 70 ms on the maintainer's machine
- The check will report on amendments of the kind this repository has made until now. That is
  the change of practice, and it is why the check does not start at `block`
- A hook cannot see a shell write. The check can, but only reports

### Neutral

- [ADR-066](066-constitution-calibration.md) gains an amendment note pointing here
- The registry gains two entries; its schema is unchanged

## Validation

- **Metric 1**: `adr-append-only` reports nothing on ten consecutive pull requests that amend an
  Accepted record. Only then is graduation to `block` considered, under
  [ADR-064](064-enforcement-architecture.md)
- **Metric 2**: no legitimate edit is refused by the hook in an interactive session; an
  unattended session that tries to edit an existing record is refused
- **Metric 3**: a rerun of the script-rename task with the hook on, against ADR-066's wording
  alone. Until that is run, the hook's effect on this repository is untested

## References

- [ADR-066](066-constitution-calibration.md) — the gap this closes
- [ADR-064](064-enforcement-architecture.md), [ADR-045](045-cross-tool-agents-spine.md),
  [ADR-035](035-template-scope-boundary.md), [ADR-052](052-script-taxonomy.md)
- clownware/go-performance-starter#162 — the Go starter's test; its ADR-033 is the design this
  ports
- chrispezza/portfolio#106 — the 240-run test of this repository

## Enforcement

- **Testable consequences:**
  - TC-1: a record that is Accepted on the default branch loses no text.
  - TC-2: `.claude/settings.json` runs `scripts/src/adr-guard.ts` before Edit, Write and
    MultiEdit.
  - TC-3: the guard asks for an existing record, says nothing for a new one, and denies
    `AGENTS.md`.
- **Checks:**
  - TC-1 → check `adr-append-only` (status: **warn**)
  - TC-2 → check `adr-guard-wired` (status: **warn**)
  - TC-3 → `scripts/src/__tests__/adr-guard.test.ts` via `test:unit` (status: **block**)
- **Not machine-checkable:** whether an approval prompt was answered with thought; whether an
  appended note says what changed and why; whether a shell write to a record was intended.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-10-12\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted
