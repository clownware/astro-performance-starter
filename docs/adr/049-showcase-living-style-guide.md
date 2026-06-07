---
title: 'ADR-049: The Showcase Is the Living Style Guide'
lastUpdated: 2026-06-06T00:00:00.000Z
description: >-
  Evolves the /showcase page into the canonical design-system style guide
  (System / Color / Type / Motion / Components), built from token-driven
  specimens so it cannot drift, zero-JS, with how-it-works delegating to it.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

After the v2 cold-minimal migration (ADR-047/048), the design system was documented in three
overlapping places: `/showcase` (a component gallery + partial token swatches), the
"Design System" pillar of `/how-it-works` (a narrative token-pipeline tour), and prototype
mockups. A design brief proposed a single "living style guide" — one page that demonstrates
the system **by being styled entirely by it** (a narrative hero, full palettes, a type
specimen, a motion section, the component gallery).

The brief's mockup was visually compelling but **factually frozen on the pre-v2 world**: it
labelled palettes `gray/moonstone/imperialRed/orangeWeb`, showed `--bg/--fg` var shorthands,
defaulted the display face to Space Grotesk, said "Astro 5", and claimed "Under 15KB CSS
gzipped". Adopting its copy verbatim would ship inaccurate documentation.

## Decision Drivers

- **Single source of reference**: one canonical page, not three overlapping ones.
- **Accuracy that can't rot**: a style guide that silently drifts from the shipped tokens is
  worse than none.
- **Zero-JS baseline**: the page must not regress the starter's no-hydration default.
- **Reuse over rebuild**: lean on existing primitives, not a from-scratch copy of the mockup.

## Considered Options

### Option 1: New separate `/design-system` page

A third page beside `/showcase` (components) and `/how-it-works`. **Con:** more nav surface
and more overlap to keep in sync.

### Option 2: Fold specimens into `/how-it-works`

**Con:** bloats the architecture tour; mixes "how it works" prose with "here it is" specimens.

### Option 3: Evolve `/showcase` into the living style guide (chosen)

Restructure `/showcase` to `System / Color / Type / Motion / Components`, keeping the existing
component gallery as the Components section. `/how-it-works` keeps its narrative pillar and
links here.

## Decision

**Evolve `/showcase` into the canonical living style guide (Option 3)**, under three rules:

### Accuracy by construction (token-driven specimens)

Specimens read live token output, so the page always portrays exactly what ships:

- `PaletteBand` renders each family's 50–950 band from `hsl(var(--color-{family}-{step}))`.
- `TypeSpecimen` sizes rows with the `text-*` utilities (the `--text-*` tokens) and picks the
  face with `font-display` / `font-text` (the `fontFamily` token group).
- `ColorTokenSwatch` role chips read the live `--color-*` role vars.
- Unit tests assert these components emit **no** hardcoded colour/size literals (drift guards).

Narrative copy is corrected to ship-truth (`slate/violet/rose/amber`, `--color-*`, **Geist**,
**Astro 6**, ~26KB CSS / 50KB budget, two faces).

### Zero-JS, static comparisons

No live toggles. The gradient is shown as a **static A-vs-B** OKLCH comparison (via an `arc`
prop on `AnimatedGradientText`) and the type specimen renders in the shipped Geist — the
"re-themes itself" story is told in copy and the EDIT→BUILD→GATE→SHIP flow, not a runtime
switch. This keeps the page's "0 KB new JS" property and honours ADR-026's two-faces rule
(Space Grotesk is **not** added).

### Delegation

`/how-it-works` keeps the conceptual token-pipeline narrative (with its code snippets
corrected to v2) and links to the style guide. The site nav label changes
**"Components" → "Design System"** (URL `/showcase/` unchanged).

## Consequences

### Positive

- One canonical, self-demonstrating reference that re-skins purely by editing `tokens/`.
- Documentation that cannot drift from the shipped system (token-driven + drift-guard tests).
- No new hydration; the zero-JS baseline holds.

### Negative

- A substantial one-time page rebuild and two new specimen components.
- Showcase e2e specs that asserted the old section list/title needed updating.

### Neutral

- The component gallery is unchanged — only regrouped under a Components section.

## Validation

- **Accuracy sweep**: the page contains no stale terms (`moonstone`, `Space Grotesk`,
  `Astro 5`, `--bg`, `15KB`); specimens emit only `hsl(var(--color-…))` / `text-*` utilities.
- **Token-driven proof**: a `PaletteBand` cell computes the live palette colour; a
  `TypeSpecimen` row renders in Geist at the token size; role chips flip with the theme.
- **Zero-JS**: the built page adds no new `client:` island.
- **Gate**: `pnpm quality:ci` + `pnpm design:validate` pass; CSS stays < 50KB.

## References

- [ADR-026: Font Strategy](./026-font-strategy.md)
- [ADR-047: Design Tokens v2](./047-design-tokens-v2-role-based-naming.md)
- [ADR-048: CSS-Native Motion System](./048-css-native-motion-system.md)
- `src/pages/showcase.astro`, `src/components/molecules/PaletteBand.astro`,
  `src/components/molecules/TypeSpecimen.astro`

---
**Date**: 2026-06-06\
**Participants**: Chris Pezza, template maintainers\
**Outcome**: Accepted
