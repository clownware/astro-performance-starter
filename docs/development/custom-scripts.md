---
title: Custom Scripts
description: A guide to the custom scripts and automation used in this project.
lastUpdated: true
--- 

This project uses a collection of custom scripts to automate common tasks, enforce quality standards, and enhance the build process.

## Development Scripts

| Command | Description |
| :--- | :--- |
| `start` | Start development server |
| `start:host` | Start development server with network access |
| `start:debug` | Start development server with verbose logging |
| `preview` | Preview production build locally |
| `clean` | Remove build artifacts (dist, .astro) |
| `clean:all` | Remove build artifacts and node_modules cache |

## Build Scripts

| Command | Description |
| :--- | :--- |
| `build` | Build tokens then build site for production |
| `build:ci` | Build for CI with verbose logging |
| `tokens:build` | Compile design tokens to CSS variables and Tailwind config |

## Code Quality Scripts

| Command | Description |
| :--- | :--- |
| `format` | Format code with Biome |
| `format:check` | Check code formatting without changes |
| `lint` | Lint code with Biome |
| `lint:md` | Lint Markdown files |
| `lint:md:fix` | Fix Markdown linting issues |
| `typecheck` | Run Astro type checking |
| `typecheck:types` | Run TypeScript type checking only |
| `quality` | Run all quality checks (format, lint, markdown, types) |

## Testing Scripts

| Command | Description |
| :--- | :--- |
| `test` | Run unit tests with Vitest |
| `test:unit` | Run unit tests once |
| `test:e2e` | Run Playwright end-to-end tests |
| `test:e2e:ui` | Run E2E tests with UI |
| `test:a11y` | Run accessibility tests |

## Documentation Scripts

| Command | Description |
| :--- | :--- |
| `docs:sync` | Sync documentation from separate docs repo (available at launch) |
| `docs:update` | Sync docs and inject current package versions for AI context |
| `docs:components` | Start Astrobook component documentation |
| `docs:components:build` | Build Astrobook documentation |
| `roadmap:update` | Update implementation roadmap status |

## Performance Scripts

| Command | Description |
| :--- | :--- |
| `images:analyze` | Analyze image sizes and optimization opportunities |
| `images:optimize` | Interactive image optimization tool |
| `bundle:analyze` | Analyze bundle size and composition |
| `perf:budgets` | Check performance against defined budgets |
| `perf:baseline` | Track baseline performance metrics |
| `perf:lighthouse` | Run Lighthouse performance audit |
| `perf:lighthouse:ci` | Run Lighthouse for CI (JSON output) |

## Design System Scripts

| Command | Description |
| :--- | :--- |
| `design:validate` | Validate color contrast compliance (WCAG AA) |
| `budgets:validate` | Validate performance budget overrides |

## Security Scripts

| Command | Description |
| :--- | :--- |
| `audit` | Run security audit on production dependencies |
| `audit:ci` | Run filtered security audit for CI |

## Git Hooks

| Command | Description |
| :--- | :--- |
| `prepare` | Install Husky git hooks |
