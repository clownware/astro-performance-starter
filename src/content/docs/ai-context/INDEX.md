---
title: INDEX
description: '***'
---

***

current\_phase: 5
title: AI Assistant Context Index
version: 1.0.0
lastUpdated: 2025-06-19T00:00:00.000Z
review: '2025-12-31'
description: >-
Central entry point and contextual guide for AI assistants working on this
Astro project.
--------------

> 🤖 **Purpose**: Central entry point for AI assistants working on this Astro project

## Quick Start for AI Assistants

When working on this project, follow this priority order:

1. **Understand the Track**: Check if working on MVP or Showcase version
2. **Review Current Phase**: Identify which implementation phase is active
3. **Check Performance Budgets**: Ensure changes stay within limits
4. **Follow Design System**: Use established tokens and patterns
5. **Maintain Type Safety**: TypeScript strict mode is required

## Project Overview

This is a modern Astro static site with:

* **Framework**: Astro \{\{versions.astro}} with zero JavaScript by default
* **Styling**: Tailwind CSS \{\{versions.tailwindcss}} with design tokens
* **Content**: MDX with Astro Content Collections
* **Performance**: Lighthouse 97+ target
* **Deployment**: Cloudflare Pages

## Key Directories

```
src/
├── components/     # UI components (atomic design)
├── content/        # Content collections (blog, projects)
├── layouts/        # Page layouts
├── pages/          # Routes
├── styles/         # Global CSS
└── utils/          # Helper functions

docs/
├── implementation-guides/  # Phase-by-phase guides
├── adr/                   # Architecture decisions
└── llm-context/          # AI assistant docs
```

## Current Implementation Status

The current active phase is defined in this file's frontmatter (`current_phase`).

To determine the status of any phase:

1. Consult the **[Implementation Roadmap](/)** for the full, ordered list of phases (0-12).
2. Compare a phase's number to the `current_phase` value:
   * If `phase_number < current_phase`, it is **Completed**.
   * If `phase_number == current_phase`, it is **Active**.
   * If `phase_number > current_phase`, it is **Pending**.

This value is updated automatically by CI on pull request merges.

## Critical Constraints

### Performance Budgets

* **JavaScript**: \< 160KB total (gzipped)
* **CSS**: \< 50KB total
* **Images**: \< 200KB each (after optimization)
* **Lighthouse Scores**: Performance 97+, Accessibility 98+

> **Note on Budget Strictness**: These budgets are intentionally strict to maintain excellent Core Web Vitals and ensure a high-quality user experience. For instance, the project's INP/FID goals (target \< 100ms) are more demanding than Google's 'good' threshold of 200ms. While this is beneficial for outcomes like a developer portfolio, it's important to communicate to stakeholders that CI may fail even on seemingly small regressions that exceed these tight budgets. This proactive communication helps manage expectations around development velocity and quality gates.

### Technical Rules

1. **Avoid `client:load`** unless explicitly justified in an ADR (e.g., early theme initialization in `ThemeSetup.astro`). Whenever `client:load` is used, document the rationale and measure the impact.
2. **Prefer CSS** solutions over JavaScript
3. **Use Astro Image** component for all images
4. **TypeScript strict** mode required
5. **Biome** for linting/formatting (not ESLint/Prettier)

## Common AI Tasks

### Component Creation

```
"Create an accessible [component] with:
- TypeScript interfaces
- Tailwind styling using our tokens
- ARIA labels and keyboard navigation
- MVP version (no JS) and Showcase version (minimal JS)"
```

### Performance Optimization

```
"Optimize [feature] to:
- Reduce bundle size
- Improve Core Web Vitals
- Lazy load appropriately
- Stay within our budgets"
```

### Content Modeling

```
"Create Astro content collection for [type] with:
- Zod schema
- TypeScript types
- Draft mechanism
- SEO fields"
```

## Key Configuration Files

### Always Reference These

