---
title: 'ADR-036: Layered Constitution for Agent Context'
description: >-
  Split the monolithic CLAUDE.md into a layered constitution (CLAUDE.md +
  .claude/engineering.md + .claude/workflow.md + .claude/stack.md) so that
  halt-on-violation rules, engineering defaults, process guidance, and stack
  facts each have a single tone and a single update cadence.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

`CLAUDE.md` had grown to 132 lines across 14 top-level headings, conflating four distinct kinds of content:

- Halt-on-violation rules (e.g. "never `client:load` without ADR justification")
- Engineering defaults (component conventions, design-token usage, TypeScript settings)
- Process guidance (scope boundaries, quality gates, git hooks)
- Stack facts (Astro 7.x, pnpm 10.x, Node 24.x, command references)

The four categories have different tones, different update cadences, and different audiences. Stack facts change with every dependency upgrade. Halt-on-violation rules should change once a year. Conflating them into a single file makes the rules read as advisory and the facts read as binding — exactly the wrong message for both.

Robert C. Martin's `unclebob/swarm-forge` repo embodies a working pattern for separating these concerns: `constitution.prompt` carries the inviolable rules, `engineering.prompt` carries the strong defaults, `workflow.prompt` carries the process, and `stack.prompt` (or equivalent) carries the facts. Each layer has a single voice. This ADR adapts that pattern to a single-Claude-session template repo rather than the multi-agent orchestration `swarm-forge` itself targets.

## Decision Drivers

- **Tone consistency**: A constitution that mixes "halt on violation" rules with "here is our package manager" facts cannot communicate either credibly.
- **Update cadence**: Stack facts (`stack.md`) update with every dependency bump. Constitution rules update rarely. Separating them lets each evolve at its natural pace.
- **Auditability**: A constitution under 30 lines is easy to skim and easy to verify. A 132-line one isn't.
- **Agent precedence**: When an agent looks up "what's our package manager?", it should read a facts file, not a rules file. When it looks up "may I add a new dependency?", the rules file is the right destination.
- **Forward compatibility**: ADRs 037, 038, 039, 040 will add rules and roles. Without a layered structure, each adds noise to the constitution.

## Considered Options

### Option 1: Keep monolithic CLAUDE.md

**Description**: Leave the current 132-line CLAUDE.md as-is; trust the section headings to provide structure.

**Pros**:

- Zero migration cost
- One file to grep

**Cons**:

- Tone collisions (rules read advisory, facts read binding)
- Update churn — every dependency bump touches the same file as the rules
- Hard to enforce a "constitution under 30 lines" discipline
- Doesn't compose with the role taxonomy ADR-038 will introduce

### Option 2: Split into separate ADRs

**Description**: Move engineering defaults into a new "Engineering Standards" ADR, workflow into a separate "Workflow ADR", etc.

**Pros**:

- Each topic gets its own decision record
- ADR machinery (template, status, lastUpdated) applies uniformly

**Cons**:

- ADRs are for decisions, not for live reference documents that agents read every session
- An agent that needs "what's our coverage threshold?" should not read four ADRs to find out
- Updates require ADR revision overhead for what are really standards drift, not decisions

### Option 3: Layered constitution (this ADR)

**Description**: Split `CLAUDE.md` into a layered structure where each file has a single tone and a single update cadence. `CLAUDE.md` carries only halt-on-violation rules and is kept under 30 lines. Sublayer files carry engineering defaults, workflow, and stack facts. The constitution explicitly states sublayer precedence so the layering is for organisation, not softening.

**Pros**:

- Each file has one voice and one audience
- Constitution stays scannable (< 30 lines)
- Stack facts churn doesn't touch rules
- Composes with the role taxonomy from ADR-038
- Matches a working pattern (`swarm-forge`)

**Cons**:

- One-time migration cost (this PR)
- Slightly more files for an agent to read (mitigated by `CLAUDE.md` explicitly listing them)

## Decision

We will go with **Option 3 (Layered constitution)** because it is the only option that produces a constitution short enough to enforce as "non-negotiable" and a stack file disposable enough to update without ceremony.

### Target structure

```text
CLAUDE.md                    # Constitution: halt-on-violation rules. Under 30 lines.
.claude/
  engineering.md             # Strong engineering defaults (components, tokens, TS, naming)
  workflow.md                # Process: scope boundaries, quality gate, ADR discipline, testing
  stack.md                   # Tech facts: versions, commands, budgets, key ADRs, deployment
  roles/                     # (Created in ADR-038, not here)
  settings.json              # (Existing)
  settings.local.json        # (Existing)
  skills/                    # (Existing)
src/components/CLAUDE.md     # Directory-scoped, unchanged
```

