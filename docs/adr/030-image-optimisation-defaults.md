---
title: 'ADR-030: Image Optimisation Defaults'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the non-obvious image optimisation configuration choices in
  astro.config.mjs — Sharp service, constrained layout, AVIF/WebP output,
  and the pixel limit rationale.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Astro's built-in `<Image />` component uses Sharp for image processing and supports multiple output formats, layout modes, and responsive srcset generation. The starter ships with specific defaults in `astro.config.mjs` that are non-obvious to users:

```js
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      limitInputPixels: 268402689, // ~16K x 16K pixels
    },
  },
  responsive: {
    globalStyles: true,
    layout: 'constrained',
  },
  domains: [],
  remotePatterns: [],
},
```

These choices affect performance, CLS, and how images behave in layouts. Without documentation, users encounter unexpected behaviour when adding large images or changing layouts.

## Decision Drivers

- **CLS prevention**: Images must have explicit dimensions to prevent layout shift
- **Format efficiency**: AVIF > WebP > JPEG for compression ratio
- **Responsive by default**: Images should serve appropriately sized files to all devices
- **Security**: Remote image domains must be explicitly allowlisted
- **Large image support**: Some use cases (photography portfolios, high-res artwork) need to process very large source files

## Decisions

### Sharp as the Image Service

Sharp is the only production-ready image processing service for Astro's static output mode. The alternative (`@astrojs/image` with Squoosh) is deprecated. Sharp is explicitly configured rather than relying on Astro's auto-detection to ensure consistent behaviour across environments.

### `limitInputPixels: 268402689` (~16K × 16K)

Sharp's default pixel limit is ~268 megapixels (16,384 × 16,384). This is explicitly set rather than left as a default to:

1. **Document the limit** — users adding very large source images (photography, scanned artwork) will hit this limit and need to know it exists
2. **Prevent silent failures** — Sharp throws an error rather than silently producing a corrupt output when the limit is exceeded
3. **Allow override** — users with legitimate large-image needs can increase this value in `astro.config.mjs`

For typical web content (photos up to ~6000×4000px from modern cameras), this limit is never reached.

### `layout: 'constrained'`

Astro's responsive image layouts:

| Layout | Behaviour | Use case |
|--------|-----------|----------|
| `fixed` | Exact pixel dimensions, no scaling | Icons, logos |
| `constrained` | Scales down to fit container, never scales up | **Most content images** |
| `full-width` | Stretches to fill container width | Hero images, banners |

**`constrained` is the correct default** because:

- It prevents images from rendering larger than their intrinsic size (no blurry upscaling)
- It respects container width constraints
- It generates a `srcset` with multiple sizes for responsive delivery
- It sets explicit `width` and `height` attributes, preventing CLS

Users who need full-width hero images should pass `layout="full-width"` explicitly on those components.

### `globalStyles: true`

This injects a small CSS snippet that applies `max-width: 100%` and `height: auto` to all Astro-processed images globally. Without this, images may overflow their containers on narrow viewports.

**Why global rather than per-component?** The alternative is adding `class="w-full h-auto"` to every `<Image />` usage. Global styles are less error-prone and consistent with how browsers handle `<img>` elements by default.

### Output Formats: AVIF + WebP

Astro generates AVIF and WebP variants automatically when Sharp is configured. The `<picture>` element serves the most efficient format the browser supports:

```
AVIF  → ~50% smaller than JPEG
WebP  → ~30% smaller than JPEG
JPEG  → fallback for older browsers
```

No explicit format configuration is needed — Astro handles format selection automatically based on the source image type and browser support.

### `domains: []` and `remotePatterns: []`

Remote image optimisation is disabled by default. Users must explicitly allowlist external image domains. This is a security decision — processing arbitrary remote URLs would allow SSRF-style attacks if the site ever processes user-provided URLs.

To enable remote images from a specific domain:

```js
image: {
  domains: ['images.unsplash.com'],
  // or use remotePatterns for wildcard matching
}
```

## Consequences

### Positive

- Images are responsive and CLS-free by default
- AVIF/WebP output reduces image payload significantly
- Explicit pixel limit prevents silent failures with large source files
- Remote image processing is secure by default (opt-in allowlist)

### Negative

- `constrained` layout may surprise users who expect images to fill their container — they must use `layout="full-width"` explicitly
- `globalStyles: true` adds a small CSS injection that users cannot easily override per-image
- Very large source images (>16K×16K) require increasing `limitInputPixels`

### Neutral

- Sharp must be installed as a dependency — it is listed in `dependencies` (not `devDependencies`) because Astro's image service requires it at build time in CI environments
- Image optimisation only runs during `pnpm run build`, not in `pnpm run dev` (dev serves originals for speed)

## Validation

- **CLS**: All images must have explicit `width` and `height` — verified via Lighthouse CLS audit
- **Format delivery**: Network tab must show AVIF or WebP responses in supporting browsers
- **No layout overflow**: Images must not exceed their container width on any viewport

## References

- [Astro Image Documentation](https://docs.astro.build/en/guides/images/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Core Web Vitals: CLS](https://web.dev/cls/)
- [ADR-020: Page Performance Patterns](./020-page-performance-patterns.md)
- [Performance Budgets](../implementation-guides/reference/budgets-guardrails.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
