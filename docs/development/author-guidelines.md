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
- **Configuration**: Content collection schemas are defined in `src/content.config.ts`

## Content Collections Setup

The template includes a basic content collection structure that you can extend:

### Blog Collection Example

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.date(),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('Your Name'),
    }),
});

export const collections = { blog: blogCollection };
```

### Creating Content

1. **Create collection directory**: `src/content/[collection-name]/`
2. **Add content files**: Use `.md` or `.mdx` format
3. **Include frontmatter**: Match your schema requirements
4. **Validate**: Run `pnpm run check` to ensure type safety

## Using MDX Components

The template supports MDX for rich content with React-like components:

```mdx
---
title: "Example Post"
description: "Demonstrating MDX components"
date: 2026-01-01
coverAlt: ""
tags: []
---

# My Post

Regular markdown content works as expected.

<Image src="./example.jpg" alt="Example image" />

You can also use any Astro components in your MDX files.
```

## Image Guidelines

- **Location**: Store images next to content files or in `src/assets/`
- **Optimization**: Use the built-in `<Image />` component for automatic optimization
- **Formats**: AVIF and WebP are automatically generated
- **Alt text**: Always include descriptive alt text for accessibility

```astro
---
import { Image } from 'astro:assets';
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
