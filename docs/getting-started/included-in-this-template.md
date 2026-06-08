---
title: What is included in this template?
description: >-
  What is included in the Astro Performance Starter template.
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Overview

The _Astro Performance Starter_ gives you a production-ready foundation focused on performance, accessibility, and DX. **Phase 5 ("UI Component Library") is now complete**, delivering essential UI components alongside the foundational site structure.

## What’s included in this template

| Feature | Path | Notes |
|---------|------|-------|
| Base layout | `src/layouts/BaseLayout.astro` | Main layout with ViewTransitions, Header, Footer, SkipLink. Uses Head molecule for meta tags. |
| Head molecule | `src/components/molecules/Head.astro` | Reusable SEO component with OG/Twitter tags, font pre-loading, canonical URLs. |
| Header | `src/components/structural/Header.astro` | Sticky, responsive shell with placeholder nav & logo. |
| Footer | `src/components/structural/Footer.astro` | Dynamic copyright year. |
| Skip link | `src/components/a11y/SkipLink.astro` | Keyboard-friendly “skip to content”. |
| Error pages | `src/pages/404.astro`, `src/pages/500.astro` | Custom, accessible error templates. |
| Global font setup | Astro 6 Fonts API (`src/assets/fonts/`) | Self-hosted Geist + Inter, preloaded WOFF2 & CSS vars (ADR-053). |
| Security headers | `public/_headers` | CSP, HSTS, referrer-policy, etc. |
| Robots rules | `src/pages/robots.txt.ts` | Dynamic robots.txt generation with sitemap reference. |
| Favicon | `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png` | Replace with your own brand assets. |
| TypeScript types | `src/types/` | Navigation types and auto-generated content types. |
| Project assets | `src/assets/logo.svg` | Optimized logo asset for branding. |

## UI Components (Phase 5 - Complete)

**Essential UI primitives following atomic design patterns:**

| Component | Path | Purpose |
|-----------|------|----------|
| Button | `src/components/atoms/Button.astro` | Versatile button with size/variant props. Primary foundation for interactions. |
| Badge | `src/components/atoms/Badge.astro` | Non-interactive labels for status, metrics, or categories. |
| Icon | `src/components/atoms/Icon.astro` | Reusable SVG icons (github, arrows) with accessibility support. |
| Image | `src/components/atoms/Image.astro` | Wrapper around Astro's Image with project defaults (AVIF, optimized sizing). |
| Card | `src/components/molecules/Card.astro` | Flexible content container with consistent spacing and styling. |
| PostCard | `src/components/molecules/PostCard.astro` | Blog post card with image, metadata, tags, and reading time. Supports featured/regular variants. |
| SectionSeparator | `src/components/molecules/SectionSeparator.astro` | Gradient divider for visual section separation. |
| Container | `src/components/structural/Container.astro` | Manages horizontal width and centers content across breakpoints. |
| Section | `src/components/structural/Section.astro` | Controls vertical rhythm and spacing for page sections. |
| Grid | `src/components/structural/Grid.astro` | Responsive CSS Grid with consistent gaps and breakpoint behavior. |

**Link styling:** Basic commented-out styles provided in `src/styles/global.css` - customize as needed or create Link component using provided documentation patterns.

## Development Tools & Scripts

| Tool | Path/Config | Purpose |
|------|-------------|----------|
| Design tokens | `tokens/base.json`, `tokens/semantic.json` | Complete design system with build script. |
| Token builder | `scripts/src/build-tokens.ts` | Converts JSON tokens to CSS variables and Tailwind config. |
| Performance baseline | `scripts/src/baseline-performance.ts` | Lighthouse score tracking and budgets. |
| Contrast validator | `scripts/src/validate-contrast.ts` | WCAG AA accessibility validation. |
| Budget tracking | `scripts/src/track-performance-budgets.ts` | Performance budget enforcement. |
| Biome linting | `biome.json` | Fast linting and formatting (replaces ESLint + Prettier). |
| Git hooks | `.husky/pre-commit` | Pre-configured commit hooks with lint-staged. |
| Vitest testing | `vitest.config.ts` | Testing framework configuration. |

## AI Development Context

| Feature | Path | Purpose |
|---------|------|----------|
| Cross-tool AI spine | `AGENTS.md` | Canonical context for Cursor, Codex CLI, Copilot, Windsurf, Aider, Devin, Zed, Continue, Amp, Amazon Q. Generated from the layered constitution (`CLAUDE.md` + `.claude/{engineering,workflow,stack}.md`) via `pnpm agents:build`. See ADR-045. |
| Layered constitution | `CLAUDE.md`, `.claude/engineering.md`, `.claude/workflow.md`, `.claude/stack.md` | Halt-on-violation rules + engineering defaults + workflow + stack facts. Source of truth for `AGENTS.md`. See ADR-036. |
| Windsurf overlay | `.windsurfrules` | Thin Cascade-specific overlay; full context comes from `AGENTS.md`. |
| Comprehensive docs | `docs/` | Implementation guides, patterns, and ADRs. |

## Configuration Files

| Config | Purpose |
|--------|----------|
| `.editorconfig` | Consistent editor settings across team. |
| `.commitlintrc.cjs` | Enforces conventional commit messages. |
| `.lintstagedignore` | Files to skip during pre-commit linting. |
| `src/styles/global.css` | Tailwind v4 CSS-native config with `@theme inline` design token integration. |
| `tsconfig.json` | Strict TypeScript configuration. |
| `.nvmrc` | Node.js version specification. |

## Running the template locally

```bash
pnpm install   # install dependencies
pnpm dev       # start local dev server
```

• Demo home: `http://localhost:4321/`

## Customizing the skeleton

1. **Branding:** update logo text in `Header.astro` and swap `public/favicon.svg`.
2. **Navigation:** edit links in `Header.astro` and wire the mobile menu panel.
3. **Pages:** start new pages under `src/pages/` or copy the demo landing page.
4. **SEO defaults:** change `siteTitle` and related fields in `src/config.ts`.

## Excluded by default

| Item | Reason |
|------|--------|
| `.github/FUNDING.yml` | Funding links vary; add your own if desired |
| Documentation-specific files | Markdown linting configs, frontmatter validation scripts removed for general use |

## Next phases

**Phases 0-5 are complete.** Content collections for blog, projects, experience, and navigation are connected and working. Follow the [implementation guides](../implementation-guides/) for step-by-step progress on remaining phases.
