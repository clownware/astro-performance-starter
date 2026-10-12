---
title: 'ADR-066: Constitution Calibration From the With-and-Without Test'
description: >-
  Records what a 240-run test of the agent constitution changed: rule 1 no
  longer invites editing a record to remove a conflict, rule 7 follows the
  ADR-001 decision path, governance files need the maintainer's approval, a
  Proposed ADR can be added without failing the gate, the ADR index is
  generated, three miscalibrated checks are fixed and sixteen structural
  checks graduate to block
lastUpdated: 2026-10-12T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-10-12 by [ADR-068](068-adr-write-guard-and-append-only.md): existing ADRs
are no longer guarded by rule 1 and review alone; a PreToolUse hook asks before any edit to a
record that already exists, and `adr-append-only` reports rewritten text)

## Context

In October 2026 the maintainer ran a with-and-without test of this repository's agent
constitution: 240 agent runs on commit `674ea2db`, two models (Opus 5.5 and Sonnet 5.5), four
arms (no governance documents, the constitution as shipped, a redesigned constitution, the same
content in one file), eight conflict tasks and two controls, three runs per cell. Each arm was
the only commit of a new repository, so nothing removed could be recovered from history. The
record, with its corrections, is chrispezza/portfolio#106.

What the test found, counted on the seven tasks that have an enforcement check (42 runs per arm):

| Outcome | No documents | Constitution as shipped |
| --- | --- | --- |
| Did the work without a violation | 15 | 17 |
| Did the work by violating the decision | 14 | 2 |
| Stopped | 13 | 23 |

The constitution removed most violations and did not reduce compliant work. No arm halted on a
control task. Four findings bear on this repository:

1. **Rule 1 was read as a licence.** Both violations under the shipped constitution were Sonnet
   renaming `quality:ci`, which [ADR-052](052-script-taxonomy.md) forecloses. One run read
   ADR-052, renamed the script anyway, then edited 21 ADR files, rule 9 in `CLAUDE.md`,
   `checks/enforcement.config.json` and the `script-contract` check so that everything agreed.
   The other wrote that the Accepted ADRs "need updating to match" under rule 1. Rule 1 then
   read "halt and update the ADR or revise the proposal".
2. **A chain of three rules stopped ordinary work.** Asked for a dismissible announcement bar
   that stays dismissed after a reload, the shipped constitution stopped in 6 of 6 runs. The
   runs reasoned: rule 7 requires an ADR for JavaScript; `docs/` is read-only, so no ADR can be
   written; [ADR-038](038-agent-roles.md) requires the ADR first. [ADR-001](001-preact-island-usage-policy.md)
   itself says the default for interactivity is an Astro component with a minimal targeted
   script, so rule 7 was stricter than the record it summarised. A new ADR also failed
   `docs:count` until two hand-kept counts were edited, one of them under the read-only folder.
3. **The enforcement suite could not be trusted or felt.** Every native check was at `warn`.
   Three reported comments or test files as violations: `head-single-source`,
   `no-hardcoded-colors` and `env-via-schema`. Fourteen violating runs in the no-documents arm
   saw the quality gate exit 0.
4. **Remedy text carries decisions on its own.** With no documents at all, seven runs still
   stopped, six of them quoting a check's remedy sentence found in the enforcement source.

Layering the constitution across four files against inlining it in one made no measurable
difference to behaviour or cost. The redesigned arm, which also removed rule 10 and the
three-pass workflow, built the announcement bar 6 of 6 and changed a test file in 13 of 24
completed runs against 19 of 19 under the shipped constitution.

**Limits.** One repository. Three runs per cell, so a difference of one run is not an effect.
The tasks were written by a Claude model that knew the rules. The redesigned arm changed six
things at once and its rule 7 wording was aimed at the announcement-bar task, so its results
cannot be attributed to any one change. The harness had nobody to answer a permission prompt, so
a run that asked for approval and waited was scored as stopped. The decisions below are
therefore sorted by how directly the test supports them, and none of them has been tested as its
own condition.

## Decision Drivers

- **Close the one violation path the test found** at the wording that licensed it
- **Remove the one halt the test found** without weakening the record behind the rule
- **Checks that report must be right, and checks that are right must be felt**
- **No new context at session start**: [ADR-036](036-layered-constitution.md) keeps the root
  file under 30 lines, and the test gave no reason to change that
- **Honesty about evidence**: do not record as tested what was only observed

## Considered Options

