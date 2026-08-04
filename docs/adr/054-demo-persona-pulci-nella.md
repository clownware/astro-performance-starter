---
title: 'ADR-054: Demo persona & brand mascot (Pulci Nella)'
lastUpdated: 2026-07-02T00:00:00.000Z
description: >-
  Adopt Pulci Nella — a reusable Clownware ghost-dev mascot derived from
  Pulcinella — as the swappable demo identity. Source bio, experience, and
  blog byline from the existing content collections; forbid fabricated
  metrics; ship clear "replace me" markers throughout the author surface.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Before this decision, the template's demo author surface was incoherent:

- `src/pages/about.astro` rendered "Hi, I'm Alex 👋" with hardcoded inline
  `skills` and `experiences` arrays bypassing the existing `bio` and
  `experience` content collections.
- The three demo blog posts already carried `author: 'Pulci Nella'`, but
  the projects collection used `Christopher Pezza` and `Lead Architect`
  framing on case studies with fabricated Lighthouse scores ("99/100"),
  fabricated durations ("3 months"), and fabricated client counts.
- `bio/default.mdx` and the three `experience/*.mdx` entries existed but
  shipped with template placeholder copy ("Your Name", "Acme Corp",
  "Tech Innovations Inc.") that no surface consumed.

A cloner inheriting that state had three problems: an inconsistent author
identity across the site, fabricated metrics they could accidentally ship
as their own, and no clear seam between "demo content" and "your content."

The astro.build/themes submission window forced the question. A themes
directory visitor judging the homepage and About in one sitting needed a
demo persona that read as obviously placeholder, not as a real human's
embellished CV.

## Decision Drivers

- **Replaceability signal**: a named clown is a self-evident placeholder;
  a realistic fake human is not. Cloners must immediately see "this is
  demo content."
- **No falsifiable claims**: outcomes that survive eviction must be
  capability statements true of the starter, never client KPIs.
- **Collection-driven**: the bio and experience collections already exist
  with the right shape; About should source from them, not bypass them.
- **One identity everywhere**: bio, About hero, experience, blog byline
  all read as the same demo person.
- **Brand-coherent**: the persona belongs to Clownware; reuse across
  Clownware templates is desirable.

## Considered Options

### Option 1: Keep "Alex" + hardcoded arrays

**Description**: Status quo — fictional human "Alex" with inline arrays
in About.

**Pros**:

- No changes required.

**Cons**:

- Reads as a real person's CV; cloners might ship it.
- Bypasses the existing `bio`/`experience` collections.
- Inconsistent with the blog byline ("Pulci Nella" already shipped).

### Option 2: Use the actual maintainer's identity

**Description**: Make the template author the demo author.

**Pros**:

- Truthful.

**Cons**:

- Every cloner inherits another person's name, photo, links.
- "Replace me" becomes "replace someone real who built this," which is
  worse signal than a clown.

### Option 3: Pulci Nella — named demo persona (CHOSEN)

**Description**: Ship a Clownware demo mascot — Pulci Nella (a split of
_Pulcinella_) — as the swappable identity. Source from bio + experience
collections. Replace fabricated client metrics with capability statements.
Mark every persona surface with a `{/* CUSTOMIZE: ... */}` MDX comment.

**Pros**:

- Obvious placeholder — cloners cannot mistake it for a real CV.
- One identity threads through bio, About, experience, blog byline,
  project demo case studies.
- Reuses existing collections; no schema changes.
- A brand asset Clownware can carry across templates.

**Cons**:

- One more brand surface to maintain (mascot SVG, voice guide).
- Cloners who skip the CUSTOMIZE markers ship a clown's CV.

## Decision

We will go with **Option 3** — Pulci Nella as the demo persona.

### Implementation Details

- `src/content/bio/default.mdx` — Pulci Nella's bio (name, title, location,
  social, categorized skills, intro prose). Avatar uses
  `../../assets/brand/state-idle.svg` (an animated state portrait). The interim
  `src/images/avatar-placeholder.png` has been removed — it went unused once the
  brand SVGs shipped and it exceeded the per-image budget (ADR-057).
- `src/content/experience/{ghost-dev,travelling-maschera,bundle-size-exorcist}.mdx`
  — three experience entries ordered 1–3, replacing the prior
  senior/frontend/junior-developer placeholders.
- `src/pages/about.astro` — rewired to load bio via `getEntry("bio", "default")`
  and experiences via `getCollection("experience")` sorted by `order`.
  Renders `<BioContent />` from the bio's `render(entry)` call. Categorized
  skills group iteration replaced the flat inline array.
- Blog byline: all three demo posts already carry `author: "Pulci Nella"`;
  verified.
- Projects (per ADR-056): demo case studies in Pulci Nella's voice with
  capability outcomes, no client KPIs.

### Persona scope

Pulci Nella is confined to the **author surface**: bio, About, experience,
blog byline, project demo case studies. It does not appear in:

- Documentation prose
- ADR content (ADRs are written in the template's voice, not Pulci Nella's)
- Component names or code identifiers
- Error messages or system output

### Reuse across Clownware templates

Cross-template reuse starts as a documented convention — the same persona
shipped fresh into each repo. A shared npm package is deferred until
copy-paste drift becomes a real maintenance burden.

## Consequences

### Positive

- One consistent, obviously-demo identity across the site.
- Collections become the single source the About page consumes; no more
  inline placeholder arrays.
- Cloners see a clean "replace me" signal at every persona surface.
- Removes the fabricated-metric risk: capability statements remain true
  after a cloner swaps the persona.

### Negative

- A second Clownware brand asset to maintain (mascot SVG + voice copy).
- Cloners who skip the CUSTOMIZE markers ship a clown's CV.

### Neutral

- The persona's voice (slightly wry, technically grounded, first-person)
  is now the demo content voice; cloners overwriting it set their own.

## Validation

- **Metric 1**: `rg "Alex|Christopher Pezza|Tech Innovations|Acme Corp" src/`
  returns zero hits outside test fixtures. _(amended 2026-08-02: originally
  claimed zero hits outright;
  `src/components/molecules/__tests__/ProjectCard.test.ts` uses "Acme Corp" as a
  fixture client name — no persona-surface content matches.)_
- **Metric 2**: `pnpm build` succeeds with the bio and experience
  collections populated; `/about` renders Pulci Nella end-to-end.
- **Metric 3**: every persona MDX surface contains a `CUSTOMIZE:` marker.
- **Metric 4**: no fabricated client metrics in shipping content
  (Lighthouse scores stay as capability claims, durations and roles
  removed from project case studies — see ADR-056).

## References

- [ADR-055](055-icon-system.md) — Companion decision on the visual
  language Pulci Nella inhabits (mono icons, one gradient per view).
- [ADR-056](056-projects-replaceable-demo-portfolio.md) — Projects
  collection's role as demo portfolio in Pulci Nella's voice.
- [ADR-049](049-showcase-living-style-guide.md) — Showcase as the living
  style guide; persona visuals must defer to its rules.

## Notes

The mascot artwork shipped as the `state-*.svg` portraits in
`src/assets/brand/`; `bio/default.mdx` uses `state-idle.svg` as the avatar. The
interim `avatar-placeholder.png` was removed once those SVGs landed (see the
per-image budget gate, ADR-057).

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Not machine-checkable:** persona voice, replaceability signal, and the no-falsifiable-claims rule are editorial judgments; collection-driven sourcing is a review concern.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-07\
**Participants**: template author, Pulci Nella (persona maintainer)\
**Outcome**: Accepted
