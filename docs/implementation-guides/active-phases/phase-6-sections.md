---
title: Phase 6 - Page Sections & Composition
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers composed page sections, hero components, feature grids, and
  testimonials with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
---
## Overview

- **Tier**: Build (Phase 6 of 12)
- **Duration**: 2-3 days
- **Dependencies**: Phase 0-5 completed
- **Deliverables**: Composed page sections, hero components, feature grids, testimonials

## Entry Criteria

- [ ] Component library built (Phase 5)
- [ ] Design tokens integrated
- [ ] Layout system functional
- [ ] Content schemas defined

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 6.01 | Build Hero section | Essential | Text-focused; add animations as Advanced |
| 6.02 | Create Features grid | Essential | Static 3-column; enhanced animations are Advanced |
| 6.03 | Add CTA section | Essential | Simple banner; advanced styling is Recommended |
| 6.04 | Build Footer section | Essential | Links and copyright |
| 6.05 | Create About section | Essential | Text and image; enhanced layout is Recommended |
| 6.06 | Add Contact section | Essential | Form or contact info; advanced form is Recommended |
| 6.07 | Build Blog listing | Essential | Card-based layout |
| 6.08 | Create Project grid | Essential | Portfolio showcase |
| 6.09 | Create Testimonials | Recommended | Carousel or grid |
| 6.10 | Build Stats section | Recommended | Animated numbers via Preact island |
| 6.11 | Add Timeline | Recommended | Project/career history |
| 6.12 | Create FAQ section | Recommended | Accordion pattern |
| 6.13 | Build Newsletter | Advanced | Form with validation and API integration |
| 6.14 | Add Team section | Recommended | Member cards |
| 6.15 | Create Pricing table | Advanced | Comparison layout |
| 6.16 | Build Process section | Recommended | Step-by-step visual |

## Lightweight Section Loading

> **Why this change?** Earlier versions embedded large inline scripts for each section. We now extract the observer/animation logic into a tiny Preact island (`StatsObserverIsland.tsx`) imported **once**. Each section renders minimal HTML on the server so users without JavaScript still see meaningful content.
>
> **Implementation tips**
>
> 1. Render placeholders server-side (numbers without animation).
> 2. In the island, hydrate only when the section becomes visible (`client:visible`).
> 3. Share a single IntersectionObserver utility.

## Common Pitfalls

1. **Over-nesting Sections**: Don't wrap sections in sections unnecessarily
   - **Solution**: Use semantic HTML, sections for major content areas only

2. **Missing Semantic Structure**: Using divs instead of section/article
   - **Solution**: Use appropriate HTML5 elements

3. **Poor Mobile Experience**: Desktop-only section designs
   - **Solution**: Design mobile-first, test at all breakpoints

4. **Inaccessible Animations**: Motion without considering preferences
   - **Solution**: Always respect prefers-reduced-motion

5. **Heavy Section Components**: Loading too much JavaScript
   - **Solution**: Keep sections static, use islands sparingly

## Exit Criteria

### Essential (all projects)

- [ ] Hero, Features, CTA, Footer, About, Contact, Blog listing, Project grid built
- [ ] All sections accessible (WCAG AA)
- [ ] All sections mobile responsive (all breakpoints tested)

### Recommended (most projects)

- [ ] Testimonials, Stats, Timeline, FAQ, Team sections added where relevant
- [ ] Smooth scroll interactions via CSS `scroll-behavior`

### Advanced (portfolio/enterprise)

- [ ] Animated hero and section transitions via View Transitions API
- [ ] Stats section uses Preact island with `client:visible`
- [ ] Newsletter section with API integration

## Rollback Strategy

If section implementation causes issues:

1. **Performance Regression**:
   - Remove animations/islands
   - Simplify to static HTML
   - Check bundle size impact

2. **Layout Issues**:
   - Revert to basic grid
   - Remove complex positioning
   - Test on real devices

3. **Accessibility Problems**:
   - Simplify interactions
   - Add missing ARIA labels
   - Test with screen readers

## AI Assistant Notes

### Key Files to Reference

- `src/components/sections/*` - All section components
- `src/pages/index.astro` - Section composition
- Section-specific assets and content

### Common Prompts for This Phase

- "Create a testimonials section with carousel"
- "Build an accessible FAQ accordion section"
- "Design a hero section with animated background"
- "Compose sections for landing page"

### Context Requirements

- Brand guidelines for styling
- Content requirements per section
- Performance constraints
- Animation preferences
