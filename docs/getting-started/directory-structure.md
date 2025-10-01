---
title: Directory Structure
description: >-
  Overview of the Astro Performance Starter template structure and organization.
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Template Structure

The production-ready codebase you'll be working with:

```bash
astro-performance-starter/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # CI/CD pipeline
│   │   └── deploy.yml                # Deployment workflow
│   └── ISSUE_TEMPLATE/               # Issue templates
│
├── .husky/                           # Git hooks
│   ├── commit-msg                    # Commit linting
│   └── pre-commit                    # Pre-commit checks
│
├── src/                              # Production-ready implementation
│   ├── assets/
│   │   ├── icons/                   # SVG icons
│   │   │   ├── external-link.svg
│   │   │   └── link.svg
│   │   ├── images/                  # Image assets
│   │   └── logo.svg                 # Project logo
│   ├── components/
│   │   ├── a11y/                    # Accessibility components (1)
│   │   │   └── SkipLink.astro
│   │   ├── atoms/                   # Atomic components (5)
│   │   │   ├── Badge.astro
│   │   │   ├── Button.astro
│   │   │   ├── Image.astro
│   │   │   ├── SocialLink.astro
│   │   │   └── Tooltip.astro
│   │   ├── molecules/               # Molecule components (4)
│   │   │   ├── Card.astro
│   │   │   ├── ContactForm.astro
│   │   │   ├── ExpandableFeatureCard.astro
│   │   │   └── ProjectCard.astro
│   │   ├── structural/              # Structural components (5)
│   │   │   ├── Container.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Grid.astro
│   │   │   ├── Header.astro
│   │   │   └── Section.astro
│   │   ├── mdx/                     # MDX components (7)
│   │   │   ├── Blockquote.astro
│   │   │   ├── Callout.astro
│   │   │   ├── CodeFromFile.astro
│   │   │   ├── Figure.astro
│   │   │   ├── Grid.astro
│   │   │   ├── Link.tsx             # Preact component
│   │   │   └── index.ts             # Component registry
│   │   └── ThemeSetup.astro         # Theme detection (1)
│   ├── content/
│   │   ├── config.ts                # Content Collections schema
│   │   ├── bio/                     # Author bio collection
│   │   ├── blog/                    # Blog posts collection
│   │   │   └── *.mdx                # MDX blog posts
│   │   ├── navigation/              # Navigation config
│   │   └── projects/                # Projects collection
│   │       └── *.mdx                # MDX project pages
│   ├── layouts/                     # Page layouts (3)
│   │   ├── BaseLayout.astro         # Foundation layout
│   │   ├── BlogLayout.astro         # Blog post layout
│   │   └── ProjectLayout.astro      # Project showcase layout
│   ├── pages/                       # Routes (9)
│   │   ├── index.astro              # Homepage
│   │   ├── about.astro              # About page
│   │   ├── contact.astro            # Contact page
│   │   ├── 404.astro                # Not found
│   │   ├── 500.astro                # Server error
│   │   ├── blog/
│   │   │   ├── index.astro          # Blog index with pagination
│   │   │   └── [slug].astro         # Dynamic blog post
│   │   └── projects/
│   │       ├── index.astro          # Projects index with filtering
│   │       └── [slug].astro         # Dynamic project page
│   ├── styles/
│   │   └── global.css               # Global styles with tokens
│   ├── types/
│   │   └── navigation.ts            # Type definitions
│   └── utils/
│       └── formatDate.ts            # Utility functions
│
├── public/                          # Static assets
│   ├── _headers                     # Security headers
│   ├── favicon.svg
│   └── robots.txt
│
├── tokens/                          # Design tokens
│   ├── base.json                    # Base tokens
│   ├── semantic.json                # Semantic tokens
│   └── dist/                        # Generated CSS (git-ignored)
│
├── scripts/                         # Build & validation scripts
│   ├── src/
│   │   ├── build-tokens.ts          # Token builder
│   │   ├── validate-contrast.ts     # WCAG validator
│   │   └── baseline-performance.ts  # Performance tracking
│   └── tsconfig.json
│
├── docs/                            # 📚 See Documentation Structure below
│
├── .vscode/                         # Editor configuration
│   ├── extensions.json              # Recommended extensions
│   └── settings.json                # Workspace settings
│
├── astro.config.mjs                 # Astro configuration
├── biome.json                       # Linting & formatting
├── tailwind.config.ts               # Tailwind with tokens
├── tsconfig.json                    # TypeScript strict mode
├── vitest.config.ts                 # Testing configuration
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # Lock file
├── .nvmrc                           # Node version (22.x)
├── .env.example                     # Environment template
├── README.md                        # Project overview
└── LICENSE.txt                      # MIT license
```

---

## Component Organization

**23 production-ready components** organized by atomic design principles:

### Accessibility (1)

