---
title: 'ADR-061: versions.json Is a Public Consumption Contract'
description: >-
  Treat versions.json as a public, machine-consumed contract with external
  consumers; key renames and removals are breaking changes, the template field
  is stamped from package.json by tooling, and GitHub Releases published on tag
  push provide the stable releases/latest endpoint
lastUpdated: 2026-07-12T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted — extends [ADR-059](./059-docs-drift-gate.md)

## Context

`versions.json` began as an internal manifest of the template's stack pins. It now has external,
machine consumers that read it by key name over raw GitHub URLs:

1. **The docs drift gate** ([ADR-059](./059-docs-drift-gate.md)): the documentation repository's
   `update-versions.ts` and `drift:check` CI fetch this file and fail the docs build when the
   site's stack claims diverge from it.
2. **The clownware.org product-facts layer**: the marketing site's sync script fetches this file
   at refresh time and renders version fact strips on the product page. Sibling templates
   (e.g. `go-performance-starter`) adopt the same file name and shape, so consumers treat the
   contract as uniform across products.

Two defects motivated formalising the contract:

- The manifest's own `template` field was hand-maintained and drifted: it reported `v0.2.0`
  while `package.json` and the latest git tag were `0.9.0`. Nothing stamped it during releases,
  so the one field external consumers use as "which template version are these facts for" was
  wrong for months.
- The repository publishes git tags but **no GitHub Releases**, so consumers have no stable
  `releases/latest` API endpoint and no changelog surface to link; "latest version" had to be
  inferred from the tag list.

## Decision Drivers

- **Consumer stability**: two external systems break silently if keys are renamed or removed.
- **No hand-maintained facts**: hand-edited version fields have drifted every time they existed
  (README footer, dependency pins, and now `template` — all shipped drifted at least once).
- **Existing enforcement pattern**: `version:check` already runs in `quality:ci`; extending it
  costs less than a new mechanism and keeps one guard per drift class.
- **Adopter cleanliness**: any release automation must stay generic — cloners inherit workflows.

## Considered Options

### Option 1: Formal contract + stamped template field + Releases on tag push

**Description**: Declare `versions.json` a public contract (additive keys fine; renames/removals
breaking). Stamp `template` from `package.json` `"version"` in `version:fix`; fail
`version:check` (and therefore `quality:ci`) on drift. Publish a GitHub Release on `v*` tag push
with notes extracted from `CHANGELOG.md`.

**Pros**:

- Reuses the existing guard-script pattern and CI gate; no new infrastructure
- `releases/latest` becomes a stable machine endpoint; the Release body links the changelog
- Zero adopter pollution — the release workflow is fully generic

**Cons**:

- Key names are now frozen commitments; renaming requires coordinating consumers
- One more workflow to maintain

### Option 2: Versioned API endpoint (publish facts to a hosted JSON endpoint)

**Description**: Publish product facts to a hosted location (e.g. Pages artifact or a worker)
with schema versioning, decoupled from the repository layout.

**Pros**:

- Contract decoupled from file layout; schema can evolve behind a version
- Could aggregate multiple products server-side

**Cons**:

- New infrastructure and deploy surface for what raw GitHub URLs already provide
- Breaks the sibling-template symmetry (each template would need the same infra)
- Overkill for two consumers reading a dozen keys

### Option 3: Status quo (informal file, hand-maintained template field)

**Description**: Keep `versions.json` informal; consumers read it at their own risk.

**Pros**:

- No work

**Cons**:

- The `template` field already shipped drifted (v0.2.0 vs 0.9.0) — proven failure mode
- Renames break the docs drift gate and marketing site silently
- No stable release endpoint for consumers

## Decision

We will go with **Option 1** because both defects are instances of drift classes this repository
already guards against in CI, and the consumers already exist — the contract is being formalised,
not invented.

The contract:

- **Additive keys are non-breaking.** New stack pins may be added freely.
- **Renaming or removing a key is a breaking change.** It requires checking both consumers (the
  docs repository's drift gate; the clownware.org sync script) and coordinating the change.
- **`template` is stamped, never hand-edited.** `pnpm run version:fix` writes it from
  `package.json` `"version"`; `pnpm run version:check` fails `quality:ci` on any mismatch.
- **GitHub Releases are the version endpoint.** Pushing a `v*` tag triggers
  `.github/workflows/release.yml`, which publishes a Release whose body is that version's
  `CHANGELOG.md` section (extracted by the unit-tested `scripts/src/extract-changelog.ts`).
  Consumers use `releases/latest`; a tag without a non-empty changelog section fails the workflow.

### Implementation Details

```typescript
// scripts/src/check-version-consistency.ts — the template field joins the
// existing drift guards (README footer, dependency pins):
export function findTemplateMismatch(
  pkgVersion: string,
  versions: Record<string, string>,
): string | null; // null = consistent; message = drift, quality:ci fails
```

## Consequences

### Positive

- External consumers can rely on key stability and a stamped `template` version
- `releases/latest` gives machine consumers and humans one canonical "current version" surface
- The entire release chain (bump → tag → Release with notes) is automated and CI-guarded

### Negative

- Key names are commitments; refactoring the manifest now has a coordination cost
- Cutting a release requires a CHANGELOG section for the tagged version (enforced by failure)

### Neutral

- `versions.yml` had no programmatic consumers and was legacy; it was removed by this
  ADR's implementing change (#305) *(amended 2026-08-02: originally said the file was
  "untouched by this ADR" and a candidate for removal under its own change; the
  implementing commit deleted it — recorded in ADR-035's 2026-07-12 amendment)*
- Existing tags (v0.9.0 and earlier) predate the workflow; backfilling their Releases is a
  manual one-time action

## Validation

- **Metric 1**: `version:check` fails CI on any `template` drift (guard is exercised by unit tests)
- **Metric 2**: the next `v*` tag produces a GitHub Release with the correct CHANGELOG body
- **Metric 3**: docs drift gate and clownware.org sync run without key-mapping changes across
  template releases

## References

- [ADR-059: Docs Drift Gate Replaces Push-Sync](./059-docs-drift-gate.md)
- [ADR-045: Cross-Tool Agents Spine](./045-cross-tool-agents-spine.md) — the no-drift CI pattern
- `scripts/src/check-version-consistency.ts`, `scripts/src/extract-changelog.ts`
- `.github/workflows/release.yml`

## Notes

The same contract shape is being adopted by `go-performance-starter` (its own `versions.json`
stamped by its release flow), so cross-product consumers can treat every Clownware template
identically. Consumers deliberately read raw GitHub URLs rather than a hosted endpoint — see
Option 2 for why.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `versions.json` is consistent with `package.json` (stamped `template` field; no drift).
- **Checks:**
  - TC-1 → `version:check` in `quality:ci` (status: **block**, pre-existing gate)
- **Not machine-checkable:** whether a key rename/removal is justified — a contract break requires a superseding or amending ADR, which is a governance act.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2026-07-12\
**Participants**: Template maintainers\
**Outcome**: Accepted
