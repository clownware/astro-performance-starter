---
title: 'ADR-025: Tailwind CSS v4 Migration Strategy'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to remain on Tailwind CSS v3 and defines the trigger
  criteria and migration path for a future v4 upgrade. Supersedes ADR-002.
tableOfContents: true
pagefind: true
---

## Status

Accepted — supersedes [ADR-002: Future CSS Tooling Considerations](./002-future-css-tooling-considerations.md)

## Context

Tailwind CSS v4 was released in early 2025 and introduces a fundamentally different configuration model. Rather than a `tailwind.config.ts` file, v4 uses a CSS-native `@theme` block inside a `.css` file. This is a breaking change for this project because:

1. **The `@astrojs/tailwind` integration is deprecated** for v4. The official path is the `@tailwindcss/vite` plugin.
2. **The entire design token pipeline breaks.** The current system generates `tokens/dist/tailwind-tokens.json`, which is imported by `tailwind.config.ts` via a `transformTokens()` function. This file and function have no equivalent in v4's CSS-native config.
3. **`tailwind.config.ts` itself does not exist in v4.** All theme extensions (`colors`, `spacing`, `borderRadius`, `boxShadow`, `typography` overrides) would need to be rewritten as `@theme` CSS blocks.
4. **The `@tailwindcss/typography` plugin** has a v4-compatible version but requires updated configuration syntax.

Several docs in the project incorrectly claimed Tailwind v4 was already in use. This ADR corrects the record and defines the path forward.

## Decision Drivers

- **Token pipeline integrity**: The JSON → CSS vars → Tailwind config pipeline is a core feature of the design system. It must not be broken by a version bump.
- **Stability**: v4 is still maturing. The `@astrojs/tailwind` deprecation notice appeared in Astro docs in early 2025; the ecosystem (plugins, IDE tooling, community patterns) is still catching up.
- **Migration cost**: Rewriting `tailwind.config.ts`, `build-tokens.ts`, and all `@theme` blocks is a significant effort that warrants a dedicated migration sprint, not an incidental upgrade.
- **No functional gap**: v3 fully satisfies current requirements. There is no feature in v4 that the project currently needs.

## Considered Options

### Option 1: Migrate to Tailwind v4 now

**Pros**:

- Modern tooling, CSS-native config
- `@astrojs/tailwind` deprecation resolved
- Smaller CSS output in some cases

**Cons**:

- Requires complete rewrite of `tailwind.config.ts`
- Requires rewrite of `scripts/src/build-tokens.ts` to emit `@theme` CSS blocks instead of JSON
- Requires replacing `@astrojs/tailwind` integration with `@tailwindcss/vite` plugin in `astro.config.mjs`
- Requires updating all `tailwindcss-themer` usage (or removing it — v4 has built-in theme support)
- High risk of regressions across the design system

### Option 2: Stay on Tailwind v3, document migration path (chosen)

**Pros**:

- Zero disruption to current design token pipeline
- Stable, well-tested configuration
- Migration can be planned and executed as a focused effort

**Cons**:

- `@astrojs/tailwind` is deprecated (but still functional for v3)
- Not on the latest version

## Decision

**Stay on Tailwind CSS v3.x.** The project will migrate to v4 when all of the following conditions are met:

1. A v4-compatible token build pipeline is designed and tested (emitting `@theme` CSS blocks from `tokens/base.json` and `tokens/semantic.json`)
2. `@tailwindcss/typography` v4 compatibility is confirmed
3. A migration branch has been validated against the full component library with no visual regressions
4. The `tailwindcss-themer` dependency is either replaced or confirmed compatible

## Migration Path (When Ready)

The migration will require these steps in order:

1. **Rewrite `build-tokens.ts`** — output `@theme {}` CSS block instead of `tailwind-tokens.json`
2. **Replace integration** — swap `@astrojs/tailwind` for `@tailwindcss/vite` in `astro.config.mjs`
3. **Delete `tailwind.config.ts`** — move all `extend` values into the generated `@theme` block
4. **Update `src/styles/global.css`** — replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
5. **Audit typography plugin** — update prose CSS variable overrides to v4 syntax
6. **Visual regression test** — run Playwright snapshots against all pages before merging

## Consequences

### Positive

- No disruption to current workflows
- Decision is clearly documented, preventing ad-hoc upgrade attempts
- Migration path is defined and actionable

### Negative

- `@astrojs/tailwind` is deprecated; if Astro drops v3 support in a future release, the timeline accelerates
- Project cannot use v4-only features (cascade layers, `@starting-style`, etc.)

### Neutral

- All documentation now correctly states Tailwind v3.x
- ADR-002 is superseded by this record

## Validation

- **Trigger**: Re-evaluate if `@astrojs/tailwind` stops working with a new Astro major version
- **Trigger**: Re-evaluate if a v4 feature is required for a planned feature
- **Review cadence**: Quarterly, per ADR-006

## References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Astro Tailwind Integration Docs](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — notes `@astrojs/tailwind` deprecated for v4
- [Astro 5.2 Release Notes](https://astro.build/blog/astro-520/) — Tailwind v4 support via Vite plugin
- [ADR-002: Future CSS Tooling Considerations](./002-future-css-tooling-considerations.md) — superseded
- [ADR-000: Starter Template Architecture](./000-starter-decisions.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
