---
title: 'ADR-020: Page Performance Patterns'
lastUpdated: 2025-10-01T00:00:00.000Z
description: >-
  Consolidated page performance patterns targeting 95+ Lighthouse scores
  with minimal JavaScript, covering static pages, blog, and interactive features
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-07-05: Core Web Vitals updated FID→INP, the JavaScript budget
corrected to raw bytes as CI enforces, and the Lighthouse targets qualified against the
enforced CI floors — see the annotated sections below)

## Context

The Astro Performance Starter targets **95+ Lighthouse scores** with minimal JavaScript. As the codebase has grown, different pages have required different performance optimization strategies. This ADR consolidates all page performance patterns into a single source of truth.

## Performance Target

**Lighthouse Scores**: 95+ Performance, 98+ Accessibility, 100 Best Practices, 100 SEO
(aspirational targets; the enforced CI floors are 0.9 / 0.95 / 0.95 / 0.9 in
`lighthouserc.json` — see ADR-023's amendment)

**Core Web Vitals**:

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms *(amended: replaces FID, which Google
  retired in 2024)*
- **CLS** (Cumulative Layout Shift): < 0.1

**Bundle Budgets**:

- **JavaScript**: < 160KB total **raw** *(amended: originally stated "gzipped"; CI
  enforces raw bytes — `JS_SIZE_LIMIT_BYTES=163840` in `.github/workflows/ci.yml` —
  matching `.claude/stack.md`)*
- **CSS**: < 50KB uncompressed
- **Default starter**: ~90KB JS, ~15KB CSS (gzipped)

## Decision

Adopt the per-page-type patterns catalogued below as the binding performance playbook —
each page in the template follows the pattern for its type, and new pages pick the
matching section before writing code. This record is deliberately a pattern catalogue
rather than a single choice. *(Section added 2026-07-05; the record predated the
template's required Decision heading.)*

## Performance Patterns by Page Type

### 1. Static Pages (About, Contact)

**Characteristics**:

- No dynamic data fetching
- Minimal or no client-side interactivity
- Content-focused

**Optimization Strategy**:

```astro
---
// ✅ Zero JS by default
import BaseLayout from '@/layouts/BaseLayout.astro';
import Card from '@/components/molecules/Card.astro';
---

<BaseLayout>
  <!-- Static content -->
  <Card>
    <h2>About Us</h2>
    <p>Static content...</p>
  </Card>
</BaseLayout>
```

**Key Patterns**:

- **Zero JavaScript baseline**: No client directives unless absolutely necessary
- **Eager load hero images**: Use `loading="eager"` for above-the-fold images
- **Lazy load below-fold**: Use `loading="lazy"` for images below the fold
- **Progressive enhancement**: Add JS only when needed (forms, interactions)
- **CSS-only interactions**: Prefer CSS hover/focus states over JS

**Performance Checklist**:

- [ ] No unnecessary client directives
- [ ] Hero images use `loading="eager"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Forms work without JS (progressive enhancement)
- [ ] CSS transitions respect `prefers-reduced-motion`

---

### 2. Dynamic Routes (Blog Posts, Project Pages)

**Characteristics**:

- Content from collections
- Pagination or navigation
- Markdown/MDX rendering

**Optimization Strategy**:

```astro
---
// ✅ Compute navigation ONCE in getStaticPaths
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => 
    b.data.date.valueOf() - a.data.date.valueOf()
  );

  return sortedPosts.map((post, index) => ({
    params: { slug: post.slug },
    props: {
      post,
      // Pre-compute navigation to avoid per-page sorting
      prevPost: sortedPosts[index + 1] || null,
      nextPost: sortedPosts[index - 1] || null,
    },
  }));
}

const { post, prevPost, nextPost } = Astro.props;

// ✅ Single render() call - reuse for content AND headings
const { Content, headings } = await post.render();
---

<article>
  <Content />
  
  <!-- Navigation computed once, not per-page -->
  {prevPost && <a href={`/blog/${prevPost.slug}`}>Previous</a>}
  {nextPost && <a href={`/blog/${nextPost.slug}`}>Next</a>}
</article>
```

**Key Patterns**:

- **Compute navigation in `getStaticPaths`**: Avoid O(n log n) sorting per page
- **Single `render()` call**: Reuse for both content and metadata (headings, TOC)
- **Async image decoding**: Use `decoding="async"` on cover images
- **Prefetch navigation**: Use `data-astro-prefetch` on prev/next links
- **Lazy load images**: All content images should be lazy-loaded

**Performance Checklist**:

- [ ] Navigation computed in `getStaticPaths` (not per-page)
- [ ] Single `post.render()` call per page
- [ ] Cover images use `decoding="async"`
- [ ] Content images use `loading="lazy"`
- [ ] Prev/next links use `data-astro-prefetch`

**Implementation Examples**:

- [ADR 012: Blog Performance Optimizations](./012-blog-performance-optimizations.md)

---

### 3. Index/Landing Pages

**Characteristics**:

- Multiple components
- Some interactivity (expandable sections, tabs)
- Hero sections with CTAs

**Optimization Strategy**:

```astro
---
import ExpandableFeatureCard from '@/components/molecules/ExpandableFeatureCard.astro';
---

