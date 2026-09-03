---
title: Content Model Guide - Schema Design Patterns
lastUpdated: true
description: >-
  Best practices for designing content schemas in Astro using Content
  Collections
tableOfContents: true
pagefind: true
---
## Overview

This guide covers the content schema patterns used in this project's Astro Content Collections. All schemas live in `src/content.config.ts` and use Zod for build-time validation with full TypeScript inference.

## Core Principles

1. **Type Safety First**: Zod schemas provide runtime validation and TypeScript inference
2. **Future-Proof**: Optional fields and defaults allow content to evolve without breaking
3. **DRY**: Common patterns (tags, dates, draft/featured flags) repeat across collections
4. **Validation**: Malformed content fails at build time, not in production
5. **Flexibility**: Mix Markdown, MDX, and JSON sources across collections

## Collection Setup

Every collection uses `glob` loaders to source files from `src/content/<name>/`:

```typescript
// src/content.config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      // ... fields
    }),
});

export const collections = {
  blog: blogCollection,
  // all collections must be exported here
};
```

The `[^_]*` glob pattern excludes files prefixed with `_`, useful for drafts or partials you want to keep in the directory but exclude from the collection.

## Schema Patterns

### Image Schema Pattern

Astro's `image()` helper validates image paths at build time and enables automatic optimization (AVIF/WebP). Access it via the schema function signature:

```typescript
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      cover: image(),                // Required — build fails if missing
      coverAlt: z.string(),          // Always pair with alt text
      cardImage: image().optional(), // Optional variant for card thumbnails
    }),
});
```

Use `image()` (not `z.string()`) for any frontmatter image field. This enables Sharp processing and ensures referenced files exist at build time.

The bio collection uses the same pattern for avatars:

```typescript
schema: ({ image }) =>
  z.object({
    avatar: image(), // Processed through Astro Image pipeline
  }),
```

### Optional vs Required Fields

Use `.optional()` for fields that not every entry needs. Use `.default()` for fields that should always have a value:

```typescript
// Projects collection — mixing required, optional, and defaulted fields
z.object({
  title: z.string(),                    // Required — every project needs a title
  description: z.string().max(160),     // Required + constrained for SEO
  date: z.date(),                       // Required
  draft: z.boolean().default(false),    // Defaulted — published unless marked draft
  featured: z.boolean().default(false), // Defaulted — not featured unless marked
  client: z.string().optional(),        // Optional — not all projects have a client
  duration: z.string().optional(),      // Optional
  role: z.string().optional(),          // Optional
  externalUrl: z.url().optional(),      // Optional — validated as URL when present
  sortOrder: z.number().default(0),     // Defaulted — manual ordering override
})
```

The blog collection demonstrates `.default()` with non-boolean types:

```typescript
z.object({
  tags: z.array(z.string()).default([]),         // Defaults to empty array
  technologies: z.array(z.string()).default([]), // Same pattern
  author: z.string().default("Your Name"),       // Default string value
})
```

**Rule of thumb**: Use `.default()` when templates should always have a value to render. Use `.optional()` when templates conditionally render based on presence.

### Array of Objects Pattern

For structured repeated data, use `z.array(z.object({...}))`. This validates each item in the array:

```typescript
// Projects — measurable outcomes with structured metrics
outcomes: z
  .array(
    z.object({
      metric: z.string(),              // e.g., "Page Load Time"
      value: z.string(),               // e.g., "1.2s" — string to allow units
      description: z.string().optional(),
    }),
  )
  .optional(),
```

```typescript
// Bio — skills grouped by category
skills: z
  .array(
    z.object({
      category: z.string(),       // e.g., "Frontend", "DevOps"
      items: z.array(z.string()), // e.g., ["TypeScript", "React", "Astro"]
    }),
  )
  .optional(),
```

```typescript
// Experience — highlight bullets
highlights: z.array(z.string()).optional(), // Simple string array
technologies: z.array(z.string()).optional(),
```

Use string arrays for flat lists (`tags`, `technologies`, `highlights`). Use object arrays when each item has multiple properties (`outcomes`, `skills`).

### Date Handling Pattern

Zod's `z.date()` parses YAML date values from frontmatter. Use `.optional()` for open-ended ranges:

```typescript
// Experience — date ranges with optional end for current positions
z.object({
  startDate: z.date(),
  endDate: z.date().optional(),       // Omit for current role
  current: z.boolean().default(false), // Explicit flag for "present"
})

// Blog — publish date with optional update tracking
z.object({
  date: z.date(),                     // Original publish date
  updated: z.date().optional(),       // Set when content is revised
})
```

