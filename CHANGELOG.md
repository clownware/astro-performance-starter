# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

[compare changes](https://github.com/clownware/astro-performance-starter/compare/v0.2.0...HEAD)

### 🚀 Enhancements

- **config:** Optimize build with Lightning CSS and theme-aware code blocks ([e1f0a41](https://github.com/clownware/astro-performance-starter/commit/e1f0a41))
- **design:** Update color scheme to white/charcoal with improved contrast ([f62d049](https://github.com/clownware/astro-performance-starter/commit/f62d049))
- **homepage:** Refine hero messaging and update tech stack details ([5bda76e](https://github.com/clownware/astro-performance-starter/commit/5bda76e))
- **about:** Make mock identity more playful and on-brand ([e64f850](https://github.com/clownware/astro-performance-starter/commit/e64f850))

### 🩹 Fixes

- **components:** Improve button contrast and social link icons ([bc1eee9](https://github.com/clownware/astro-performance-starter/commit/bc1eee9))
- **contact:** Improve text contrast and icon consistency ([56480ff](https://github.com/clownware/astro-performance-starter/commit/56480ff))
- **layouts:** Improve UX and consistency across blog and project layouts ([ec5a41f](https://github.com/clownware/astro-performance-starter/commit/ec5a41f))

### 💅 Refactors

- **footer:** Remove top border and emoji from GitHub link ([c0d1fae](https://github.com/clownware/astro-performance-starter/commit/c0d1fae))
- **components:** Migrate ExpandableFeatureCard to Preact and robots.txt to dynamic ([f78a7d9](https://github.com/clownware/astro-performance-starter/commit/f78a7d9))

### 📖 Documentation

- **project:** Rewrite template case study with production focus ([8ecd240](https://github.com/clownware/astro-performance-starter/commit/8ecd240))
- Full documentation review — sync with current repo state ([39ecec3](https://github.com/clownware/astro-performance-starter/commit/39ecec3))

### 🏡 Chore

- Update remaining component files for consistency ([cabf974](https://github.com/clownware/astro-performance-starter/commit/cabf974))
- Added `changelogen` for automated changelog generation from conventional commits
- Added `predev` script for automatic token compilation on `pnpm run dev`

## [0.2.0] - 2026-03-26

### Changed

- Upgraded `astro` 5.14.1 → 6.0.8
- Upgraded `@astrojs/mdx` 4.3.6 → 5.0.2
- Upgraded `@astrojs/preact` 4.1.1 → 5.0.2
- Upgraded Vite 6.x → 7.x (transitive, via Astro 6)
- Migrated content collections config to Content Layer API (`src/content/config.ts` → `src/content.config.ts`, added `glob()` loaders, removed `type:` declarations)
- Updated `z` import from `astro:content` to `astro/zod` (Zod 4 requirement)
- Updated `entry.slug` → `entry.id` across all pages, layouts, and components
- Updated `entry.render()` → standalone `render(entry)` from `astro:content`
- Fixed missing avatar image path in `src/content/bio/author.json`

## [0.1.1] - 2026-03-26

### Fixed

- Corrected `@tailwindcss/typography` version spec from `^0.6.0` (non-existent) to `^0.5.19`
- Updated hardcoded Tailwind CSS version in tech stack display from `v3.4.4` to `v4.2.2`
- Updated hardcoded Biome version in tech stack display from `v2.2.4` to `v2.4.9`
- Corrected stale version manifest values in `versions.json` and `versions.yml` (astro, biome, node, pnpm, preact, playwright, sharp, style-dictionary, tailwindcss-themer, astro-sitemap)
- Fixed pre-existing MD001 heading level error in `docs/implementation-guides/code-examples/phase-8-code-examples.md`

### Changed

- Upgraded `vitest` 2.1.9 → 4.1.1
- Upgraded `jsdom` 27.0.0 → 29.0.1
- Upgraded `lighthouse` 12.8.2 → 13.0.3
- Upgraded `typescript` 5.9.2 → 5.9.3
- Upgraded `markdownlint-cli2` 0.18.1 → 0.22.0
- Upgraded `lint-staged` 15.5.2 → 16.4.0
- Upgraded `@commitlint/cli` + `@commitlint/config-conventional` 19.8.1 → 20.5.0
- Upgraded `astrobook` 0.8.10 → 0.12.4
- Added `MD060` disable to markdownlint config (compact table separators are standard GFM)

## [0.1.0] - 2026-03-25

### Added

- Initial public release of Astro Performance Starter
- Zero-JS baseline with Astro 5.x islands architecture
- Design token system with semantic colors and dark mode support
- WCAG AA accessibility compliance with automated contrast validation
- Biome 2.x for formatting and linting (replaces ESLint + Prettier)
- TypeScript 5.x in strict mode
- Tailwind CSS 3.x with design token integration
- Content Collections with MDX support for blog and projects
- GitHub Actions CI/CD pipeline (build, lint, type-check, security audit, bundle size)
- Pre-commit hooks via Husky + lint-staged
- E2E tests with Playwright, unit tests with Vitest
- Comprehensive documentation in `docs/` with AI context layer
- 38 Architecture Decision Records (ADRs)
- Progressive implementation guide (Foundation → Build → Polish)
- Performance budgets enforced in CI (< 160KB JS, < 50KB CSS)
- Atomic design component structure
- Responsive pages: Home, About, Blog, Projects, Contact, 404, 500