<!-- ✅ Above-the-fold: Static -->
<section class="hero">
  <h1>Welcome</h1>
  <p>Static hero content</p>
</section>

<!-- ✅ Below-the-fold: Lazy hydration -->
<section class="features">
  <ExpandableFeatureCard 
    client:visible
    title="Feature 1"
  >
    Content loads when visible
  </ExpandableFeatureCard>
</section>

<!-- ✅ Far below-fold: Defer even more -->
<section class="testimonials">
  <iframe 
    src="https://example.com/embed"
    loading="lazy"
    title="Testimonials"
  />
</section>
```

**Key Patterns**:

- **`client:visible` for below-fold**: Hydrate only when component enters viewport
- **`client:idle` for non-critical**: Hydrate when browser is idle
- **Defer iframes**: Use `loading="lazy"` on embedded content
- **Prefetch critical pages**: Use `data-astro-prefetch` on primary CTAs
- **Optimize images**: Use responsive images with `widths` or `densities`

**Client Directive Decision Tree**:

```
Is the component interactive?
├─ NO → Don't use client directive (static Astro component)
└─ YES → Is it above the fold?
    ├─ YES → Is it critical for initial interaction?
    │   ├─ YES → client:load (rare - justify in ADR)
    │   └─ NO → client:idle
    └─ NO → client:visible
```

**Performance Checklist**:

- [ ] Hero section is static (no client directive)
- [ ] Below-fold interactive components use `client:visible`
- [ ] Non-critical components use `client:idle`
- [ ] Iframes use `loading="lazy"`
- [ ] Primary CTAs use `data-astro-prefetch`
- [ ] No `client:load` unless justified

**Implementation Examples**:

- [ADR 014: Index Page Performance Strategy](./014-index-page-performance-strategy.md)

---

### 4. List/Archive Pages (Blog Index, Projects)

**Characteristics**:

- Multiple items (cards, previews)
- Pagination or filtering
- Thumbnails/preview images

**Optimization Strategy**:

```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => 
    b.data.date.valueOf() - a.data.date.valueOf()
  );
  
  const pageSize = 10;
  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) },
    props: {
      posts: sortedPosts.slice(i * pageSize, (i + 1) * pageSize),
      currentPage: i + 1,
      totalPages,
    },
  }));
}

const { posts, currentPage, totalPages } = Astro.props;
---

<div class="grid">
  {posts.map((post, index) => (
    <PostCard 
      post={post}
      loading={index < 3 ? 'eager' : 'lazy'}
    />
  ))}
</div>
```

**Key Patterns**:

- **Eager load first 3 images**: Above-the-fold cards get `loading="eager"`
- **Lazy load remaining**: Below-fold cards get `loading="lazy"`
- **Pagination over infinite scroll**: Better for performance and accessibility
- **Prefetch pagination links**: Use `data-astro-prefetch` on page numbers
- **Client-side filtering (optional)**: Use `client:idle` for filter UI

**Performance Checklist**:

- [ ] First 3 card images use `loading="eager"`
- [ ] Remaining images use `loading="lazy"`
- [ ] Pagination links use `data-astro-prefetch`
- [ ] Filter UI (if any) uses `client:idle` or `client:visible`
- [ ] No client-side data fetching (use static generation)

**Implementation Examples**:

- [ADR 015: Projects Pagination Strategy](./015-projects-pagination-strategy.md)

---

## Progressive Enhancement Patterns

### Forms

**Pattern**: Forms must work without JavaScript, with JS for enhanced UX.

```astro
<!-- ✅ Works without JS (native form submission) -->
<form action="/api/contact" method="POST">
  <input type="email" name="email" required />
  <button type="submit">Send</button>
</form>

<!-- ✅ Enhanced with JS (inline script for progressive enhancement) -->
<script>
  // Add client-side validation, loading states, etc.
  // Form still works if JS fails to load
</script>
```

**Key Principles**:

- Form submits natively without JS
- JS adds validation, loading states, error handling
- Use inline `<script>` for critical form logic
- Consider `client:visible` for complex validation

**Performance Impact**:

- Inline scripts: ~2-5KB per form (acceptable)
- External validation library: Only if needed, use `client:idle`

---

### Interactive Components

**Pattern**: Start static, add interactivity progressively.

```astro
<!-- ✅ CSS-only accordion (no JS) -->
<details class="accordion">
  <summary>Click to expand</summary>
  <div>Content</div>
</details>

<!-- ✅ Enhanced accordion (with JS for analytics, etc.) -->
<details class="accordion" data-track-expand>
  <summary>Click to expand</summary>
  <div>Content</div>
</details>

<script>
  // Optional: Track expansion events
  document.querySelectorAll('[data-track-expand]').forEach(el => {
    el.addEventListener('toggle', () => {
      // Analytics tracking
    });
  });
