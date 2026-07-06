---
title: 'ADR-048: CSS-Native Motion System'
lastUpdated: 2026-06-06T00:00:00.000Z
description: >-
  Adopts a seven-technique motion system that is CSS-native, compositor-cheap,
  and gated behind prefers-reduced-motion. The entire JavaScript surface is one
  optional client:idle island (the cursor spotlight).
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-07-05 by [ADR-060](./060-showcase-interactive-demo-islands.md):
the cursor spotlight ships as an Astro atom with a deferred module script rather than a
`client:idle` island, and the showcase hosts two sanctioned demo islands — MotionLab and
SignalsCounter — outside this ADR's "no other component hydrates for motion" budget)

## Context

The v2 design language (ADR-047) calls for "restraint, then one bright move" — a
near-monochrome dark surface with a small set of deliberate motions. We need a motion
system that delivers that polish without violating the starter's performance and zero-JS
philosophy (Constitution rules 2 and 7: `client:load` forbidden, prefer CSS over JS).

Modern CSS makes most of this achievable with no JavaScript at all: cross-document
`@view-transition`, scroll-driven `animation-timeline: view()`, registered
`@property <angle>` for animatable gradients, and clip-text sweeps. Only one technique
(a pointer-tracking spotlight) genuinely needs JS.

## Decision Drivers

- **Zero-JS baseline**: motion must not regress the no-JS rendering path
- **Compositor-only**: animations touch `transform`, `opacity`, `background-position`, or a
  registered `<angle>` — never layout-triggering properties
- **Accessibility**: every animation gated behind `prefers-reduced-motion: no-preference`
  with a meaningful resting state
- **Bounded decoration**: a hard cap on looping/decorative motion so the page never strobes
- **Token alignment**: durations and easings map 1:1 to the existing `motion.duration` /
  `motion.ease` tokens in `base.json`

## Considered Options

### Option 1: JS animation library (Framer Motion / GSAP)

**Pros**: Rich API, easy orchestration

**Cons**: Ships KBs of JS and forces hydration; violates the zero-JS baseline; main-thread
cost; overkill for seven small effects

### Option 2: CSS-native, one optional island (chosen)

**Description**: Six techniques are 100% CSS; one (cursor spotlight) is a ~0.4KB
`client:idle` island that only feeds two CSS variables. All gated behind
`prefers-reduced-motion`.

**Pros**:

- No hydration except one tiny opt-in island
- Compositor-only — no main-thread jank
- Degrades to sensible static states under reduced motion / no JS

**Cons**:

- Some techniques need newer browser support (`@view-transition`, `animation-timeline`) —
  acceptable because each degrades to a static fallback

### Option 3: No motion

**Pros**: Simplest, cheapest

**Cons**: Forgoes the design language's single expressive differentiator

## Decision

**Adopt the seven-technique CSS-native system (Option 2).**

| # | Technique | Cost | JS |
| --- | --- | --- | --- |
| 1 | Page transitions — `@view-transition { navigation: auto }` | Compositor | none |
| 2 | Headline gradient morph — shared `view-transition-name: hero-grad` | Compositor | none |
| 3 | Scroll reveals — `animation-timeline: view()` (via the existing `ScrollReveal` component) | Compositor | none |
| 4 | Conic glow border — registered `@property --glow-ang` | Low paint | none |
| 5 | Text sheen / CTA shimmer — clip-text + skewed bar | Compositor | none |
| 6 | Grain overlay — fixed `feTurbulence` SVG at ~5% | 1 static layer | none |
| 7 | Cursor spotlight — pointer-tracked radial glow | Compositor | 1 island |

### Budget and gating contract

- **JS budget**: exactly one optional JS surface (cursor spotlight), rAF-throttled,
  writing only `--mx` / `--my`. No other component hydrates for motion. *(Amended: shipped
  as a deferred module `<script>` in the `CursorSpotlight` atom — same deferral and no-JS
  fallback, no hydration runtime. The showcase's MotionLab island controls a CSS animation
  and is sanctioned separately by [ADR-060](./060-showcase-interactive-demo-islands.md).)*
- **Decorative-loop cap**: one conic glow border per view + two slow sheen loops; all
  pausable; nothing strobes.
- **Reduced motion**: every keyframe block sits inside
  `@media (prefers-reduced-motion: no-preference)`. With reduced motion on, elements render
  at their resting state (gradients hold a static position, reveals are fully visible, the
  spotlight shows a static centered glow, grain is unaffected because it never moves).
- **Token mapping**: durations/easings reference `--duration-*` / `--ease-*` (from
  `motion.duration` / `motion.ease`); no new motion tokens are introduced.

## Consequences

### Positive

- Premium motion with effectively zero JS
- No layout thrash; all effects compositor-cheap
- Accessible by contract — gated with real resting states

### Negative

- Relies on newer CSS features; older browsers get the static fallback (acceptable)
- The grain SVG adds ~3KB inline (cached once)

### Neutral

- The cursor spotlight is opt-in per page; pages that don't include it pay nothing

## Validation

- **JS surface**: bundle analysis shows no new hydrated component except the single
  `client:idle` spotlight island; `pnpm perf:budgets` stays within the JS budget
- **Reduced motion**: toggling OS reduced-motion settles every loop to its resting state
- **No layout jank**: animations are limited to compositor properties (manual DevTools check)
- **CSS budget**: total CSS (incl. motion) stays < 50KB

## References

- `docs/2026-06_design_system/Astro Starter - Motion System.html` — the seven techniques
- [ADR-001: Hydration Strategy](./001-hydration-strategy.md) — `client:load` restriction
- [ADR-047: Design Tokens v2](./047-design-tokens-v2-role-based-naming.md)

## Notes

The headline gradient morph (technique 2) uses the **Variant B (OKLCH longer-hue)** sweep
selected for this starter.

---
**Date**: 2026-06-06\
**Participants**: Chris Pezza, template maintainers\
**Outcome**: Accepted