### Content allocation

**`CLAUDE.md` (constitution):**

- The nine "Rules of Engagement" rewritten as halt-on-violation language ("halt and report" rather than "verify with")
- Explicit precedence statement directing the reader to sublayer files
- Pointer to ADR-035 for scope boundaries

**`.claude/engineering.md`:**

- Component conventions (atomic hierarchy, Props interface requirement, slots-over-props)
- Island hydration policy (the ADR-001 client:directive escalation order)
- Design system rules (token usage, semantic naming, what's forbidden)
- Image policy (Astro Image required; no `<img>`)
- TypeScript settings rationale
- Naming conventions table

**`.claude/workflow.md`:**

- Scope boundaries table from ADR-035 (with pointer to the full ADR)
- Quality gate command and the local↔CI parity statement
- ADR discipline (when to check, when to open)
- Git hooks
- Testing requirements (per layer: unit, component microtest, E2E, a11y)

**`.claude/stack.md`:**

- Tech stack versions
- Key commands table
- Performance budgets
- Key ADRs list
- Deployment target

### Constitution mandate

The constitution body explicitly states sublayer precedence:

> Rules in `.claude/engineering.md` and `.claude/workflow.md` apply with constitutional force; the layering exists for organisation, not for softening. Stack facts (commands, versions, dependencies) live in `.claude/stack.md`.

This forecloses the failure mode where an agent treats sublayer files as advisory because they're not in `CLAUDE.md` proper.

## Consequences

### Positive

- Constitution becomes scannable (< 30 lines vs 132)
- Stack facts churn no longer touches rules
- Each file has a single voice — easier to write, easier to read
- Composes cleanly with the role taxonomy ADR-038 will introduce
- Easier to audit "is this rule halt-on-violation?" because it's the only kind in `CLAUDE.md`

### Negative

- One-time migration cost (this PR)
- New contributors must learn the four-file structure
- Risk: agents could treat sublayer files as advisory despite the explicit precedence clause — mitigated by phrasing both in the constitution and in each sublayer file's header

### Neutral

- Total content is approximately the same; only the organisation changes
- `src/components/CLAUDE.md` (directory-scoped) is unaffected and continues to work as before
- `.windsurfrules` parallel-rules pattern continues but should mirror the new structure when next updated

## Validation

- `wc -l CLAUDE.md` returns < 30 (target: 25–28 content lines + a header)
- Every rule in `CLAUDE.md` uses halt-on-violation language (`halt and X` or `is forbidden`)
- A trial Claude session asked "what's our package manager?" reads `.claude/stack.md`, not `CLAUDE.md`
- A trial Claude session asked "may I use `client:load`?" reads `.claude/engineering.md` (Island Hydration section) or hits the constitution clause directly

## References

- Robert C. Martin, [unclebob/swarm-forge on GitHub](https://github.com/unclebob/swarm-forge) — runnable embodiment of layered-constitution pattern
- Robert C. Martin and Justin Martin, [Clean AI: Agentic Discipline series](https://cleancoders.com) — methodology background
- [ADR-035: Template Scope Boundary](035-template-scope-boundary.md) — closest existing constitution clause; its scope table moves to `.claude/workflow.md`
- [ADR-034: Dual-Purpose Docs Strategy](034-dual-purpose-docs-strategy.md) — sets the precedent for files serving both human and AI audiences

## Notes

The hyphen-versus-numerical-ordering convention: the layering imposes an implicit precedence (constitution > engineering > workflow > stack) that mirrors the migration of "softer" content from the top of CLAUDE.md to the bottom. Stack facts at the bottom feels natural because they change most often; constitution at the top feels natural because it changes rarely.

The choice of `.claude/` as the directory name (rather than tool-agnostic `.agent/` or `docs/agent-context/`) follows the ecosystem convention as of 2026. If a tool-agnostic convention emerges, a future ADR can revisit; the migration is mechanical.

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `CLAUDE.md`, `.claude/engineering.md`, `.claude/workflow.md`, and `.claude/stack.md` all exist.
  - TC-2: the generated agent spine is current with the constitution layers.
- **Checks:**
  - TC-1 → check `constitution-shape` (status: **warn**)
  - TC-2 → `agents:check` in `quality:ci` (status: **block**, pre-existing gate) — see ADR-045
- **Not machine-checkable:** tone separation (rules read binding, facts read informational) is editorial.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_
