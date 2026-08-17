---
title: 'ADR-000: Astro Performance Starter Template Architecture Decisions'
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Architectural Decision Record for initial Astro performance starter template
  architecture choices
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

This Astro performance starter template aims to provide a production-ready foundation for building high-performance Astro websites. We need to make foundational decisions that balance performance, developer experience, and maintainability while being opinionated enough to provide value but flexible enough for various use cases.

## Decision Drivers

- **Performance**: Must achieve Lighthouse scores of 95+ consistently (100 aspirational)
- **Developer Experience**: Should be easy to understand and extend
- **Maintainability**: Minimize tooling complexity and dependency sprawl
- **Flexibility**: Support progressive implementation through Foundation, Build, and Polish tiers
- **Modern Standards**: Use current best practices and tools

## Considered Options

### Build Tool and Framework

This starter template is specifically designed as an **Astro Performance Starter** to achieve 95+ Lighthouse scores (targeting 100) with zero JavaScript by default. The framework choice is Astro 6.x *(amended 2026-08-13: now 7.x — ADR-062)*, and the decisions below focus on optimal tooling choices within the Astro ecosystem.

#### Astro + Vite Build System

- **Pros**: Zero JS by default, excellent performance, built-in optimizations, perfect for static sites, islands architecture for selective hydration
- **Rationale**: Astro is specifically chosen for performance-first static sites, making this the ideal foundation for a performance-focused starter template
- **Performance Benefits**: Sub-second page loads, minimal JavaScript bundles, automatic image optimization

### Code Quality Tooling

#### Option 1: Biome (single tool)

- **Pros**: 20x faster than ESLint, single tool for lint + format
- **Cons**: Newer tool, less ecosystem

#### Option 2: ESLint + Prettier

- **Pros**: Mature, extensive plugin ecosystem
- **Cons**: Slower, requires multiple tools, config complexity

### CSS Framework

#### Option 1: Tailwind CSS 3.x

- **Pros**: Utility-first, tree-shakeable, design tokens support
- **Cons**: Learning curve for newcomers

#### Option 2: CSS Modules + PostCSS

- **Pros**: Familiar to most developers, explicit
- **Cons**: More boilerplate, harder to maintain consistency

## Decision

We will use:

- **Astro with Vite** for the build system *(6.x at founding; 7.x since ADR-062)*
- **Biome** for linting and formatting
- **Tailwind CSS 4.x** with CSS-native `@theme` design tokens
- **TypeScript** in strict mode
- **pnpm** as package manager

### Implementation Details

```json
{
  "engines": {
    "node": ">=24.0.0"
  }
}
```

*(Amended 2026-08-13: the enforced floor is now `>=24.15.0` — see `package.json` `engines`.)*

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

- Requires Node.js 24.x+ (current LTS)
- Opinionated choices may not suit all projects
- Focus on static/SSG over SSR capabilities

## Validation

Success metrics:

- **Lighthouse Performance**: Consistently ≥ 95 (target 100)
- **Build Time**: Under 2 minutes for typical site
- **Developer Onboarding**: New devs productive within 1 hour
- **Bundle Size**: JS < 160KB, CSS < 50KB
- **Type Coverage**: 100% of components typed

## References

- [Astro Documentation](https://docs.astro.build)
- [Biome Benchmarks](https://biomejs.dev/blog/biome-wins-prettier-challenge)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Performance Budget Research](https://github.com/clownware/astro-performance-starter/blob/master/docs/implementation-guides/reference/budgets-guardrails.md)

## Notes

This ADR represents the initial decisions for v1.0 of the Astro performance starter template. As the ecosystem evolves, we may need to revisit these choices. Any changes should be documented in new ADRs that supersede this one.

The dual-track approach (MVP vs Showcase) has been refined by ADR-033 into a progressive tier model (Foundation/Build/Polish) that better maps to how users actually consume the template. Teams work through phases sequentially and stop when they've reached their goals.

## Enforcement

<!-- Added 2026-07-12 as an amendment under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `package.json` pins pnpm via `packageManager` and no `package-lock.json` or `yarn.lock` exists.
  - TC-2: no ESLint or Prettier config files or dependencies exist — Biome is the only lint/format tool.
- **Checks:**
  - TC-1 → check `pnpm-only` (status: **warn**)
  - TC-2 → check `biome-only` (status: **warn**)
- **Not machine-checkable:** the 95+ Lighthouse target is evidenced by the Lighthouse workflow on the deployed site, not asserted per-commit; tier progression is guidance.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*

---
**Date**: 2024-01-15\
**Participants**: Template maintainers\
**Outcome**: Accepted
