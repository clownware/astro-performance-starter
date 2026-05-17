# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Layered AI constitution split across `CLAUDE.md`, `.claude/engineering.md`, `.claude/workflow.md`, `.claude/stack.md`, and `.claude/roles/` ([ADR-036](./docs/adr/036-layered-constitution.md))
- Testing philosophy adopted as house rules — test-first, AAA structure, no conditional assertions, no lowered thresholds ([ADR-037](./docs/adr/037-testing-philosophy.md))
- Three-pass Architect → Coder → Reviewer workflow with explicit hand-off artefacts ([ADR-038](./docs/adr/038-agent-roles.md))
- `AGENTS.md` at repo root — cross-tool AI agent spine read natively by Cursor, Codex CLI, Copilot, Windsurf, Aider, Devin, Zed, Continue, Amp, and Amazon Q (ADR-045)
- `scripts/src/build-agents-md.ts` with `pnpm agents:build` and `pnpm agents:check` — generates `AGENTS.md` from the layered constitution; CI fails on drift
- ADR-045 documenting the cross-tool spine architecture as the cross-tool extension of ADR-036
- Homepage "AI-Assisted Development" card and README "Why This Starter?" bullet rewritten to name the agentic-discipline methodology rather than soft "AI-optimized" copy
- README "Working with AI Agents" section documenting the layered constitution and `AGENTS.md` cross-tool spine

### Changed

- `pnpm quality:ci` now halts on any violation — broken tests, lint, types, and markdown all block merge with no `--no-verify` bypass ([ADR-039](./docs/adr/039-halt-on-violation-enforcement.md)). **Breaking for contributors:** PRs that previously landed without passing tests will now be blocked.
- `quality:ci` now also chains `agents:check` so a source-file edit without `AGENTS.md` regeneration fails CI
- `.windsurfrules` shrunk from 179 lines to a ~20-line Windsurf-specific overlay; full context now comes from `AGENTS.md`
- `.claude/stack.md` "Multi-tool sync" footer replaced with a generated-spine note
- `docs/ai-context/INDEX.md` Rules of Engagement section no longer duplicates the halt-on-violation rules (the 7-vs-10 drift it encoded was the motivating example for ADR-045); points at `AGENTS.md` instead
- `docs/ai-context/ai-rules-setup.md` rewritten for the AGENTS.md pattern with a 2026 tool-support matrix
- ADR-035 Category 1 enumeration: `airules.example` row removed; `AGENTS.md` row added
- README, CONTRIBUTING, and `docs/getting-started/included-in-this-template.md` updated to describe the cross-tool spine instead of the per-tool copy workflow
- Homepage Foundation tier card replaces "CI pipeline" with "Layered AI constitution" and "Halt-on-violation CI gates"
- Homepage CTA footer "AI Optimized" replaced with "Agentic Discipline"; subhead updated to reference the layered constitution

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