- `SkipLink.astro` - Keyboard navigation helper

### Atoms (5)

- `Badge.astro` - Labels and tags
- `Button.astro` - Interactive buttons with variants
- `Image.astro` - Optimized image wrapper
- `SocialLink.astro` - Social media links
- `Tooltip.astro` - Pure CSS tooltips

### Molecules (4)

- `Card.astro` - Content cards
- `ContactForm.astro` - Form with validation
- `ExpandableFeatureCard.astro` - Interactive feature cards
- `ProjectCard.astro` - Project showcase cards

### Structural (5)

- `Container.astro` - Content width container
- `Footer.astro` - Site footer
- `Grid.astro` - Responsive grid layouts
- `Header.astro` - Site navigation
- `Section.astro` - Page sections

### MDX Components (7)

- `Blockquote.astro` - Enhanced blockquotes
- `Callout.astro` - Alert-style callouts
- `CodeFromFile.astro` - Load code from files
- `Figure.astro` - Images with captions
- `Grid.astro` - MDX grid layouts
- `Link.tsx` - Smart link component (Preact)
- `index.ts` - Component registry

### Other (1)

- `ThemeSetup.astro` - Dark mode detection

---

## Page Routes

**9 routes** including dynamic pages:

- `/` - Homepage
- `/about` - About page
- `/contact` - Contact form
- `/blog/` - Blog index (paginated)
- `/blog/[slug]` - Dynamic blog posts
- `/projects/` - Projects index (filterable)
- `/projects/[slug]` - Dynamic project pages
- `/404` - Not found
- `/500` - Server error

---

## Layouts

**3 specialized layouts** extending BaseLayout:

- `BaseLayout.astro` - Foundation with SEO, fonts, View Transitions
- `BlogLayout.astro` - Blog posts with TOC, sharing, navigation
- `ProjectLayout.astro` - Project showcase with hero, tech stack

---

## Documentation Structure

Comprehensive guides organized for AI-assisted development:

```bash
docs/
├── getting-started/                 # Quick start
│   ├── quick-start.md
│   ├── directory-structure.md       # ← You are here
│   └── configuration.md
│
├── implementation-guides/           # Phase-by-phase guides
│   ├── completed/                   # Foundation phases (0-4)
│   │   ├── phase-0-foundation.md
│   │   ├── phase-1-content.md
│   │   ├── phase-2-design.md
│   │   ├── phase-3-performance.md
│   │   └── phase-4-quality.md
│   ├── active-phases/               # Current development (5-12)
│   │   ├── phase-5-components.md
│   │   ├── phase-6-sections.md
│   │   ├── phase-7-content.md
│   │   └── ...
│   ├── code-examples/               # Copy-paste examples
│   │   ├── phase-4-code-examples.md # Layouts & structure
│   │   ├── phase-5-code-examples.md # Components
│   │   ├── phase-6-code-examples.md # Sections & layouts
│   │   └── phase-7-code-examples.md # Pages & routes
│   ├── guides/                      # Topic-specific guides
│   │   ├── components-guide.md
│   │   ├── accessibility.md
│   │   └── testing.md
│   └── tracks/                      # Implementation paths
│       ├── mvp-track-guide.md       # Fast MVP path
│       └── showcase-track-guide.md  # Full-featured path
│
├── patterns/                        # Design patterns
│   ├── component-patterns.md        # Component design
│   ├── mdx-components.md            # MDX usage
│   └── islands-architecture.md      # Interactive components
│
├── architecture/                    # System design
│   ├── design-tokens.md
│   ├── tech-stack.md
│   └── performance-budgets.md
│
└── adr/                            # Architectural Decision Records
    ├── 000-starter-decisions.md
    ├── 001-preact-island-usage.md
    └── ...
```

**See**: [Documentation Overview](../README.md) for full navigation guide.

---

## Key Files

### Configuration

- `astro.config.mjs` - Astro, MDX, integrations
- `tailwind.config.ts` - Design tokens integration
- `biome.json` - Linting & formatting (20x faster than ESLint)
- `tsconfig.json` - TypeScript strict mode

### Scripts

- `pnpm run dev` - Development server
- `pnpm run build` - Production build
- `pnpm run tokens:build` - Generate design tokens
- `pnpm run lint` - Lint & format code
- `pnpm run test` - Run tests

### Quality Gates

- `.husky/pre-commit` - Pre-commit validation
- `.github/workflows/ci.yml` - CI/CD pipeline
- `budget-overrides.json` - Performance budgets

---

## Related Documentation

- [Quick Start Guide](./quick-start.md) - Get up and running
- [Tech Stack](../architecture/tech-stack.md) - Technology choices
- [Component Patterns](../patterns/component-patterns.md) - Component design
- [Implementation Tracks](../implementation-guides/tracks/) - MVP vs Showcase paths
