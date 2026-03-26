---
title: 'ADR-028: Prefetch Strategy — @astrojs/prefetch'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to include @astrojs/prefetch in the base template,
  its performance trade-offs, and configuration defaults.
tableOfContents: true
pagefind: true
---

## Status

Superseded — `@astrojs/prefetch` was deprecated in Astro 3.5 and removed in Astro 4.0. The project now uses Astro's built-in `prefetch: true` config option in `astro.config.mjs`, which provides equivalent hover/focus-based prefetching natively. See [Astro Prefetch Guide](https://docs.astro.build/en/guides/prefetch/) for the current approach.

## Context

The starter includes `@astrojs/prefetch` in `astro.config.mjs`. This integration adds a small JavaScript snippet (~1KB) that prefetches pages when a user hovers over or focuses an internal link, making subsequent navigations feel instant.

This is an undocumented addition that adds JavaScript to every page — a tension with the zero-JS philosophy. This ADR justifies the inclusion and defines the configuration defaults.

## Decision Drivers

- **Perceived performance**: Prefetching eliminates the network round-trip on navigation, making the site feel faster even when Lighthouse scores are already high
- **JS budget**: The addition must be minimal — under 2KB gzipped
- **Zero-JS philosophy**: Any JavaScript addition requires explicit justification (per ADR-001 pattern)
- **Progressive enhancement**: Prefetching is purely additive — pages load correctly without it
- **Works with View Transitions**: Prefetch + ClientRouter (ADR-009) together produce near-instant navigation

## Considered Options

### Option 1: No prefetching

**Pros**:

- Strictly zero JavaScript for navigation
- No speculative network requests

**Cons**:

- Full network round-trip on every navigation
- Noticeably slower perceived performance on multi-page sites
- Wastes the benefit of static hosting (files are already on CDN edge)

### Option 2: `@astrojs/prefetch` with `intentSelector` (hover/focus) — chosen

**Pros**:

- Prefetch only triggers on user intent (hover/focus), not on page load
- No wasted bandwidth for links the user never clicks
- ~1KB gzipped — negligible JS budget impact
- Works automatically with all `<a>` tags pointing to internal routes

**Cons**:

- Adds JavaScript to every page
- Hover-based prefetch doesn't help on touch-only devices (touch triggers click, not hover)

### Option 3: `<link rel="prefetch">` in `<head>` (manual)

**Pros**:

- No JavaScript at all — pure HTML hint
- Browser decides whether to act on it

**Cons**:

- Must be manually added per page
- No dynamic intent detection
- Prefetches unconditionally on page load (wastes bandwidth)

### Option 4: Speculation Rules API

**Pros**:

- Native browser API, no JavaScript library
- Supports prerendering (not just prefetching)

**Cons**:

- Chrome-only as of 2026 — not cross-browser
- Prerendering has privacy implications (executes page JS before user navigates)
- Not yet suitable as a default

## Decision

**Keep `@astrojs/prefetch`** with default `intentSelector` behaviour (hover + focus triggers prefetch).

The ~1KB cost is justified by the significant perceived performance improvement on multi-page navigation. This is consistent with the ADR-009 decision to include ClientRouter (~2-3KB) for the same reason: small, justified JS additions that improve perceived performance are acceptable when they degrade gracefully.

### Configuration

```js
// astro.config.mjs
import prefetch from '@astrojs/prefetch';

export default defineConfig({
  integrations: [
    prefetch(), // defaults: intentSelector triggers on hover/focus
  ],
});
```

No custom configuration is needed. The default behaviour is correct for this use case.

### Touch Device Consideration

On touch devices, hover events don't fire before click. Prefetch therefore provides no benefit on touch-only interactions. This is acceptable — the site loads correctly without prefetch, and touch users on fast connections won't notice the difference. Touch users on slow connections benefit from the static CDN delivery regardless.

## Consequences

### Positive

- Near-instant navigation when combined with ClientRouter (ADR-009)
- Zero configuration required
- Gracefully degrades — pages work without it

### Negative

- Adds ~1KB JavaScript to every page
- No benefit on touch-only devices
- Speculative network requests may be unwanted on metered connections (mitigated by intent-based triggering)

### Neutral

- Total JavaScript from prefetch + ClientRouter: ~4KB gzipped — well within the 160KB budget
- Speculation Rules API should be re-evaluated when cross-browser support improves

## Validation

- **Bundle size**: `@astrojs/prefetch` contribution must remain under 2KB gzipped
- **Lighthouse**: No regression in Performance score from prefetch script
- **Network tab**: Prefetch requests only fire on hover/focus, not on page load

## References

- [@astrojs/prefetch Documentation](https://docs.astro.build/en/guides/prefetch/)
- [Speculation Rules API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)
- [ADR-009: ClientRouter and View Transitions](./009-client-router-view-transitions.md)
- [ADR-001: Preact Island Usage Policy](./001-preact-island-usage-policy.md) — JS justification pattern

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Superseded (replaced by built-in `prefetch: true` config)
