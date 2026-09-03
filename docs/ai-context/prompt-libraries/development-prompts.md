---
title: Development Prompts
lastUpdated: true
description: Copy-paste prompts for core development tasks using AI assistants
tableOfContents: true
pagefind: true
---

> 🤖 **Purpose**: Copy-paste prompts for component creation, performance optimization, and architecture decisions

## Component Creation Prompts

### Basic Component

```text
Create an Astro component called [ComponentName] that:
- Has TypeScript props interface
- Uses our design tokens from tokens/ (semantic roles in tokens/semantic.json, built on tokens/base.json)
- Is fully accessible with proper ARIA labels
- Works without JavaScript
- Follows our atomic design pattern
- Includes these props: [list props]
- Has these variants: [list variants]

Reference our Button component pattern from /implementation-guides/active-phases/phase-5-components/
```

### Interactive Component

```text
Create an Astro component with optional interactivity:
- Name: [ComponentName]
- Static by default (zero JS)
- Prefer a CSS-only solution; if state is genuinely needed, use a Preact island for: [interaction details]
- Use client:idle or client:visible (client:load is forbidden per ADR-001)
- Follow islands architecture from /patterns/islands-architecture/
- Maintain all functionality without JavaScript
- Include keyboard navigation
- Test with screen readers

Performance budget: < 50KB per island (Tier 2 in /implementation-guides/reference/budgets-guardrails/)
```

### Complex Layout Component

```text
Build a [SectionName] section component that:
- Uses our Container and Section structural components
- Responsive with our Grid component
- Follows mobile-first approach
- Uses semantic HTML structure
- Includes these content areas: [list areas]
- Has these responsive breakpoints: [list breakpoints]
- References design tokens for spacing/colors

See /implementation-guides/active-phases/phase-6-sections/ for section patterns
```

## Content Modeling Prompts

### Content Collection Schema

```text
Create an Astro content collection schema for [ContentType]:
- Use Zod for validation
- Include these required fields: [list fields]
- Include these optional fields: [list fields]
- Add draft: boolean field (default: false)
- Add proper TypeScript types
- Include image field using Astro's image helper
- Add any computed fields needed
- Reference our blog schema in /implementation-guides/completed/phase-1-content-arch/

Consider future content needs and extensibility
```

### MDX Component

```text
Create an MDX component for [Purpose]:
- Accepts these props: [list props]
- Handles this content: [describe content]
- Works in our MDX component system
- Includes proper TypeScript types
- Handles edge cases (empty state, errors)
- Is accessible and semantic
- Can be used like: <ComponentName prop="value" />

Follow MDX patterns from /patterns/mdx-components/
```

## Performance Optimization Prompts

### Image Optimization

```text
Optimize images in [Component/Page]:
- Use Astro's <Image> component
- Generate AVIF and WebP formats
- Include proper sizes attribute
- Add loading="lazy" except above fold
- Set width and height to prevent CLS
- Use our src/components/atoms/Image.astro wrapper (ADR-030)
- Keep images under 200KB after optimization

Reference /patterns/performance-patterns/ for examples
```

### Bundle Size Reduction

```text
Reduce JavaScript bundle size for [Feature]:
- Current size: [X]KB
- Target size: < [Y]KB
- Identify unused imports
- Use dynamic imports where appropriate
- Consider CSS-only alternatives
- Implement progressive enhancement
- Stay within our 160KB total raw JS budget

See /implementation-guides/reference/budgets-guardrails/ for limits
```

### Lighthouse Score Improvement

```text
Improve Lighthouse scores for [Page]:
- Current scores: [list scores]
- Target: 95+ performance, 98+ accessibility
- Focus on: [specific metrics like LCP, CLS]
- Check against our performance budgets
- Implement resource hints
- Optimize critical rendering path
- Add performance monitoring

Reference /implementation-guides/active-phases/phase-9-performance/
```

## Testing & Quality Prompts

### Accessibility Audit

```text
Audit [Component/Page] for accessibility:
- Test with keyboard navigation only
- Check color contrast (4.5:1 minimum)
- Verify screen reader compatibility
- Ensure proper heading hierarchy
- Check focus indicators
- Test with assistive technologies
- Validate semantic HTML structure
- Ensure alt text on images

Must meet WCAG AA standards from /implementation-guides/reference/budgets-guardrails/
```

### E2E Test Creation

```text
Write Playwright E2E test for [Feature]:
- Test happy path: [describe flow]
- Test error states
- Test on mobile and desktop viewports
- Include accessibility checks with axe-core
- Test without JavaScript enabled
- Measure performance impact
- Follow our testing patterns

See /implementation-guides/active-phases/phase-8-qa/ for test structure
```

## Architecture & Patterns Prompts

### Island Architecture Decision

```text
Help me decide if [Feature] needs JavaScript:
- Current functionality: [describe what it does]
- User interaction: [describe interactions]
- Options to consider:
  1. Pure CSS solution
  2. <ClientRouter /> (astro:transitions) only
  3. Preact island (client:idle or client:visible)

Factors: performance budget, maintenance, user experience
Reference /patterns/islands-architecture/ patterns
```

### Design System Integration

```text
Integrate [Feature] with our design system:
- Use semantic tokens from tokens/semantic.json (base palette in tokens/base.json — ADR-047)
- Follow component naming conventions
- Ensure dark mode compatibility
- Check responsive behavior
- Add proper TypeScript types
- Include accessibility features
- Document usage patterns
- Add the component to the /showcase living style guide (ADR-049)

Reference /development/how-to-use-design-tokens/ for the token structure
```

### Performance Pattern Implementation

```text
Implement [Pattern] for better performance:
- Current metric: [value]
- Target metric: [value]
- Pattern to implement: [lazy loading, code splitting, etc.]
- Expected improvement: [estimate]
- Implementation approach: [details]
- How to measure success
- Rollback plan if it fails

Follow patterns from /patterns/performance-patterns/
```

## Quick Fixes

### Add Dark Mode Support

```text
Add dark mode support to [Component]:
- Use our semantic role tokens — they flip in .dark automatically
- No manual dark: variants (ADR-047)
- Test contrast in both modes
- Respect system preferences
- No flash of wrong theme
- Reference /development/how-to-use-design-tokens/ for the token structure
```

### Make Component Responsive

```text
Make [Component] responsive:
- Mobile-first approach
- Use our breakpoint system
- Test at 320px, 768px, 1024px, 1440px
- Use Grid component for layouts
- Container queries if needed
- No horizontal scroll at any size
```

### Improve SEO

```text
Improve SEO for [Page]:
- Add proper meta tags
- Use semantic HTML
- Add structured data if relevant
- Optimize images with alt text
- Check heading hierarchy
- Add OpenGraph tags
- Update sitemap
- Reference BaseLayout meta setup
```

## Usage Tips

1. **Always provide context** about your current phase and tier (Foundation, Build, or Polish — ADR-033)
2. **Reference specific files** from the implementation guides
3. **Include current metrics** when asking for optimization
4. **Mention constraints** like bundle size or browser support
5. **Ask for rollback plans** when making significant changes

Remember: These templates are starting points. Customize based on your specific needs and always reference the relevant implementation guide phase.
