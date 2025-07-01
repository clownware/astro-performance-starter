---
title: lint staged config
description: "```json\r // package.json - lint-staged configuration\r {\r   \"lint-staged\": {\r     \"*.{js,ts,jsx,tsx,astro}\": [\r       \"biome check --apply --no-errors-on-unmatch"
last_reviewed_on: '2025-07-01'
---
```json
// package.json - lint-staged configuration
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,astro}": [
      "biome check --apply --no-errors-on-unmatched",
      "biome format --write --no-errors-on-unmatched"
    ],
    "*.{md,json,yaml,yml}": [
      "biome format --write --no-errors-on-unmatched"
    ],
    "package.json": [
      "sort-package-json"
    ]
  }
}
```
