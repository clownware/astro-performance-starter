---
title: 'Phase 1 - Code Examples'
description: Code examples for Phase 1
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Code Examples

Companion to [Phase 1 - Content & Data Architecture](/implementation-guides/completed/phase-1-content-arch/). Blocks marked *condensed* are trimmed copies of the starter's real files; blocks marked *illustrative* are examples for your own project and do not exist in the starter.

### Content Collections Configuration

```typescript
// src/content.config.ts — Content Layer config lives at the src root,
// not the legacy src/content/config.ts location (removed in current Astro releases).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Portfolio/Case Studies Schema
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160), // SEO meta description
      date: z.date(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cardImage: image().optional(),
      cover: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()),
      client: z.string().optional(),
      duration: z.string().optional(),
      role: z.string().optional(),
      technologies: z.array(z.string()),
      outcomes: z
        .array(
          z.object({
            metric: z.string(),
            value: z.string(),
            description: z.string().optional(),
          }),
        )
        .optional(),
      externalUrl: z.url().optional(),
      sortOrder: z.number().default(0),
    }),
});

// Blog Posts Schema
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.date(),
      updated: z.date().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string(), // Required for accessibility when cover image is used
      cardImage: image().optional(),
      tags: z.array(z.string()).default([]),
      technologies: z.array(z.string()).default([]),
      author: z.string().default('Your Name'),
      readingTime: z.number().optional(), // Optional: can be calculated
      canonicalUrl: z.url().optional(),
      relatedPosts: z.array(z.string()).optional(), // ids of related posts
    }),
});

// Navigation/Site Data
const navigationCollection = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/navigation' }),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        isExternal: z.boolean().default(false),
        icon: z.string().optional(),
        order: z.number().default(0),
      }),
    ),
  }),
});

// Bio/About Content
const bioCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx,json}', base: './src/content/bio' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      location: z.string().optional(),
      avatar: image(),
      social: z
        .object({
          github: z.url().optional(),
          linkedin: z.url().optional(),
          twitter: z.url().optional(),
          email: z.email().optional(),
        })
        .optional(),
      skills: z
        .array(
          z.object({
            category: z.string(),
            items: z.array(z.string()),
          }),
        )
        .optional(),
    }),
});

// Experience/Work History Collection (see ADR-017)
const experienceCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(), // Optional for current positions
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    order: z.number().default(0), // For manual ordering
  }),
});

// Architecture Decision Records — publishes docs/adr/ as web routes under /adr/.
// The glob only matches numbered files, so README.md and template.md are
// excluded; the numeric prefix on the file name IS the ADR number.
const adrCollection = defineCollection({
  loader: glob({ pattern: '[0-9][0-9][0-9]-*.md', base: './docs/adr' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.date(),
    tableOfContents: z.boolean().default(true),
    pagefind: z.boolean().default(true),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  navigation: navigationCollection,
  bio: bioCollection,
  experience: experienceCollection,
  adr: adrCollection,
};
```

This is the starter's real [`src/content.config.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/content.config.ts). The `experience` collection is documented in [ADR-017](/adr/017-experience-content-collection/); the schema rationale for all six collections is in [ADR-027](/adr/027-content-collections-schema-design/).

### URL Structure Strategy

Every pattern is a function wrapped in `withBase()`, so URLs respect Astro's `base` config (e.g. GitHub Pages sub-path deployments), and every route ends in a trailing slash (`trailingSlash: "always"` in `astro.config.mjs`). The module also exports `resolveBasePath`, `getBlogPostUrl`, `getBlogTagUrl`, and `isTrustedUrl` (open-redirect protection for external links).

```typescript
// src/utils/url-utils.ts (condensed — see the starter for the full file)

/**
 * Prepends the configured base path to an internal URL.
 * No-op when base is "/"; passes through external URLs, anchors, and
 * already-prefixed paths (idempotent — never double-prefixes).
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  // ... see the starter for the full logic
}

export const urlPatterns = {
  home: () => withBase('/'),
  projects: () => withBase('/projects/'),
  project: (slug: string) => withBase(`/projects/${slug}/`),
  blog: () => withBase('/blog/'),
  blogPost: (slug: string) => withBase(`/blog/${slug}/`),
  blogTag: (tag: string) => withBase(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`),
  about: () => withBase('/about/'),
  contact: () => withBase('/contact/'),
  blogArchive: (year: number, month?: number) =>
    withBase(month ? `/blog/${year}/${String(month).padStart(2, '0')}/` : `/blog/${year}/`),
} as const;

// Slug generation — preserves unicode letters/numbers (IRI-friendly),
// not just ASCII \w
export function generateSlug(title: string): string {
  if (!title) {
    return '';
  }
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove special chars, preserve accented letters and numbers
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse consecutive hyphens
    .trim();
}

