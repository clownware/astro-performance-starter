# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `versions.json` declared a public consumption contract — additive keys fine, renames/removals breaking ([ADR-061](./docs/adr/061-versions-json-public-contract.md))
- `version:check` now fails on a drifted `template` field in `versions.json`; `version:fix` stamps it from `package.json` `"version"` (the field had shipped drifted: v0.2.0 vs 0.9.0)
- GitHub Releases published automatically on `v*` tag push via `.github/workflows/release.yml`, with the body extracted from that version's CHANGELOG section (`scripts/src/extract-changelog.ts`)

## [0.9.0] — 2026-05-17

Release candidate. Material shift in positioning: this template is now a reference implementation of the layered AI constitution pattern with halt-on-violation enforcement.

### Added

- Layered AI constitution split across `CLAUDE.md`, `.claude/engineering.md`, `.claude/workflow.md`, `.claude/stack.md`, and `.claude/roles/` ([ADR-036](./docs/adr/036-layered-constitution.md))
- Testing philosophy adopted as house rules — test-first, AAA structure, no conditional assertions, no lowered thresholds ([ADR-037](./docs/adr/037-testing-philosophy.md))
- Three-pass Architect → Coder → Reviewer workflow with explicit hand-off artefacts ([ADR-038](./docs/adr/038-agent-roles.md))
- Container API helper for `.astro` component microtests; microtests now ship for every atom and molecule ([ADR-040](./docs/adr/040-container-api-for-component-microtests.md))
- Stryker mutation testing nightly via `.github/workflows/mutation.yml`; local invocation `pnpm test:mutate` ([ADR-042](./docs/adr/042-mutation-testing-with-stryker.md))
- CRAP score budget policy for high-coupling functions ([ADR-043](./docs/adr/043-crap-score-budgets.md))
- Coupling-map tooling to surface high-fan-in modules ([ADR-044](./docs/adr/044-coupling-map.md))
- `AGENTS.md` at repo root — cross-tool AI agent spine read natively by Cursor, Codex CLI, Copilot, Windsurf, Aider, Devin, Zed, Continue, Amp, and Amazon Q ([ADR-045](./docs/adr/045-cross-tool-agents-spine.md))
- `scripts/src/build-agents-md.ts` with `pnpm agents:build` and `pnpm agents:check` — generates `AGENTS.md` from the layered constitution; CI fails on drift
- Homepage "AI-Assisted Development" card rewritten as "Agentic Discipline Built In" naming the constitution, role-separated workflow, and halt-on-violation gates
- Homepage tech stack now lists Astro Container API and Stryker as first-class testing tools
- README "Why This Starter?" bullet rewritten ("Agentic discipline built in") and a new "Working with AI Agents" section documents the layered constitution, the `AGENTS.md` cross-tool spine, and Uncle Bob's _Clean AI: Agentic Discipline_ source
- SVG hero images for the `design-decisions` and `ai-optimized-means-ai-ready` blog posts; the latter is now published (draft removed)

### Changed

