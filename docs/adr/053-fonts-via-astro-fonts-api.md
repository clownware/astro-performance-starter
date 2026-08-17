---
title: 'ADR-053: Fonts via the Astro 6 Fonts API'
lastUpdated: 2026-06-07T00:00:00.000Z
description: >-
  Supersedes ADR-026. Delivers self-hosted Geist (display) + Inter (body) via
  Astro 6's native Fonts API with local providers and vendored woff2, adding
  metric-adjusted fallback faces to cut CLS.
tableOfContents: true
pagefind: true
---

## Status

Accepted (supersedes [ADR-026](./026-font-strategy.md))

## Context

ADR-026 self-hosted Geist + Inter via the `@fontsource-variable/*` packages and a
hand-written inline `@font-face` block in `Head.astro` (latin subset, `swap`,
variable 100–900, two `<link rel=preload>`s). It was strong, but it carried two
npm dependencies and — more importantly — its system fallback (`sans-serif`) was
**not metric-matched** to the webfonts, so the swap from fallback to webface
could shift layout.

Astro 6 ships a stable, top-level Fonts API (`fonts:` config + `<Font>` from
`astro:assets`) that self-hosts fonts, fingerprints them, and **auto-generates
metric-adjusted fallback faces** (`size-adjust` / `ascent-override` /
`descent-override`) — directly addressing the CLS gap.

## Decision

Adopt the Astro 6 Fonts API with **local providers** and **vendored woff2**.

### Local provider, vendored files (not a remote provider)

The two latin variable woff2 files are vendored in `src/assets/fonts/`
(`geist-latin-variable.woff2`, `inter-latin-variable.woff2`, with OFL license
text alongside). Each font is registered with `fontProviders.local()` and a
single variant (`weight: "100 900"`, `style: "normal"`).

This was chosen over the built-in `fontProviders.fontsource()` / `google()`
remote providers deliberately: a remote provider downloads fonts from a
third-party API **at build time**, which the previous setup never did. Vendoring
keeps builds **fully offline and reproducible** — no build-time network
dependency, the same property `@fontsource` (node_modules) gave, minus the npm
dependency.

### Wiring

- `<Font cssVariable="--font-geist" preload />` and `--font-inter` in `Head.astro`
  replace the manual imports, preloads, and inline `@font-face` block. Both faces
  preload (Geist is the LCP element on most pages; Inter is body).
- `global.css` `@theme` sources `--font-display: var(--font-geist)` and
  `--font-text: var(--font-inter)` — these generated vars carry the family **plus
  the metric-adjusted fallback chain**, so the CLS benefit reaches every element.
- Family names stay `Geist` / `Inter` (matching `tokens/base.json` `fontFamily`,
  which still documents the intended stack and is asserted by the design-token
  tests). Astro fingerprints the actual `@font-face` family names internally.

## Consequences

- **Positive:** metric-adjusted fallbacks cut CLS (verified CLS = 0 on home +
  blog post, perf 99); two fewer npm deps; less manual font wiring; still
  self-hosted, latin-subset, `swap`, variable, offline-reproducible.
- **Negative:** the woff2 binaries are vendored in the repo (~29KB + ~48KB) and
  must be refreshed manually if the upstream faces change (rare). The
  `tokens.css` `--font-family-*` vars are now vestigial (superseded by the Fonts
  API vars) but kept since the design tokens still document the stack.
- **For cloners:** swap fonts by replacing the files in `src/assets/fonts/` and
  the `name`/`src` in the `fonts:` config, or switch to a remote provider
  (`fontProviders.google()` etc.) if a build-time fetch is acceptable.

## Validation

- `pnpm build` emits fingerprinted woff2 + metric-adjusted `@font-face` fallbacks.
- Lighthouse: CLS 0, perf 99 on `/` and a blog post (no LCP regression).
- `document.fonts` confirms Geist (h1) and Inter (body) load and apply.
- `pnpm quality:ci` green.

## References

- [ADR-026: Font Strategy (superseded)](./026-font-strategy.md)
- [ADR-020: Page Performance Patterns](./020-page-performance-patterns.md)
- [ADR-051: CSP](./051-content-security-policy-strategy.md) — why the inline `@font-face` block (a CSP friction point) is now gone
- `astro.config.mjs` (`fonts`), `src/components/molecules/Head.astro`, `src/styles/global.css`, `src/assets/fonts/`
- [Astro Fonts API](https://docs.astro.build/en/reference/configuration-reference/#fonts)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: the vendored variable woff2 files and their OFL licenses exist in `src/assets/fonts/`.
  - TC-2: no `@fontsource/*` package is a dependency.
  - TC-3: no page exceeds the font preload budget.
- **Checks:**
  - TC-1, TC-2 → check `fonts-vendored` (status: **warn**)
  - TC-3 → `fonts:gate` in CI (status: **block**, pre-existing gate) — see ADR-058
- **Not machine-checkable:** font pairing and preload composition judgment beyond the numeric cap.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2026-06-07\
**Participants**: Template maintainers\
**Outcome**: Accepted — fonts delivered via the Astro 6 Fonts API; ADR-026 superseded
