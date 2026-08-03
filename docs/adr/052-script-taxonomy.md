---
title: 'ADR-052: Script Taxonomy — Cloner-Facing vs Maintainer'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Organises package.json scripts into a cloner-facing core and a maintainer
  group as a documentation convention — grouping and ordering only, never
  renaming — so the everyday surface is obvious without breaking CI/hooks.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

`package.json` exposes ~45 scripts. Most maintain _the template itself_
(`perf:baseline`, `perf:budgets`, `bundle:analyze`,
`images:optimize`, `roadmap:update`, the `agents:*`
spine, `release:*`, `audit:*`) *(amended 2026-08-02: the first four originally
cited the `scripts/src/*.ts` file basenames — `baseline-performance`,
`track-performance-budgets`, `analyze-bundle`, `optimize-images-interactive` —
which were never script names)*. A portfolio cloner needs roughly ten of them.
Surfacing all of them as flat peers of `dev`/`build` reads as "complex to use"
and buries the everyday commands — a real onboarding cost for a distribution
template (applies the scope framework of [ADR-035](035-template-scope-boundary.md)).

The obvious fix — renaming maintainer scripts into a `maint:*` namespace — was
**rejected**: ~30 scripts are referenced by name in CI workflows, Husky hooks,
and inside other scripts (`quality:ci` calls `agents:check`; `build` calls
`env:validate` and `tokens:build`; `.github/workflows/*` call several directly).
Renaming them is high-risk churn with no functional benefit.

## Decision

Treat the split as a **documentation and ordering convention, not a renaming
scheme.**

1. **Group + order in `package.json`** — cloner-facing core first
   (`dev`, `build`, `preview`, `quality`/`quality:ci`, `test:*`, `tokens:build`,
   `format`/`lint*`, `check*`, `clean*`), then a separator key, then the
   maintainer/advanced scripts. The separator uses inert `"//1"` / `"//2"` keys
   (valid JSON, ignored by tooling) since JSON has no comments.
2. **README "Key Commands"** lists the ~10 everyday scripts up front; the full
   set lives in a collapsed "All Scripts Reference".
3. **No renames, ever.** Script names are a stable contract for CI, hooks, and
   muscle memory. This ADR explicitly forecloses a `maint:*`-style rename as
   out of scope — not deferred.

## Consequences

- **Positive:** the everyday surface is obvious at a glance; zero CI/hook/doc
  breakage risk; the convention is cheap to maintain.
- **Negative:** the inert `"//1"`/`"//2"` separator keys are a mild idiom; the
  grouping is a convention reviewers must honour when adding scripts (new
  cloner-facing scripts go above the separator, maintainer scripts below).

## References

- [ADR-035: Template Scope Boundary](035-template-scope-boundary.md)
- [ADR-042: Mutation Testing](042-mutation-testing-with-stryker.md) — `test:mutate` is a maintainer/advanced script
- [ADR-045: Cross-Tool Agents Spine](045-cross-tool-agents-spine.md) — `agents:*` scripts must keep their names
- `package.json`, `README.md`

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: every stable cloner-facing script name exists in `package.json`.
  - TC-2: the `//1`/`//2` separator keys are present, preserving the two-group ordering.
- **Checks:**
  - TC-1, TC-2 → check `script-contract` (status: **warn**)
- **Not machine-checkable:** which group a new script belongs to is a judgment call.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-07\
**Participants**: Template maintainers\
**Outcome**: Accepted — scripts grouped/ordered by audience; renaming foreclosed