- `pnpm quality:ci` now halts on any violation — broken tests, lint, types, and markdown all block merge with no `--no-verify` bypass ([ADR-039](./docs/adr/039-halt-on-violation-enforcement.md)). **Breaking for contributors:** PRs that previously landed without passing tests will now be blocked.
- `quality:ci` now also chains `agents:check` so a source-file edit without `AGENTS.md` regeneration fails CI
- `.windsurfrules` shrunk from 179 lines to a ~20-line Windsurf-specific overlay; full context now comes from `AGENTS.md`
- `.claude/stack.md` "Multi-tool sync" footer replaced with a generated-spine note
- `docs/ai-context/INDEX.md` Rules of Engagement section no longer duplicates the halt-on-violation rules (the 7-vs-10 drift it encoded was the motivating example for ADR-045); points at `AGENTS.md` instead
- `docs/ai-context/ai-rules-setup.md` rewritten for the AGENTS.md pattern with a 2026 tool-support matrix
- ADR-035 Category 1 enumeration: `airules.example` row removed; `AGENTS.md` row added
- README, CONTRIBUTING, and `docs/getting-started/included-in-this-template.md` updated to describe the cross-tool spine instead of the per-tool copy workflow
- E2E suite restructured for ADR-037 hygiene (one logical assertion per test, behaviour-describing names); Gherkin extension declined as unnecessary ceremony given the rewrite already reads as specifications
- Homepage Foundation tier card replaces "CI pipeline" with "Layered AI constitution" and "Halt-on-violation CI gates"
- Homepage Build tier card replaces "Automated tests & CI quality gates" with "Container API microtests for every atom & molecule" and "Test-first discipline enforced in CI (ADR-037)"
- Homepage Polish tier card replaces "Post-launch monitoring" with "Mutation testing as quality verification (ADR-042)"
- Homepage "Lighthouse Performance Scores" section renamed to "Quality Metrics" to accommodate both runtime performance and test-quality dimensions
- Homepage CTA footer "AI Optimized" replaced with "Agentic Discipline"; subhead updated to reference the layered constitution
- `package.json` description rewritten from "AI-optimized documentation" to "a layered AI constitution with halt-on-violation enforcement"; previously-empty `author`, `homepage`, `repository.url`, and `bugs.url` fields populated
- ADR-040 Notes section cleaned of a hardcoded `/Users/chrispezza/…` path leak — now cross-links to ADR-042 instead

### Fixed

- `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, and `@vitest/coverage-v8` were declared but not installed locally; lockfile refreshed so `pnpm test:mutate` works on first clone

### Removed

- `airules.example` — stale Chrome Extension / React / Shadcn / Express boilerplate; setup docs that recommended copying it (`cp airules.example .windsurfrules`) would have overwritten the working Windsurf rules with the wrong stack. Replaced by the generated `AGENTS.md` pattern (ADR-045)

## [0.2.0] — 2026-04-06

### Added

- Astro 6.x with Content Layer API and zero-JS baseline
- Tailwind CSS v4 with CSS-native `@theme inline` design tokens
- Biome 2.x for formatting and linting (replaces ESLint + Prettier)
- Component showcase page with modern CSS features
- RSS feed generation via `@astrojs/rss`
- GitHub Pages subpath support with `withBase()` utility
- One-click deploy buttons for Cloudflare Pages, Netlify, and Vercel
- Claude Code project configuration with skills and subagents
- AI context layer (`CLAUDE.md`, `.windsurfrules`, `airules.example`, `docs/ai-context/`)
- 36 Architecture Decision Records (ADR-000 through ADR-035)
- Progressive implementation roadmap (Foundation / Build / Polish tiers)
- E2E tests with Playwright, unit tests with Vitest, accessibility tests with axe-core
- Security audit CI job with Trivy and custom audit filter
- Markdown link-check CI job for `docs/`
- Design token system with build pipeline and WCAG contrast validation
- Contact form with client-side validation and honeypot spam protection
- Live Lighthouse CI quality badges
- Dependabot configuration for automated dependency updates
- Comprehensive documentation: getting-started guides, patterns, implementation guides

### Changed

- Migrated from Astro 5 to Astro 6 Content Layer API
- Migrated from Tailwind v3 to v4 with `@tailwindcss/vite`
- Replaced ESLint + Prettier with Biome 2.x
- Replaced dual-track (MVP/Showcase) model with progressive tier model (ADR-033)
- Updated color scheme to white/charcoal with improved contrast ratios
- Optimized build with Lightning CSS minification
- Template-portable configuration (no hardcoded owner-specific values)

### Fixed

- GitHub Pages 404s and asset path resolution
- CI pipeline Node version, pnpm setup, and quality gates
- Restored 100 Lighthouse performance score
- E2E test resilience for unconfigured site links
- Cross-platform path compatibility in build scripts

## [0.1.0] — 2025-07-01

Initial template release with core Astro setup, design system foundations, and CI pipeline.
