---
title: 'ADR-014: Index Page Performance Strategy'
description: >-
  Performance analysis and optimization decisions for the homepage,
  including JS hydration strategy, lazy loading, and metric generation.
lastUpdated: 2025-10-01T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

> **Note**: This ADR documents the implementation of patterns defined in [ADR 020: Page Performance Patterns](./020-page-performance-patterns.md). Refer to ADR 020 for comprehensive performance guidelines.

## Context

The `index.astro` homepage uses several components and data structures that could impact performance. Key concerns raised:

1. **ExpandableFeatureCard JS**: Does it introduce unnecessary hydration?
2. **Client directives**: Are interactive components properly deferred?
3. **Lazy loading**: Are images and iframes optimized?
4. **Hardcoded metrics**: Should Lighthouse scores be dynamically generated?

This ADR documents the current performance status and optimization decisions.

## Performance Analysis Results

### JavaScript Bundle Analysis

**Build output (production):**

```
dist/_astro/page.CY1iZwUD.js:     2.07 kB │ gzip: 1.04 kB
dist/_astro/ClientRouter.js:     15.12 kB │ gzip: 5.18 kB (View Transitions)
```

**ExpandableFeatureCard script:**

- Type: `<script type="module">` (NOT `is:inline`)
- Size: ~1KB gzipped
- Behavior: Deferred module loading (non-blocking)
- Functionality: Syncs `<details>` expand/collapse across feature cards

**Total page JS (excluding View Transitions):**

- Homepage-specific: ~1KB gzipped
- Zero Preact/React islands
- Zero `client:*` directives

### Current Implementation Status

✅ **Zero-JS Baseline Maintained**

- No client-side framework hydration
- No `client:load`, `client:visible`, or `client:idle` directives
- ExpandableFeatureCard uses native HTML `<details>` element
- Progressive enhancement via deferred module script

✅ **Lazy Loading**

- No images on index.astro (only SVG icons)
- No iframes present
- All images in other pages use Astro's `<Image>` component with automatic optimization

✅ **CSS-First Interactivity**

- `<details>` element provides expand/collapse without JS
- JS only enhances UX by syncing multiple cards
- Graceful degradation: works without JS

❌ **Hardcoded Metrics**

- Lighthouse scores manually defined in frontmatter
- Tech stack versions manually maintained
- No dynamic generation from build artifacts

## Decision Drivers

- **Performance First**: Maintain 95+ Lighthouse scores
- **Zero-JS Baseline**: Ship minimal JavaScript by default
- **Progressive Enhancement**: JS enhances, doesn't enable
- **Maintainability**: Balance automation vs. simplicity
- **Accuracy**: Metrics should reflect reality

## Considered Options

### Option 1: Keep ExpandableFeatureCard as-is (Current)

**Pros:**

- Already optimal: native `<details>`, deferred module
- ~1KB gzipped is negligible
- No hydration overhead
- Progressive enhancement pattern

**Cons:**

- Inline script duplicated per card (mitigated by module bundling)

### Option 2: Extract script to external file

**Pros:**

- Single script reference
- Better caching

**Cons:**

- Adds HTTP request (minimal with HTTP/2)
- Over-engineering for 1KB
- Loses component encapsulation

### Option 3: Remove JS entirely (CSS-only)

**Pros:**

- True zero-JS
- Simplest possible

**Cons:**

- Loses synchronized expand/collapse UX
- Degrades user experience
- Not worth the tradeoff for 1KB

### Option 4: Dynamic metric generation from Lighthouse CI

**Pros:**

- Always accurate scores
- Automated updates
- No manual maintenance

**Cons:**

- Adds build complexity
- Scores vary by environment
- Misleading if content changes
- Requires Lighthouse CI integration

### Option 5: Move metrics to content collections

**Pros:**

- Centralized data management
- Type-safe schemas
- Easier to update

**Cons:**

- Over-engineering for static marketing data
- Adds query overhead
- No real benefit for homepage data

## Decisions

### 1. Keep ExpandableFeatureCard Script (Option 1)

**Rationale:**

- Current implementation is already optimal
- ~1KB gzipped is well within performance budget
- Uses native HTML `<details>` with progressive enhancement
- Deferred module loading is non-blocking
- No hydration overhead (pure DOM manipulation)

**Implementation:**

```astro
<!-- Native HTML with JS enhancement -->
<details class="feature-details">
  <summary>Show details</summary>
  <div>Content</div>
</details>

<script type="module">
  // Deferred, non-blocking enhancement
  const syncFeatureCards = () => { /* ... */ };
  // ...
</script>
```

### 2. No Additional Lazy Loading Needed

**Rationale:**

- Index page has no images (only inline SVG icons)
- No iframes present
- Future images should use `<Image loading="lazy">` by default
- Astro's Image component handles optimization automatically

**Guideline for future additions:**

```astro
<!-- Correct pattern for future images -->
<Image 
  src={heroImage} 
  alt="Description"
  loading="lazy"  // Default for below-fold images
  format="avif"   // Automatic via Astro config
/>
```

