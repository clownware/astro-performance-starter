---
title: lint staged config
description: "```json\r // package.json - lint-staged configuration\r {\r   \"lint-staged\": {\r     \"*.{astro,ts,tsx,js,jsx,json,yml,yaml}\": \"biome check --write --no-errors-on-unmatch"
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
