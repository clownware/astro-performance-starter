---
title: package scripts
description: >-
  The everyday scripts section of the template's package.json, verbatim. See
  package.json for the maintainer and advanced set (ADR-052 taxonomy).
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// package.json — the "Everyday" section, reproduced verbatim from the file.
// The maintainer & advanced scripts live below the "//2" separator (ADR-052).
{
  "scripts": {
    "//1": "─── Everyday: the scripts you'll actually use as a cloner ───",
    "predev": "pnpm run tokens:build",
    "dev": "astro dev",
    "dev:host": "astro dev --host",
    "dev:debug": "astro dev --verbose",
    "dev:agent": "astro dev --background",
    "dev:agent:stop": "astro dev stop",
    "build": "pnpm run env:validate && pnpm run tokens:build && astro build",
    "build:ci": "pnpm run env:validate && pnpm run tokens:build && astro build --verbose",
    "preview": "astro preview",
    "preview:build": "pnpm run build && astro preview",
    "tokens:build": "tsx scripts/src/build-tokens.ts",
    "format": "biome format . --write",
    "format:check": "biome format .",
    "lint": "biome check .",
    "lint:md": "markdownlint-cli2 \"**/*.md\" \"**/*.mdx\"",
    "lint:md:fix": "markdownlint-cli2 \"**/*.md\" \"**/*.mdx\" --fix",
    "check": "SITE_URL=${SITE_URL:-http://localhost:4321} astro check",
    "check:types": "tsc --noEmit",
    "quality": "pnpm run format && pnpm run lint && pnpm run lint:md && pnpm run check",
    "quality:ci": "pnpm run format:check && pnpm run lint && pnpm run lint:md && pnpm run check && pnpm run test:unit && pnpm run agents:check && pnpm run version:check && pnpm run og:check && pnpm run docs:count",
    "test": "SITE_URL=http://localhost:4321 vitest",
    "test:unit": "SITE_URL=http://localhost:4321 vitest run",
    "test:coverage": "SITE_URL=http://localhost:4321 vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test --grep=\"@a11y\"",
    "clean": "rm -rf dist .astro tokens/dist",
    "clean:all": "rm -rf dist .astro tokens/dist node_modules/.cache",
    "prepare": "husky"
  }
}
```
