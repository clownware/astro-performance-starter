---
title: 'Phase 1: Content & Data Architecture'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Details content schema, TypeScript types, URL strategy, and content fixtures
  for both MVP and Showcase tracks.
---

# Phase 1: Content & Data Architecture

## Overview
- **Track**: Both (MVP & Showcase)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0 (Foundation) completed
- **Deliverables**: Content schema, TypeScript types, URL strategy, content fixtures

## Entry Criteria
- [x] Astro project initialized
- [x] TypeScript configured in strict mode
- [x] Development environment functional
- [x] Content requirements gathered

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 1.01 | Inventory content types | ✅ | ✅ | List all content needs |
| 1.02 | Design URL structure | ✅ | ✅ | SEO-friendly paths |
| 1.03 | Create content collections | ✅ | ✅ | Define in config.ts |
| 1.04 | Define collection schemas | ✅ | ✅ | Zod schemas |
| 1.05 | Add draft mechanism | ✅ | ✅ | Boolean field |
| 1.06 | Generate TypeScript types | ✅ | ✅ | Auto from schemas |
| 1.07 | Create slug utilities | ✅ | ✅ | Consistent URL generation |
| 1.08 | Set up MDX components | ✅ | ✅ | Custom elements |
| 1.09 | Create content fixtures | ✅ | ✅ | One per type |
| 1.10 | Add frontmatter validation | ✅ | ✅ | astro check |
| 1.11 | Document content model | ✅ | ✅ | CHANGELOG.md |
| 1.12 | Create content guidelines | ✅ | ✅ | For authors |

## Code Examples

### Content Collections Configuration

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Portfolio/Case Studies Schema
const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160), // SEO meta description
    date: z.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: image(),
    coverAlt: z.string(),
    tags: z.array(z.string()),
    client: z.string().optional(),
    duration: z.string().optional(),
    role: z.string().optional(),
    technologies: z.array(z.string()),
    outcomes: z.array(z.object({
      metric: z.string(),
      value: z.string(),
      description: z.string().optional()
    })).optional(),
    externalUrl: z.string().url().optional(),
    sortOrder: z.number().default(0)
  })
});

// Blog Posts Schema
const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().default(false),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Your Name'),
    readingTime: z.number().optional(), // Will calculate
    canonicalUrl: z.string().url().optional(),
    relatedPosts: z.array(z.string()).optional() // slugs
  })
});

// Navigation/Site Data
const navigationCollection = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      isExternal: z.boolean().default(false),
      icon: z.string().optional(),
      order: z.number()
    }))
  })
});

// Bio/About Content
const bioCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    title: z.string(),
    location: z.string().optional(),
    avatar: image(),
    social: z.object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional()
    }).optional(),
    skills: z.array(z.object({
      category: z.string(),
      items: z.array(z.string())
    })).optional()
  })
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  navigation: navigationCollection,
  bio: bioCollection
};
```

### URL Structure Strategy

```typescript
// src/utils/url-utils.ts
export const urlPatterns = {
  home: '/',
  projects: '/projects',
  project: (slug: string) => `/projects/${slug}`,
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  blogTag: (tag: string) => `/blog/tag/${tag}`,
  about: '/about',
  contact: '/contact',
  
  // Archive patterns
  blogArchive: (year: number, month?: number) => 
    month ? `/blog/${year}/${String(month).padStart(2, '0')}` : `/blog/${year}`
} as const;

// Slug generation utilities
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Remove consecutive hyphens
    .trim();
}

// Type-safe URL builder
export function getProjectUrl(project: { slug: string }): string {
  return urlPatterns.project(project.slug);
}
```

### MDX Components Configuration

```typescript
// src/components/mdx/index.ts
import { Code } from '@astrojs/starlight/components';
import { Image } from 'astro:assets';
import Callout from './Callout.astro';
import Grid from './Grid.astro';
import Figure from './Figure.astro';

