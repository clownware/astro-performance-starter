---
title: lint staged config
description: >-
  lint-staged configuration: Biome checks staged code files, markdownlint fixes
  staged Markdown (package.json section)
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// package.json - lint-staged configuration
{
  "lint-staged": {
    "*.{astro,ts,tsx,js,jsx,json,yml,yaml}": "biome check --write --no-errors-on-unmatched",
    "*.{md,mdx}": "markdownlint-cli2 --fix"
  }
}
```
