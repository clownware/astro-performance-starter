---
title: 'ADR-045: Cross-Tool AGENTS.md as Generated Spine'
description: >-
  Generate AGENTS.md at the repo root from the layered constitution
  (CLAUDE.md, .claude/engineering.md, .claude/workflow.md, .claude/stack.md)
  so every AGENTS.md-aware tool reads the same canonical content as Claude
  Code, with CI-enforced drift detection.
lastUpdated: 2026-05-17T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

[ADR-036](036-layered-constitution.md) split `CLAUDE.md` into a layered constitution (`CLAUDE.md` + `.claude/engineering.md` + `.claude/workflow.md` + `.claude/stack.md`) so each layer could have its own tone and update cadence. That work shipped. The cross-tool side did not.

The pre-existing parallel pattern — a hand-maintained `.windsurfrules` mirroring the same content — accumulated drift in measurable ways:

- `.windsurfrules` (179 lines) re-encoded substantially the same material as the three `.claude/*.md` files combined, but was never updated when the layered files were created. It still carried the pre-ADR-036 organisation.
- `airules.example` (131 lines) was stale Chrome Extension / React / Shadcn / Express boilerplate with unfilled `[Project Name]` placeholders, yet two setup docs (`docs/ai-context/ai-rules-setup.md` and `docs/ai-context/INDEX.md`) instructed users to `cp airules.example .windsurfrules` — which would have overwritten the working Windsurf rules with Chrome Extension boilerplate. An active footgun in the published Starlight docs.
- The Rules of Engagement section drifted across three files: 10 halt-on-violation rules in `CLAUDE.md` (the canonical list, including the ADR-037 failing-test rule), 7 suggestive-tone rules in `docs/ai-context/INDEX.md`, and 0 explicit rules in `.windsurfrules` (embedded in prose). Three renderings, three totals.
- The "Multi-tool sync" footer in [`.claude/stack.md`](../../.claude/stack.md) explicitly acknowledged the manual-sync requirement as an unsolved problem.

