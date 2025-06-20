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
