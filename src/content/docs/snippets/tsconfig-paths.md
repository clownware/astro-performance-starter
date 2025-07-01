---
title: tsconfig paths
description: "```json\r // tsconfig.json\r {\r   \"extends\": \"astro/tsconfigs/strict\",\r   \"compilerOptions\": {\r     \"baseUrl\": \".\",\r     \"paths\": {\r       \"@/*\": [\"src/*\"],\r     "
last_reviewed_on: '2025-07-01'
---
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
      "@styles/*": ["src/styles/*"],
      "@types/*": ["src/types/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```
