---
title: 'ADR-037: Testing Philosophy and House Rules'
description: >-
  Adopts Uncle Bob's testing principles (TDD discipline, F.I.R.S.T., AAA with
  single assertion, no conditional assertions) as house rules in the layered
  constitution. Extends ADR-023 without superseding it.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

[ADR-023](023-testing-strategy.md) set the testing strategy (hybrid Vitest + Playwright + axe-core); the enforced unit-coverage thresholds are 80/75/70 (lines/functions/branches, from `vitest.config.ts`, recorded in ADR-023 by its 2026-07-05 amendment). What ADR-023 did not codify is the **discipline** that determines whether those tests carry signal:

- Whether the test is written before the production code (Three Laws of TDD in spirit)
- Whether each test asserts exactly one logical thing (AAA + single assertion)
- Whether tests are conditional on configuration (the `if (await x.isVisible()) { expect(...) }` anti-pattern, which has cost CI debugging sessions in this repo)
- How tests are named (behaviour vs. implementation)
- When to mock vs. when to use real dependencies

These are the differences between a coverage report at 96% that catches regressions and a coverage report at 96% that doesn't catch anything. ADR-037 codifies them.

The codification lives in three places:

1. **`CLAUDE.md`** (the constitution): one halt-on-violation rule about TDD
2. **`.claude/engineering.md`**: five practical rules
3. **`docs/development/testing-conventions.md`**: the longer "how to write a good test in this repo" companion with examples

The "Uncle Bob lenses" rationale doc cited in the planning notes does not exist as a separate file; this ADR inlines its conclusions to keep the dependency graph honest.

## Decision Drivers

- **Signal over coverage**: 96% line coverage with weak assertions is the failure mode this addresses
- **Discipline cost**: the rules must be cheap enough to follow without ceremony
- **Composability with ADR-038**: the Architect pass produces the failing test; ADR-037's rules say what "good" looks like for that test
- **Existing exemplars**: `src/utils/__tests__/formatDate.test.ts` already follows the discipline; the rules describe what's already working
- **Existing anti-patterns**: `e2e/index.spec.ts` has conditional-assertion patterns that ADR-037 explicitly forbids going forward

## Considered Options

### Option 1: Leave ADR-023 as the sole testing reference

**Description**: Treat the strategy ADR as sufficient; trust contributors to write good tests.

**Pros**:

- Less documentation churn

**Cons**:

- Strategy ADR doesn't address discipline (how to write the test, what makes one good)
- The conditional-assertion anti-pattern in `e2e/index.spec.ts` shipped without anything formally forbidding it
- New contributors and Claude sessions have no concrete "what good looks like" reference

### Option 2: Adopt full classical TDD (Three Laws, nano-cycle)

**Description**: Mandate Robert C. Martin's Three Laws strictly: never write a line of production code without a failing test; write only enough test to fail; write only enough production code to pass.

**Pros**:

- Maximum discipline; well-documented in Clean Code literature
- The nano-cycle catches everything

**Cons**:

- Nano-cycle is overkill for static-site template work; the overhead doesn't fit the use case
- Strict interpretation breaks exploratory work (spike commits)
- A blanket mandate doesn't survive contact with reality; rules read as advisory

### Option 3: Adopt the principles, not the strict cycle (this ADR)

**Description**: Adopt the Three Laws _in spirit_ (test before code, scope minimal), F.I.R.S.T. (Fast, Independent, Repeatable, Self-validating, Timely) as the test review checklist, AAA + single assertion, no conditional assertions, behaviour-describing names. Codify as five rules in `.claude/engineering.md`, one constitution clause, and a companion conventions doc.

**Pros**:

- Captures the discipline that matters at a cost the workflow can sustain
- Composes cleanly with the Architect pass in ADR-038
- Each rule is verifiable (e.g. "no `if (cond) { expect(...) }`" can be linted)
- The companion doc gives concrete examples from this repo

**Cons**:

- Five new rules to remember (but they're internalised quickly)
- The companion doc adds a file to maintain (offset by removing tribal-knowledge debate)

## Decision

We will go with **Option 3 (Adopt the principles, not the strict cycle)** because it captures the signal-bearing discipline without making the workflow unworkable.

### What lands where

**`CLAUDE.md` (one constitution clause):**

> Production code follows a failing test. If you generate production code without a corresponding failing test, halt and write the test.

This is the only TDD-related halt rule in the constitution; the rest live in the sublayer.

**`.claude/engineering.md` (five rules under a new "Testing Discipline" section):**

1. Before implementing, write or update the failing test. Show the failure output before writing production code.
2. Use Arrange / Act / Assert structure with one logical assertion per test.
3. No conditional assertions. If the assertion depends on configuration, fix the fixture so the configuration is deterministic.
4. Test names describe behaviour, not implementation.
5. Never lower a coverage threshold to make CI pass. Add the missing test or open an ADR documenting the exception.

**`docs/development/testing-conventions.md` (new companion doc):**

- AAA template, referencing `src/utils/__tests__/formatDate.test.ts` as the exemplar
- The conditional-assertion anti-pattern with the `e2e/index.spec.ts` instance as cautionary tale, plus the deterministic-fixture remedy
- Behaviour-naming convention with before/after examples
- Mock-or-not decision flow (when to use `src/__mocks__/astro-content.ts` pattern vs. when to test against real)
- F.I.R.S.T. as a self-review checklist

**`CONTRIBUTING.md`:**

A pointer to `testing-conventions.md` from the Testing Requirements section. No content duplication.

### Rationale inlined (the "Uncle Bob lenses" thinking)

The five rules collapse Robert C. Martin's Three Laws, F.I.R.S.T., and the "test code is first-class production code" doctrine into the smallest enforceable set:

- **TDD discipline as direction-of-flow.** The Three Laws prescribe the order (test first, fail, code, pass). Rule 1 is that order, expressed at the granularity of a feature rather than a line.
- **AAA + single assertion.** F.I.R.S.T.'s "Independent" and "Self-validating" both fail when a test bundles multiple assertions: one failure hides the others, and the test fails for ambiguous reasons.
- **No conditional assertions.** The `if (await link.isVisible()) { expect(...).toHaveAttribute(...) }` pattern in `e2e/index.spec.ts:21-24` is the canonical example: when the link is hidden, the test passes silently. Asserting nothing is worse than asserting wrong, because the green CI signal looks honest.
- **Behaviour naming.** Names describing implementation rot when implementation changes; names describing behaviour survive refactors.
- **No threshold lowering.** Lowering a threshold to make CI pass converts a tested invariant into a documented regression. Always: add the test or open an ADR explaining the exception.

## Consequences

### Positive

- New tests follow a verifiable pattern; review becomes "did you follow the rules?" rather than judgement
- Conditional-assertion regressions become structurally harder
- The companion doc gives Claude sessions a concrete reference for "what good looks like"
- Composes with ADR-038: the Architect pass produces a test that satisfies these rules
- Coverage numbers carry more signal because the underlying tests are stronger

### Negative

- New file (`testing-conventions.md`) to maintain
- Existing tests in `e2e/` that violate Rule 3 are now visible debt (addressed in Phase 2 of the plan)
- Five rules to internalise (offset: they're verifiable, not vibes)

### Neutral

- ADR-023's coverage targets are unchanged
- Existing util tests (`src/utils/__tests__/**`) already comply; no migration needed
- Atom tests from PR #213 are AAA-shaped; no migration needed for Phase 1

## Validation

- ADR-037 merged Accepted
- `docs/development/testing-conventions.md` exists and is linked from `CONTRIBUTING.md`
- The five rules are present in `.claude/engineering.md`
- The constitution clause is present in `CLAUDE.md`
- A trial Claude session asked for a non-trivial feature produces a failing test before any production code (cross-validates ADR-038)

## References

- [ADR-023: Testing Strategy and Coverage Targets](023-testing-strategy.md) — extended, not superseded
- [ADR-036: Layered Constitution](036-layered-constitution.md) — establishes the file structure these rules populate
- [ADR-038: Agent Roles and Handoff Patterns](038-agent-roles.md) — the Architect pass produces the failing test required by Rule 1
- Robert C. Martin, _Clean Code_ (2008), Chapter 9: Unit Tests
- Robert C. Martin and Justin Martin, [Clean AI: Agentic Discipline series](https://cleancoders.com)
- Existing exemplar: `src/utils/__tests__/formatDate.test.ts`
- Existing anti-pattern: `e2e/index.spec.ts` lines 21-24 and 92-97 (addressed in Phase 2)

## Notes

The companion doc (`testing-conventions.md`) is the practical reference; this ADR is the decision record. Future updates to test conventions should land in the companion doc with a note in this ADR's "Notes" section rather than reopening the ADR.

The rule "Never lower a coverage threshold to make CI pass" exists because the alternative — silently dropping coverage when a test is removed — is indistinguishable from coverage drift caused by a real bug. The escape valve is an explicit ADR; the cost of writing one is the brake.

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Accepted

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: coverage thresholds hold (weak-assertion drift is measured separately by mutation runs, ADR-042).
- **Checks:**
  - TC-1 → `test:coverage` in CI (status: **block**, pre-existing gate)
- **Not machine-checkable:** the test-first sequence and F.I.R.S.T. discipline are process facts not derivable from repo state; they are enforced socially and via the Stop-gate running the suite.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_
