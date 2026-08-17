---
title: Phase 9 - Performance & SEO
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers site optimization, performance reports, SEO implementation, and
  monitoring setup with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
---
## Overview

- **Tier**: Polish (Phase 9 of 12)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0-8 completed
- **Deliverables**: Optimized site, performance reports, SEO implementation, monitoring setup

## Entry Criteria

- [ ] QA testing complete
- [ ] All bugs fixed
- [ ] Content finalized
- [ ] Images already optimized (Phase 7)

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 9.01 | Audit current performance | Essential | Baseline metrics |
| 9.02 | Optimize critical path | Essential | CSS, fonts, scripts |
| 9.03 | Implement caching strategy | Essential | Headers via `public/_headers` |
| 9.04 | Minify and compress | Essential | Handled by Astro build |
| 9.05 | Set up CDN | Essential | Cloudflare Pages default |
| 9.06 | Optimize web fonts | Essential | Subset, preload |
| 9.07 | Technical SEO audit | Essential | Crawlability, indexing |
| 9.08 | Schema markup | Essential | Structured data |
| 9.09 | Generate sitemap | Essential | XML sitemap |
| 9.10 | Submit to search engines | Essential | Google, Bing |
| 9.11 | Performance monitoring | Recommended | RUM setup |
| 9.12 | Create performance budget CI | Recommended | Lighthouse CI automated checks |

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

### Essential (all projects)

- [ ] Lighthouse scores meet targets (95+ performance)
- [ ] Core Web Vitals pass (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] All images optimized with modern formats
- [ ] Fonts subsetted and preloaded
- [ ] Caching strategy implemented via `public/_headers`
- [ ] SEO audit passes
- [ ] Schema markup implemented
- [ ] Sitemap generated and submitted
- [ ] Bundle sizes within budget (JS < 160KB, CSS < 50KB)

### Recommended (most projects)

- [ ] Performance monitoring active (RUM)
- [ ] Lighthouse CI integrated in GitHub Actions

### Advanced (portfolio/enterprise)

- [ ] Service worker active for offline support
- [ ] Performance dashboards configured

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