export const mdxComponents = {
  // Enhanced code blocks
  pre: Code,
  
  // Responsive images with captions
  img: Image,
  Figure,
  
  // Layout components
  Grid,
  Callout,
  
  // Typography enhancements
  a: (props: any) => <a {...props} class="link" />,
  blockquote: (props: any) => <blockquote {...props} class="blockquote" />
};
```

### Content Fixtures

```mdx
---
# src/content/projects/example-project.mdx
title: "E-commerce Platform Redesign"
description: "Increased conversion rate by 40% through user-centered design"
date: 2024-06-15
draft: false
featured: true
cover: "./images/ecommerce-cover.jpg"
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
  src="./images/architecture-diagram.png"
  alt="System architecture diagram"
  caption="High-level architecture showing service boundaries"
/>
```

### Content Model Changelog

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

### Validation Script

```typescript
// scripts/validate-content.ts
import { getCollection } from 'astro:content';

async function validateContent() {
  try {
    // Check all collections
    const projects = await getCollection('projects');
    const posts = await getCollection('blog');
    
    // Validate drafts aren't published
    const publishedDrafts = [...projects, ...posts]
      .filter(item => item.data.draft && !item.id.includes('draft'));
    
    if (publishedDrafts.length > 0) {
      console.error('❌ Draft content in main folders:', publishedDrafts);
      process.exit(1);
    }
    
    // Check for required images
    const missingImages = projects
      .filter(p => !p.data.cover);
    
    if (missingImages.length > 0) {
      console.warn('⚠️  Projects missing cover images:', missingImages);
    }
    
    console.log('✅ Content validation passed');
  } catch (error) {
    console.error('❌ Content validation failed:', error);
    process.exit(1);
  }
}

validateContent();
```

## Common Pitfalls

1. **Overly Complex Schemas**: Starting with too many fields
   - **Solution**: Add fields as needed, start minimal

2. **Missing Draft Field**: Accidentally publishing unfinished content
   - **Solution**: Make draft:true the default, explicitly set to false

3. **Inconsistent Slugs**: URLs that change breaking links
   - **Solution**: Generate slugs once, store in frontmatter

4. **Type Mismatches**: Schema doesn't match actual content
   - **Solution**: Use fixtures to test schemas early

## Exit Criteria

- [x] All content types identified and documented
- [x] URL structure defined and consistent
- [x] Content collections configured with schemas
- [x] TypeScript types generating correctly
- [x] Draft mechanism implemented and tested
- [x] Slug generation utilities working
- [x] MDX components configured
- [x] At least one fixture per content type
- [x] Validation passing with `astro check`
- [x] Content model changelog created
- [x] Author guidelines documented

## Rollback Strategy

If content architecture needs changes:

1. **Schema Changes**:
   ```bash
   # Create migration script
   node scripts/migrate-content.js --from v1 --to v2
   ```

2. **URL Structure Changes**:
   - Set up redirects in `astro.config.mjs`
   - Update all internal links
   - Submit new sitemap

3. **Collection Rename**:
   - Move files to new location
   - Update imports
   - Clear `.astro` cache

## AI Assistant Notes

### Key Files to Reference
- `src/content/config.ts` - Collection schemas
- `src/utils/url-utils.ts` - URL patterns
- `src/content/*/` - Content examples
- Content model changelog

### Common Prompts for This Phase
- "Create Astro content collection schema for [type]"
- "Generate TypeScript types from content schema"
- "Set up MDX components for rich content"
- "Create URL structure for SEO"

### Context Requirements
- Types of content (blog, portfolio, etc.)
- URL preferences (with/without dates)
- Required metadata fields
- Future content plans

## References

- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Zod Schema Validation](https://github.com/colinhacks/zod)
- [SEO-Friendly URL Structure Best Practices](https://developers.google.com/search/docs/crawling-indexing/url-structure)

---

Return to [Phase 0: Foundation Decisions](01-foundation-phase-0-foundation.md) | Proceed to [Phase 2: Design System Tokens](02-structure-phase-2-design-system.md)
