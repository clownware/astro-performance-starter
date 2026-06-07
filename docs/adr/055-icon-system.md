---
title: 'ADR-055: Icon System — Lucide-aligned line family, one gradient per view'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Adopt a single Lucide-aligned line-icon family rendered through the existing
  Icon.astro path registry; forbid emoji as UI iconography; preserve the
  one-gradient-per-view restraint established on /showcase.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Before this decision, the site mixed visual languages: the `/showcase/` page used a
refined `✦` brand mark, monochrome eyebrow labels, and dot badges; the homepage
used 32+ emoji glyphs as UI icons (🚀🤖🎨⚡🧩🏗️ feature cards, 🎯 section
headings, 🔒⚡🤖 footer); About used 👋; ProjectCard used 🚀 and 📁; how-it-works
decorated section cards with 📋📐🧭. Emoji-as-icons is the loudest "generic
template" signal a themes-directory visitor reads — and it broke the cold-minimal
language Showcase already proves.

Two non-emoji icons already existed in `Icon.astro` (github, arrow-down/right,
external-link) as inline path `d` strings. The component was the natural seam
to extend; a parallel system (icon font, SVG sprite, runtime library) would have
fragmented the family without solving the actual problem.

The submission window for astro.build/themes is the trigger: the directory
listing links straight to the homepage, so first-impression iconography gets
judged with the same weight as architecture.

## Decision Drivers

- **Visual coherence**: One icon family across every surface, matching the
  cold-minimal Showcase voice (restraint, then one bright move).
- **Zero-JS preservation**: No runtime icon library; SSR-inlined SVG only.
- **Dep posture**: The project keeps a tight dep tree (~12 prod deps); adding
  `lucide` + `@iconify-json/lucide` or `astro-icon` would meaningfully widen it.
- **ADR-049 alignment**: Showcase is the living style guide. Iconography is a
  token-driven, CSS-native concern; the registry must compose with the existing
  CSS variable system (`currentColor` propagation).
- **Reuse over abstraction**: `Icon.astro` already encoded the contract;
  extending it beats introducing a parallel mechanism.

## Considered Options

### Option 1: `astro-icon` + `@iconify-json/lucide`

**Description**: Build-time integration that inlines tree-shaken SVG from the
Iconify JSON pack.

**Pros**:

- Lucide fidelity guaranteed; no hand-translation risk.
- Zero runtime payload (build-time inliner).
- Mature, well-maintained, widely adopted in the Astro ecosystem.

**Cons**:

- Adds 2 dev dependencies; `@iconify-json/lucide` is ~5MB in `node_modules`.
- Introduces a parallel component (`<Icon collection="lucide" name="zap" />`)
  alongside the existing `Icon.astro` — two ways to do the same thing.
- The plan's preferred path (paste-as-SVG) keeps the existing pattern.

### Option 2: Drop currentColor SVGs into `src/icons/` and refactor `Icon.astro` to load via `?raw`

**Description**: Each glyph lives as a standalone SVG file; the registry loads
content via Vite's `?raw` import suffix.

**Pros**:

- File-per-icon is editor-friendly (preview in IDE).
- Trivial to add a new icon without touching the component.

**Cons**:

- Two patterns to maintain: the existing inline `d`-string registry for github
  et al., plus the new file-based loader.
- Sourcing Lucide-faithful SVGs still requires either the npm package or
  hand-translation — does not solve the fidelity question.

### Option 3: Extend the existing `Icon.astro` path-registry in place (CHOSEN)

**Description**: Add Lucide-aligned line icons as inline path `d` strings to the
existing registry. Single multi-subpath `d` per icon covers shapes that would
need multiple nodes (e.g. `bot` eyes). All new icons are stroke paths
(stroke-width 2, round line-cap/line-join, `currentColor`).

**Pros**:

- Zero new dependencies; node_modules unchanged.
- One pattern, one component, one source of truth.
- Type-safe icon names via a shared `IconName` union exported from
  `src/types/icons.ts`; component contracts (`Feature.icon`, `LighthouseMetric.icon`)
  reference it directly.
- Matches the existing convention used by github, arrow-down, arrow-right,
  external-link.

**Cons**:

