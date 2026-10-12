---
title: 'ADR-067: ADRs Published as Web Routes'
description: >-
  Records, after the fact, the decision shipped in June 2026 to publish every
  record in docs/adr/ as a page under /adr/ through an adr content collection.
  The code and ADR-027 had attributed that decision to ADR-062, which is the
  Astro 7 upgrade and says nothing about it
lastUpdated: 2026-10-12T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Proposed (retroactive: records a decision shipped 2026-06-07 in `1ec8fc90`, closing #262; the
maintainer moves it to Accepted on review, per [ADR-066](066-constitution-calibration.md))

## Context

Since June 2026 the template has rendered each ADR as its own page, with an index, so that blog
posts and other content can link to a decision and a reader can browse the log on the site. The
work shipped without a record. `src/content.config.ts`, `README.md` and
[ADR-027](027-content-collections-schema-design.md) all cited "ADR-062" for it, but
[ADR-062](062-astro-7-upgrade-remark-retained.md) is the Astro 7 upgrade. No record at any number
described the decision (#391, found in the 2026-09 docs-versus-code audit).

This is the same gap [ADR-064](064-enforcement-architecture.md) closed for the enforcement
architecture: a number cited before it was written, then taken by something else.

## Decision Drivers

- **Linkability**: a decision cited in a post or a page should be one click away on the same site
- **One source**: the pages must render the files agents and contributors already read, not a copy
- **Scope**: [ADR-035](035-template-scope-boundary.md) keeps `docs/` out of the build; any
  exception has to be named and bounded

## Considered Options

### Option 1: Keep ADRs as repository files only

**Pros**: nothing to build or maintain.

**Cons**: content can only link to GitHub, and a cloner's fork links to the wrong repository.

### Option 2: Publish ADRs through a content collection (shipped)

**Pros**: the pages are rendered from `docs/adr/` itself; frontmatter is validated by the same Zod
machinery as other content; links are checked at build time.

**Cons**: every ADR's frontmatter becomes a build input, so a malformed record fails the build; the
route count grows with the log.

### Option 3: Publish the whole `docs/` tree

**Cons**: contradicts ADR-035 and [ADR-034](034-dual-purpose-docs-strategy.md); most of `docs/` is
reference material for the docs site, not template content.

## Decision

**Option 2**, as shipped.

- **Collection.** `src/content.config.ts` defines an `adr` collection with the glob
  `[0-9][0-9][0-9]-*.md` over `./docs/adr`, which excludes `README.md` and `template.md`. The
  entry id is the file basename, so the numeric prefix is the ADR number. The schema is the ADR
  frontmatter: `title`, `description`, `lastUpdated` (date), `tableOfContents`, `pagefind`.
- **Routes.** `src/pages/adr/index.astro` lists every record in id order, with reserved stubs
  de-emphasised and not hidden. `src/pages/adr/[slug].astro` renders one record; a record with
  `pagefind: false` is served `noindex`.
- **Links.** The build's link validator resolves a `/adr/<slug>/` link to `docs/adr/<slug>.md`.
- **Boundary.** `docs/adr/` is the only part of `docs/` that is published. Everything else stays
  out of the build.

## Consequences

### Positive

- Decisions can be linked from content and browsed on the site
- A record with invalid frontmatter fails `astro check` and the build, not a reader

### Negative

- One static route per record; the log's growth is build time and sitemap size
- Renaming an ADR file changes its URL. The log's convention already forbids renumbering

### Neutral

- The generated index in `docs/adr/README.md` ([ADR-066](066-constitution-calibration.md)) and the
  `/adr/` page list the same records by different means. The page reads the collection; the
  README table also names enforcing checks

## Validation

- **Metric 1**: `pnpm build` emits one `/adr/<slug>/` page per file matched by the glob
- **Metric 2**: no reference in `src/`, `README.md` or `docs/adr/` attributes the collection to
  ADR-062

## References

- #262 (the feature), `1ec8fc90` (the commit), #391 (the wrong citation), #370 (Mermaid on these pages)
- [ADR-027](027-content-collections-schema-design.md), [ADR-034](034-dual-purpose-docs-strategy.md),
  [ADR-035](035-template-scope-boundary.md)

## Enforcement

Not enforced — this record's status is **Proposed**; only Accepted ADRs are binding
(see the status table in the ADR README and ADR-039).

---
**Date**: 2026-10-12\
**Participants**: Chris Pezza, Claude\
**Outcome**: Deferred