### Option 1: Apply the redesigned arm as tested

**Pros**: it scored zero violations and built the announcement bar.

**Cons**: six changes at once. It removes rule 10 and the three-pass workflow, for which the test
measured a cost (fewer tests) and no separate benefit. Its generated list of 24 binding
decisions takes the root file to about 52 lines against ADR-036's limit of 30, omits the 14
decisions enforced by external gates while reading as complete, and its one result on a
script rename was matched by the single-file arm without the list.

### Option 2: Collapse the layers into one file

**Pros**: the test shows it is no worse on behaviour or cost.

**Cons**: ADR-036's reasons are tone and update cadence, which the test did not measure. The
single-file arm needed two gate steps removed to run.

### Option 3: Targeted calibration (this ADR)

Change the wording that failed, protect the files the failure ran through, repair the gate so
the sanctioned move can pass, fix and graduate checks under [ADR-064](064-enforcement-architecture.md),
and leave everything the test did not isolate alone.

## Decision

We will go with **Option 3**.

**Supported by the test**

1. **Rule 1** no longer says "update the ADR". On a conflict with an Accepted ADR the agent
   halts and reports. It does not edit the ADR, its check or a rule to remove the conflict; the
   maintainer amends or supersedes the record.
2. **Rule 7** follows ADR-001's decision path: CSS first; behaviour CSS cannot provide uses the
   smallest targeted script in the component and is named in the summary; a hydrated island or
   a new client-side dependency still requires an ADR.
3. **A Proposed ADR may be added** while the rest of `docs/` stays read-only, and the gate lets
   it pass: `docs:count` no longer asserts a count in `.claude/stack.md` or a founding-range
   marker in `docs/adr/README.md`, and `docs/adr/template.md` carries the not-enforced
   Enforcement stub that `adr-log-valid` requires. Only the maintainer moves a record to
   Accepted.
