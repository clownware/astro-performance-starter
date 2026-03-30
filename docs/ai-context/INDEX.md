---
title: AI Assistant Context Index
description: >-
  Central entry point and contextual guide for AI assistants working on this
  Astro project.
lastUpdated: true
tableOfContents: true
pagefind: true
current_phase: 6
---


> 🤖 **Purpose**: Central entry point for AI assistants working on this Astro project

## AI Assistant Contract

This contract specifies what AI assistants can expect to find and where. Read this before making any changes.

### Entry Point

- Start here: `docs/ai-context/INDEX.md` (this file)
- This file provides project overview, constraints, and navigation

### Tool-Specific Context Files

- **Claude Code**: `CLAUDE.md` (project root) + `.claude/` directory (skills, agents, settings)
- **Windsurf**: `.windsurfrules` (project root)
- **Cursor**: `.cursorrules` (copy from `airules.example`)
- **Cline**: `.clinerules` (copy from `airules.example`)
- See `docs/ai-context/ai-rules-setup.md` for setup details

### Architectural Constraints

- Location: `docs/adr/`
- Contract: Every **Accepted** ADR represents a constraint AI must respect
- Key ADRs: 001 (island policy), 023 (testing strategy), 033 (tier model), 034 (docs strategy), 035 (scope boundary)

### Performance Limits

- Location: `docs/implementation-guides/reference/budgets-guardrails.md`
- Contract: All changes must stay within documented budgets
- Quick reference: JS < 160KB gzipped, CSS < 50KB, Images < 200KB each, Lighthouse 95+

### Component Conventions

- Location: `docs/patterns/component-patterns.md`
- Contract: New components must follow documented atomic design hierarchy

### Scope Boundary (ADR-035)

- **Modify freely**: `src/`, config files (`astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`), `public/`, `tokens/`
- **Read but don't modify**: `docs/` (unless explicitly updating documentation)
- **Don't create**: Files that belong in Category 3 per ADR-035 (maintenance artifacts, marketing content)

### Rules of Engagement

1. Read `docs/adr/` before suggesting architectural changes
2. Do not suggest `client:load` without referencing ADR-001
3. Use design tokens from `tokens/` — never hardcode color/spacing values
4. TypeScript strict mode is non-negotiable
5. Use Biome, not ESLint/Prettier
6. Use pnpm, not npm or yarn
7. Check `docs/implementation-guides/reference/budgets-guardrails.md` before adding dependencies

## Quick Start for AI Assistants

When working on this project, follow this priority order:

1. **Understand the Tier**: Check which implementation tier is active (Foundation/Build/Polish)
2. **Review Current Phase**: Identify which implementation phase is active (0–12)
3. **Check Performance Budgets**: Ensure changes stay within limits
4. **Follow Design System**: Use established tokens and patterns
5. **Maintain Type Safety**: TypeScript strict mode is required

## Project Overview

This is a modern Astro static site with:

- **Framework**: Astro 6.x with zero JavaScript by default
- **Styling**: Tailwind CSS 4.x with CSS-native `@theme` design tokens
- **Content**: MDX with Astro Content Collections
- **Performance**: Lighthouse 95+ target
- **Deployment**: Cloudflare Pages

## Key Directories

```bash
src/                        # Category 1: Modify freely
├── components/             # UI components (atomic design)
├── content/                # Content collections (blog, projects)
├── layouts/                # Page layouts
├── pages/                  # Routes
├── styles/                 # Global CSS
└── utils/                  # Helper functions

docs/                       # Category 2: Read, don't modify (unless updating docs)
├── adr/                    # Architecture decisions — constraints AI must respect
├── ai-context/             # AI assistant context — start here
├── implementation-guides/  # Phase-by-phase guides
└── patterns/               # Component, performance, accessibility patterns
```

## Current Implementation Status

The current active phase is defined in this file's frontmatter (`current_phase`).

To determine the status of any phase:

1. Consult the **[Implementation Roadmap](/)** for the full, ordered list of phases (0-12).
2. Compare a phase's number to the `current_phase` value:
   - If `phase_number < current_phase`, it is **Completed**.
   - If `phase_number == current_phase`, it is **Active**.
   - If `phase_number > current_phase`, it is **Pending**.

Update this value manually when a phase is complete, then run `pnpm run roadmap:update` to sync the roadmap checkboxes in `docs/README.md`.

## Critical Constraints

### Performance Budgets

- **JavaScript**: \< 160KB total (gzipped)
- **CSS**: \< 50KB total
- **Images**: \< 200KB each (after optimization)
- **Lighthouse Scores**: Performance 95+, Accessibility 98+

