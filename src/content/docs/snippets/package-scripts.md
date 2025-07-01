---
title: package scripts
description: "```json\r // package.json - scripts section\r {\r   \"scripts\": {\r     \"dev\": \"astro dev\",\r     \"build\": \"astro check && astro build\",\r     \"preview\": \"astro previe"
last_reviewed_on: '2025-07-01'
---
```json
// package.json - scripts section
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "sync": "astro sync",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "lint": "biome lint .",
    "lint:fix": "biome lint --apply .",
    "quality": "biome check .",
    "quality:fix": "biome check --apply .",
    "validate:links": "tsx scripts/validate-links.ts",
    "prepare": "husky install"
  }
}
```
