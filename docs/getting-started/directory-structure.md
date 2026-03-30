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
│   │   ├── atoms/                   # Atomic components (6)
│   │   │   ├── Badge.astro
│   │   │   ├── Button.astro
│   │   │   ├── Icon.astro
│   │   │   ├── Image.astro
│   │   │   ├── SocialLink.astro
│   │   │   └── Tooltip.astro
│   │   ├── molecules/               # Molecule components (8)
│   │   │   ├── Card.astro
│   │   │   ├── ContactForm.astro
│   │   │   ├── ContactFormScript.ts
│   │   │   ├── ExpandableFeatureCard.tsx  # Preact component
│   │   │   ├── Head.astro
│   │   │   ├── PostCard.astro
│   │   │   ├── ProjectCard.astro
│   │   │   └── SectionSeparator.astro
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
│   │   ├── bio/                     # Author bio collection
│   │   ├── blog/                    # Blog posts collection
│   │   │   └── *.mdx                # MDX blog posts
│   │   ├── experience/              # Work experience collection
│   │   │   └── *.mdx                # MDX experience entries
│   │   ├── navigation/              # Navigation config
│   │   └── projects/                # Projects collection
│   │       └── *.mdx                # MDX project pages
│   ├── layouts/                     # Page layouts (3)
│   │   ├── BaseLayout.astro         # Foundation layout
│   │   ├── BlogLayout.astro         # Blog post layout
│   │   └── ProjectLayout.astro      # Project showcase layout
│   ├── pages/                       # Routes (10)
│   │   ├── index.astro              # Homepage
│   │   ├── about.astro              # About page
│   │   ├── contact.astro            # Contact page
│   │   ├── 404.astro                # Not found
│   │   ├── 500.astro                # Server error
│   │   ├── robots.txt.ts            # Dynamic robots.txt generation
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
│   ├── utils/
│   │   ├── blog.ts                  # Blog post queries and sorting
│   │   ├── formatDate.ts            # Date formatting and reading time
│   │   ├── socialShare.ts           # Social media share URLs
│   │   ├── url-utils.ts             # URL helpers
│   │   └── validateOgImage.ts       # OG image validation
│   ├── config.ts                    # Site metadata and social links
│   └── content.config.ts            # Content Collections schema (Astro 6 Content Layer API)
│
├── public/                          # Static assets
│   ├── _headers                     # Security headers
│   └── favicon.svg
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
├── tsconfig.json                    # TypeScript strict mode
├── vitest.config.ts                 # Testing configuration
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # Lock file
├── .nvmrc                           # Node version (24.x)
├── .env.example                     # Environment template
├── README.md                        # Project overview
└── LICENSE.txt                      # MIT license
```

---

## Component Organization

**28 production-ready component files** organized by atomic design principles:

### Accessibility (1)

- `SkipLink.astro` - Keyboard navigation helper

### Atoms (6)

- `Badge.astro` - Labels and tags
- `Button.astro` - Interactive buttons with variants
- `Icon.astro` - Reusable SVG icons with accessibility support
- `Image.astro` - Optimized image wrapper
- `SocialLink.astro` - Social media links
- `Tooltip.astro` - Pure CSS tooltips

### Molecules (8)

- `Card.astro` - Content cards
- `ContactForm.astro` - Form with validation
- `ContactFormScript.ts` - Form handling logic
- `ExpandableFeatureCard.tsx` - Interactive feature cards (Preact)
- `Head.astro` - Reusable SEO component with OG/Twitter tags
- `PostCard.astro` - Blog post cards with metadata
- `ProjectCard.astro` - Project showcase cards
- `SectionSeparator.astro` - Gradient divider for visual section separation

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
├── getting-started/                 # Onboarding & setup
│   ├── onboarding.md               # Developer setup guide
│   ├── launch-demo.md              # Get running in 5-10 minutes
│   ├── quick-deploy.md             # Ship to production in under an hour
│   ├── directory-structure.md       # ← You are here
│   ├── included-in-this-template.md # Feature inventory
│   ├── creating-your-first-page.md  # Step-by-step page creation
│   └── FAQ.md                       # Common questions
│
├── ai-context/                      # AI assistant entry point
│   └── INDEX.md                     # Central context contract
│
├── implementation-guides/           # Phase-by-phase guides
│   ├── completed/                   # Foundation phases (0-4)
│   ├── active-phases/               # Current development (5-12)
│   ├── code-examples/               # Copy-paste examples
│   ├── guides/                      # Topic-specific guides
│   └── reference/                   # Tech stack, budgets, checklist
│
├── development/                     # Dev workflow guides
│   ├── recommended-extensions.md    # VS Code extensions
│   ├── git-workflow.md              # Branching & commit conventions
│   ├── author-guidelines.md         # Content authoring guide
│   └── TESTING_COVERAGE.md          # Test strategy & coverage
│
├── patterns/                        # Design patterns
│   ├── component-patterns.md        # Component design
│   ├── content-collections.md       # Advanced content patterns
│   ├── islands-architecture.md      # Interactive components
│   ├── mdx-components.md            # MDX usage
│   └── performance-patterns.md      # Optimization techniques
│
├── snippets/                        # Reusable code snippets
│
└── adr/                             # Architectural Decision Records (35+)
    ├── 000-starter-decisions.md
    ├── 001-preact-island-usage-policy.md
    ├── template.md
    └── ...
```

**See**: [Documentation Overview](../README.md) for full navigation guide.

---

## Key Files

### Configuration

- `astro.config.mjs` - Astro, MDX, integrations
- `src/styles/global.css` - Tailwind v4 CSS-native config with `@theme inline` design tokens
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

- [Launch Demo](./launch-demo.md) - Get up and running
- [Component Patterns](../patterns/component-patterns.md) - Component design
- [Implementation Guides](../implementation-guides/) - Phased development tiers
