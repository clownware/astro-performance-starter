---
title: 'ADR-011: Dynamic Route Error Handling'
lastUpdated: 2025-09-30T00:00:00.000Z
description: >-
  Defensive error handling in all dynamic route files with 404 redirects
  for undefined props and slug mismatches
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Dynamic routes in Astro (e.g., `/blog/[slug].astro`) use `getStaticPaths()` to generate pages at build time. While Astro's static path generation prevents most runtime errors, edge cases can still occur:

1. **Development errors**: Props may be undefined during development/testing
2. **Build-time issues**: Content collection queries could fail or return unexpected data
3. **Future refactoring**: Changes to data structures might introduce undefined states
4. **Defensive programming**: Following fail-safe principles for production resilience

Without explicit error handling, these edge cases result in:

- Cryptic build failures
- Poor developer experience during debugging
- Potential runtime errors if SSR is ever enabled

## Decision

Implement defensive error handling in all dynamic route files with:

1. **Undefined post check**: Redirect to 404 if post data is missing
2. **Slug mismatch validation**: Handle cases where post slug doesn't match URL parameter
3. **Boundary condition comments**: Document null handling for prev/next navigation
4. **Early returns**: Use Astro's redirect for graceful failure

### Implementation Pattern

```typescript
const { post } = Astro.props;

// Error handling: Redirect to 404 if post is undefined
if (!post) {
  return Astro.redirect("/404");
}

// ... fetch related data ...

const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);

// Edge case: If slug mismatch (should not happen with static paths, but defensive)
if (currentIndex === -1) {
  return Astro.redirect("/404");
}

// Get previous and next posts (null if at boundaries)
const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
```

## Rationale

### Why This Approach?

1. **Fail-safe design**: Gracefully handles unexpected states rather than crashing
2. **Developer experience**: Clear error messages via 404 page instead of build failures
3. **Production resilience**: Prevents edge cases from breaking the entire site
4. **Future-proof**: Protects against refactoring errors or data structure changes
5. **Minimal overhead**: Zero runtime cost for static builds (checks happen at build time)

### Why Not Alternative Approaches?

#### Alternative 1: Throw errors

```typescript
if (!post) throw new Error("Post not found");
```

❌ Breaks build process, poor user experience

#### Alternative 2: Silent fallback

```typescript
const post = Astro.props.post ?? defaultPost;
```

❌ Masks bugs, creates confusing behavior

#### Alternative 3: No error handling

```typescript
const { post } = Astro.props; // Trust getStaticPaths
```

❌ Fragile during development, no safety net

## Consequences

### Positive

- ✅ **Resilience**: Graceful degradation for edge cases
- ✅ **DX**: Clear 404 pages instead of cryptic build errors
- ✅ **Maintainability**: Explicit error handling documents assumptions
- ✅ **Debugging**: Easier to trace issues with explicit checks
- ✅ **Zero cost**: No runtime overhead for static builds

### Neutral

- Slightly more verbose code (4-6 extra lines per dynamic route)
- Requires consistent application across all dynamic routes

### Negative

- None identified - this is a pure improvement following defensive programming principles

## Compliance

- **User Rules**: ✅ Follows minimal, focused edits principle
- **User Rules**: ✅ Uses comments to document edge cases
- **User Rules**: ✅ Implements defensive programming without over-engineering
- **Performance**: ✅ Zero runtime overhead (build-time only)
- **Accessibility**: ✅ Redirects to proper 404 page with ARIA labels

## Implementation Checklist

Apply this pattern to all dynamic routes:

- [x] `/src/pages/blog/[slug].astro`
- [ ] `/src/pages/projects/[slug].astro` (if applicable)
- [ ] Any future dynamic routes

## Related Files

- `src/pages/blog/[slug].astro` - Primary implementation
- `src/pages/404.astro` - Error destination
- `src/layouts/BlogLayout.astro` - Handles null prev/next gracefully

## Future Considerations

- Monitor build logs for 404 redirects (indicates data issues)
- Consider adding build-time validation for content collections
- If SSR is enabled, add runtime error logging
- Add integration tests for error handling paths

## References

- [Astro Dynamic Routes](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)
- [Astro Redirects](https://docs.astro.build/en/guides/routing/#redirects)
- Defensive Programming Principles

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Not machine-checkable:** presence of the defensive redirect pattern in dynamic routes is a review concern. A grep-based check was evaluated during the enforcement retrofit and rejected as brittle (pattern text varies legitimately); see ADR-064.
- **Graduation log:** _(empty at creation; entries added when a check changes status)_

---
**Date**: 2025-10-01 (footer backfilled 2026-07-05 from git history; this record predates the footer convention)\
**Participants**: Template maintainers\
**Outcome**: Accepted
