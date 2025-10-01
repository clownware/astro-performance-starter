---
title: ClientRouter and View Transitions API Usage
lastUpdated: 2025-09-30T23:12:00.000Z
description: Decision to use Astro's ClientRouter for View Transitions API in BaseLayout
tableOfContents: true
pagefind: true
---
# ADR-009: ClientRouter and View Transitions API Usage

## Status

Accepted

## Context

The Astro Performance Starter template has a core principle of "zero JavaScript by default" to achieve 95+ Lighthouse scores. However, `BaseLayout.astro` currently imports and uses `ClientRouter` from `astro:transitions`, which enables the View Transitions API for client-side navigation.

The View Transitions API provides smooth page transitions without full page reloads, but it requires JavaScript to function. This creates a tension between our performance-first philosophy and enhanced user experience through animated transitions.

We need to document whether this JavaScript addition is justified and ensure it aligns with our progressive enhancement strategy.

## Decision Drivers

- **Performance requirements**: Target 95+ Lighthouse scores with minimal JavaScript
- **User experience**: Smooth navigation transitions improve perceived performance
- **Progressive enhancement**: Features should work without JavaScript, then enhance
- **Bundle size**: ClientRouter adds ~2-3KB gzipped to the bundle
- **Accessibility**: View Transitions must respect `prefers-reduced-motion`

## Considered Options

### Option 1: Remove ClientRouter (Zero JavaScript)

**Description**: Remove `ClientRouter` entirely, relying on native browser navigation

**Pros**:

- Strictly adheres to "zero JavaScript by default" principle
- Smallest possible bundle size
- No JavaScript execution overhead
- Works in all browsers without polyfills

**Cons**:

- Full page reloads on navigation (slower perceived performance)
- No animated transitions between pages
- Less modern user experience compared to SPAs

### Option 2: Keep ClientRouter (Current Implementation)

**Description**: Use `ClientRouter` in BaseLayout for all pages by default

**Pros**:

- Smooth, animated page transitions
- Faster perceived navigation (no white flash)
- Preserves shared layout state (header, footer)
- Respects `prefers-reduced-motion` automatically
- Minimal JavaScript cost (~2-3KB gzipped)

**Cons**:

- Adds JavaScript to every page by default
- Requires JavaScript for optimal experience
- Potential accessibility concerns if not implemented correctly

### Option 3: Opt-in ClientRouter per Page

**Description**: Remove from BaseLayout, add to individual pages that need it

**Pros**:

- Pages can choose their own navigation strategy
- Maximum flexibility
- Truly zero JavaScript for pages that don't opt in

**Cons**:

- Inconsistent user experience across site
- More boilerplate in page components
- Developers may forget to add it where beneficial

## Decision

We will **keep ClientRouter in BaseLayout** (Option 2) with the following justifications:

1. **Progressive Enhancement**: The site works perfectly without JavaScript (SSR renders all content). ClientRouter only enhances navigation, it doesn't break functionality.

2. **Performance Trade-off**: The ~2-3KB cost is justified by improved perceived performance through instant navigation and reduced layout shift.

3. **Accessibility Built-in**: Astro's View Transitions API automatically respects `prefers-reduced-motion` and maintains focus management.

4. **Modern Standard**: View Transitions API is becoming a web standard (Chrome 111+, Safari 18+), with Astro providing a polyfill for older browsers.

### Implementation Details

```astro
// src/layouts/BaseLayout.astro
import { ClientRouter } from "astro:transitions";

<head>
  <Head {...Astro.props} />
  <ClientRouter />
</head>
```

The `ClientRouter` is placed in the `<head>` to initialize before page content loads, ensuring smooth transitions from the first navigation.

## Consequences

### Positive

- Improved perceived performance through instant navigation
- Modern, polished user experience with smooth transitions
- Automatic accessibility features (reduced motion support)
- Maintains SSR benefits (SEO, initial load speed)
- Small JavaScript footprint (~2-3KB) is acceptable trade-off

### Negative

- Violates strict "zero JavaScript" interpretation
- Adds ~2-3KB to every page load
- Requires JavaScript for optimal navigation experience
- May need additional testing for JavaScript-disabled scenarios

### Neutral

- Pages can still opt out using `transition:persist={false}` if needed
- View Transitions API is progressive enhancement, not requirement
- Developers must be aware of transition lifecycle hooks

## Validation

How will we know if this decision was correct?

- **Lighthouse Score**: Maintain 95+ performance score despite JavaScript addition
- **Bundle Size**: Total JavaScript remains under 5KB for base pages
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **User Feedback**: Positive response to navigation smoothness
- **Accessibility Audit**: No regressions in a11y testing

## References

- [Astro View Transitions Documentation](https://docs.astro.build/en/guides/view-transitions/)
- [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [ADR-001: Preact Island Usage Policy](./001-preact-island-usage-policy.md) (similar JavaScript justification pattern)
- [Project Rule: Zero JavaScript by default](../ai-context/ai-rules-setup.md)

## Notes

### Future Considerations

- Monitor View Transitions API browser support and consider removing polyfill when widely supported
- Evaluate per-page opt-in strategy if JavaScript budget becomes constrained
- Consider adding custom transition animations for specific page types (blog posts, projects)

### Migration Strategy

No migration needed - this ADR documents existing implementation. If we decide to remove ClientRouter in the future:

1. Remove `<ClientRouter />` from BaseLayout
2. Update this ADR status to "Superseded by ADR-XXX"
3. Document performance impact in new ADR

---
**Date**: 2025-09-30  
**Participants**: Development team  
**Outcome**: Accepted
