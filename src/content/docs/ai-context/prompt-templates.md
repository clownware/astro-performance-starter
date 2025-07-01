---
title: AI Assistant Prompt Templates
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: Copy-paste prompts for common development tasks using AI assistants.
---
> 🤖 **Purpose**: Copy-paste prompts for common development tasks

## Component Creation Prompts

### Basic Component

```
Create an Astro component called [ComponentName] that:
- Has TypeScript props interface
- Uses our design tokens from tokens/base.json
- Is fully accessible with proper ARIA labels
- Works without JavaScript
- Follows our atomic design pattern
- Includes these props: [list props]
- Has these variants: [list variants]

Reference our Button component pattern from phase-5-components.md
```

### Interactive Component

```
Create an Astro component with optional interactivity:
- Name: [ComponentName]
- Static by default (zero JS)
- Progressive enhancement with Alpine.js for: [interaction details]
- Use client:visible directive if needed
- Follow islands architecture from patterns/islands-architecture.md
- Maintain all functionality without JavaScript
- Include keyboard navigation
- Test with screen readers

Performance budget: < 5KB JavaScript
```

### Complex Layout Component

```
Build a [SectionName] section component that:
- Uses our Container and Section structural components
- Responsive with our Grid component
- Follows mobile-first approach
- Uses semantic HTML structure
- Includes these content areas: [list areas]
- Has these responsive breakpoints: [list breakpoints]
- References design tokens for spacing/colors

See phase-6-sections.md for section patterns
```

## Content Modeling Prompts

### Content Collection Schema

```
Create an Astro content collection schema for [ContentType]:
- Use Zod for validation
- Include these required fields: [list fields]
- Include these optional fields: [list fields]
- Add draft: boolean field (default: false)
- Add proper TypeScript types
- Include image field using Astro's image helper
- Add any computed fields needed
- Reference our blog schema in phase-1-content-arch.md

Consider future content needs and extensibility
```

### MDX Component

```
Create an MDX component for [Purpose]:
- Accepts these props: [list props]
- Handles this content: [describe content]
- Works in our MDX component system
- Includes proper TypeScript types
- Handles edge cases (empty state, errors)
- Is accessible and semantic
- Can be used like: <ComponentName prop="value" />

Follow MDX patterns from content-collections.md
```

## Performance Optimization Prompts

### Image Optimization

```
Optimize images in [Component/Page]:
- Use Astro's <Image> component
- Generate AVIF and WebP formats
- Include proper sizes attribute
- Add loading="lazy" except above fold
- Set width and height to prevent CLS
- Use our OptimizedImage wrapper pattern
- Keep images under 200KB after optimization

Reference performance-patterns.md for examples
```

### Bundle Size Reduction

```
Reduce JavaScript bundle size for [Feature]:
- Current size: [X]KB
- Target size: < [Y]KB
- Identify unused imports
- Use dynamic imports where appropriate
- Consider CSS-only alternatives
- Implement progressive enhancement
- Stay within our 160KB total JS budget

See budgets-guardrails.md for limits
```

### Lighthouse Score Improvement

```
Improve Lighthouse scores for [Page]:
- Current scores: [list scores]
- Target: 97+ performance, 98+ accessibility
- Focus on: [specific metrics like LCP, CLS]
- Check against our performance budgets
- Implement resource hints
- Optimize critical rendering path
- Add performance monitoring

Reference phase-9-performance.md
```

## Testing & Quality Prompts

### Accessibility Audit

```
Audit [Component/Page] for accessibility:
- Test with keyboard navigation only
- Check color contrast (4.5:1 minimum)
- Verify screen reader compatibility
- Ensure proper heading hierarchy
- Check focus indicators
- Test with browser dev tools
- Validate ARIA usage
- Test reduced motion preferences

Must meet WCAG AA standards from budgets-guardrails.md
```

### E2E Test Creation

