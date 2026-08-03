---
title: 'ADR-043: CRAP Score Budgets'
description: >-
  Reserves an ADR slot for CRAP score (Change Risk Anti-Patterns) budgets.
  Deferred indefinitely — TypeScript tooling for CRAP is immature compared
  to Clojure/Java. Revisit every six months.
lastUpdated: 2026-05-16T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Proposed (deferred — revisit by 2026-11-16)

## Context

CRAP (Change Risk Anti-Patterns) is a composite metric combining cyclomatic complexity with code coverage to flag functions that are both complex and under-tested. It was proposed in 2007 by Alberto Savoia and is well-supported in Java and Clojure tooling.

The testing+agentic-discipline plan reserved this slot for CRAP-score budgets as a follow-on to ADR-042 (mutation testing). On research, the TypeScript ecosystem's CRAP tooling is materially less mature than Clojure/Java equivalents. Available options as of 2026:

- `code-complexity` packages report cyclomatic complexity but don't compute CRAP
- No mainstream CRAP reporter integrates with Vitest coverage
- Custom CRAP computation (cc * (1 - coverage)²) is straightforward but requires building and maintaining the reporter

## Decision

**Deferred indefinitely.** The marginal value over ADR-037 (testing-discipline rules) plus ADR-042 (mutation testing) is small at the template's current scale. Revisit every six months: if TypeScript CRAP tooling matures or the codebase grows to a point where high-complexity / low-coverage functions become a recurring problem, reopen.

## Revisit triggers

- A mainstream TypeScript CRAP reporter ships and integrates with Vitest
- The repo crosses ~10 KLOC of production code (currently under 3 KLOC)
- A code review uncovers a high-complexity / under-tested function that escaped the existing gates

## References

- Alberto Savoia, _"Crap4j: A simple, useful metric for finding the worst code"_ (2007)
- [ADR-037: Testing Philosophy](037-testing-philosophy.md)
- [ADR-042: Mutation Testing with Stryker](042-mutation-testing-with-stryker.md)

---

**Date**: 2026-05-16\
**Participants**: Chris Pezza, Claude\
**Outcome**: Deferred

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

Not enforced — this record's status is **Proposed**; only Accepted ADRs are binding
(see the status table in the ADR README and ADR-039).
