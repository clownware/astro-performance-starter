---
title: 'ADR-024: Live Quality Badges for Performance Transparency'
description: >-
  Implementation of live Lighthouse score badges to surface CI results and
  prove performance claims with zero JavaScript overhead
lastUpdated: 2025-10-01T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

The template claims "95+ Lighthouse scores" and "100/100" performance, but these claims need verification. Users should be able to:

1. **Verify claims instantly** – Click a badge to see live Lighthouse results
2. **Trust the metrics** – See that scores are validated by CI/CD
3. **Monitor performance** – Check real-world scores on the deployed site

### Problem

- Performance claims in marketing copy lack proof
- No easy way for users to verify Lighthouse scores
- CI validates performance but results aren't surfaced publicly

### Requirements

- **Zero JavaScript** – Badges must work without client-side code
- **Accessible** – Proper ARIA labels and semantic HTML
- **Performant** – No external badge services that slow page load
- **Verifiable** – Link to live PageSpeed Insights results
- **Maintainable** – No manual score updates required

## Decision

Implement **hybrid static badges with live verification links**:

### Implementation Strategy

1. **Static badges** – Use semantic HTML/CSS (no external badge services)
2. **Live verification** – Link to PageSpeed Insights for real-time scores
3. **CI indicator** – Show "Verified by CI" badge for trust signal
4. **Multiple placements** – Index page, Footer, and README

### Badge Locations

#### 1. Index Page (Primary)

Added to Lighthouse Metrics section (`#performance`):

- **"View Live Scores" button** – Links to PageSpeed Insights
- **"Verified by CI" badge** – Shows CI validation
- Responsive layout (stacks on mobile)
- Hover effects for interactivity

#### 2. Footer (Persistent)

Added to footer badges row:

- **"🎯 95+ Lighthouse" badge** – Clickable, links to PageSpeed
- Matches existing badge style (MIT Licensed, Production Ready, etc.)
- Visible on every page

#### 3. README (Discovery)

Added Shields.io badge at top:

```markdown
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-success?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis?url=https://clownware.github.io/astro-performance-starter/)
```

- Shows up in GitHub repo
- Clickable for verification
- Uses Lighthouse logo for brand recognition

## Implementation Details

### Index Page Badge

```astro
<!-- Live Quality Badge -->
<div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
  <a 
    href={siteLinks.pagespeed}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-800 transition-colors group"
    aria-label="View live Lighthouse scores on PageSpeed Insights"
  >
    <span class="text-sm font-medium">🎯 View Live Scores</span>
    <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
      <!-- External link icon -->
    </svg>
  </a>
  
  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-medium">
    <svg class="w-3 h-3"><!-- Checkmark icon --></svg>
    Verified by CI
  </span>
</div>
```

### Footer Badge

```astro
<a 
  href={siteLinks.pagespeed}
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
  aria-label="View live Lighthouse scores"
>
  🎯 95+ Lighthouse
</a>
```

### Design Tokens Used

- **Colors**: `bg-primary-100`, `text-primary-800`, `hover:bg-primary-200`
- **Spacing**: `px-4 py-2`, `gap-3 sm:gap-4`
- **Typography**: `text-sm font-medium`, `text-xs`
- **Transitions**: `transition-colors`, `transition-transform`

## Alternatives Considered

### 1. Lighthouse CI Server (Rejected)

**Pros:**

- Automated badge generation
- Historical trend tracking
- Official Lighthouse CI integration

**Cons:**

- Requires external hosting (Heroku, Vercel, etc.)
- Additional infrastructure to maintain
- Potential single point of failure
- Costs for hosting

**Why rejected:** Too much infrastructure overhead for a starter template.

### 2. GitHub Actions Badge (Rejected)

**Pros:**

- Automated from CI workflow
- No external dependencies
- Shows pass/fail status

**Cons:**

- Only shows pass/fail, not actual scores
- Doesn't link to detailed results
- Less informative for users

**Why rejected:** Doesn't surface actual Lighthouse scores.

### 3. Embedded Lighthouse Widget (Rejected)

**Pros:**

- Shows live scores in-page
- No external navigation needed

**Cons:**

- Requires JavaScript (violates zero-JS principle)
- Adds external dependencies
- Performance impact
- Privacy concerns (external API calls)

**Why rejected:** Violates zero-JS baseline and adds performance overhead.

### 4. Manual Score Updates (Rejected)

**Pros:**

- Simple to implement
- No external dependencies

**Cons:**

- Requires manual updates after every change
- Easy to forget or become stale
- No verification mechanism

**Why rejected:** Not maintainable, defeats purpose of "live" badge.

## Consequences

### Positive

- **Transparency** – Users can verify performance claims instantly
- **Trust** – "Verified by CI" badge builds confidence
- **Zero overhead** – No JavaScript, no external services
- **Accessibility** – Proper ARIA labels and semantic HTML
- **SEO benefit** – README badge shows up in GitHub search
- **Marketing** – Prominent placement reinforces performance-first messaging

### Negative

- **Manual URL updates** – If deployment URL changes, badges need updating
- **PageSpeed dependency** – Relies on Google's PageSpeed Insights service
- **No automation** – Scores aren't auto-updated (but link shows live data)

### Neutral

- **Static scores** – Badge shows "95+" not exact score (intentional)
- **Multiple placements** – Increases visibility but adds maintenance points

## Monitoring

### Success Metrics

- **Click-through rate** – Track badge clicks to PageSpeed Insights
- **User feedback** – Monitor for questions about performance claims
- **CI validation** – Ensure CI continues to enforce performance budgets

### Maintenance

- **Quarterly review** – Verify PageSpeed Insights URL still works
- **Score updates** – If template performance improves, update badge text
- **Deployment changes** – Update URLs if deployment location changes

## Related Decisions

- [ADR 014: Index Page Performance Strategy](./014-index-page-performance-strategy.md) – Performance optimization approach
- [ADR 020: Page Performance Patterns](./020-page-performance-patterns.md) – Performance best practices

## References

- [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Shields.io Badge Service](https://shields.io/)
- [WCAG 2.1 Link Purpose](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)

## Implementation Checklist

- [x] Add badge to index.astro performance section
- [x] Add badge to Footer component
- [x] Add Shields.io badge to README
- [x] Verify PageSpeed Insights URL works
- [x] Test accessibility (ARIA labels, keyboard navigation)
- [x] Test responsive layout (mobile, tablet, desktop)
- [x] Document in ADR
- [ ] Update CI workflow to fail on performance regression
- [ ] Add performance monitoring to deployment pipeline

## Future Enhancements

### Phase 1 (Optional)

- Add Lighthouse CI workflow step to generate artifacts
- Store historical scores in GitHub Actions artifacts
- Create performance trend visualization

### Phase 2 (Advanced)

- Set up Lighthouse CI server for detailed tracking
- Add performance regression detection
- Generate automated performance reports

### Phase 3 (Enterprise)

- Integrate with monitoring services (Datadog, New Relic)
- Add Core Web Vitals tracking
- Create performance dashboard
