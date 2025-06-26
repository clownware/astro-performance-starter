---
title: 'ADR-001: Astro Performance Starter Template Architecture Decisions'
version: 1.0.0
lastUpdated: '2025-06-10'
description: >-
  Architectural Decision Record for initial Astro performance starter template
  architecture choices.
---
## Status

Accepted

## Context

This Astro performance starter template aims to provide a production-ready foundation for building high-performance Astro websites. We need to make foundational decisions that balance performance, developer experience, and maintainability while being opinionated enough to provide value but flexible enough for various use cases.

## Decision Drivers

- **Performance**: Must achieve Lighthouse scores of 100 consistently
- **Developer Experience**: Should be easy to understand and extend
- **Maintainability**: Minimize tooling complexity and dependency sprawl
- **Flexibility**: Support both minimal (MVP) and comprehensive (Showcase) implementations
- **Modern Standards**: Use current best practices and tools

## Considered Options

### Build Tool and Framework

This starter template is specifically designed as an **Astro Performance Starter** to achieve 100/100 Lighthouse scores with zero JavaScript by default. The framework choice is Astro {{versions.astro}}, and the decisions below focus on optimal tooling choices within the Astro ecosystem.

**Astro {{versions.astro}} + Vite Build System**
- **Pros**: Zero JS by default, excellent performance, built-in optimizations, perfect for static sites, islands architecture for selective hydration
- **Rationale**: Astro is specifically chosen for performance-first static sites, making this the ideal foundation for a performance-focused starter template
- **Performance Benefits**: Sub-second page loads, minimal JavaScript bundles, automatic image optimization

### Code Quality Tooling

**Option 1: Biome (single tool)**
- **Pros**: 20x faster than ESLint, single tool for lint + format
- **Cons**: Newer tool, less ecosystem

**Option 2: ESLint + Prettier**
- **Pros**: Mature, extensive plugin ecosystem
- **Cons**: Slower, requires multiple tools, config complexity

### CSS Framework

**Option 1: Tailwind CSS {{versions.tailwindcss}}**
- **Pros**: Utility-first, tree-shakeable, design tokens support
- **Cons**: Learning curve for newcomers

**Option 2: CSS Modules + PostCSS**
- **Pros**: Familiar to most developers, explicit
- **Cons**: More boilerplate, harder to maintain consistency

## Decision

We will use:
- **Astro {{versions.astro}} with Vite** for the build system
- **Biome** for linting and formatting
- **Tailwind CSS {{versions.tailwindcss}}** with design tokens
- **TypeScript** in strict mode
- **pnpm** as package manager

### Implementation Details

```json
{
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## Consequences

### Positive
- Exceptional performance out of the box with zero JavaScript default
- Single tool for code quality (Biome) reduces complexity
- Modern tooling provides excellent developer experience
- Design tokens ensure consistency and maintainability
- Type safety catches errors early

### Negative
- Biome has less ecosystem support than ESLint
- Tailwind CSS requires learning utility classes
- pnpm might be new to some contributors

### Neutral
- Requires Node.js {{versions.node-current}}+ (LTS version)
- Opinionated choices may not suit all projects
- Focus on static/SSG over SSR capabilities

## Validation

Success metrics:
- **Lighthouse Performance**: Consistently ≥ 100
- **Build Time**: Under 2 minutes for typical site
- **Developer Onboarding**: New devs productive within 1 hour
- **Bundle Size**: JS < 160KB, CSS < 50KB
- **Type Coverage**: 100% of components typed

## References

- [Astro Documentation](https://docs.astro.build)
- [Biome Benchmarks](https://biomejs.dev/blog/biome-wins-prettier-challenge)
- [Tailwind CSS {{versions.tailwindcss}} Documentation](https://tailwindcss.com/docs)
- [Performance Budget Research](../implementation-guides/00-overview-budgets-guardrails.md)

## Notes

This ADR represents the initial decisions for v1.0 of the Astro performance starter template. As the ecosystem evolves, we may need to revisit these choices. Any changes should be documented in new ADRs that supersede this one.

The dual-track approach (MVP vs Showcase) allows teams to choose their complexity level while maintaining the same foundational decisions.

---

**Date**: 2024-01-15  
**Participants**: Template maintainers  
**Outcome**: Accepted
