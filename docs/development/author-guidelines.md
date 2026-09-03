---
title: Content Authoring Guidelines
description: How to create and manage content for the Astro Performance Starter template
lastUpdated: true
tableOfContents: true
pagefind: true
---
This document provides guidelines for creating and managing content within projects built with this Astro Performance Starter template.

## Getting Started

- **Content Location**: All structured content uses Astro's Content Collections API in `src/content/`
- **Validation**: Run `pnpm run check` to validate TypeScript and content schemas
- **Configuration**: Content collection schemas are defined in [`src/content.config.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/content.config.ts)

## Content Collections Setup

The template ships six content collections — `projects`, `blog`, `navigation`, `bio`, `experience`, and `adr` — that you can extend. The `adr` collection is unusual: it loads `docs/adr/NNN-*.md` so decision records publish as web routes ([ADR-062](/adr/062-astro-7-upgrade-remark-retained/)).

### Blog Collection Example

The full `blog` schema, as defined in `src/content.config.ts`:

```typescript
// src/content.config.ts (excerpt — see the file for all six collections)
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
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
      author: z.string().default("Your Name"), // Default author
      readingTime: z.number().optional(), // Optional: can be calculated
      canonicalUrl: z.url().optional(),
      relatedPosts: z.array(z.string()).optional(), // ids of related posts
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

Note that `coverAlt` is required even when `cover` is omitted — every post frontmatter needs it.

### Creating Content

1. **Create collection directory**: `src/content/[collection-name]/`
2. **Add content files**: Use `.md` or `.mdx` format
3. **Include frontmatter**: Match your schema requirements
4. **Validate**: Run `pnpm run check` to ensure type safety

## Using MDX Components

The template supports MDX for rich content with components:

```mdx
---
title: "Example Post"
description: "Demonstrating MDX components"
date: 2026-01-01
coverAlt: ""
---

import Image from '@/components/atoms/Image.astro';
import exampleImage from './example.jpg';

# My Post

Regular markdown content works as expected.

<Image src={exampleImage} alt="Example image" />

You can also use any Astro components in your MDX files.
```

`Figure`, `Grid`, and `Callout` (from `src/components/mdx/`) are pre-registered via `astro.config.mjs` and need no import; links and blockquotes are also rendered by the `Link` and `Blockquote` components there. Anything else — including `Image` — must be imported inside the MDX file.

## Image Guidelines

- **Location**: Store images next to content files or in `src/assets/`
- **Optimization**: Use the template's `Image` atom ([`src/components/atoms/Image.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/atoms/Image.astro)), which wraps `astro:assets` with responsive `widths` / `densities` defaults, lazy loading, and async decoding
- **Formats**: the atom outputs a single format per image — AVIF by default, overridable with the `format` prop; SVG sources pass through unchanged. Astro's raw `<Image />` from `astro:assets` does not apply this default.
- **Alt text**: Always include descriptive alt text for accessibility

```astro
---
import Image from '@/components/atoms/Image.astro';
import myImage from '../assets/example.jpg';
---

<Image src={myImage} alt="Descriptive alt text" />
```

## Content Workflow

1. **Plan content structure** using Content Collections
2. **Create schema** in `src/content.config.ts`
3. **Write content** in MDX format with proper frontmatter
4. **Preview locally** with `pnpm dev`
5. **Validate** with `pnpm run check`
6. **Deploy** using your preferred hosting platform