// Type-safe URL builder — Content Layer entries are keyed by `id`, not `slug`
export function getProjectUrl(project: { id: string }): string {
  return urlPatterns.project(project.id);
}
```

Full file: [`src/utils/url-utils.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/utils/url-utils.ts).

### MDX Components Configuration

```typescript
// src/components/mdx/index.ts (condensed — see the starter for the full file)
// Code blocks are handled by the site's syntax highlighter (Shiki /
// astro-expressive-code) — no extra `pre` mapping or Starlight import needed.
// The .astro components are loaded via dynamic `await import()` wrappers with
// no-op fallbacks so this module can also be evaluated in plain Node (unit
// tests), where .astro files can't be compiled.
let callout: unknown;
try {
  callout = (await import('./Callout.astro')).default;
} catch {
  callout = () => null;
}
// ... same wrapper pattern for Figure, Grid, and Blockquote ...

import Link from './Link'; // Preact component for enhanced <a> tags

export const components = {
  // Custom components referenced by tag name in MDX
  Figure: figure,
  Grid: grid,
  Callout: callout,

  // Override default HTML tags with custom components.
  // <img> tags in MDX are optimized by Astro's default astro:assets handling.
  a: Link,
  blockquote: blockquote,
};

export default components;
```

The exported symbol is `components` (with a default export) — `astro.config.mjs` aliases it on import: `import { components as mdxComponents } from './src/components/mdx/index.ts'` and passes it to `mdx({ components: mdxComponents })`. Full file: [`src/components/mdx/index.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/mdx/index.ts); usage guidance in [MDX Components](/patterns/mdx-components/).

### Content Fixtures

The block below is an **illustrative fixture** for your own project — it is not a file in the starter. The starter's real project fixtures are directory routes, one folder per entry with a sibling cover image: `src/content/projects/<slug>/index.mdx` plus `cover.svg` (see [`docs-portal`](https://github.com/clownware/astro-performance-starter/blob/master/src/content/projects/docs-portal/index.mdx)). Both shapes validate against the `projects` schema above.

```mdx
---
# Illustrative — e.g. src/content/projects/example-project/index.mdx
title: "E-commerce Platform Redesign"
description: "Increased conversion rate by 40% through user-centered design"
date: 2024-06-15
draft: false
featured: true
cover: "./ecommerce-cover.jpg"
coverAlt: "Screenshot of redesigned e-commerce platform"
tags: ["UX Design", "Preact", "Performance"]
client: "TechCorp Inc"
duration: "3 months"
role: "Lead Frontend Developer"
technologies: ["Preact", "TypeScript", "Tailwind CSS", "Astro"]
outcomes:
  - metric: "Conversion Rate"
    value: "+40%"
    description: "Improved checkout flow and product pages"
  - metric: "Page Load Time"
    value: "-60%"
    description: "Optimized assets and lazy loading"
sortOrder: 1
---

## Project Overview

<Callout type="success">
This project demonstrates modern e-commerce best practices with significant measurable improvements.
</Callout>

The client needed a complete redesign of their aging e-commerce platform...

## Technical Approach

<Grid cols={2}>
  <div>
    ### Frontend Architecture
    - Component-based design system
    - Progressive enhancement
    - Optimistic UI updates
  </div>
  <div>
    ### Performance Strategy
    - Code splitting by route
    - Image optimization pipeline
    - Edge caching with Cloudflare
  </div>
</Grid>

<Figure
  src="./architecture-diagram.png"
  alt="System architecture diagram"
  caption="High-level architecture showing service boundaries"
/>
```

### Content Model Changelog

Illustrative — the starter does not ship a content-model changelog; step 1.11 asks you to keep one for your own schema changes.

```markdown
# Content Model Changelog

## [1.0.0] - 2024-01-15

### Added
- Initial content collections:
  - `projects`: Portfolio case studies
  - `blog`: Blog posts with MDX support
  - `navigation`: Site navigation data
  - `bio`: Author/about information

### Schema Decisions
- All content has `draft` field for preview
- Projects have `sortOrder` for manual ordering
- Blog posts track `updated` date separately
- Tags are arrays of strings (not references)

## Migration Notes
- When adding fields, provide defaults
- Breaking changes require data migration scripts
- Always test with `astro check` after changes
```

### Content Validation

The starter ships no standalone content-validation script — frontmatter validation is enforced by the Zod schemas in `src/content.config.ts`, which `astro check` (run via `pnpm run check`, part of `quality` and `quality:ci`) applies to every entry. Invalid or missing fields fail the build, so a separate validator would only duplicate the schema. Draft handling is a query-time concern: pages filter with `getCollection('projects', ({ data }) => !data.draft)`.
