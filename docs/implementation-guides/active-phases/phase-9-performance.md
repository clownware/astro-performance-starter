---
title: Phase 9 - Performance & SEO
lastUpdated: true
description: >-
  Covers site optimization, performance reports, SEO implementation, and
  monitoring setup with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
sidebar:
  order: 9
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
| 9.01 | Audit current performance | Essential | Baseline metrics (`pnpm run perf:baseline`, `pnpm run perf:lhci`) |
| 9.02 | Optimize critical path | Essential | CSS, fonts, scripts |
| 9.03 | Implement caching strategy | Essential | Headers via `public/_headers` (no service worker ships) |
| 9.04 | Minify and compress | Essential | Handled by the Astro build |
| 9.05 | Set up CDN | Essential | GitHub Pages (shipped deploy) or any static host's CDN |
| 9.06 | Optimize web fonts | Essential | Already subset and self-hosted (ADR-053); keep preloads within `pnpm run fonts:gate` (ADR-058) |
| 9.07 | Technical SEO audit | Essential | Crawlability, indexing |
| 9.08 | Schema markup | Essential | Structured data |
| 9.09 | Generate sitemap | Essential | `@astrojs/sitemap` (shipped) |
| 9.10 | Submit to search engines | Essential | Google, Bing |
| 9.11 | Performance monitoring | Advanced | RUM setup |
| 9.12 | Tune performance budget CI | Recommended | `budgets.json` + `lighthouserc.json` gates already run in CI |

## Common Pitfalls

1. **Ignoring Third-Party Scripts**: External scripts killing performance
   - **Solution**: Lazy load, use facades, or self-host

2. **Unoptimized Fonts**: Loading entire font families
   - **Solution**: Subset fonts, use variable fonts, preload critical (the shipped Geist/Inter files already are)

3. **Missing Caching Headers**: Not leveraging browser cache
   - **Solution**: Set appropriate cache-control headers

4. **Blocking Resources**: CSS/JS blocking render
   - **Solution**: Inline critical CSS, defer non-critical JS

5. **Poor Image Strategy**: Wrong formats or sizes
   - **Solution**: Use modern formats, responsive images

## Exit Criteria

### Essential (all projects)

- [ ] Lighthouse scores meet targets (95+ performance measured; CI floors are performance ≥ 0.90, accessibility ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.90 in `lighthouserc.json` and `lighthouserc.mobile.json`)
- [ ] Core Web Vitals pass (LCP < 2.5s, INP ≤ 200ms, CLS < 0.1)
- [ ] All images optimized with modern formats (`pnpm run images:gate` passes)
- [ ] Fonts subsetted and preloaded (`pnpm run fonts:gate` passes)
- [ ] Caching strategy implemented via `public/_headers` (honoured by Cloudflare Pages/Netlify; a no-op on GitHub Pages — ADR-051)
- [ ] SEO audit passes
- [ ] Schema markup implemented
- [ ] Sitemap generated and submitted
- [ ] Bundle sizes within budget (`pnpm run perf:budgets`: JS ≤ 160KB total raw; CSS ~50KB is advisory, not gated)

### Recommended (most projects)

- [ ] Lighthouse CI thresholds reviewed for your site (`lighthouse.yml` already gates desktop and mobile)
- [ ] Budgets tightened in `budgets.json` once you know your real sizes

### Advanced (portfolio/enterprise)

- [ ] Performance monitoring active (RUM)
- [ ] Performance dashboards configured
- [ ] Service worker for offline support (optional — none ships with the starter)

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
   - Re-run optimization pipeline (`pnpm run images:optimize`)
   - Check CDN configuration
   - Verify responsive images

## AI Assistant Notes

### Key Files to Reference

- `astro.config.mjs` - Build optimizations, sitemap, fonts
- `public/_headers` - Caching and security headers
- `budgets.json`, `budget-overrides.json` - Raw-size budgets enforced by `pnpm run perf:budgets`
- `lighthouserc.json`, `lighthouserc.mobile.json` - Lighthouse CI floors
- `scripts/src/baseline-performance.ts` (`pnpm run perf:baseline`) - Performance baseline script

### Common Prompts for This Phase

- "Optimize bundle size for production"
- "Implement Core Web Vitals monitoring"
- "Set up caching headers for static assets"
- "Tighten budgets.json and the Lighthouse CI floors for this site"

### Context Requirements

- Current performance metrics
- Target audience geography
- CDN preferences
- Analytics platform
