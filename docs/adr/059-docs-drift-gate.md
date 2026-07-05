---
title: 'ADR-059: Docs Drift Gate Replaces Push-Sync'
description: >-
  Retire the automated docs push-sync to the Starlight documentation repository
  in favour of independent authoring plus a CI drift gate that fails the docs
  build when its stack claims diverge from this repository's versions.json
lastUpdated: 2026-07-02T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted — supersedes [ADR-008](./008-docs-sync-strategy.md); amends [ADR-006](./006-documentation-review-cadence.md) for cross-repo stack claims

## Context

ADR-008 established an automated push-sync: on every `docs/**` change pushed to `master`, the
`sync-docs-to-starlight.yml` workflow copies `docs/` into the Starlight documentation repository
(`clownware/astro-starter-docs`, which deploys to <https://astro.clownware.org>) and opens a PR.

A full audit on 2026-07-02 found the pipeline dead in practice and broken by design:

1. **No sync PR has ever been merged.** 22+ sync PRs sat open in the docs repository, the oldest
   from 2025-09-30. The workflow reports success when a PR is *created*, so the failure was silent.
2. **The PRs are unmergeable by construction.** The workflow deletes everything in the docs
   repository except `.git` and copies `docs/` into the repository *root*. Merging any sync PR
   would delete the Starlight application itself (`src/`, `astro.config.mjs`, `package.json`).
3. **The content sets diverged long ago.** This repository's `docs/` (~151 files) and the docs
   site's `src/content/docs/` (91 pages) have different structures and largely different content.
   The docs site was authored *for* Starlight; it was never a mirror of `docs/`. ADR-008's
   replace-everything model never matched the target repository's shape.

The consequence: the public docs site froze at roughly September 2025 while this repository moved
through Astro 5→6, Tailwind 4, the Fonts API, the Content Layer API, and the enforcement-gate
layer — so the site now actively documents a stack the starter no longer ships. ADR-006's review
cadence did not catch this because it is a calendar intention for in-repo docs, not a gate on the
external site.

## Decision Drivers

- **Enforcement over intention**: consistent with ADR-039, drift must fail a build, not wait for a
  calendar review
- **Respect the real architecture**: the docs site is an independently authored Starlight
  application with its own information architecture, not a rendering of `docs/`
- **Maintenance burden**: the push-sync requires PAT rotation and produced only unmergeable PRs
- **Silent-failure elimination**: "workflow green" must mean "docs correct", not "PR opened"

## Considered Options

### Option 1: Rewrite the push-sync to target the Starlight content directory

**Description**: Keep `docs/` as the single source of truth; rewrite the workflow to transform
frontmatter and write into `src/content/docs/` without touching the Starlight application.

**Pros**:

- Docs live beside code; one PR updates both atomically
- Preserves ADR-008's single-source-of-truth goal

**Cons**:

- Requires a real transformation layer (frontmatter, paths, sidebar) — significant new tooling
- Forces a one-time reconciliation of two long-diverged trees (151 vs 91 files) into one shape
- The site's IA (tracks, snippets, ai-prompts) has no home in `docs/`; either the site flattens
  or `docs/` bloats

### Option 2: Independent authoring plus a CI drift gate

**Description**: The docs repository is authored on its own cadence. Delete the push-sync. The
docs repository's CI fetches this repository's `versions.json` (the machine-readable stack
manifest already enforced in-repo by `version:check`) and fails the docs build when the site's
stack claims diverge.

**Pros**:

- Matches how the site actually evolved; each repository keeps the shape suited to its job
- Converts stack drift from a silent condition into a build failure — enforcement, not cadence
- Removes PAT management and the destructive workflow entirely
- Minimal new tooling: one fetch-and-compare CI step in the docs repository

**Cons**:

- Prose drift (beyond declared versions) is not caught mechanically; it needs the docs
  repository's link validation and periodic audits
- Docs updates require deliberate work in a second repository

### Option 3: Monorepo

**Description**: Move the Starlight site into this repository.

**Pros**:

- Atomic updates, one CI surface

**Cons**:

- Rejected by ADR-008 for the same reasons that still hold (hosting split, template scope per
  ADR-035); would couple template cloners to a docs application they don't need

## Decision

We will go with **Option 2** because it makes the enforcement philosophy (ADR-039) apply to the
docs site with the least machinery, and it stops pretending the site is a mirror when it has
never been one.

### Implementation Details

- Delete `.github/workflows/sync-docs-to-starlight.yml` from this repository
- Close the open `sync-docs-*` PRs and delete their branches in the docs repository
- Docs repository CI gains a drift-gate step: fetch this repository's raw `versions.json`,
  compare against the site's version manifest, exit non-zero on mismatch
- The docs repository's version manifest sources from this repository's `versions.json` rather
  than from the docs repository's own installed dependencies
- `docs/development/docs-sync-setup.md` is retired alongside the workflow

## Consequences

### Positive

- Stack drift on the public site becomes a build failure instead of a ten-month silent freeze
- No PAT rotation, no destructive automation, no unmergeable-PR queue
- Each repository's CI meaning is restored: green means correct

### Negative

- Content (prose, examples, coverage) must be maintained deliberately in the docs repository;
  the gate only covers declared stack facts
- `docs/` content that should appear on the site needs manual porting

### Neutral

- ADR-008's Considered Options analysis remains a useful record; its chosen mechanism is retired
- ADR-006's frontmatter review dates remain in force for in-repo documentation; for cross-repo
  stack claims the cadence is replaced by this gate. *(Update 2026-07-05: ADR-006 was
  subsequently Withdrawn — an audit found its mechanism was never implemented, so there were
  no review dates in force to retain.)*

## Validation

- **Gate fires**: a deliberate version mismatch in the docs repository fails its CI
- **Queue cleared**: zero open `sync-docs-*` PRs in the docs repository
- **No silent freeze**: docs site version claims match `versions.json` at every deploy

## References

- [ADR-008: Documentation Sync Strategy](./008-docs-sync-strategy.md) — superseded
- [ADR-006: Documentation Review Cadence](./006-documentation-review-cadence.md) — amended
- [ADR-039: Halt-on-Violation Enforcement](./039-halt-on-violation-enforcement.md)
- Docs audit, 2026-07-02 (session artifact `DOCS-AUDIT-AND-PLAN.md`)

## Notes

The audit that motivated this ADR found ~10 systemic defect classes on the live site (stale
version manifest, legacy Content Collections API, wrong repository slug, malformed code fences,
deprecated deploy guidance) and near-zero coverage of the enforcement layer. Those are content
fixes tracked in the docs repository; this ADR governs only the sync architecture.

---
**Date**: 2026-07-02\
**Participants**: Template maintainers\
**Outcome**: Accepted