### 3. Keep Metrics Hardcoded (Reject Option 4)

**Rationale:**

- Lighthouse scores are **marketing claims**, not live data
- Scores reflect "ideal conditions (empty starter)" - documented
- Dynamic generation would be misleading as content grows
- Manual updates force conscious decisions about claims
- Simpler build process

**Implementation:**

```typescript
/**
 * Lighthouse performance metrics for the starter template.
 * Reflects ideal conditions with empty starter content.
 */
const metrics: LighthouseMetric[] = [
  { label: "Performance", score: "95+", icon: "🚀" },
  // Manually updated, consciously maintained
];
```

**Disclaimer added:**
> "Scores reflect ideal conditions (empty starter). Real-world results may vary by deployment and content."

### 4. Keep Data in Frontmatter (Reject Option 5)

**Rationale:**

- Homepage data is **static marketing content**, not dynamic content
- Content collections are for blog posts, projects, etc.
- Frontmatter keeps data co-located with usage
- Type safety achieved via `src/types/content.ts`
- No query overhead

### 5. Implement Prefetch/Preconnect for External Links

**Rationale:**

- External links to GitHub and documentation domains benefit from DNS prefetch
- Internal documentation links benefit from Astro's prefetch integration
- Reduces latency by 100-300ms for external link clicks
- Enables instant navigation for internal links

**Implementation:**

```astro
<!-- index.astro -->
<BaseLayout
  title="..."
  description="..."
  preconnectDomains={["https://github.com"]}
>
  <!-- Internal links with prefetch -->
  <Button href="/docs/getting-started" data-astro-prefetch>
    View Documentation
  </Button>
  
  <!-- External links with security attributes -->
  <Button href="https://github.com/..." rel="noopener noreferrer" target="_blank">
    View on GitHub
  </Button>
</BaseLayout>
```

**Generated HTML:**

```html
<head>
  <!-- DNS prefetch for faster domain resolution -->
  <link rel="dns-prefetch" href="https://github.com" />
  <link rel="preconnect" href="https://github.com" crossorigin />
  <!-- Add preconnect for your docs domain if hosted externally -->
  <!-- <link rel="dns-prefetch" href="https://your-docs-site.example.com" /> -->
  <!-- <link rel="preconnect" href="https://your-docs-site.example.com" crossorigin /> -->
</head>
```

## Performance Budget Compliance

**Current homepage metrics:**

- Total JS: ~1KB gzipped (homepage-specific)
- View Transitions: ~5KB gzipped (framework feature)
- CSS: ~4KB gzipped
- Images: 0 (SVG icons only)

**Budget status:**

- ✅ JS Budget: 50KB (using ~6KB = 12%)
- ✅ CSS Budget: 20KB (using ~4KB = 20%)
- ✅ Image Budget: 200KB (using 0KB = 0%)

## Consequences

### Positive

- **Optimal performance**: Minimal JS, native HTML features
- **Maintainable**: Clear data structures with type safety
- **Honest metrics**: Hardcoded scores with clear disclaimers
- **Progressive enhancement**: Works without JS, better with JS
- **Simple build**: No complex metric generation

### Neutral/To Address

- **Manual updates**: Metrics require conscious maintenance
  - Mitigated by: Type safety and documentation
  - Benefit: Forces honest evaluation of claims
- **Script per card**: Module bundling handles this efficiently
  - Actual cost: ~1KB total, not per card

### Negative

- None identified - current implementation is optimal

## Monitoring and Validation

**Performance checks:**

```bash
# Build and check bundle sizes
pnpm run build
ls -lh dist/_astro/*.js

# Run Lighthouse
pnpm run perf:lighthouse

# Check performance budgets
pnpm run perf:budgets
```

**Validation criteria:**

- ✅ No `client:*` directives on index.astro
- ✅ No Preact/React islands
- ✅ Total JS < 10KB gzipped (homepage-specific)
- ✅ Lighthouse Performance > 95
- ✅ Native HTML features used where possible

## Future Considerations

**If adding images to index.astro:**

```astro
<Image 
  src={image}
  alt="Description"
  loading="lazy"        // For below-fold images
  loading="eager"       // For above-fold hero images
  format={["avif", "webp"]}
/>
```

**If adding interactive components:**

1. Prefer CSS-only solutions
2. Use `client:visible` for below-fold interactivity
3. Use `client:idle` for non-critical enhancements
4. **Never** use `client:load` without ADR justification
5. Document decision in this ADR

**If metrics become dynamic:**

- Create ADR justifying the complexity
- Implement Lighthouse CI integration
- Add caching strategy
- Update disclaimer language

## References

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [HTML Details Element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [Progressive Enhancement Principles](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
- ADR-001: Preact Island Usage Policy
- Internal: `src/components/molecules/ExpandableFeatureCard.astro`
- Internal: `src/pages/index.astro`
