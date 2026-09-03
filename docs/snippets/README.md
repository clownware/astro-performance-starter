---
title: Documentation Snippets
description: >-
  Reusable configuration blocks that are embedded into the implementation
  guides at build time via the snippet shortcode
lastUpdated: true
tableOfContents: true
pagefind: true
---
# Documentation Snippets

This directory contains reusable code snippets and configuration blocks that are referenced across multiple documentation files.

## Usage

Snippets are embedded in other documentation pages with a shortcode written on its own paragraph:

```markdown
{% snippet "biome-config" %}
```

The name is the snippet's file name without `.md`, in straight double quotes. Only
letters, digits, hyphens, and underscores are allowed. The shortcode is expanded only
in regular paragraph text — the include resolver deliberately skips code blocks and
inline code, which is why the example above renders literally.

Snippet includes resolve at build time: the
[`remark-snippet-includes`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/remark-snippet-includes.mjs)
plugin replaces each shortcode with the current content of `docs/snippets/<name>.md`
(the whole file, trimmed), so referencing pages always render the snippet as it exists
when the site is built. A shortcode that names a missing snippet fails the build.

## Available Snippets

| Snippet | Description | Used In |
|---------|-------------|---------|
| `adr-template` | Mirror of the canonical ADR template (`docs/adr/template.md`) | [Phase 0](/implementation-guides/completed/phase-0-foundation/) |
| `biome-config` | Biome formatter and linter configuration (`biome.json`, excerpt) | [Phase 0](/implementation-guides/completed/phase-0-foundation/), [Phase 3](/implementation-guides/completed/phase-3-code-examples/) |
| `commitlint-config` | Conventional-commits commitlint setup (`.commitlintrc.cjs`) | [Phase 3](/implementation-guides/completed/phase-3-code-examples/) |
| `env-example` | Environment variables template (`.env.example`) | [Phase 0](/implementation-guides/completed/phase-0-foundation/) |
| `essential-scripts` | Minimal `package.json` scripts subset | not currently embedded |
| `git-hooks` | Husky install steps and the three hook files | [Phase 0](/implementation-guides/completed/phase-0-foundation/), [Phase 3](/implementation-guides/completed/phase-3-code-examples/) |
| `lint-staged-config` | lint-staged configuration (`package.json` section) | [Phase 0](/implementation-guides/completed/phase-0-foundation/), [Phase 3](/implementation-guides/completed/phase-3-code-examples/) |
| `package-scripts` | The everyday scripts section of `package.json`, verbatim | [Phase 3](/implementation-guides/completed/phase-3-code-examples/) |
| `tsconfig-paths` | TypeScript path aliases (`tsconfig.json` excerpt) | [Phase 0](/implementation-guides/completed/phase-0-foundation/) |

## Snippet Structure

Each snippet file should:

- Reproduce its source file verbatim, or be clearly labelled as an excerpt
- Include a comment naming the source file
- Follow the project's code style
- Be version-agnostic where possible

## Maintenance

When a config file changes:

1. Regenerate the matching snippet from the real file
2. Changes propagate to every referencing page at the next build
3. No need to update the referencing documentation files
