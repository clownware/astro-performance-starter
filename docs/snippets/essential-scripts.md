---
title: essential scripts
description: >-
  The minimal package.json scripts a cloner needs (dev, build, preview, check),
  with the two helpers build depends on
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// package.json (subset) — the minimum a clone needs to run. Values are the
// template's real scripts; build depends on tokens:build and env:validate.
{
  "scripts": {
    "predev": "pnpm run tokens:build",
    "dev": "astro dev",
    "build": "pnpm run env:validate && pnpm run tokens:build && astro build",
    "preview": "astro preview",
    "tokens:build": "tsx scripts/src/build-tokens.ts",
    "env:validate": "tsx scripts/src/validate-env.ts",
    "check": "SITE_URL=${SITE_URL:-http://localhost:4321} astro check",
    "check:types": "tsc --noEmit"
  }
}
```
