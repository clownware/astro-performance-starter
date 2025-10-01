# ADR 012: Blog Performance Optimizations

**Status:** Accepted  
**Date:** 2025-09-30  
**Deciders:** Development Team  
**Related:** Blog Layout, Static Site Generation, Performance

## Context

The initial blog implementation had several performance bottlenecks that would scale poorly as content grows:

1. **Redundant Sorting**: Each blog post page fetched and sorted ALL posts independently (O(n log n) per page)
2. **Double Rendering**: `post.render()` was called twice—once for content, once for headings
3. **Implicit Image Decoding**: Cover images didn't explicitly set `decoding="async"`
4. **Per-Page Metadata Calculation**: Reading time calculated from raw markdown on every page

For a blog with 100 posts, this meant:

- 100 separate sort operations (instead of 1)
- 200 markdown parse operations (instead of 100)
- Unnecessary blocking on image decode

## Decision

Implement build-time performance optimizations following Astro's static generation best practices:

### 1. Compute Navigation Once in `getStaticPaths`

**Before**:

```typescript
// In [slug].astro page component
const allPosts = (await getCollection("blog")).sort(...);
const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
```

**After**:

```typescript
// In getStaticPaths (runs once)
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const sortedPosts = posts.sort(...);
  
  return sortedPosts.map((post, index) => ({
    params: { slug: post.slug },
    props: {
      post,
      prevPost: index > 0 ? sortedPosts[index - 1] : null,
      nextPost: index < sortedPosts.length - 1 ? sortedPosts[index + 1] : null,
    },
  }));
}
```

**Impact**: Reduces O(n²) to O(n log n) for entire build

### 2. Render Markdown Once Per Page

**Before**:

```typescript
// In [slug].astro
const { Content } = await post.render();

// In BlogLayout.astro
const { headings } = await post.render(); // DUPLICATE!
```

**After**:

```typescript
// In [slug].astro
const { Content, headings } = await post.render();

// Pass to layout
<BlogLayout post={post} headings={headings}>
  <Content />
</BlogLayout>

// In BlogLayout.astro - receive as prop
const { post, headings } = Astro.props;
```

**Impact**: Eliminates 50% of markdown parsing operations

### 3. Explicit Async Image Decoding

**Before**:

```astro
<Image src={cover} loading="eager" />
```

**After**:

```astro
<Image src={cover} loading="eager" decoding="async" />
```

**Impact**: Prevents image decode from blocking main thread (LCP improvement)

### 4. Reading Time Calculation (Deferred)

**Current**: `formatPostMetadata(date, post.body, updated)` processes raw markdown per page

**Decision**: Keep as-is for now because:

- Static builds = one-time cost
- Only becomes bottleneck at 1000+ posts
- Precomputing would require content schema changes or build hooks

**Future**: If blog exceeds 500 posts, consider:

- Precomputing in content collection config
- Caching in build hook
- Storing in frontmatter

## Rationale

### Why This Approach?

1. **Leverage Static Generation**: Astro builds pages once—optimize the build, not runtime
2. **Minimal Code Changes**: Works within existing architecture
3. **Measurable Impact**: Each optimization has clear performance benefit
4. **Scalability**: Handles 100s of posts efficiently; 1000s with future optimizations

### Performance Gains

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Sort operations (100 posts) | 100 | 1 | **99% reduction** |
| Markdown parses (100 posts) | 200 | 100 | **50% reduction** |
| Image decode blocking | Implicit | Async | **LCP improvement** |

### Why Not Alternative Approaches?

**Alternative 1: Client-side navigation**

```typescript
// Fetch prev/next via API
```

❌ Breaks static generation, adds runtime overhead

**Alternative 2: Precompute everything in content schema**

```typescript
// Store metadata in frontmatter
```

❌ Over-engineering for current scale, harder to maintain

**Alternative 3: Cache sorted posts globally**

```typescript
// Use module-level cache
```

❌ Unnecessary complexity when getStaticPaths already runs once

## Consequences

### Positive

- ✅ **Build Performance**: 50-99% reduction in redundant operations
- ✅ **Scalability**: Handles 100s of posts efficiently
- ✅ **Lighthouse Scores**: Async decoding improves LCP
- ✅ **Maintainability**: Cleaner separation of concerns (data prep in getStaticPaths)
- ✅ **Zero Runtime Cost**: All optimizations are build-time only

### Neutral

- Slightly more complex `getStaticPaths` (but clearer intent)
- `headings` must be passed as prop (explicit dependency)

### Negative

- None identified for current scale (< 500 posts)

## Compliance

- **User Rules**: ✅ Follows minimal, focused edits principle
- **User Rules**: ✅ Leverages Astro's static generation patterns
- **User Rules**: ✅ Optimizes build performance without runtime overhead
- **Performance**: ✅ Targets 95+ Lighthouse scores
- **Scalability**: ✅ Handles growth to 100s of posts

## Implementation Checklist

- [x] Move sorting to `getStaticPaths` in `/src/pages/blog/[slug].astro`
- [x] Pass `prevPost` and `nextPost` as props
- [x] Render markdown once, pass `headings` to layout
- [x] Update `BlogLayout.astro` to accept `headings` prop
- [x] Add explicit `decoding="async"` to cover image
- [ ] Monitor build times as content grows
- [ ] Consider precomputing reading time if blog exceeds 500 posts

## Related Files

- `src/pages/blog/[slug].astro` - Primary optimizations
- `src/pages/blog/index.astro` - Uses centralized blog utilities
- `src/layouts/BlogLayout.astro` - Receives headings as prop
- `src/utils/blog.ts` - Centralized blog post queries and sorting (eliminates duplication)
- `src/utils/formatDate.ts` - Reading time calculation (future optimization)

## Future Considerations

### If Blog Exceeds 500 Posts

1. **Precompute Reading Time**:

   ```typescript
   // In content config or build hook
   const readingTime = estimateReadingTime(post.body);
   ```

2. **Pagination for Blog Index**:

   ```typescript
   // Already implemented in /blog/index.astro
   ```

3. **Incremental Builds**:
   - Explore Astro's experimental incremental static regeneration
   - Only rebuild changed posts

### Monitoring

Track build times in CI/CD:

```bash
pnpm run build --verbose
# Monitor: "Generating static routes" duration
```

## References

- [Astro getStaticPaths](https://docs.astro.build/en/reference/api-reference/#getstaticpaths)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Image Decoding Performance](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
- Build-time vs Runtime Optimization Principles
