---
title: 'ADR-041: Reserved'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Placeholder preserving ADR numbering sequence. This number was skipped during
  ADR creation and is reserved for future use.
tableOfContents: false
pagefind: false
---

## Status

Withdrawn

## Context

This stub preserves the numbering audit trail per ADR best practices — gaps in
numbering should be documented rather than silently ignored (matching the existing
ADR-007 and ADR-016 reserved stubs).

Unlike those stubs, ADR-041 was not merely skipped: the Phase 2 testing plan
deliberately reserved it for an optional **Gherkin / BDD-style specs** decision —
`*.feature` files consumed by Playwright — to be opened only if the E2E restructure
surfaced acceptance criteria too ambiguous for prose. It did not: the split-out tests
(one logical assertion per test, behaviour-describing names per
[ADR-037](./037-testing-philosophy.md)) already read as specifications, so adding
Given/When/Then would be ceremony without signal.

## Decision

Do not open ADR-041 at this time; the number stays reserved for the Gherkin/BDD
decision specifically. The re-open trigger is: "prose acceptance criteria are ambiguous
enough that test reviewers disagree about whether the test matches the spec." Until that
fires, the tests-as-specs convention stands. The operative statement of this convention
lives in `.claude/workflow.md` ("Gherkin / BDD-style specs — declined"); this stub
records the same decision in the ADR audit trail.

## References

- [ADR-040: Container API for Component Microtests](/adr/040-container-api-for-component-microtests/)
- [ADR-042: Mutation Testing with Stryker](/adr/042-mutation-testing-with-stryker/)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

Not enforced — this record's status is **Withdrawn**; only Accepted ADRs are binding
(see the status table in the ADR README and ADR-039).

---
**Date**: 2026-06-07\
**Participants**: Template maintainers\
**Outcome**: Withdrawn (number reserved)
