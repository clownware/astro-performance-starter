---
title: 'ADR-026: Font Strategy — Self-Hosted Variable Fonts via @fontsource'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to self-host Inter as a variable font via @fontsource,
  covering the rationale over Google Fonts, subsetting approach, and loading strategy.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Typography is one of the most common first customisations users make to this starter. The font loading strategy has direct implications for:

- **Performance**: Font files are a common source of render-blocking and layout shift (CLS)
- **Privacy**: Google Fonts makes third-party requests that may violate GDPR/privacy regulations
- **Reliability**: External font CDNs introduce a network dependency
- **Core Web Vitals**: Poor font loading causes CLS and LCP regressions

The project ships with Inter as the default typeface. This ADR documents why and how.

## Decision Drivers

- **Zero CLS**: Fonts must not cause layout shift — `font-display: swap` with preloading is required
- **Privacy-first**: No third-party requests at runtime by default
- **Performance budget**: Font files must not meaningfully impact LCP
- **Variable fonts preferred**: Single file covers all weights, reducing HTTP requests
- **Self-contained**: The starter must work offline and without external dependencies

## Considered Options

### Option 1: Google Fonts (remote)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
```

**Pros**:

- Zero setup, widely known
- Automatic subsetting by Google

**Cons**:

- Third-party DNS lookup + connection on every page load (~100-300ms on cold connections)
- GDPR/privacy concerns — IP addresses sent to Google
- Requires internet connection during development
- No control over file format or caching headers
- Google Fonts deprecated direct WOFF2 variable font URLs in 2023

### Option 2: Manual self-hosting (download and commit font files)

**Pros**:

- Full control over files
- No npm dependency

**Cons**:

- Manual update process when font versions change
- Files committed to git (repo bloat)
- No automatic subsetting tooling

### Option 3: `@fontsource` npm packages (chosen)

```bash
pnpm add @fontsource-variable/inter
```

```astro
import '@fontsource-variable/inter';
```

**Pros**:

- Fonts versioned alongside code in `package.json`
- WOFF2 variable font files served from `node_modules`, copied to `dist/` at build time
- No third-party runtime requests
- Automatic updates via `pnpm update`
- Consistent with npm ecosystem tooling

**Cons**:

- Adds to `node_modules` size (not shipped to production)
- Requires understanding of `@fontsource` package naming convention

## Decision

**Use `@fontsource-variable/inter`** for the default typeface with the following implementation:

### Why Inter

- Designed for screen readability at all sizes
- Excellent Latin character coverage
- Variable font available (single file, all weights)
- Widely used in developer tooling and SaaS products — familiar to the target audience
- Permissive SIL Open Font License

### Loading Strategy

Fonts are preloaded in `BaseLayout.astro` / `Head.astro` to eliminate render-blocking:

```astro
---
import '@fontsource-variable/inter/wght.css';
---
```

The variable font (`wght` axis) covers weights 100–900 in a single ~95KB WOFF2 file. This is preferable to loading multiple static weight files.

### CSS Variable Integration

The font family is exposed as a design token CSS variable:

```css
:root {
  --font-sans: 'Inter Variable', system-ui, sans-serif;
}
```

This allows users to swap the font by changing a single token value without hunting through component files.

### Replacing the Default Font

Users who want a different font should:

1. Remove `@fontsource-variable/inter` from `package.json`
2. Install their chosen `@fontsource` package (e.g. `pnpm add @fontsource-variable/geist`)
3. Update the import in `BaseLayout.astro`
4. Update `--font-sans` in `tokens/base.json`
5. Run `pnpm run tokens:build`

## Consequences

### Positive

- Zero third-party font requests — privacy compliant by default
- Fonts versioned in `package.json` — reproducible builds
- Variable font = single HTTP request for all weights
- Works offline and in CI without network access

### Negative

- Users unfamiliar with `@fontsource` may not know how to swap fonts
- Variable font file (~95KB uncompressed) is larger than a single static weight (~20KB) — acceptable trade-off for covering all weights

### Neutral

- Font subsetting is not applied by default. Users with non-Latin character requirements should subset manually or use a service like `glyphhanger`
- `font-display: swap` is set by `@fontsource` by default, which is correct for this use case

## Validation

- **CLS**: Cumulative Layout Shift must remain < 0.05 with fonts loaded
- **No external requests**: Verified via network tab — zero requests to fonts.googleapis.com or fonts.gstatic.com
- **Lighthouse**: Font loading must not appear in "Eliminate render-blocking resources" audit

## References

- [@fontsource documentation](https://fontsource.org/docs/getting-started)
- [Inter typeface](https://rsms.me/inter/)
- [Google Fonts privacy concerns (GDPR)](https://www.cookieyes.com/blog/google-fonts-gdpr/)
- [ADR-000: Starter Template Architecture](./000-starter-decisions.md)
- [ADR-020: Page Performance Patterns](./020-page-performance-patterns.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
