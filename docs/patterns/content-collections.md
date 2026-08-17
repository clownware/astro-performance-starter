---
title: Content Collections Patterns
lastUpdated: 2025-06-10T00:00:00.000Z
description: Advanced patterns for working with Astro Content Collections
tableOfContents: true
pagefind: true
---
> 📚 **Purpose**: Advanced patterns for working with Astro Content Collections

## Content Modeling Principles

### 1. Schema-First Design

- Define your content structure before creating content
- Use Zod for runtime validation
- Include all metadata upfront
- Plan for future content needs

### 2. Type Safety Throughout

- Leverage TypeScript's type inference
- Generate types from schemas
- Use discriminated unions for variants
- Validate at build time

### 3. Flexible but Consistent

- Allow for content variations
- Maintain consistent core fields
- Use optional fields sparingly
- Document all schema decisions

## Advanced Schema Patterns

### 1. Discriminated Union Schemas

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Base schema for all posts
const basePostSchema = z.object({
  title: z.string(),
  date: z.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// Specific schemas for different post types
const articleSchema = basePostSchema.extend({
  type: z.literal('article'),
  readingTime: z.number(),
  excerpt: z.string().max(160),
});

const tutorialSchema = basePostSchema.extend({
  type: z.literal('tutorial'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string()).optional(),
  duration: z.string(), // "30 minutes"
});

const videoSchema = basePostSchema.extend({
  type: z.literal('video'),
  videoUrl: z.string().url(),
  duration: z.string(), // "10:30"
  transcript: z.string().optional(),
});

// Combined schema using discriminated union
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.discriminatedUnion('type', [
    articleSchema,
    tutorialSchema,
    videoSchema,
  ]),
});
```

### 2. Relational Content

```typescript
// src/content.config.ts
// Handle relationships between content

const authorsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().url().optional(),
    }).optional(),
  }),
});

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    // Reference to author by ID
    author: z.string(), // matches author filename
    // Multiple related posts
    relatedPosts: z.array(z.string()).optional(),
    // Category taxonomy
    category: z.enum(['development', 'design', 'business']),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
  }),
});

// Helper to resolve references
export async function getPostWithAuthor(post: any) {
  const author = await getEntry('authors', post.data.author);
  return {
    ...post,
    data: {
      ...post.data,
      author: author?.data || null,
    },
  };
}
```

### 3. Computed Fields

```typescript
// src/content.config.ts
// Add computed fields to schemas

import readingTime from 'reading-time';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    // Computed fields are added after retrieval
    // Not stored in frontmatter
  }),
});

// utils/content.ts
export async function getEnhancedPost(post: any) {
  const { Content } = await render(post); // `render` from 'astro:content'
  const stats = readingTime(post.body);
  
  return {
    ...post,
    data: {
      ...post.data,
      readingTime: Math.ceil(stats.minutes),
      wordCount: stats.words,
      excerpt: post.body.slice(0, 160).trim() + '...',
    },
  };
}
```

### 4. Nested Content Structures

```typescript
// src/content.config.ts
// Complex nested schemas

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    client: z.string(),
    date: z.date(),
    featured: z.boolean().default(false),
    
    // Nested timeline
    timeline: z.array(z.object({
      phase: z.string(),
      duration: z.string(),
      description: z.string(),
      deliverables: z.array(z.string()),
    })).optional(),
    
    // Nested outcomes
    outcomes: z.array(z.object({
      metric: z.string(),
      value: z.string(),
      improvement: z.number().optional(), // percentage
      description: z.string().optional(),
    })).optional(),
    
    // Nested tech stack
    techStack: z.object({
      frontend: z.array(z.string()),
      backend: z.array(z.string()),
      tools: z.array(z.string()),
    }).optional(),
  }),
});
```

## Content Query Patterns

### 1. Advanced Filtering

```typescript
// utils/content-queries.ts
import { getCollection } from 'astro:content';

