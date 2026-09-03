---
title: tsconfig paths
description: >-
  TypeScript path aliases from the template's tsconfig.json (@/, @components/,
  @layouts/, and friends)
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// tsconfig.json (excerpt — the path aliases; see the file for the full compilerOptions)
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
      "@components/*": [
        "src/components/*"
      ],
      "@layouts/*": [
        "src/layouts/*"
      ],
      "@utils/*": [
        "src/utils/*"
      ],
      "@styles/*": [
        "src/styles/*"
      ],
      "@types/*": [
        "src/types/*"
      ],
      "@content/*": [
        "src/content/*"
      ],
      "@assets/*": [
        "src/assets/*"
      ],
      "@scripts/*": [
        "scripts/*"
      ]
    }
  }
}
```
