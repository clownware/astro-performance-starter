---
title: Phase 4 - Skeleton Layout & Routing
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers base layout, routing structure, navigation, and metadata system for
  both tracks
tableOfContents: true
pagefind: true
---
## Overview

- **Track**: Both (MVP & Showcase)
- **Effort**: Moderate, depends on project complexity
- **Dependencies**: Phase 0-3 completed
- **Deliverables**: Base layout, routing structure, navigation, metadata system

## Entry Criteria

- [ ] Design system configured
- [ ] Content architecture defined
- [ ] Tooling and CI functional
- [ ] Initial performance baseline planned

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 4.01 | Create base layout | ✅ | ✅ | HTML structure, metadata |
| 4.02 | Build header component | ✅ | ✅ | Logo, nav, theme toggle |
| 4.03 | Build footer component | ✅ | ✅ | Links, copyright |
| 4.04 | Design mobile navigation | ✅ | ✅ | Responsive pattern |
| 4.05 | Create minimal page routes | ✅ | ✅ | `index.astro` & `404.astro` only. See guide. |
| 4.06 | Set up metadata system | ✅ | ✅ | SEO, OpenGraph |
| 4.07 | Configure font loading | ✅ | ✅ | Preload, swap |
| 4.08 | Add security headers | ✅ | ✅ | CSP, HSTS |
| 4.09 | Set up skip links | ✅ | ✅ | Accessibility |
| 4.10 | Create error pages | ✅ | ✅ | 404, 500 |
| 4.11 | Review analytics options | ☑️ | ☑️ | Optional. See dedicated guide. |
| 4.12 | Baseline performance | ✅ | ✅ | Initial metrics |

### Analytics Setup

This template does not include analytics out-of-the-box to respect user privacy. Adding analytics is an optional step that you can take based on your project's needs. We have created a detailed guide with copy-paste recipes for popular, privacy-focused providers.

- **Guide: [Adding Web Analytics](/implementation-guides/05-deployment/optional-analytics)**

This approach keeps the template clean while empowering you to make the right choice for your site.

## Common Pitfalls

1. **Missing Font Attributes**: Forgetting crossorigin on preload
   - **Solution**: Always include all required attributes

2. **Blocking Resources**: Scripts/styles blocking render
   - **Solution**: Use defer/async, critical CSS inline

3. **Poor Mobile UX**: Desktop-first navigation
   - **Solution**: Design mobile-first, test on devices

4. **Missing Meta Tags**: Incomplete SEO/social setup
   - **Solution**: Use layout component for consistency

## Exit Criteria

- [ ] Base layout component complete
- [ ] Header with navigation functional
- [ ] Footer with links and social
- [ ] Mobile navigation working smoothly
- [ ] All main routes created
- [ ] Metadata system implemented
- [ ] Fonts loading optimally
- [ ] Security headers configured
- [ ] Skip links for accessibility
- [ ] Error pages created
- [ ] Analytics ready (privacy-first)
- [ ] Performance baseline recorded

## Rollback Strategy

If skeleton needs major changes:

1. **Layout Issues**:
   - Keep old layout as BaseLayoutV1
   - Migrate pages gradually
   - Test each migration

2. **Route Changes**:
   - Set up redirects in config
   - Update sitemap
   - Check internal links

3. **Performance Regression**:
   - Compare with baseline
   - Check resource loading
   - Review recent changes

## AI Assistant Notes

### Key Files to Reference

- `src/layouts/BaseLayout.astro` - Main layout
- `src/components/layout/*` - Header/Footer
- `public/_headers` - Security headers
- `perf-baseline/scores.json` - Performance targets

### Common Prompts for This Phase

- "Create Astro layout with SEO metadata"
- "Build accessible mobile navigation"
- "Set up security headers for Astro"
- "Configure font preloading strategy"

### Context Requirements

- Site structure and pages
- Brand/logo assets
- Navigation hierarchy
- Performance targets