// Multi-criteria filtering
export async function getFilteredPosts({
  category,
  tags,
  author,
  limit,
  excludeId,
}: {
  category?: string;
  tags?: string[];
  author?: string;
  limit?: number;
  excludeId?: string;
}) {
  const posts = await getCollection('blog', ({ data, id }) => {
    // Skip drafts
    if (data.draft) return false;
    
    // Exclude specific post
    if (excludeId && id === excludeId) return false;
    
    // Filter by category
    if (category && data.category !== category) return false;
    
    // Filter by author
    if (author && data.author !== author) return false;
    
    // Filter by tags (must have all specified tags)
    if (tags && tags.length > 0) {
      const hasAllTags = tags.every(tag => data.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    
    return true;
  });
  
  // Sort by date descending
  const sorted = posts.sort((a, b) => 
    b.data.date.getTime() - a.data.date.getTime()
  );
  
  // Apply limit if specified
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get related posts based on tags
export async function getRelatedPosts(
  currentPost: any,
  limit: number = 3
) {
  const posts = await getCollection('blog', ({ data, id }) => {
    // Exclude current post and drafts
    if (id === currentPost.id || data.draft) return false;
    
    // Find posts with overlapping tags
    const commonTags = data.tags.filter(tag => 
      currentPost.data.tags.includes(tag)
    );
    
    return commonTags.length > 0;
  });
  
  // Sort by number of common tags
  const scored = posts.map(post => ({
    post,
    score: post.data.tags.filter(tag => 
      currentPost.data.tags.includes(tag)
    ).length,
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}
```

### 2. Pagination Patterns

```typescript
// utils/pagination.ts
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginate<T>(
  items: T[],
  { page, pageSize }: PaginationParams
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;
  
  return {
    data: items.slice(offset, offset + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Usage in page component
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const pageSize = 10;
  const totalPages = Math.ceil(posts.length / pageSize);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) },
    props: {
      page: i + 1,
      pageSize,
    },
  }));
}
```

### 3. Search Implementation

```typescript
// utils/search.ts
import Fuse from 'fuse.js';
import { getCollection } from 'astro:content';

export interface SearchIndex {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
}

// Build search index
export async function buildSearchIndex(): Promise<SearchIndex[]> {
  const posts = await getCollection('blog');
  
  return posts.map(post => ({
    id: post.id,
    title: post.data.title,
    body: post.body.slice(0, 500), // First 500 chars
    tags: post.data.tags,
    category: post.data.category,
  }));
}

// Perform search
export function searchContent(
  index: SearchIndex[],
  query: string
) {
  const fuse = new Fuse(index, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'body', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
  
  return fuse.search(query);
}
```

## Content Organization Patterns

### 1. Multi-language Content

```typescript
// src/content.config.ts
const i18nSchema = z.object({
  lang: z.enum(['en', 'es', 'fr']),
  translations: z.array(z.object({
    lang: z.enum(['en', 'es', 'fr']),
    slug: z.string(),
  })).optional(),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: baseSchema.merge(i18nSchema),
});

// Directory structure
// content/
//   blog/
//     en/
//       post-1.mdx
//     es/
//       post-1.mdx
//     fr/
//       post-1.mdx
```

### 2. Draft Workflow

```typescript
// utils/draft-management.ts
export async function getAllPosts(includeDrafts = false) {
  return getCollection('blog', ({ data }) => {
    return includeDrafts || !data.draft;
  });
}

// Preview component
export function DraftBanner({ isDraft }: { isDraft: boolean }) {
  if (!isDraft) return null;
  
  return (
    <div class="draft-banner">
      ⚠️ This is a draft and not visible to the public
    </div>
  );
}

// Environment-based draft visibility
export function shouldShowDraft() {
  return import.meta.env.MODE === 'development' ||
         import.meta.env.PREVIEW_MODE === 'true';
}
```

### 3. Content Versioning

```typescript
// src/content.config.ts
const versionedSchema = z.object({
  version: z.number().default(1),
  lastModified: z.date(),
  changeLog: z.array(z.object({
    version: z.number(),
    date: z.date(),
    changes: z.array(z.string()),
  })).optional(),
});

// Track content changes
export function createChangeLog(
  oldContent: any,
  newContent: any
) {
  const changes = [];
  
  if (oldContent.title !== newContent.title) {
    changes.push(`Title changed from "${oldContent.title}" to "${newContent.title}"`);
  }
  
  // ... check other fields
  
  return {
    version: (oldContent.version || 1) + 1,
    date: new Date(),
    changes,
  };
}
```

## Content Rendering Patterns

### 1. Custom Components in MDX

```typescript
// src/components/mdx/index.ts
import Code from './Code.astro';
import Callout from './Callout.astro';
import YouTube from './YouTube.astro';
import ComparisonTable from './ComparisonTable.astro';

export const components = {
  // Override default elements
  pre: Code,
  
  // Custom components
  Callout,
  YouTube,
  ComparisonTable,
  
  // Shortcuts
  Warning: (props: any) => <Callout type="warning" {...props} />,
  Info: (props: any) => <Callout type="info" {...props} />,
};

// Usage in MDX
// <Warning>
//   This is important information!
// </Warning>
```

### 2. Dynamic Component Loading

```astro
---
// DynamicContent.astro
const { componentName, props } = Astro.props;

// Map of available components
const componentMap = {
  Hero: () => import('./Hero.astro'),
  Features: () => import('./Features.astro'),
  Testimonials: () => import('./Testimonials.astro'),
};

// Dynamically import component
const Component = componentMap[componentName] 
  ? (await componentMap[componentName]()).default 
  : null;
---
{Component && <Component {...props} />}
```

### 3. Content Includes

```typescript
// utils/content-includes.ts
// Reusable content snippets

export const commonIncludes = {
  ctaButton: `
[Get Started →](./get-started)
{.cta-button}
  `,
  
  newsletterForm: `
<Newsletter client:visible />
  `,
  
  authorBio: (authorId: string) => `
<AuthorBio author="${authorId}" />
  `,
};

// Use in MDX
// {commonIncludes.ctaButton}
```

## Performance Optimizations

### 1. Collection Caching

```typescript
// utils/content-cache.ts
const cache = new Map();

export async function getCachedCollection(
  name: string,
  filter?: any
) {
  const cacheKey = `${name}-${JSON.stringify(filter || {})}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await getCollection(name, filter);
  cache.set(cacheKey, result);
  
  return result;
}

// Clear cache in development
if (import.meta.env.DEV) {
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      cache.clear();
    });
  }
}
```

### 2. Lazy Content Loading

```astro
---
// LazyContent.astro
export interface Props {
  collection: string;
  id: string;
}

const { collection, id } = Astro.props;
---
<div 
  class="lazy-content"
  data-collection={collection}
  data-id={id}
>
  <div class="skeleton">Loading content...</div>
</div>

<script>
  // Load content when visible
  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const collection = el.dataset.collection;
        const id = el.dataset.id;
        
        try {
          const response = await fetch(`/api/content/${collection}/${id}`);
          const html = await response.text();
          el.innerHTML = html;
        } catch (error) {
          el.innerHTML = '<p>Failed to load content</p>';
        }
        
        observer.unobserve(el);
      }
    }
  });
  
  document.querySelectorAll('.lazy-content').forEach(el => {
    observer.observe(el);
  });
</script>
```

## Content Migration Patterns

### 1. Schema Migration

```typescript
// scripts/migrate-content.ts
import { z } from 'zod';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';

// Define migration
const migration = {
  from: z.object({
    title: z.string(),
    publishedAt: z.string(), // Old field
  }),
  to: z.object({
    title: z.string(),
    date: z.date(), // New field
  }),
  transform: (old: any) => ({
    ...old,
    date: new Date(old.publishedAt),
    publishedAt: undefined,
  }),
};

// Run migration
async function migrate() {
  const files = await glob('src/content/**/*.mdx');
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Validate old schema
    const parsed = migration.from.safeParse(data);
    if (!parsed.success) continue;
    
    // Transform
    const transformed = migration.transform(parsed.data);
    
    // Write back
    const updated = matter.stringify(body, transformed);
    await writeFile(file, updated);
  }
}
```

### 2. Bulk Operations

```typescript
// scripts/bulk-update.ts
// Add reading time to all posts

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import readingTime from 'reading-time';

async function addReadingTime() {
  const files = await glob('src/content/blog/**/*.mdx');
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Skip if already has reading time
    if (data.readingTime) continue;
    
    // Calculate reading time
    const stats = readingTime(body);
    data.readingTime = Math.ceil(stats.minutes);
    
    // Write back
    const updated = matter.stringify(body, data);
    await writeFile(file, updated);
    
    console.log(`Updated ${file}: ${data.readingTime} min read`);
  }
}
```

## Best Practices

1. **Keep Schemas Focused**: Don't try to model everything upfront
2. **Use Discriminated Unions**: For content with variants
3. **Validate Early**: Catch content errors at build time
4. **Cache Wisely**: Balance performance with freshness
5. **Plan for Growth**: Design schemas that can evolve
6. **Document Everything**: Especially schema decisions
7. **Test Migrations**: Always backup before bulk operations

## Common Pitfalls

1. **Over-Engineering Schemas**: Start simple, evolve as needed
2. **Missing Required Fields**: Always provide defaults
3. **Circular References**: Avoid infinite loops in relations
4. **Ignoring Performance**: Large collections need optimization
5. **Forgetting Drafts**: Always filter drafts in production
