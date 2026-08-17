---
title: 'ADR-015: Projects Page Pagination Strategy'
description: >-
  Hybrid pagination approach combining SSR initial load with client-side
  Load More for optimal UX, SEO, and progressive enhancement
lastUpdated: 2025-10-01T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The projects page (`/src/pages/projects/index.astro`) displays a portfolio of projects with filtering and pagination capabilities. We needed to decide between:

1. **SSR-only pagination** with URL-based pages (`/projects/1`, `/projects/2`)
2. **Client-side "Load More"** with dynamic HTML generation
3. **Hybrid approach** with SSR initial load and client-side expansion

The template follows a "zero-JS by default" philosophy (ADR-001), but the projects page requires some interactivity for filtering and pagination.

## Decision

We implemented a **hybrid pagination approach** with the following characteristics:

### Initial Load (SSR)

- First 6 projects rendered server-side via Astro
- Full SEO benefits and zero-JS baseline
- Progressive enhancement ready

### Load More (Client-Side)

- Remaining projects embedded as JSON data
- Client-side HTML generation on button click
- Only loads when `projects.length > 6`

### Filtering (Client-Side)

- Technology-based filtering with badges
- Keyboard accessible with ARIA support
- Works on all loaded projects (initial + loaded)

## Rationale

### Why Not Pure SSR Pagination?

- **UX Trade-off**: URL-based pagination (`/projects/2`) requires full page reloads
- **Filter Complexity**: Combining URL pagination with client-side filtering creates state management issues
- **Portfolio Context**: Projects pages typically show all work without pagination in modern portfolios

### Why Client-Side Load More?

- **Better UX**: Seamless loading without page refresh
- **Filter Integration**: Works naturally with existing filter functionality
- **Performance**: Only 6 projects load initially, keeping Lighthouse scores high
- **Progressive Enhancement**: Works without JS (shows first 6 projects)

### Justification for Client-Side HTML Generation

While this violates pure SSR principles, it's justified because:

1. **Conditional**: Only executes when `projects.length > 6`
2. **One-time**: Runs once per user session, not repeatedly
3. **Small Scope**: Limited to project cards, not complex components
4. **Performance**: Keeps initial bundle small, lazy-loads remaining data
5. **Accessibility**: Fully keyboard navigable with ARIA live regions

## Implementation Details

### Performance Safeguards

```typescript
// Only show load more when needed
const projectsPerPage = 6;
const hasMoreProjects = projects.length > projectsPerPage;
```

### Accessibility

- `aria-live="polite"` on projects grid
- Keyboard navigation for all filters
- `aria-pressed` state management
- Focus-visible styles for keyboard users

### Progressive Enhancement

> **Amendment (2026-08-02):** the filter controls have since been rewritten as
> native `<button type="button">` elements with `aria-pressed` — the
> `role="button"`/`tabindex="0"` pattern noted below no longer exists in
> `projects/index.astro`.

- Works without JavaScript (shows first 6 projects)
- Filter badges have `role="button"` and `tabindex="0"`
- Semantic HTML with proper ARIA labels

## Consequences

### Benefits

- **Excellent UX**: No page reloads, seamless filtering
- **Good Performance**: Initial load is minimal (6 projects)
- **SEO Friendly**: First 6 projects are SSR
- **Accessible**: Full keyboard and screen reader support
- **Maintainable**: Clear separation of concerns

### Trade-offs

- **Duplicated Logic**: Card HTML exists in both Astro component and JS string
- **Maintenance**: Card structure changes require updates in two places
- **Bundle Size**: ~50 lines of JavaScript for load more functionality
- **Not Pure SSR**: Deviates from zero-JS ideal for this feature

### Mitigation Strategies

1. **Document clearly**: This ADR explains the trade-offs
2. **Keep minimal**: Only 6 projects per page limit
3. **Monitor performance**: Ensure Lighthouse scores remain 95+
4. **Consider refactor**: If projects grow beyond 20, revisit SSR pagination

## Alternative Considered

### Astro Paginate Helper

```typescript
import { paginate } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return paginate(projects, { pageSize: 6 });
}
```

**Rejected because**: Requires URL-based pagination which conflicts with client-side filtering UX.

## Future Considerations

If the project count exceeds 20-30 projects:

- Reconsider URL-based pagination with server-side filtering
- Implement virtual scrolling for large lists
- Use Astro's built-in pagination with query params
- Consider a search/filter API endpoint

## Related ADRs

- [ADR-001: Preact Island Usage Policy](./001-preact-island-usage-policy.md) - Why we avoid heavy client-side JS
- [ADR-014: Index Page Performance Strategy](./014-index-page-performance-strategy.md) - Performance patterns

## Compliance

- ✅ **Performance Budget**: Lighthouse 95+ maintained
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Progressive Enhancement**: Works without JS
- ⚠️ **Zero-JS Ideal**: Deviates for UX benefit (justified)

## Performance Optimizations (2025-10-01)

### Script Loading Strategy

**Change**: Removed `is:inline` directive from client-side script to enable Astro's automatic optimizations.

**Benefits**:

- **Automatic deferral**: Script no longer blocks page rendering
- **Better caching**: Bundled script gets content-hashed filename
- **Type safety**: TypeScript types added for DOM manipulation
- **Smaller bundle**: Astro's minification and tree-shaking applied

**Before**:

```astro
<script lang="js" is:inline>
  // Inline script, blocks parsing
</script>
```

**After**:

```astro
<script>
  // Automatically bundled, deferred, and cached
  interface ProjectData { /* ... */ }
  // TypeScript-typed DOM manipulation
</script>
```

**Impact**:

- No framework overhead (still vanilla JS per ADR-001)
- Improved First Contentful Paint (FCP)
- Better Long Task avoidance
- Maintains progressive enhancement

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Not machine-checkable:** the hybrid pagination/filtering approach is a UX decision; no invariant is derivable beyond the repo-wide budgets that already gate shipped JS.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2025-10-01 (footer backfilled 2026-07-05 from git history; this record predates the footer convention)\
**Participants**: Template maintainers\
**Outcome**: Accepted
