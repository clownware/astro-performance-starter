---
title: Phase 9 - Performance & SEO
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers site optimization, performance reports, SEO implementation, and
  monitoring setup for both tracks
tableOfContents: true
pagefind: true
---
## Overview

- **Track**: Both (MVP & Showcase)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0-8 completed
- **Deliverables**: Optimized site, performance reports, SEO implementation, monitoring setup

## Entry Criteria

- [ ] QA testing complete
- [ ] All bugs fixed
- [ ] Content finalized
- [ ] Images already optimized (Phase 7)

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 9.01 | Audit current performance | ✅ | ✅ | Baseline metrics |
| 9.02 | Optimize critical path | ✅ | ✅ | CSS, fonts, scripts |
| 9.03 | Implement caching strategy | ✅ | ✅ | Headers, service worker |
| 9.04 | Minify and compress | ✅ | ✅ | HTML, CSS, JS |
| 9.05 | Set up CDN | ✅ | ✅ | Static assets |
| 9.06 | Optimize web fonts | ✅ | ✅ | Subset, preload |
| 9.07 | Technical SEO audit | ✅ | ✅ | Crawlability, indexing |
| 9.08 | Schema markup | ✅ | ✅ | Structured data |
| 9.09 | Generate sitemap | ✅ | ✅ | XML sitemap |
| 9.10 | Submit to search engines | ✅ | ✅ | Google, Bing |
| 9.11 | Performance monitoring | ❌ | ✅ | RUM setup |
| 9.12 | Create performance budget CI | ❌ | ✅ | Automated checks |

## Common Pitfalls

1. **Ignoring Third-Party Scripts**: External scripts killing performance
   - **Solution**: Lazy load, use facades, or self-host

2. **Unoptimized Fonts**: Loading entire font families
   - **Solution**: Subset fonts, use variable fonts, preload critical

3. **Missing Caching Headers**: Not leveraging browser cache
   - **Solution**: Set appropriate cache-control headers

4. **Blocking Resources**: CSS/JS blocking render
   - **Solution**: Inline critical CSS, defer non-critical JS

5. **Poor Image Strategy**: Wrong formats or sizes
   - **Solution**: Use modern formats, responsive images

## Exit Criteria

- [ ] Lighthouse scores meet targets (97+ performance)
- [ ] Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] All images optimized with modern formats
- [ ] Critical CSS inlined, non-critical deferred
- [ ] Fonts subsetted and preloaded
- [ ] Caching strategy implemented
- [ ] Service worker active (Showcase)
- [ ] SEO audit passes
- [ ] Schema markup implemented
- [ ] Sitemap generated and submitted
- [ ] Performance monitoring active (Showcase)
- [ ] Bundle sizes within budget

## Rollback Strategy

If performance degrades:

1. **Script Issues**:
   - Remove problematic third-party scripts
   - Revert to previous bundle configuration
   - Check for unintended dependencies

2. **Style Regression**:
   - Verify critical CSS extraction
   - Check for CSS-in-JS issues
   - Revert style changes

3. **Image Problems**:
   - Re-run optimization pipeline
   - Check CDN configuration
   - Verify responsive images

## AI Assistant Notes

### Key Files to Reference

- `astro.config.mjs` - Build optimizations
- `public/_headers` - Caching strategy
- Performance audit scripts
- Lighthouse configuration

### Common Prompts for This Phase

- "Optimize bundle size for production"
- "Implement Core Web Vitals monitoring"
- "Set up caching headers for static assets"
- "Create performance budget CI workflow"

### Context Requirements

- Current performance metrics
- Target audience geography
- CDN preferences
- Analytics platform