- Hand-crafted Lucide-aligned paths are not pixel-for-pixel identical to the
  upstream Lucide SVGs. Visual family is consistent; precise glyph shapes may
  differ.
- Adding a new icon requires editing one component file rather than dropping a
  file in a folder.

## Decision

We will go with **Option 3** — extend `Icon.astro`'s path registry with
Lucide-aligned line icons.

Initial curated set (under twenty):

- Feature cards: `zap`, `bot`, `palette`, `gauge`, `puzzle`, `layers`
- Metrics: `accessibility`, `shield-check`, `search`
- Utility: `check`, `target`, `wrench`, `lock`, `book-open`
- Pre-existing: `github`, `arrow-down`, `arrow-right`, `external-link`

### Implementation Details

- `IconName` union lives in `src/types/icons.ts` (single source of truth).
- `Icon.astro` imports `IconName` and renders one `<path>` element with
  `currentColor` stroke + width 2 + round join/cap.
- `Feature.icon` and `LighthouseMetric.icon` in `src/types/content.ts` use
  `IconName` (was `string`), making the data → render pipeline strictly typed.
- Emoji are forbidden as UI iconography. Exceptions:
  - The `✦` brand mark on `/showcase/` (intentional, retained).
  - Typographic check/cross marks (`✓`, `⚠`) used as aria-hidden bullets and
    form-state indicators — these are text, not icons.
  - Emoji inside code-example string templates (e.g. `# ✓ format` shown as
    literal CLI output on how-it-works) — content, not UI.

### One-gradient-per-view rule

The violet→rose OKLCH gradient is the single bright move per view; icons stay
monochrome (`currentColor` inheriting from a neutral foreground or the
`text-primary-*` palette in feature/metric contexts). This preserves the
"restraint, then one bright move" thesis established on `/showcase/` and
codified by ADR-049.

## Consequences

### Positive

- One coherent visual language across the site; submission-grade first
  impression for astro.build/themes.
- Type-safe icon name pipeline (compile-time errors if a data array references
  an unregistered icon).
- Bundle delta: negligible (~150–300 bytes per icon, only used icons are
  inlined). No runtime JS.
- Adding icons is a single-file edit with a typed contract.

### Negative

- Hand-crafted paths may drift from upstream Lucide if Lucide updates a glyph
  shape; the registry needs occasional sync.
- Multi-element Lucide icons (those with circles or multiple paths) are
  approximated with multi-subpath `d` strings; pixel-level fidelity is not
  guaranteed.

### Neutral

- ProjectCard, ExpandableFeatureCard, Footer, About, projects/index, and
  how-it-works all rewritten to consume the registry or to drop decorative
  emoji entirely.
- Pre-existing typography marks (`✓`, `⚠`, `•`, `▸`) remain as text.

## Validation

- **Metric 1**: `rg -P "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/pages/
  src/components/` returns only intentional brand glyphs (`✦` on showcase) and
  typography marks.
- **Metric 2**: `Icon.astro` registry has exactly one source of truth (the
  inline `icons` Record); no parallel icon component exists.
- **Metric 3**: `pnpm check` and `pnpm lint` exit zero on the icon system
  files. `Feature.icon` mis-typing is a TypeScript error, not a runtime fault.
- **Metric 4**: Build budget unchanged (icon bytes counted under the existing
  SVG budget; no new chunk).

## References

- [ADR-049](049-showcase-living-style-guide.md) — Showcase as the living style
  guide; iconography decisions defer to its visual language.
- [ADR-048](048-css-native-motion-system.md) — `hero-grad` view-transition
  contract; icons are static, never gradient-animated.
- [Lucide upstream](https://lucide.dev) — visual reference for the line-icon
  family this registry aligns with.

## Notes

The plan's first-stated alternative ("Install `lucide` + `@iconify-json/lucide`")
was explored and rejected in favour of the in-place extension. The dep cost
exceeded the marginal fidelity gain for a starter template at this scale
(~17 icons total). Re-evaluate if the curated set grows past ~30 glyphs or if
upstream Lucide changes meaningfully affect visual recognition.

---
**Date**: 2026-06-07\
**Participants**: Pulci Nella (demo persona maintainer), template author\
**Outcome**: Accepted