1. `astro.config.mjs` - Astro configuration
2. `tailwind.config.ts` - Tailwind with design tokens
3. `tsconfig.json` - TypeScript settings
4. `biome.json` - Linting/formatting rules
5. `src/content/config.ts` - Content schemas

### Performance Monitoring

1. `perf-baseline/scores.json` - Target metrics
2. `.lighthouserc.js` - Lighthouse CI config
3. `public/_headers` - Security headers

## Design System Reference

### Color Tokens

* **Semantic**: background, foreground, border, primary, etc.
* **Format**: HSL values in CSS variables
* **Dark Mode**: Automatic with .dark class

### Typography Scale

* Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
* Font: Inter Variable (self-hosted)
* Line heights: Included in tokens

### Spacing System

* Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
* Usage: Consistent padding/margin

## Content Types

### Projects Collection

* Fields: title, description, date, technologies, outcomes
* Features: Draft mode, featured flag, custom sorting

### Blog Collection

* Fields: title, description, date, tags, author
* Features: MDX support, related posts, reading time

### Navigation Collection

* Type: Data collection (JSON)
* Usage: Header/footer navigation items

## Development Workflow

### Before Making Changes

1. Run `pnpm run check` - Ensure types are correct
2. Run `pnpm run build:tokens` - If design tokens changed
3. Check current Git branch - Follow branch strategy

### While Developing

1. Use `pnpm run dev` - Local development
2. Test on mobile - Mobile-first approach
3. Check accessibility - Keyboard navigation

### Before Committing

1. Pre-commit hooks run automatically
2. Validates formatting and types
3. Ensure CI will pass

## Common Pitfalls to Avoid

1. **Adding unnecessary JavaScript** - Prefer CSS solutions
2. **Hardcoding values** - Use design tokens
3. **Skipping accessibility** - Always include ARIA
4. **Ignoring performance** - Check bundle size
5. **Breaking types** - Run TypeScript checks

## Getting Help

### Internal Documentation

* **[Implementation Roadmap](/)** - Chronological build sequence.
* **Detailed Phase Guides**: `../implementation-guides/`
* **Architecture Decisions**: `../adr/`
* **Component Patterns**: `../patterns/`

### External Resources

* [Astro Docs](https://docs.astro.build)
* [Tailwind Docs](https://tailwindcss.com/docs)
* [MDN Web Docs](https://developer.mozilla.org)

## Maintenance Notes

This context should be updated when:

* Completing a new phase
* Making architecture decisions
* Changing performance budgets
* Adding new content types
* Updating dependencies

### Self-Maintenance Checklist

When any of the following occur, update this file immediately:

1. **Phase Completion**
   * \[ ] Check the box for the completed phase
   * \[ ] Update "Active Phase" to the next phase
   * \[ ] Add any new constraints or rules discovered

2. **New ADR Accepted**
   * \[ ] Add to "Critical Constraints" if it affects development
   * \[ ] Update relevant sections (e.g., new performance budgets)
   * \[ ] Link to the ADR in the appropriate section

3. **Dependency Changes**
   * \[ ] Update version numbers in "Project Overview"
   * \[ ] Add migration notes if breaking changes
   * \[ ] Update any affected code examples

4. **Content Model Changes**
   * \[ ] Update "Content Types" section
   * \[ ] Add new fields or collections
   * \[ ] Note any migration requirements

5. **New Patterns or Anti-patterns**
   * \[ ] Add to "Common Pitfalls to Avoid"
   * \[ ] Update "Common AI Tasks" with new examples
   * \[ ] Create new pattern documents if needed

### Maintenance Commands

```bash
# After completing a phase
pnpm run update:phase-status --phase=5 --status=complete

# After adding new ADR
pnpm run update:ai-context --type=adr --file=docs/adr/006-new-decision.md

# Validate AI context is current
pnpm run validate:ai-context
```

### Review Schedule

* **Weekly**: Quick check during team sync
* **Phase Completion**: Full review and update
* **Monthly**: Comprehensive accuracy audit
* **Quarterly**: Structure and organization review

Last reviewed: 2025-06-19
Next review due: 2025-12-31
