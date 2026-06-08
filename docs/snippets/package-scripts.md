---
title: package scripts
description: "```json\r // package.json — everyday scripts (see package.json for the full maintainer set)\r {\r   \"scripts\": {\r     \"dev\": \"astro dev\","
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// package.json — everyday scripts (the ones a cloner actually runs).
// See package.json for the full maintainer & advanced set (ADR-052 taxonomy).
{
  "scripts": {
    "dev": "astro dev",
    "dev:host": "astro dev --host",
    "build": "pnpm run env:validate && pnpm run tokens:build && astro build",
    "preview": "astro preview",
    "tokens:build": "tsx scripts/src/build-tokens.ts",
    "format": "biome format . --write",
    "format:check": "biome format .",
    "lint": "biome check .",
    "lint:md": "markdownlint-cli2 \"**/*.md\" \"**/*.mdx\"",
    "check": "SITE_URL=${SITE_URL:-http://localhost:4321} astro check",
    "check:types": "tsc --noEmit",
    "quality": "pnpm run format && pnpm run lint && pnpm run lint:md && pnpm run check",
    "quality:ci": "pnpm run format:check && pnpm run lint && pnpm run lint:md && pnpm run check && pnpm run test:unit && pnpm run agents:check && pnpm run version:check",
    "test": "SITE_URL=http://localhost:4321 vitest",
    "test:unit": "SITE_URL=http://localhost:4321 vitest run",
    "test:coverage": "SITE_URL=http://localhost:4321 vitest run --coverage",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test --grep=\"@a11y\"",
    "clean": "rm -rf dist .astro tokens/dist",
    "prepare": "husky install"
  }
}
```
