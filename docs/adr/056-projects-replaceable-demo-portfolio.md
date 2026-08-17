---
title: 'ADR-056: Projects as replaceable demo portfolio'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Convert the projects content collection from meta case studies about the
  template itself to clearly-demo, replaceable case studies in Pulci Nella's
  voice. Consolidate template marketing into the blog, told once. Forbid
  fabricated client KPIs in projects content.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Before this decision, the `projects` collection held two case studies
about the template itself:

- `building-this-template/` — a meta case study describing how the Astro
  Performance Starter came together, dated 2025-07-09 (anachronistic — it
  cited Astro 6, which shipped 2026), claiming "Lead Developer &
  Architect," "3 months," and a fabricated "99/100/100/100" Lighthouse
  scoreline as client outcomes.
- `shipping-ai-workflows/` — a duplicate of the existing
  `ai-optimized-means-ai-ready` blog post in case-study clothing, with a
  `TODO` admitting the hero artwork was placeholder.

This gave Projects an identity crisis. A cloner expects to replace
Projects with their own work, but the shipped content was template
marketing — they'd have to delete it before they could use the section
at all. And both stories were also told as blog posts, so anything they
salvaged would duplicate the blog.

The orphan images under `src/content/projects/images/`
(`architecture-diagram.png`, `project-alpha-{featured,thumb}.png`) were
already unreferenced, confirming the projects collection had been
half-maintained for some time.

## Decision Drivers

- **Replaceability**: Projects must read as "this is demo content; put
  yours here," not as template marketing the cloner has to remove.
- **No falsifiable claims**: outcomes that survive eviction must be
  capability statements true of the starter, never client KPIs.
- **De-duplication**: the template story belongs in the blog, told once.
- **Schema exercise**: demo case studies must exercise the projects
  schema fully (cover, cardImage, outcomes, technologies, role) so the
  cloner sees what each field renders as.
- **Voice consistency**: case studies carry Pulci Nella's voice
  (ADR-054) so the demo identity is consistent across surfaces.

## Considered Options

### Option 1: Keep meta case studies, clean only

**Description**: Apply the cleanups (date, TODO, orphan images, "35+ ADRs"
stat, fabricated outcomes) but keep both case studies as template
marketing.

**Pros**:

- Lower effort.
- Keeps the dogfooding marketing.

**Cons**:

- Projects collection remains "template marketing in case-study format" —
  not a replaceable demo.
- Continues to duplicate stories told in the blog.
- A cloner still has to delete everything before using Projects.

### Option 2: Replaceable demo portfolio in Pulci Nella's voice (CHOSEN)

**Description**: Delete the duplicate AI-workflows case study; salvage
the template-build story into the blog as a standalone Pulci Nella post;
ship 2–3 clearly-demo case studies that exercise the schema with
capability outcomes.

**Pros**:

- Projects matches what a template's portfolio section is for.
- Template marketing lives in one place (the blog), told once.
- Demo case studies are obviously demo; cloners replace or delete
  without losing genuine content.
- Schema fully exercised by the demo entries.

**Cons**:

- One-time content move + two new demo case studies to author and
  maintain.
- The salvaged blog post is a fourth post; the blog grows.

### Option 3: Empty the Projects collection

**Description**: Delete everything in `src/content/projects/`. Ship an
empty section with a "your projects go here" prompt.

**Pros**:

- Maximum replaceability signal.
- Zero content to maintain.

**Cons**:

- The cloner can't see what the case-study layout looks like populated.
- Schema isn't exercised; demo value drops to zero.
- Empty sections read as "the author didn't finish."

## Decision

We will go with **Option 2** — convert Projects to a replaceable demo
portfolio in Pulci Nella's voice.

### Implementation Details

- **Delete** `src/content/projects/shipping-ai-workflows/` — the
  AI-workflows story is told in
  `src/content/blog/ai-optimized-means-ai-ready/`. Single source of
  truth.
- **Salvage** `src/content/projects/building-this-template/` to
  `src/content/blog/building-this-template/building-this-template.mdx`
  as a standalone post in Pulci Nella's voice, dated 2026-06-06.
  Original project entry removed.
- **Create** two demo case studies:
  - `src/content/projects/patisserie-storefront/` — Maison Pulci, a
    fictional bakery storefront exercising the marketing-site shape.
  - `src/content/projects/docs-portal/` — Northwind Docs, a fictional
    documentation portal exercising the dense-content shape.
- Both demo entries ship with hand-generated violet→rose gradient SVG
  covers (`cover.svg`) matching the OG and og-default visual language.
- `outcomes[]` entries are capability statements true of the starter
  ("Zero JavaScript shipped to the browser by default", "Content-driven
  navigation that can't drift from the files"), never fabricated client
  KPIs.

### Outcome framing rule

A projects `outcome.value` must remain true after a cloner swaps the
client. "Zero JavaScript by default" survives any replacement;
"Increased conversions by 34%" does not. The rule is enforceable by
review, not by schema — schema allows any string.

### Salvage scope

The salvaged blog post (`building-this-template`) keeps the seven
architectural decisions from the original case study but:

- Reframes from "Lead Architect at Open Source" to Pulci Nella's
  ghost-dev voice.
- Strips fabricated client durations and Lighthouse scoreline tables.
- Keeps factual measurements (Preact size, build time band, bundle
  ceiling) where they're capability statements true of the demo.
- Removes anachronistic date (2025-07-09 → 2026-06-06).

## Consequences

### Positive

- Projects now matches what a template's portfolio section is for —
  examples a cloner can replace or delete cleanly.
- No content duplicated across blog and projects.
- Demo entries exercise the full schema, so the cloner sees what each
  field looks like rendered.
- One-source-of-truth for the template-build story (the blog).

### Negative

- One-time content move + two new demo case studies to maintain.
- The blog grows by one post; the projects collection halves and
  changes shape.

### Neutral

- The projects images directory is gone; new demo covers live alongside
  each case study's `index.mdx`.
- The blog hero asset for `building-this-template` is a new SVG.

## Validation

- **Metric 1**: `src/content/projects/` contains exactly two entries,
  both clearly-demo, both populated in Pulci Nella's voice.
- **Metric 2**: `rg -l "99/100|35\+ ADRs|Lead Architect|Tech Innovations|3 months"
  src/content/projects/` returns zero hits.
- **Metric 3**: `find src/content/projects -name "*.png"` returns zero
  hits (no orphan images, no shared images directory).
- **Metric 4**: The template-build story exists in exactly one location
  (the blog).
- **Metric 5**: `pnpm build` succeeds with both demo entries; their
  routes render at `/projects/patisserie-storefront/` and
  `/projects/docs-portal/`.

## References

- [ADR-035](035-template-scope-boundary.md) — Scope boundary governing
  what ships as code vs. reference documentation.
- [ADR-054](054-demo-persona-pulci-nella.md) — The demo persona whose
  voice the case studies carry.
- [ADR-049](049-showcase-living-style-guide.md) — Visual language the
  demo covers defer to.

## Notes

If a future maintainer wants to add real client case studies, the
recommended path is: replace the demo entries 1:1 (preserve the schema
exercise), or move the demo entries to a `_drafts/` folder so the schema
reference stays available. The CUSTOMIZE markers in each demo entry
point at the field they're filling.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Not machine-checkable:** replaceability signal, voice consistency (ADR-054), and no-falsifiable-claims are editorial judgments; full schema exercise is visible in review, not statically.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-07\
**Participants**: template author, Pulci Nella (persona maintainer)\
**Outcome**: Accepted