By 2026, the ecosystem solved the cross-tool problem with a single canonical file at the repo root: [`AGENTS.md`](https://agents.md), governed by the Agentic AI Foundation under the Linux Foundation. Cursor, Codex CLI, GitHub Copilot, Windsurf, Aider, Devin, Zed, Continue, Amp, and Amazon Q Developer all read it natively. Claude Code reads `CLAUDE.md` (with `@import` support), but `CLAUDE.md` and `AGENTS.md` compose cleanly: Claude uses the layered files, every other tool reads `AGENTS.md`.

[ADR-036:168](036-layered-constitution.md) anticipated this work: _"`.windsurfrules` parallel-rules pattern continues but should mirror the new structure when next updated."_

## Decision Drivers

- **Single source of truth across tools.** The drift measured above happened because there were two hand-maintained files that intended to encode the same rules. Eliminating the manual-sync requirement eliminates the drift.
- **Preserve ADR-036's separation of concerns.** Stack facts churn with every dependency bump; halt-on-violation rules change once a year. Collapsing the layered files into a single hand-authored `AGENTS.md` would undo ADR-036's tone/cadence reasoning.
- **CI-enforceable.** "Don't drift" as a rule isn't enforceable. A build script that fails CI when `AGENTS.md` is stale is enforceable. The project's `quality:ci` chain already runs `format:check`, `lint`, `lint:md`, `check`, `test:unit`, `agents:check`; adding one more step is consistent with the existing halt-on-violation discipline ([ADR-039](039-halt-on-violation-enforcement.md)).
- **Template demonstrability.** This is a template repository. The pattern users see when they fork is the pattern they will keep. A generated-artifact pattern with CI enforcement teaches the right lesson; a hand-maintained mirror teaches the wrong one.
- **Forward compatibility.** Adding `GEMINI.md` (Gemini CLI uses its own filename), `.cursor/rules/` (Cursor's glob-scoped overrides), or any other tool-specific file later is a one-line addition to the build script, not a new manual-sync surface.

## Considered Options

### Option 1: Status quo — keep `.windsurfrules` as a hand-maintained mirror

**Description**: Leave the current architecture in place. Add a CI lint rule that warns when `CLAUDE.md` and `.windsurfrules` diverge. Continue maintaining the "Multi-tool sync" footer.

**Pros**:

- Zero migration cost.
- No new files in the tree.

**Cons**:

- The audit above measured concrete drift across three files; convention has demonstrably failed to prevent it.
- Adoption of any new tool (Cursor, Codex CLI, etc.) requires another hand-maintained mirror file — drift surface grows linearly with tool count.
- Doesn't compose with the AGENTS.md ecosystem standard; the template stays out of sync with the broader 2026 convention.
- Doesn't address the `airules.example` footgun.

### Option 2: Hand-authored `AGENTS.md` as new source of truth; delete the layered files

**Description**: Make `AGENTS.md` the canonical hand-edited file. Move all content from `.claude/engineering.md`, `.claude/workflow.md`, `.claude/stack.md` into `AGENTS.md` sections. `CLAUDE.md` becomes an `@import` of `AGENTS.md`. `.windsurfrules` becomes a thin overlay pointing to `AGENTS.md`.

**Pros**:

- Operationally simple — no build step.
- One file to read, one file to edit.

**Cons**:

- Reverses ADR-036. The tone/cadence reasoning that justified the layered constitution still applies: stack facts shouldn't sit in the same file as halt-on-violation rules because the update cadences are an order of magnitude apart, and conflating them makes the rules read advisory while the facts read binding.
- Loses the per-layer file headers that scope each layer's intent ("Strong defaults with named exceptions" in `engineering.md`; "Technology facts" in `stack.md`).
- Risks an `AGENTS.md` that grows monolithically over time — the same failure mode that prompted ADR-036.

### Option 3: Generated-artifact `AGENTS.md` (this ADR)

**Description**: `AGENTS.md` is generated by concatenating `CLAUDE.md` + `.claude/engineering.md` + `.claude/workflow.md` + `.claude/stack.md` (in that order), with markdown headings demoted by one level so each layer becomes a top-level section under a single AGENTS.md title. A `pnpm agents:build` script writes the file. A `pnpm agents:check` script regenerates in-memory and diffs against the on-disk file, exiting non-zero on mismatch. The `check` runs in `pnpm quality:ci`. `.windsurfrules` shrinks to a thin overlay pointing at `AGENTS.md` plus the one Cascade-specific directive (rule citation).

**Pros**:

- Preserves ADR-036's layered constitution intact — each source file keeps its single tone and update cadence.
- Drift becomes structurally impossible. The manual-sync footer disappears.
- Matches the repo's existing validation-script pattern (`design:validate`, `budgets:validate`, `env:validate`).
- Adding a new tool with its own filename (`GEMINI.md`, etc.) is a single additional generation target.
- As a template, demonstrates a working anti-drift pattern users can keep when they fork.

**Cons**:

- One generated file checked into the repo (`AGENTS.md`, ~265 lines). PR diffs that touch any source layer also touch `AGENTS.md`.
- One additional build script and CI step to maintain.
- Generated `AGENTS.md` is longer than the AGENTS.md-spec's informal ~150-line recommendation. Bounded by what the four source layers contain.

## Decision

We will go with **Option 3 (Generated `AGENTS.md`)** because it is the only option that both eliminates cross-tool drift structurally (via CI) and preserves ADR-036's layered constitution (via build, not by collapsing). The diff-noise cost of regenerating on every layered-file edit is bounded and visible; the alternative — drift discovered later, in production — is unbounded and invisible.

### Implementation

- [`scripts/src/build-agents-md.ts`](../../scripts/src/build-agents-md.ts) supports two modes:
  - `build` — write `AGENTS.md`
  - `check` — fail with exit code 1 if `AGENTS.md` differs from the regenerated output
- [`package.json`](../../package.json) gains `agents:build` and `agents:check` scripts; `quality:ci` chains `agents:check` after `test:unit`.
- [`AGENTS.md`](../../AGENTS.md) is committed to the repo so external tools can read it without running a build. The file's banner names it as generated and points at the regenerate command.
- [`.windsurfrules`](../../.windsurfrules) shrinks from 179 lines to ~20: a pointer to `AGENTS.md` plus the Cascade-specific "explicitly state the rule" directive.
- [`docs/ai-context/INDEX.md`](../ai-context/INDEX.md) stops duplicating the Rules of Engagement (the 7-vs-10 drift was the motivating example for this ADR); it points at `AGENTS.md` instead.
- [`docs/ai-context/ai-rules-setup.md`](../ai-context/ai-rules-setup.md) is rewritten for the AGENTS.md pattern with a 2026 tool-support matrix.
- `airules.example` is deleted along with its 8 references across the docs/CHANGELOG/README/CONTRIBUTING surface. ADR-035's Category 1 enumeration loses the `airules.example` row and gains an `AGENTS.md` row.
- [`.claude/stack.md`](../../.claude/stack.md) "Multi-tool sync" footer is replaced with a "Cross-tool spine" note pointing at `AGENTS.md` and this ADR.

### Constraint

`AGENTS.md` is **not** edited by hand. The pre-commit and CI gates enforce this. To change content that appears in `AGENTS.md`, edit the source layer in `CLAUDE.md` or `.claude/*.md` and run `pnpm agents:build`.

## Consequences

### Positive

- Drift between Claude context and other-tool context becomes a CI failure, not a discoverable-much-later bug.
- New tools that read `AGENTS.md` natively (Cursor, Codex CLI, etc.) get the full constitution with zero per-tool setup.
- ADR-036's layered structure stays intact — `AGENTS.md` is downstream of the layered files, not a replacement for them.
- The `airules.example` footgun (stale Chrome Extension boilerplate that two setup docs recommended copying) is removed.
- The template demonstrates a working cross-tool anti-drift pattern users keep when they fork.

### Negative

- One generated file (~265 lines) is checked in. PR diffs that touch any source layer touch `AGENTS.md` too. This is intentional; the diff is the change reviewers should be aware of.
- One additional build script and one additional CI step (`agents:check`) to maintain.
- Adding a future tool that uses its own filename (e.g. `GEMINI.md`) requires extending `scripts/src/build-agents-md.ts` with an additional generation target. Small cost; balances against the cost of hand-maintaining the new mirror.

### Neutral

- The Claude Code experience is unchanged. `CLAUDE.md` still loads first; the Precedence clause still points at the layered files; `.claude/` still holds skills, agents, and roles.
- The Starlight docs site continues to render the AI-context section without functional change beyond the rewritten `ai-rules-setup.md` page.
- The `AGENTS.md` generated file is longer (~265 lines) than the informal AGENTS.md-spec recommendation of ~150 lines. The content all originates from layered files this template explicitly accepts as load-bearing constitution.

## Validation

- `pnpm agents:build` produces `AGENTS.md` containing all four source files' content in the documented order, with markdown headings demoted by one level.
- `pnpm agents:check` exits 0 when `AGENTS.md` is in sync, non-zero when it isn't, with a regenerate-and-commit message.
- `pnpm quality:ci` includes `agents:check` and fails when any source file is edited without regeneration.
- `wc -l .windsurfrules` returns ≤ 40 (currently 20). No section of `.windsurfrules` re-encodes content present in `AGENTS.md`.
- `grep -r "airules.example"` outside historical mentions returns zero matches — no setup
  doc or config references the deleted file. _(amended 2026-08-02: the surviving mentions
  are the `CHANGELOG.md` v0.2.0 and v0.9.0 notes, the `ai-optimized-means-ai-ready` blog
  post's retrospective, and this ADR's own text; the original carve-out named only the
  v0.2.0 note.)_
- A trial Cursor / Codex CLI / Copilot session in the repo, asked "what's our package manager?", references pnpm 10.x from the Stack section of `AGENTS.md`.
- A trial Claude Code session asked the same question references pnpm 10.x from `.claude/stack.md`.
- `docs/ai-context/INDEX.md` does not duplicate the halt-on-violation rules list; it points at `AGENTS.md`.

## References

- [AGENTS.md specification](https://agents.md) — Agentic AI Foundation (Linux Foundation), 2026
- [ADR-036: Layered constitution](036-layered-constitution.md) — the layering this ADR extends cross-tool; line 168 anticipates this work
- [ADR-039: Halt-on-violation enforcement](039-halt-on-violation-enforcement.md) — the CI-gate pattern this ADR extends to context-file drift
- [ADR-035: Template scope boundary](035-template-scope-boundary.md) — updated inline to swap `airules.example` for `AGENTS.md` in the Category 1 enumeration
- [ADR-034: Dual-purpose docs strategy](034-dual-purpose-docs-strategy.md) — `docs/ai-context/ai-rules-setup.md` continues to serve both human and AI audiences after the rewrite

## Notes

The `agents:check` script intentionally compares file content byte-for-byte rather than parsing markdown. Any whitespace, ordering, or character change in a source file produces a deterministic change in the generated output; the byte comparison catches every kind of drift, including the failure mode where a source file is edited but `AGENTS.md` is regenerated against a stale local copy. The check is fast (single read, single regenerate, single diff) and adds < 1s to `quality:ci`.

The heading-demotion logic in the build script skips fenced code blocks so that comments like `# format` inside `pnpm` example snippets in `.claude/stack.md` are not mistaken for headings. The current source files contain no H6 headings; the demotion is safe.

ADR-041 (Gherkin / BDD-style specs) was declined in the testing-philosophy work and left unrecorded as an ADR file. This ADR uses the next available number (045) following the declined 041 + the 042-044 sequence.

---

**Date**: 2026-05-17\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `AGENTS.md` and `.windsurfrules` are exactly what the build script generates from the constitution layers.
  - TC-2: hand-edits to the generated files are rejected at edit time.
- **Checks:**
  - TC-1 → `agents:check` in `quality:ci` (status: **block**, pre-existing gate)
  - TC-2 → PreToolUse guard on generated files (hook; see ADR-062)
- **Not machine-checkable:** whether new constitution content lands in the correct layer (see ADR-036).
- **Graduation log:** _(empty at creation; entries added when a check changes status)_