> **Note on Budget Strictness**: These budgets are intentionally strict to maintain excellent Core Web Vitals and ensure a high-quality user experience. For instance, the project's INP/FID goals (target \< 100ms) are more demanding than Google's 'good' threshold of 200ms. While this is beneficial for outcomes like a developer portfolio, it's important to communicate to stakeholders that CI may fail even on seemingly small regressions that exceed these tight budgets. This proactive communication helps manage expectations around development velocity and quality gates.

### Technical Rules

1. **Avoid `client:load`** unless explicitly justified in an ADR (e.g., early theme initialization in `ThemeSetup.astro`). Whenever `client:load` is used, document the rationale and measure the impact.
2. **Prefer CSS** solutions over JavaScript
3. **Use Astro Image** component for all images
4. **TypeScript strict** mode required
5. **Biome** for linting/formatting (not ESLint/Prettier)

## Common AI Tasks

### Component Creation

```text
"Create an accessible [component] with:
- TypeScript interfaces
- Tailwind styling using our tokens
- ARIA labels and keyboard navigation
- Static (no JS) by default; add interactivity only if justified in an ADR"
```

### Performance Optimization

```text
"Optimize [feature] to:
- Reduce bundle size
- Improve Core Web Vitals
- Lazy load appropriately
- Stay within our budgets"
```

### Content Modeling

```text
"Create Astro content collection for [type] with:
- Zod schema
- TypeScript types
- Draft mechanism
- SEO fields"
```

## Key Configuration Files

### Always Reference These

1. `astro.config.mjs` - Astro configuration
2. `src/styles/global.css` - Tailwind v4 CSS-native config with `@theme inline` design tokens
3. `tsconfig.json` - TypeScript settings
4. `biome.json` - Linting/formatting rules
5. `src/content/config.ts` - Content schemas

### Performance Monitoring

1. `perf-baseline/scores.json` - Target metrics
2. `.lighthouserc.js` - Lighthouse CI config
3. `public/_headers` - Security headers

## Design System Reference

### Color Tokens

- **Semantic**: background, foreground, border, primary, etc.
- **Format**: HSL values in CSS variables
- **Dark Mode**: Automatic with .dark class

### Typography Scale

- Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- Font: Inter Variable (self-hosted)
- Line heights: Included in tokens

### Spacing System

- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
- Usage: Consistent padding/margin

## Content Types

### Projects Collection

- Fields: title, description, date, technologies, outcomes
- Features: Draft mode, featured flag, custom sorting

### Blog Collection

- Fields: title, description, date, tags, author
- Features: MDX support, related posts, reading time

### Navigation Collection

- Type: Data collection (JSON)
- Usage: Header/footer navigation items

## Development Workflow

### Before Making Changes

1. Run `pnpm run check` - Ensure types are correct
2. Save token files - Auto-compile during dev/build (manual: `pnpm run build:tokens`)
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

- **[Implementation Roadmap](/)** - Chronological build sequence.
- **Detailed Phase Guides**: `../implementation-guides/`
- **Architecture Decisions**: `../adr/`
- **Component Patterns**: `../patterns/`

### External Resources

- [Astro Docs](https://docs.astro.build)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

## Maintenance Notes

This context should be updated when:

- Completing a new phase
- Making architecture decisions
- Changing performance budgets
- Adding new content types
- Updating dependencies

### Self-Maintenance Checklist

When any of the following occur, update this file immediately:

1. **Phase Completion**
   - \[ ] Check the box for the completed phase
   - \[ ] Update "Active Phase" to the next phase
   - \[ ] Add any new constraints or rules discovered

2. **New ADR Accepted**
   - \[ ] Add to "Critical Constraints" if it affects development
   - \[ ] Update relevant sections (e.g., new performance budgets)
   - \[ ] Link to the ADR in the appropriate section

3. **Dependency Changes**
   - \[ ] Update version numbers in "Project Overview"
   - \[ ] Add migration notes if breaking changes
   - \[ ] Update any affected code examples

4. **Content Model Changes**
   - \[ ] Update "Content Types" section
   - \[ ] Add new fields or collections
   - \[ ] Note any migration requirements

5. **New Patterns or Anti-patterns**
   - \[ ] Add to "Common Pitfalls to Avoid"
   - \[ ] Update "Common AI Tasks" with new examples
   - \[ ] Create new pattern documents if needed

### Maintenance Commands

<!-- TODO: These maintenance scripts are planned but not yet implemented.
     See ADR-006 for the review cadence strategy.
```bash
# After completing a phase
pnpm run update:phase-status --phase=5 --status=complete

# After adding new ADR
pnpm run update:ai-context --type=adr --file=docs/adr/006-new-decision.md

# Validate AI context is current
pnpm run validate:ai-context
```
-->

### Review Schedule

- **Weekly**: Quick check during team sync
- **Phase Completion**: Full review and update
- **Monthly**: Comprehensive accuracy audit
- **Quarterly**: Structure and organization review

Last reviewed: 2026-02-22
Next review due: 2026-05-22
