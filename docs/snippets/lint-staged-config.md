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