</script>
```

**Preference Order**:

1. **CSS-only** (`:hover`, `:focus`, `<details>`)
2. **Inline script** (< 5KB, critical functionality)
3. **`client:visible`** (below-fold, non-critical)
4. **`client:idle`** (enhancements, analytics)
5. **`client:load`** (rare, must justify in ADR)

---

## Image Optimization Patterns

### Hero Images

```astro
<!-- ✅ Above-the-fold hero -->
<Image 
  src={heroImage}
  alt="Hero image"
  loading="eager"
  decoding="async"
  format="avif"
  quality="high"
  width={1920}
  height={1080}
/>
```

### Content Images

```astro
<!-- ✅ Below-the-fold content -->
<Image 
  src={contentImage}
  alt="Content image"
  loading="lazy"
  decoding="async"
  format="avif"
  quality="high"
  widths={[320, 640, 1024]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Card Thumbnails

```astro
<!-- ✅ First 3 cards (above fold) -->
<Image 
  src={thumbnail}
  alt="Thumbnail"
  loading="eager"
  format="avif"
  width={400}
  height={300}
/>

<!-- ✅ Remaining cards (below fold) -->
<Image 
  src={thumbnail}
  alt="Thumbnail"
  loading="lazy"
  format="avif"
  width={400}
  height={300}
/>
```

---

## Prefetch Strategy

### Internal Navigation

```astro
<!-- ✅ Primary CTAs -->
<Button href="/get-started" data-astro-prefetch>
  Get Started
</Button>

<!-- ✅ Pagination -->
<a href="/blog/page/2" data-astro-prefetch>Next Page</a>

<!-- ✅ Related content -->
<a href="/blog/related-post" data-astro-prefetch>Read More</a>

<!-- ❌ Don't prefetch external links -->
<a href="https://external.com">External Link</a>
```

**When to Prefetch**:

- Primary navigation links
- Pagination links
- Related content links
- High-probability user paths

**When NOT to Prefetch**:

- External links (no benefit)
- Low-probability links (footer links)
- Download links
- Logout/destructive actions

---

## Testing & Validation

### Build-Time Analysis

```bash
# Analyze bundle size
pnpm run bundle:analyze

# Check performance budgets
pnpm run perf:budgets

# Validate against baseline
pnpm run perf:baseline
```

### Runtime Testing

```bash
# Lighthouse audit
pnpm run perf:lighthouse

# Lighthouse CI (automated)
pnpm run perf:lighthouse:ci
```

### Manual Testing

1. **Network Throttling**: Test on "Slow 3G" in DevTools
2. **CPU Throttling**: Test with 4x slowdown
3. **Disable JavaScript**: Verify forms/navigation work
4. **Image Loading**: Verify lazy loading with Network panel

---

## Performance Budgets

### JavaScript Budget

- **Static pages**: 0-10KB (forms only)
- **Dynamic routes**: 10-30KB (navigation, TOC)
- **Index/landing**: 30-90KB (interactive components)
- **Maximum**: 160KB (with all interactive features)

### CSS Budget

- **Base**: 15KB (design tokens, utilities)
- **Components**: 20KB (atomic components)
- **Pages**: 10KB (page-specific styles)
- **Maximum**: 50KB uncompressed

### Image Budget

- **Hero images**: < 200KB (AVIF, quality: high)
- **Content images**: < 100KB (AVIF, quality: mid)
- **Thumbnails**: < 50KB (AVIF, quality: mid)

---

## Consequences

### Positive

- **Single Source of Truth**: One document for all performance patterns
- **Consistency**: Clear guidelines prevent performance debt
- **Measurable**: Specific budgets and targets
- **Scalable**: Patterns work from 10 to 10,000 pages

### Negative

- **Initial Overhead**: Requires upfront optimization effort
- **Complexity**: Different patterns for different page types

### Neutral

- **Living Document**: Will be updated as new patterns emerge
- **Trade-offs**: Sometimes sacrifice features for performance

---

## Related ADRs

- [ADR 000: Starter Decisions](./000-starter-decisions.md) - Performance targets
- [ADR 012: Blog Performance Optimizations](./012-blog-performance-optimizations.md) - Implementation example
- [ADR 014: Index Page Performance Strategy](./014-index-page-performance-strategy.md) - Implementation example
- [ADR 015: Projects Pagination Strategy](./015-projects-pagination-strategy.md) - Implementation example

---

## References

### Performance

- [Astro Performance Guide](https://docs.astro.build/en/guides/performance-optimization/)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

### Best Practices

- [The Cost of JavaScript](https://v8.dev/blog/cost-of-javascript-2019)
- [Lazy Loading Images](https://web.dev/lazy-loading-images/)
- [Optimize LCP](https://web.dev/optimize-lcp/)

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-062). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: aggregate shipped JS stays within the bundle budget.
- **Checks:**
  - TC-1 → JS bundle-size gate in CI (status: **block**, pre-existing gate)
- **Not machine-checkable:** adherence to the per-page-type playbook is a review concern; Lighthouse evidences outcomes periodically.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2025-10-01 (footer backfilled 2026-07-05 from git history; this record predates the footer convention)\
**Participants**: Template maintainers\
**Outcome**: Accepted
