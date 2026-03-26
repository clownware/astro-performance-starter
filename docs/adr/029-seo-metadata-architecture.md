---
title: 'ADR-029: SEO and Metadata Architecture'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the decision to extract all <head> metadata into a dedicated Head
  molecule, the structured data strategy, canonical URL generation, and OG/Twitter
  card implementation.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Every page needs consistent `<head>` metadata: `<title>`, `<meta description>`, Open Graph tags, Twitter cards, canonical URLs, and optionally JSON-LD structured data. The implementation approach has significant implications for:

- **SEO correctness**: Missing or duplicate canonical URLs, incorrect OG tags
- **Maintainability**: Metadata logic scattered across layouts vs centralised
- **Type safety**: Untyped prop passing vs validated interfaces
- **Extensibility**: How easily pages can override defaults

This ADR documents the chosen architecture and the reasoning behind each decision.

## Decision Drivers

- **Single source of truth**: All metadata logic in one place, not duplicated across layouts
- **Type-safe props**: TypeScript interface prevents missing required fields
- **Sensible defaults**: Pages should work with minimal props; only title and description required
- **Canonical URL correctness**: Canonical must reflect the deployed site URL, not localhost
- **OG image strategy**: Must work without per-page custom images

## Architecture Decision: Dedicated `Head` Molecule

### Option 1: Inline metadata in `BaseLayout.astro`

```astro
<!-- BaseLayout.astro -->
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <!-- ... all OG tags inline ... -->
</head>
```

**Pros**: Simple, no extra file

**Cons**:

- `BaseLayout.astro` becomes large and hard to read
- Cannot reuse Head logic in alternative layouts (e.g. a minimal layout for landing pages)
- Harder to test metadata in isolation

### Option 2: Dedicated `Head.astro` molecule (chosen)

```astro
<!-- BaseLayout.astro -->
<head>
  <Head title={title} description={description} {...rest} />
  <ClientRouter />
</head>
```

**Pros**:

- `BaseLayout.astro` stays clean and readable
- `Head.astro` can be reused across multiple layout variants
- Metadata logic is isolated and testable
- Props interface is explicit and type-safe

**Cons**:

- One extra file to understand

## Decision

**Use a dedicated `Head.astro` molecule** at `src/components/atoms/Head.astro` with the following responsibilities:

### Props Interface

```typescript
interface Props {
  title: string;           // Required — page title (without site name suffix)
  description: string;     // Required — meta description (150-160 chars ideal)
  image?: string;          // OG image URL — defaults to site default OG image
  canonicalUrl?: string;   // Override canonical — defaults to Astro.url
  noindex?: boolean;       // Set true for admin/utility pages
  type?: 'website' | 'article';  // OG type — defaults to 'website'
  publishDate?: Date;      // For article type — sets article:published_time
}
```

### Title Format

Page titles are formatted as `{title} | {siteName}` where `siteName` comes from `astro.config.mjs` site metadata. The `BaseLayout` appends the suffix — individual pages pass only their own title string.

**Why not include the site name in each page's title prop?** Prevents duplication when the site name changes, and keeps page-level titles clean.

### Canonical URL Strategy

Canonical URLs are generated from `Astro.url` by default, which reflects the `site` value set in `astro.config.mjs`. This means:

- In development: `http://localhost:4321/blog/my-post/`
- In production: `https://yourdomain.com/blog/my-post/`

The `site` value in `astro.config.mjs` must be set to the production URL before deploying. The `SITE_URL` environment variable overrides this for CI/CD environments.

**Why not hardcode canonical URLs?** Hardcoded URLs break in staging environments and require manual updates when domains change.

### OG Image Strategy

A default OG image (`/og-default.png`) is used when no page-specific image is provided. This ensures every page has a valid OG image for social sharing without requiring per-page image creation.

For blog posts and projects with a `heroImage`, the layout passes the optimised image URL as the `image` prop.

### Structured Data (JSON-LD)

JSON-LD is injected for two content types:

- **Blog posts**: `Article` schema with `headline`, `datePublished`, `dateModified`, `author`, `image`
- **Site root**: `WebSite` schema with `name`, `url`, `description`

JSON-LD is not injected on every page — only where it provides meaningful SEO value. Project pages do not use JSON-LD by default (no standard schema fits portfolio projects cleanly).

## Consequences

### Positive

- All metadata logic in one file — easy to audit and update
- Type-safe props catch missing fields at build time
- Canonical URLs are always correct relative to the deployed environment
- Default OG image ensures no page is missing social metadata

### Negative

- Users must understand the `Head` molecule to customise metadata
- JSON-LD is minimal by default — users with rich structured data needs must extend it

### Neutral

- Twitter/X card type is `summary_large_image` by default — appropriate for most content
- `robots` meta tag defaults to `index, follow`; set `noindex: true` for utility pages

## Validation

- **No missing OG tags**: Every page must have `og:title`, `og:description`, `og:image`, `og:url`
- **Canonical correctness**: Canonical URL must match the page URL in production
- **No duplicate titles**: `<title>` must be unique per page
- **Lighthouse SEO**: Must score 95+ with no meta description warnings

## References

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [JSON-LD Structured Data (Google)](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [ADR-010: Social Share URL Utility](./010-social-share-url-utility.md)
- [ADR-020: Page Performance Patterns](./020-page-performance-patterns.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