```
Write Playwright E2E test for [Feature]:
- Test happy path: [describe flow]
- Test error states
- Test on mobile and desktop viewports
- Include accessibility checks with axe-core
- Test without JavaScript enabled
- Measure performance impact
- Follow our testing patterns

See phase-8-qa.md for test structure
```

## Architecture & Patterns Prompts

### Island Architecture Decision

```
Evaluate if [Feature] needs client-side JavaScript:
1. Can it be done with HTML/CSS only?
2. Can it be done at build time?
3. Can View Transitions API work?
4. What specific interactivity is needed?
5. What's the performance cost?
6. Which island directive to use?

If JS is needed, document in ADR following our template
Reference islands-architecture.md for decision framework
```

### Performance Pattern Implementation

```
Implement [Pattern] for better performance:
- Current metric: [value]
- Target metric: [value]
- Pattern to implement: [lazy loading, code splitting, etc.]
- Expected improvement: [estimate]
- Implementation approach: [details]
- How to measure success
- Rollback plan if it fails

Follow patterns from performance-patterns.md
```

## Troubleshooting Prompts

### Debug Build Error

```
Debug Astro build error:
- Error message: [paste error]
- When it occurs: [build/dev/preview]
- Recent changes: [list changes]
- Check: TypeScript errors, missing deps, schema issues
- Run: astro check, tsc --noEmit
- Verify content collections schema
- Check for circular dependencies

Reference our tooling setup in phase-3-tooling.md
```

### Performance Regression

```
Investigate performance regression:
- Metric that regressed: [LCP, FID, CLS, etc.]
- When it started: [commit/date]
- Current value: [X]
- Previous value: [Y]
- Check: bundle sizes, image sizes, render-blocking resources
- Use: Lighthouse CI, bundle analyzer
- Compare with baseline in perf-baseline/

Follow rollback strategy from phase-9-performance.md
```

## Migration Prompts

### Upgrade Dependencies

```
Upgrade [Package] from [current] to [target]:
- Check breaking changes
- Update TypeScript types if needed
- Test all affected components
- Run full test suite
- Check bundle size impact
- Verify Lighthouse scores
- Update documentation
- Consider gradual rollout

Follow our dependency management guidelines
```

### Schema Migration

```
Migrate content schema for [Collection]:
- Current schema: [describe]
- Target schema: [describe]
- Migration strategy: [approach]
- Handle existing content
- Provide fallbacks/defaults
- Test with sample content
- Create rollback plan
- Document in content changelog

See content migration patterns in content-collections.md
```

## Documentation Prompts

### Component Documentation

```
Document [Component] following our standards:
- Purpose and use cases
- Props interface with descriptions
- Usage examples (2-3 variants)
- Accessibility features
- Performance considerations
- Common pitfalls
- Related components
- Add to Astrobook stories (Showcase only)

Follow documentation pattern from phase-5-components.md
```

### ADR Creation

```
Create Architecture Decision Record for [Decision]:
- Context: [why this decision is needed]
- Options considered: [list 2-3 options]
- Decision: [what we chose]
- Consequences: [positive and negative]
- Implementation: [how to do it]
- Validation: [how to measure success]

Use ADR template from docs/adr/template.md
Number it sequentially (ADR-XXX)
```

## Quick Fixes

### Add Dark Mode Support

```
Add dark mode support to [Component]:
- Use our semantic color tokens
- Add dark: variants in Tailwind
- Test contrast in both modes
- Respect system preferences
- No flash of wrong theme
- Reference design-system.md tokens
```

### Make Component Responsive

```
Make [Component] responsive:
- Mobile-first approach
- Use our breakpoint system
- Test at 320px, 768px, 1024px, 1440px
- Use Grid component for layouts
- Container queries if needed
- No horizontal scroll at any size
```

### Improve SEO

```
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

1. **Always provide context** about your current phase and track
2. **Reference specific files** from the implementation guides
3. **Include current metrics** when asking for optimization
4. **Mention constraints** like bundle size or browser support
5. **Ask for rollback plans** when making significant changes

Remember: These templates are starting points. Customize based on your specific needs and always reference the relevant implementation guide phase.
