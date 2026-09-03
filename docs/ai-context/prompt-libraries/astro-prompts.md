---
title: Astro Prompts
lastUpdated: true
description: Copy-paste prompts for common development tasks using AI assistants
tableOfContents: true
pagefind: true
---
> 🤖 **Purpose**: Copy-paste prompts for common development tasks

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
- Test with browser dev tools
- Validate ARIA usage
- Test reduced motion preferences

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
Evaluate if [Feature] needs client-side JavaScript:
1. Can it be done with HTML/CSS only?
2. Can it be done at build time?
3. Can Astro's <ClientRouter /> (astro:transitions) cover the interaction?
4. What specific interactivity is needed?
5. What's the performance cost?
6. If a Preact island is required, which directive — client:idle or client:visible?

If JS is needed, document in ADR following our template
Reference /patterns/islands-architecture/ for decision framework
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

## Troubleshooting Prompts

### Debug Build Error

```text
Debug Astro build error:
- Error message: [paste error]
- When it occurs: [build/dev/preview]
- Recent changes: [list changes]
- Check: TypeScript errors, missing deps, schema issues
- Run: astro check, tsc --noEmit
- Verify content collections schema
- Check for circular dependencies

Reference our tooling setup in /implementation-guides/completed/phase-3-tooling/
```

### Performance Regression

```text
Investigate performance regression:
- Metric that regressed: [LCP, INP, CLS, etc.]
- When it started: [commit/date]
- Current value: [X]
- Previous value: [Y]
- Check: bundle sizes, image sizes, render-blocking resources
- Use: Lighthouse CI, bundle analyzer
- Compare with performance-baseline.json (regenerate with pnpm perf:baseline)

Follow rollback strategy from /implementation-guides/active-phases/phase-9-performance/
```

## Migration Prompts

### Upgrade Dependencies

```text
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

```text
Migrate content schema for [Collection]:
- Current schema: [describe]
- Target schema: [describe]
- Migration strategy: [approach]
- Handle existing content
- Provide fallbacks/defaults
- Test with sample content
- Create rollback plan
- Document in content changelog

See content migration patterns in /patterns/content-collections/
```

## Documentation Prompts

### Component Documentation

```text
Document [Component] following our standards:
- Purpose and use cases
- Props interface with descriptions
- Usage examples (2-3 variants)
- Accessibility features
- Performance considerations
- Common pitfalls
- Related components
- Add to the /showcase living style guide (ADR-049)

Follow documentation pattern from /implementation-guides/active-phases/phase-5-components/
```

### ADR Creation

```text
Create Architecture Decision Record for [Decision]:
- Context: [why this decision is needed]
- Options considered: [list 2-3 options]
- Decision: [what we chose]
- Consequences: [positive and negative]
- Implementation: [how to do it]
- Validation: [how to measure success]

Use ADR template from docs/adr/template.md
Number it sequentially (ADR-XXX — the next number after the ADRs in docs/adr/)
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
