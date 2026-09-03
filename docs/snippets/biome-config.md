---
title: biome config
description: >-
  The template's biome.json (formatter and linter rule set), reproduced from the
  file with the naming-convention rule and per-glob overrides omitted.
lastUpdated: true
tableOfContents: true
pagefind: true
---
```json
// biome.json (excerpt — see the note below for what is omitted)
{
  "$schema": "https://biomejs.dev/schemas/2.5.8/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": [
      "src/**/*.{astro,ts,tsx,js,jsx,md,mdx}",
      "docs/**/*.{md,mdx}",
      "scripts/**/*.{ts,js,mjs}",
      "*.{md,mdx,ts,js,mjs}"
    ]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100,
    "attributePosition": "auto"
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "double"
    }
  },
  "css": {
    "formatter": {
      "enabled": true
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noBannedTypes": "error",
        "noUselessTypeConstraint": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "error"
      },
      "suspicious": {
        "noExplicitAny": "error",
        "noImplicitAnyLet": "error"
      },
      "a11y": {
        "recommended": true
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useAsConstAssertion": "warn",
        "useBlockStatements": "warn",
        "noParameterAssign": "warn",
        "useDefaultParameterLast": "warn",
        "useEnumInitializers": "warn",
        "useSelfClosingElements": "warn",
        "useSingleVarDeclarator": "warn",
        "useNumberNamespace": "warn",
        "noInferrableTypes": "warn",
        "noUselessElse": "warn"
      }
    }
  }
}
```

> Two sections of the real file are omitted above for brevity: the
> `style.useNamingConvention` rule (camelCase variables, PascalCase types) and
> the `overrides` array (per-glob rules for Markdown, scripts, Astro, CSS,
> tests, and config files). See the repo's
> [`biome.json`](https://github.com/clownware/astro-performance-starter/blob/master/biome.json)
> for the authoritative, complete configuration.
