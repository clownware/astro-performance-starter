---
title: Directory Explained
description: >-
  A breakdown of the directory structure in the Astro Performance Starter template.
lastUpdated: true
tableOfContents: true
pagefind: true
---

```bash
astro-performance-starter/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    # Working CI pipeline
│   ├── FUNDING.yml                   # Optional sponsorship
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── phase_completion.md
│
├── docs/
│   ├── README.md                     # Docs overview & navigation
│   ├── implementation-guides/        # Development guides
│   │   ├── README.md                 # Implementation roadmap
│   │   ├── completed/                # Foundation phases (0-4)
│   │   │   ├── phase-0-foundation.md
│   │   │   ├── phase-1-content.md
│   │   │   ├── phase-2-design.md
│   │   │   ├── phase-3-performance.md
│   │   │   └── phase-4-quality.md
│   │   ├── active-phases/            # Current development (5-12)
│   │   │   ├── phase-5-components.md   # ← AI starting point
│   │   │   ├── phase-6-sections.md     # (not started)
│   │   │   ├── phase-7-pages.md
│   │   │   ├── phase-8-features.md
│   │   │   ├── phase-9-optimization.md
│   │   │   ├── phase-10-deployment.md
│   │   │   ├── phase-11-monitoring.md
│   │   │   └── phase-12-maintenance.md
│   │   ├── guides/                   # Topic-specific guides
│   │   │   ├── accessibility.md
│   │   │   ├── components.md
│   │   │   ├── content-model.md
│   │   │   └── testing.md
│   │   ├── code-examples/            # Implementation examples
│   │   │   ├── component-patterns/
│   │   │   ├── content-collections/
│   │   │   └── performance-patterns/
│   │   ├── reference/                # Technical reference
│   │   │   ├── tech-stack.md
│   │   │   ├── directory-structure.md
│   │   │   └── budgets-guardrails.md
│   │   └── tracks/                   # Implementation tracks
│   │       ├── mvp-track.md
│   │       └── showcase-track.md
│   └── adr/
│       ├── template.md
│       └── 001-starter-decisions.md
│
├── src/                              # Minimal implementation
│   ├── assets/
│   │   └── logo.svg                 # Project logo
│   ├── components/
│   │   ├── atoms/
│   │   │   └── Button.astro         # One example component
│   │   ├── structural/
│   │   │   ├── Container.astro
│   │   │   └── Section.astro
│   │   └── README.md                # Component guidelines
│   ├── content/
│   │   ├── config.ts                # Full schema setup
│   │   ├── docs/                    # Starlight docs content
│   │   └── blog/
│   │       └── example-post.mdx     # One example
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Complete base layout
│   │   └── partials/
│   │       ├── Header.astro
│   │       └── Footer.astro
│   ├── pages/
│   │   ├── index.astro              # Minimal homepage
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css               # With token integration
│   ├── types/
│   │   ├── astro-content.d.ts       # Generated types
│   │   └── navigation.ts            # Navigation types
│   └── utils/
│       └── url-utils.ts             # Example utility
│
├── public/
│   ├── _headers                     # Security headers
│   ├── favicon.svg
│   └── robots.txt
│
├── scripts/
│   ├── src/                         # Script source files
│   │   ├── build-tokens.ts          # Working token builder
│   │   ├── validate-contrast.ts     # Working validator
│   │   ├── baseline-performance.ts  # Performance baseline
│   │   └── track-performance-budgets.ts # Budget tracking
│   └── tsconfig.json                # Scripts TypeScript config
│
├── tokens/
│   ├── base.json                    # Complete token set
│   ├── semantic.json
│   └── dist/                        # Git-ignored
│
├── .vscode/
│   ├── extensions.json              # Recommended extensions
│   └── settings.json                # Project settings
│
├── .husky/
│   └── pre-commit                   # Working git hooks
│
├── .commitlintrc.cjs                # Commit message linting
├── .editorconfig                    # Editor settings
├── .env.example                     # Environment template
├── .gitignore                       # Comprehensive ignore
├── .lintstagedignore                # Lint staged ignore
├── .nvmrc                           # Node version
├── .windsurfrules                   # Windsurf AI rules
├── CHANGELOG.md                     # Release notes
├── CONTRIBUTING.md                  # Contribution guide
├── ONBOARDING.md                    # Quick start guide
├── README.md                        # Project overview
├── LICENSE.txt                      # MIT license
├── airules.example                  # AI rules template
├── astro.config.mjs                 # Minimal config
├── biome.json                       # Complete config
├── budget-overrides.json            # Example overrides
├── package.json                     # All deps, no fluff
├── pnpm-lock.yaml                   # Lockfile
├── tailwind.config.ts               # Token integration
├── tsconfig.json                    # Strict mode
└── vitest.config.ts                 # Testing config
```
