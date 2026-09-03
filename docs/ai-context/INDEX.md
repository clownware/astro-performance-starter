---
title: AI Assistant Context Index
description: >-
  Central entry point and contextual guide for AI assistants working on this
  Astro project.
lastUpdated: true
tableOfContents: true
pagefind: true
current_phase: 12
---

> 🤖 **Purpose**: Central entry point for AI assistants working on this Astro project

## AI Assistant Contract

This contract specifies what AI assistants can expect to find and where. Read this before making any changes.

### Entry Point

- Start here: `docs/ai-context/INDEX.md` (this file)
- This file provides project overview, constraints, and navigation

### Tool-Specific Context Files

- **Cross-tool spine**: [`AGENTS.md`](https://github.com/clownware/astro-performance-starter/blob/master/AGENTS.md) (project root) — canonical context for every modern AI coding tool. Generated from `CLAUDE.md` + `.claude/engineering.md` + `.claude/workflow.md` + `.claude/stack.md` via `pnpm agents:build`. Do not edit directly.
- **Claude Code**: [`CLAUDE.md`](https://github.com/clownware/astro-performance-starter/blob/master/CLAUDE.md) (project root) + the layered `.claude/{engineering,workflow,stack}.md` files + the `.claude/` directory (skills, agents, settings, roles)
- **Cursor, Codex CLI, Copilot, Windsurf, Aider, Devin, Zed, Continue**: read `AGENTS.md` natively; no per-tool setup
- See [AI Rules Configuration](/ai-context/ai-rules-setup/) for the cross-tool setup pattern and [ADR-045](/adr/045-cross-tool-agents-spine/) for the rationale

### Architectural Constraints

- Location: `docs/adr/` — see the [ADR index](https://github.com/clownware/astro-performance-starter/tree/master/docs/adr)
- Contract: Every **Accepted** ADR represents a constraint AI must respect
- Key ADRs: [001](/adr/001-preact-island-usage-policy/) (island policy), [023](/adr/023-testing-strategy/) (testing strategy), [033](/adr/033-track-consolidation/) (tier model), [034](/adr/034-dual-purpose-docs-strategy/) (docs strategy), [035](/adr/035-template-scope-boundary/) (scope boundary), [036](/adr/036-layered-constitution/) (layered constitution)

### Performance Limits

- Location: [Budgets & Guardrails](/implementation-guides/reference/budgets-guardrails/)
- Contract: All changes must stay within documented budgets
- Quick reference: JS < 160KB total **raw** (uncompressed — the CI gate in `budgets.json`), CSS < 50KB (advisory), Images < 200KB each (CI-gated, ADR-057), Lighthouse 95+ measured (CI floors 0.90 performance / 0.95 accessibility / 0.95 best-practices / 0.90 SEO)

### Component Conventions

- Location: [Component Patterns](/patterns/component-patterns/) and the directory-scoped `src/components/CLAUDE.md`
- Contract: New components must follow documented atomic design hierarchy

### Scope Boundary (ADR-035)

- **Modify freely**: `src/`, config files (`astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`), `public/`, `tokens/`
- **Read but don't modify**: `docs/` (unless explicitly updating documentation)
- **Don't create**: Files that belong in Category 3 per [ADR-035](/adr/035-template-scope-boundary/) (maintenance artifacts, marketing content)

### Rules of Engagement

The canonical halt-on-violation rules live in [`CLAUDE.md`](https://github.com/clownware/astro-performance-starter/blob/master/CLAUDE.md) and are mirrored cross-tool in [`AGENTS.md`](https://github.com/clownware/astro-performance-starter/blob/master/AGENTS.md). Read them there — they are the single source of truth. This file no longer duplicates the list, to prevent drift (the 7-vs-10 mismatch this section used to encode was the original motivating example for ADR-045).

## Quick Start for AI Assistants

When working on this project, follow this priority order:

1. **Understand the Tier**: Check which implementation tier is active (Foundation/Build/Polish — [ADR-033](/adr/033-track-consolidation/))
2. **Review Current Phase**: Identify which implementation phase is active (0–12) from `current_phase` in this file's frontmatter
3. **Check Performance Budgets**: Ensure changes stay within limits
4. **Follow Design System**: Use established tokens and patterns
5. **Maintain Type Safety**: TypeScript strict mode is required

## Project Overview

This is a modern Astro static site with:

- **Framework**: Astro with zero JavaScript by default — islands hydrate on demand
- **Styling**: Tailwind CSS with CSS-native `@theme inline` design tokens (no `tailwind.config.*`)
- **Content**: MDX with Astro Content Collections (Content Layer API, `src/content.config.ts`)
- **Performance**: Lighthouse 95+ measured; CI gates on the floors above
- **Deployment**: GitHub Pages (CI default via `.github/workflows/deploy.yml`), Cloudflare Pages (recommended in the quick-deploy guide)

Exact stack versions are stack facts, not rules: read them from [`.claude/stack.md`](https://github.com/clownware/astro-performance-starter/blob/master/.claude/stack.md) (mirrored in `AGENTS.md`), never from this file.

## Key Directories

```bash
src/                        # Category 1: Modify freely
├── components/             # UI components (atomic design; islands/ holds the Preact islands)
├── content/                # Content collections (blog, projects, bio, experience, navigation)
├── layouts/                # Page layouts
├── pages/                  # Routes
├── styles/                 # Global CSS (Tailwind @theme inline wiring)
└── utils/                  # Helper functions

tokens/                     # Category 1: design tokens (base.json + semantic.json → tokens/dist)

docs/                       # Category 2: Read, don't modify (unless updating docs)
├── adr/                    # Architecture decisions — constraints AI must respect
├── ai-context/             # AI assistant context — start here
├── implementation-guides/  # Phase-by-phase guides
└── patterns/               # Component, performance, accessibility patterns
```

## Current Implementation Status

The current active phase is defined in this file's frontmatter (`current_phase`).

To determine the status of any phase:

1. Consult the **[Implementation Guide Master Index](/implementation-guides/)** for the full, ordered list of phases (0-12).
2. Compare a phase's number to the `current_phase` value:
   - If `phase_number < current_phase`, it is **Completed**.
   - If `phase_number == current_phase`, it is **Active**.
   - If `phase_number > current_phase`, it is **Pending**.

Update this value manually when a phase is complete, then run `pnpm run roadmap:update` to sync the roadmap checkboxes in `docs/README.md`.

## Critical Constraints

### Performance Budgets

- **JavaScript**: \< 160KB total **raw** (uncompressed — enforced in CI by `pnpm perf:budgets` against `budgets.json`)
- **CSS**: \< 50KB total (advisory — tracked, not CI-gated)
- **Images**: \< 200KB each per raster file (enforced in CI — ADR-057)
- **Lighthouse Scores**: Performance 95+, Accessibility 98+ are the measured headline; the CI floors are Performance ≥ 0.90, Accessibility ≥ 0.95, Best-Practices ≥ 0.95, SEO ≥ 0.90, gated on desktop and mobile

> **Note on Budget Strictness**: These budgets are intentionally strict to maintain excellent Core Web Vitals and ensure a high-quality user experience. For instance, the project's INP target (\< 150ms in the budgets guide) is more demanding than Google's 'good' threshold of 200ms. While this is beneficial for outcomes like a developer portfolio, it's important to communicate to stakeholders that CI may fail even on seemingly small regressions that exceed these tight budgets. This proactive communication helps manage expectations around development velocity and quality gates.

### Technical Rules

1. **`client:load` is forbidden without ADR justification** ([ADR-001](/adr/001-preact-island-usage-policy/)). The starter ships no `client:load` anywhere: its two islands use `client:visible` (`src/components/islands/SignalsCounter.tsx`) and `client:idle` (`src/components/islands/MotionLab.tsx`) — see [ADR-060](/adr/060-showcase-interactive-demo-islands/). Early theme initialisation is an inline script in `src/components/ThemeSetup.astro`, not an island.
2. **Prefer CSS** solutions over JavaScript
3. **Use the Astro Image component** for all images, via the `src/components/atoms/Image.astro` wrapper — raw `<img>` is forbidden outside the [ADR-030](/adr/030-image-optimisation-defaults/) exemptions
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

1. `astro.config.mjs` - Astro configuration (Tailwind runs CSS-first via `@tailwindcss/vite`; fonts via the Astro Fonts API)
2. `src/styles/global.css` - Tailwind CSS-native config with `@theme inline` design tokens
3. `tsconfig.json` - TypeScript settings
4. `biome.json` - Linting/formatting rules
5. `src/content.config.ts` - Content schemas (Astro Content Layer API)

### Performance Monitoring

1. `budgets.json` + `budget-overrides.json` - Raw-size performance budgets and sanctioned overrides
2. `lighthouserc.json` + `lighthouserc.mobile.json` - Lighthouse CI floors (desktop + mobile)
3. `public/_headers` - Security headers (header-capable hosts; no-op on the GitHub Pages demo — [ADR-051](/adr/051-content-security-policy-strategy/))

## Design System Reference

### Color Tokens

- **Semantic**: role-based names (background, surface, foreground, border, primary, link, success/warning/error…) in `tokens/semantic.json`, built on the base palette in `tokens/base.json` ([ADR-047](/adr/047-design-tokens-v2-role-based-naming/))
- **Format**: HSL values in CSS variables (compiled to `tokens/dist/` by `pnpm run tokens:build`)
- **Dark Mode**: Automatic with the `.dark` class on `<html>` ([ADR-032](/adr/032-dark-mode-strategy/)) — semantic roles flip, so no manual `dark:` variants

### Typography Scale

- Sizes: xs, sm, base, lg, xl, 2xl … 8xl (see `fontSize` in `tokens/base.json`)
- Fonts: Geist (display) + Inter (text), self-hosted via the Astro Fonts API ([ADR-053](/adr/053-fonts-via-astro-fonts-api/))
- Line heights: Tailwind's `leading-*` utilities (not tokenised — `tokens/base.json` carries sizes only)

### Spacing System

- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 32
- Usage: Consistent padding/margin

## Content Types

### Projects Collection

- Fields: title, description, date, technologies, outcomes
- Features: Draft mode, featured flag, custom sorting

### Blog Collection

- Fields: title, description, date, tags, author
- Features: MDX support, related posts, reading time

### Navigation Collection

- Type: Data collection (JSON — `src/content/navigation/header.json`)
- Usage: Header/footer navigation items

The `bio` and `experience` collections ([ADR-017](/adr/017-experience-content-collection/)) are also defined in `src/content.config.ts`.

## Development Workflow

### Before Making Changes

1. Run `pnpm run check` - Ensure types are correct
2. Build tokens - `pnpm run tokens:build` is chained by `predev` and `build`; run it manually after editing `tokens/*.json` in an already-running dev session
3. Check current Git branch - Follow branch strategy

### While Developing

1. Use `pnpm run dev` - Local development
2. Test on mobile - Mobile-first approach
3. Check accessibility - Keyboard navigation

### Before Committing

1. Pre-commit hooks run automatically
2. Validates formatting and types
3. Ensure CI will pass (`pnpm quality:ci`)

## Common Pitfalls to Avoid

1. **Adding unnecessary JavaScript** - Prefer CSS solutions
2. **Hardcoding values** - Use design tokens
3. **Skipping accessibility** - Always include ARIA
4. **Ignoring performance** - Check bundle size
5. **Breaking types** - Run TypeScript checks

## Getting Help

### Internal Documentation

- **[Implementation Guide Master Index](/implementation-guides/)** - Chronological build sequence (the synced roadmap checklist lives in `docs/README.md`)
- **Architecture Decisions**: [ADR index](https://github.com/clownware/astro-performance-starter/tree/master/docs/adr)
- **Patterns**: [Component Patterns](/patterns/component-patterns/), [Islands Architecture](/patterns/islands-architecture/), [Performance Patterns](/patterns/performance-patterns/)
- **Prompt libraries**: [Astro Prompts](/ai-context/prompt-libraries/astro-prompts/), [Development Prompts](/ai-context/prompt-libraries/development-prompts/), [Project Management Prompts](/ai-context/prompt-libraries/project-management-prompts/)

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
   - [ ] Bump `current_phase` in this file's frontmatter
   - [ ] Run `pnpm run roadmap:update` to sync the checklist in `docs/README.md`
   - [ ] Add any new constraints or rules discovered

2. **New ADR Accepted**
   - [ ] Add to "Critical Constraints" if it affects development
   - [ ] Update relevant sections (e.g., new performance budgets)
   - [ ] Link to the ADR in the appropriate section

3. **Dependency Changes**
   - [ ] Versions live in `.claude/stack.md` and `versions.json` ([ADR-061](/adr/061-versions-json-public-contract/)) — this file carries none
   - [ ] Add migration notes if breaking changes
   - [ ] Update any affected code examples

4. **Content Model Changes**
   - [ ] Update "Content Types" section
   - [ ] Add new fields or collections
   - [ ] Note any migration requirements

5. **New Patterns or Anti-patterns**
   - [ ] Add to "Common Pitfalls to Avoid"
   - [ ] Update "Common AI Tasks" with new examples
   - [ ] Create new pattern documents if needed

### Review Schedule

- **Weekly**: Quick check during team sync
- **Phase Completion**: Full review and update
- **Monthly**: Comprehensive accuracy audit
- **Quarterly**: Structure and organization review

Last reviewed: 2026-09-02
Next review due: 2026-12-02
