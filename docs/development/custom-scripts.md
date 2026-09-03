---
title: Custom Scripts
description: A guide to every pnpm script in package.json and the automation behind it.
lastUpdated: true
tableOfContents: true
pagefind: true
---

This project uses a collection of custom scripts to automate common tasks, enforce quality standards, and enhance the build process. Every script in [`package.json`](https://github.com/clownware/astro-performance-starter/blob/master/package.json) is listed here.

`package.json` groups its scripts into an **Everyday** section (what a cloner runs) and a **Maintainer & advanced** section (template upkeep), separated by inert `"//1"` / `"//2"` keys — see [ADR-052](/adr/052-script-taxonomy/). The everyday section is reproduced verbatim in the [package scripts snippet](/snippets/package-scripts/). Most maintainer scripts are thin `tsx` wrappers around `scripts/src/*.ts`.

## Development Scripts

| Command | Description |
| :--- | :--- |
| `predev` | Runs `tokens:build` automatically before `dev` (pnpm lifecycle hook) |
| `dev` | Start development server |
| `dev:host` | Start development server with network access |
| `dev:debug` | Start development server with verbose logging |
| `dev:agent` | Start the dev server in the background (`astro dev --background`) for coding agents — [ADR-063](/adr/063-agent-facing-background-dev-server/) |
| `dev:agent:stop` | Stop the background dev server (`astro dev stop`) |
| `preview` | Serve the already-built `dist/` locally (run `build` first) |
| `preview:build` | Build, then serve `dist/` locally (convenience alias) |
| `clean` | Remove build artifacts (`dist`, `.astro`, `tokens/dist`) |
| `clean:all` | `clean` plus `node_modules/.cache` |

## Build Scripts

| Command | Description |
| :--- | :--- |
| `build` | `env:validate` → `tokens:build` → `astro build` |
| `build:ci` | Same chain as `build`, with `astro build --verbose` |
| `tokens:build` | Compile design tokens to `tokens/dist/tokens.css` and `tokens/dist/tailwind-tokens.json` |
| `env:validate` | Reject placeholder values in `SITE_URL` before a production build ([ADR-050](/adr/050-type-safe-env-astro-env/)) |

## Code Quality Scripts

| Command | Description |
| :--- | :--- |
| `format` | Format code with Biome |
| `format:check` | Check code formatting without changes |
| `lint` | Lint code with Biome (`biome check .`) |
| `lint:md` | Lint Markdown files (pure check) |
| `lint:md:fix` | Lint Markdown files and apply fixes |
| `check` | Run Astro type checking (`astro check`, with a local `SITE_URL` default) |
| `check:types` | Run TypeScript type checking only (`tsc --noEmit`) |
| `quality` | Local quality pass: `format` + `lint` + `lint:md` + `check` |
| `quality:ci` | The full CI quality gate: `format:check` + `lint` + `lint:md` + `check` + `test:unit` + `agents:check` + `version:check` + `og:check` + `docs:count` |

## Testing Scripts

| Command | Description |
| :--- | :--- |
| `test` | Run unit tests with Vitest in watch mode |
| `test:unit` | Run unit tests once (also runs in the `pre-push` hook) |
| `test:coverage` | Run unit tests once with coverage (thresholds in `vitest.config.ts`) |
| `test:mutate` | Run Stryker mutation testing against the unit suite |
| `test:e2e` | Run Playwright end-to-end tests |
| `test:e2e:ui` | Run E2E tests with the Playwright UI |
| `test:a11y` | Run the `@a11y`-tagged Playwright tests |

See [Testing Conventions](/development/testing-conventions/) for how to write tests in this repo.

## AI Constitution Scripts

| Command | Description |
| :--- | :--- |
| `agents:build` | Regenerate `AGENTS.md` from the layered constitution files in `.claude/` |
| `agents:check` | Fail if `AGENTS.md` differs from the regenerated output (CI gate) |
| `enforce` | Run the ADR enforcement suite from `checks/enforcement.config.json` and report BLOCKER / WARNING / PASS / DELEGATED ([ADR-064](/adr/064-enforcement-architecture/)) |

## Documentation Scripts

| Command | Description |
| :--- | :--- |
| `docs:count` | Verify inline counts in the docs (ADRs, components, etc.) match the filesystem (CI gate) |
| `version:check` | Verify the README footer version and `versions.json` pins match `package.json` (CI gate) |
| `version:fix` | Rewrite the drifted values that `version:check` reports |
| `roadmap:update` | Sync the roadmap checklist in `docs/README.md` from the implementation guides |

Documentation syncing to the docs site is pulled from that site's repository (its `update:adrs` and `update:versions` scripts), not pushed from this project — see [ADR-059](/adr/059-docs-drift-gate/).

## Brand Asset Scripts

| Command | Description |
| :--- | :--- |
| `og:build` | Regenerate the raster brand assets (OG images, apple-touch-icon, favicon.ico) from their source SVGs |
| `og:check` | Fail if the committed rasters differ from a fresh regeneration (CI gate) |

## Performance Scripts

| Command | Description |
| :--- | :--- |
| `images:analyze` | Analyze image sizes and optimization opportunities |
| `images:gate` | Enforce the per-image size budget (CI gate) |
| `images:optimize` | Interactive image optimization tool |
| `fonts:gate` | Enforce the per-page font-preload cap (CI gate) |
| `bundle:analyze` | Build, then analyze bundle size and composition |
| `perf:budgets` | Check the built output against the defined performance budgets |
| `perf:baseline` | Record a Lighthouse baseline for regression comparison |
| `perf:lighthouse` | Run a Lighthouse audit against the local server (HTML report) |
| `perf:lighthouse:ci` | Run Lighthouse headless for CI (JSON report) |
| `perf:lhci` | Run Lighthouse CI (`lhci autorun`) |

Budgets and their enforcement are described in [Budgets & Guardrails](/implementation-guides/reference/budgets-guardrails/).

## Design System Scripts

| Command | Description |
| :--- | :--- |
| `design:validate` | Validate color contrast compliance (WCAG AA) for the semantic token pairs |
| `budgets:validate` | Fail if any entry in `budget-overrides.json` has expired |

## Security Scripts

| Command | Description |
| :--- | :--- |
| `audit` | Run `pnpm audit` on production dependencies |
| `audit:ci` | Run the audit with the allowlist filter for CI |

## Release Scripts

| Command | Description |
| :--- | :--- |
| `release:changelog` | Generate `CHANGELOG.md` from conventional commits (changelogen) |
| `release:changelog:dry` | Preview the changelog without writing it |

## Git Hooks

| Command | Description |
| :--- | :--- |
| `prepare` | Install Husky git hooks (runs automatically on `pnpm install`) |

The hook files themselves are in the [git hooks snippet](/snippets/git-hooks/).