In frontmatter, dates use YAML date format:

```yaml
date: 2025-06-10
startDate: 2023-01-15
endDate: 2024-03-01
```

### Nested Object Pattern

For structured metadata that isn't repeated, use inline `z.object()`:

```typescript
// Bio — social links as a typed object
social: z
  .object({
    github: z.url().optional(),
    linkedin: z.url().optional(),
    twitter: z.url().optional(),
    email: z.email().optional(),
  })
  .optional(),
```

Note `z.url()` and `z.email()` for format validation — these catch malformed URLs/emails at build time rather than producing broken links in production.

### JSON Collections Pattern

Not all content is Markdown. The navigation collection uses JSON files with a different glob pattern:

```typescript
const navigationCollection = defineCollection({
  loader: glob({ pattern: "**/*.{json,yaml,yml}", base: "./src/content/navigation" }),
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
```

JSON collections don't use the `({ image })` function form since they can't reference local images. The schema is passed directly as an object.

Example `src/content/navigation/header.json` (the shipped file — trimmed):

```json
{
  "items": [
    { "label": "Home", "href": "/", "order": 1 },
    { "label": "How It Works", "href": "/how-it-works/", "order": 2 },
    { "label": "Blog", "href": "/blog/", "order": 4 },
    { "label": "GitHub", "href": "https://github.com/clownware/astro-performance-starter", "isExternal": true, "icon": "github-logo", "order": 8 }
  ]
}
```

### Cross-Reference Pattern

Reference other collection entries by ID string:

```typescript
// Blog — related posts by slug
relatedPosts: z.array(z.string()).optional(), // IDs of related blog entries
```

Astro doesn't enforce referential integrity here — the IDs are plain strings. Validate references in your templates if needed.

## Querying and Filtering

### Basic Collection Query

```typescript
import { getCollection } from "astro:content";

const navigation = await getCollection("navigation");
const navItems = navigation[0]?.data.items || [];
```

### Filtering with Inline Predicate

Pass a filter function as the second argument to `getCollection` to exclude entries at query time:

```typescript
import { type CollectionEntry, getCollection } from "astro:content";

// Filter out drafts
const posts = await getCollection(
  "blog",
  ({ data }: CollectionEntry<"blog">) => data.draft !== true,
);

// Filter out drafts from projects
const projects = await getCollection(
  "projects",
  ({ data }: CollectionEntry<"projects">) => !data.draft,
);
```

### Compound Filters

Combine conditions in the predicate for more specific queries:

```typescript
// Featured, non-draft posts
const featuredPosts = await getCollection(
  "blog",
  ({ data }: CollectionEntry<"blog">) =>
    data.draft !== true && data.featured === true,
);
```

### Sorting and Limiting

Sort and slice after querying — `getCollection` returns a plain array:

```typescript
// Sort by date descending
function sortPostsByDate(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}

// Usage: get 3 newest featured posts
const featured = sortPostsByDate(featuredPosts).slice(0, 3);
```

### Centralized Query Utilities

Extract repeated query patterns into utility functions (see `src/utils/blog.ts`):

```typescript
// src/utils/blog.ts
export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const allPosts = await getCollection(
    "blog",
    ({ data }: CollectionEntry<"blog">) => data.draft !== true,
  );
  return sortPostsByDate(allPosts);
}

export async function getFeaturedPosts(
  limit = 3,
): Promise<CollectionEntry<"blog">[]> {
  const featuredPosts = await getCollection(
    "blog",
    ({ data }: CollectionEntry<"blog">) =>
      data.draft !== true && data.featured === true,
  );
  return sortPostsByDate(featuredPosts).slice(0, limit);
}
```

### Static Path Generation

Use `getStaticPaths` with collection queries for dynamic routes:

```typescript
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

## Collection Reference

| Collection | Source Format | Loader Pattern | Image Support |
|---|---|---|---|
| `projects` | MD/MDX | `**/[^_]*.{md,mdx}` | Yes (`{ image }`) |
| `blog` | MD/MDX | `**/[^_]*.{md,mdx}` | Yes (`{ image }`) |
| `bio` | MD/MDX/JSON | `**/[^_]*.{md,mdx,json}` | Yes (`{ image }`) |
| `experience` | MD/MDX | `**/[^_]*.{md,mdx}` | No |
| `navigation` | JSON/YAML | `**/*.{json,yaml,yml}` | No |