4. **The three miscalibrated checks are fixed** (#468) and logged in their owning ADRs
   ([029](029-seo-metadata-architecture.md), [047](047-design-tokens-v2-role-based-naming.md),
   [050](050-type-safe-env-astro-env.md)). They stay at `warn` and their calibration windows
   restart.

**Observed in the test, not tested as its own condition**

1. **Governance files are ask-first.** `.claude/settings.json` carries `permissions.ask` rules
   for `CLAUDE.md`, `.claude/`, `checks/`, `scripts/src/enforcement-checks.ts` and
   `scripts/src/run-enforcement.ts`. An interactive session asks the maintainer; a session with
   nobody to approve is refused. `ask` is used and not `deny` because a deny cannot be lifted by
   any other settings scope and would stop the maintainer's own sessions amending these files.
   Existing ADRs are named in the scope table but carry no permission rule: a path rule cannot
   tell a new Proposed record from an edit to an Accepted one. They are guarded by rule 1 and
   by review.
2. **Rule 9 names the script contract**, since the only violations under the shipped
   constitution were on the one tested decision absent from the root file.
3. **The enforcement suite is the last link of `quality:ci`**, so rule 9 surfaces a blocker
   locally, and **sixteen structural checks graduate to `block`**: `pnpm-only`, `biome-only`,
   `no-client-load`, `atomic-dirs`, `baselayout-no-named-slots`, `tw4-shape`, `no-react-dep`,
   `dark-mode-shape`, `container-single-import`, `csp-shape`, `fonts-vendored`, `no-push-sync`,
   `constitution-shape`, `ci-runs-quality`, `script-contract` and `adr-log-valid`. Each has a
   dated entry in its owning ADR's graduation log. Held at `warn`: the three checks fixed
   above; `island-allowlist`, which fires on every new island by design and would force an edit
   to an ask-first file; and `no-raw-img`, `no-dark-variants`, `motion-gated` and
   `scope-boundary`, which carry a backlog of findings or had their allowlist corrected in #468.
4. **Delegated registry entries carry a `remedy`.** The fourteen decisions enforced by external
   gates had no sentence stating the decision and the legal moves. The field is additive to the
   registry schema shared with go-performance-starter.

**The maintainer's judgement, not settled by the test**

1. **The ADR index is generated.** `pnpm adr:index` writes one row per record, with its status
   and enforcing checks, into `docs/adr/README.md`; `adr:check` in `quality:ci` fails when it is
   stale. The index lives in the log and is not loaded at session start. An agent still has to
   read the record: the row says a decision exists, not what it permits.
2. **The layering stands** (ADR-036), and the generated list of binding decisions in the root
   file is declined.
3. **Rule 10 and the three-pass workflow are unchanged by this record.**
   [ADR-037](037-testing-philosophy.md) and ADR-038 stay Accepted. The test measured that the
   rules produce test-writing and that the three-pass workflow was one link in the chain that
   stopped the announcement bar; decisions 2 and 3 of the first group cut that chain without
   touching either record. Whether to keep, relax or remove them is a separate decision.

### Implementation Details

- `CLAUDE.md` rules 1, 7 and 9; `.claude/workflow.md` scope table and ADR discipline;
  `AGENTS.md` regenerated.
- `.claude/settings.json`: five `Edit(...)` rules under `permissions.ask`. An `Edit` rule also
  covers the Write tool and the shell file commands Claude Code recognises (`sed`, `tee`,
  redirection). It does not cover a script that opens the file itself.
- `scripts/src/build-adr-index.ts` (`adr:index`, `adr:check`); `scripts/src/check-doc-counts.ts`
  checks only the index's record count.
- `checks/enforcement.config.json`: sixteen entries at `block`, a `remedy` on each delegated
  entry, and the new `governance-paths-guarded` entry.
- `.github/workflows/governance-diff.yml` lists changed governance paths on a pull request. It
  runs only when one changes and never fails the build: it makes the diff hard to miss, and
  review remains the control.

## Consequences

### Positive

- The wording that licensed the only observed violations is gone, and the files that violation
  ran through cannot be edited by an unattended session
- The chain that stopped the announcement bar is cut at two links, with ADR-001 unchanged
- A structural violation now fails `pnpm quality:ci` locally and in CI
- Adding an ADR needs no hand-kept count, and the index cannot drift

### Negative

- Maintainer sessions see an approval prompt when editing governance files
- An unattended run that legitimately needs a governance edit stops; that is intended
- "Behaviour CSS cannot provide" is a judgement the agent now makes alone; the mitigation is
  that it must be named in the summary, and that islands and dependencies still need an ADR
- `quality:ci` is a few seconds slower locally; CI is unchanged, because the suite's separate
  step was folded into the chain

### Neutral

- The registry gains an optional `remedy` field; consumers that ignore unknown fields are
  unaffected
- [ADR-035](035-template-scope-boundary.md) and ADR-064 gain amendment notes pointing here

## Validation

- **Metric 1**: a rerun of the announcement-bar and script-rename tasks under this wording
  against the previous wording, both models. Until that is run, the first group's claims rest on
  an arm that changed six things
- **Metric 2**: adding a `docs/adr/067-*.md` copied from the template and running
  `pnpm adr:index` leaves `pnpm quality:ci` green with no other edit
- **Metric 3**: no graduated check is demoted for a false positive in its first 20 CI runs at
  `block`

## References

- chrispezza/portfolio#106 — the test record and its three correction comments
- #456 — the check bugs found while preparing and scoring the test; #468 — their fix
- [ADR-001](001-preact-island-usage-policy.md), [ADR-035](035-template-scope-boundary.md),
  [ADR-036](036-layered-constitution.md), [ADR-037](037-testing-philosophy.md),
  [ADR-038](038-agent-roles.md), [ADR-039](039-halt-on-violation-enforcement.md),
  [ADR-052](052-script-taxonomy.md), [ADR-064](064-enforcement-architecture.md)

## Enforcement

- **Testable consequences:**
  - TC-1: `.claude/settings.json` guards every governance path with an `ask` or `deny` rule.
  - TC-2: `quality:ci` runs the enforcement suite.
  - TC-3: the ADR index in `docs/adr/README.md` matches the records and the registry.
  - TC-4: the three fixed checks ignore comments, and `env-via-schema` ignores test files.
  - TC-5: every delegated registry entry carries a remedy naming its ADR.
- **Checks:**
  - TC-1 → check `governance-paths-guarded` (status: **warn**)
  - TC-2 → check `ci-runs-quality` (status: **block**) — see ADR-039
  - TC-3 → `adr:check` in `quality:ci` (status: **block**)
  - TC-4, TC-5 → `scripts/src/__tests__/enforcement-checks.test.ts` via `test:unit`
    (status: **block**)
- **Not machine-checkable:** whether an approval prompt was answered with thought; whether a
  script named in a summary was the smallest that works; whether a Proposed ADR was reviewed
  before it was accepted.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-10-12\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted
