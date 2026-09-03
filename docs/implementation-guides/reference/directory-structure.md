---
title: Project Directory Structure
lastUpdated: true
description: >-
  Complete breakdown of the Astro Performance Starter project organization,
  component architecture, and file structure conventions
tableOfContents: true
pagefind: true
---

## Project Organization Philosophy

The Astro Performance Starter follows a **structured, scalable architecture** designed for:

- **Developer Experience**: Clear, predictable file locations
- **Performance First**: Optimized build output and asset organization
- **Atomic Design**: Component hierarchy that scales from simple to complex
- **Type Safety**: TypeScript-first with generated types from content
- **AI-Friendly**: Well-documented structure for AI development tools

## Complete Directory Structure

Tracked files only — generated output (`dist/`, `.astro/`, `tokens/dist/`, `coverage/`, `playwright-report/`, `lighthouse-ci-reports*/`) is git-ignored.

```bash
astro-performance-starter/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Quality gates, budgets, image/font gates, Chromium e2e, Semgrep, gitleaks
│   │   ├── deploy.yml                # GitHub Pages deployment
│   │   ├── lighthouse.yml            # Lighthouse CI gates (desktop + mobile lhci configs)
│   │   ├── link-check.yml            # Scheduled markdown link check
│   │   ├── mutation.yml              # Scheduled Stryker mutation testing (ADR-042)
│   │   ├── release.yml               # Release automation (changelogen)
│   │   └── versions-sync.yml         # Keeps versions.json in sync on Dependabot branches (ADR-061)
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug-report.md
│       └── feature-request.md
│
├── docs/
│   ├── README.md                     # Docs overview & navigation
│   ├── logo.svg
│   ├── personalization-guide.md
│   ├── assets/                       # Doc images (demo-screenshot.webp)
│   ├── 2026-06_design_system/        # Design system reference sheets (HTML) + brand/motion/tokens/wiring
│   ├── development/                  # CONTRIBUTING, git-workflow, custom-scripts, testing-conventions, …
│   ├── patterns/                     # component-patterns, content-collections, islands-architecture,
│   │   ├── …                         #   mdx-components, performance-patterns
│   │   └── examples/                 # success.json / error.json used by CodeFromFile examples
│   ├── snippets/                     # Reusable doc snippets (remark-snippet-includes)
│   ├── ai-context/                   # INDEX.md, ai-rules-setup, prompt-libraries/, PRD template
│   ├── implementation-guides/
│   │   ├── README.md                 # Implementation roadmap (tier model, ADR-033)
│   │   ├── completed/                # Foundation phases 0-4 + phase-{1..4}-code-examples.md
│   │   ├── active-phases/            # Build & polish phases 5-12
│   │   ├── code-examples/            # phase-{5..10,12}-code-examples.md
│   │   ├── guides/                   # accessibility, components, content-model, image-optimization,
│   │   │                             #   responsive-design, rollback-strategies, testing-strategy
│   │   └── reference/                # tech-stack, directory-structure, budgets-guardrails,
│   │                                 #   portfolio-checklist, optional-analytics, table-format-guide
│   └── adr/                          # Numbered ADRs 000 … 064 (007, 016, 041 reserved)
│       ├── README.md
│       ├── template.md
│       └── 000-starter-decisions.md … 064-enforcement-architecture.md
│
├── src/
│   ├── assets/
│   │   ├── brand/                   # Brand SVGs (marks, lockups, state icons)
│   │   ├── fonts/                   # Vendored woff2 (Geist, Inter) + OFL licences — Astro Fonts API (ADR-053)
│   │   ├── icons/                   # SVG icon sources
│   │   └── logo.svg
│   ├── components/
│   │   ├── atoms/                   # Badge, Button, Icon, Image, ThemeToggle, Tooltip, SocialLink, …
│   │   ├── molecules/               # Card, ContactForm (+ContactFormScript.ts), Dialog, Head, Tabs, …
│   │   ├── structural/              # Container, Section, Grid, Header, Footer, ParallaxSection
│   │   ├── islands/                 # Preact islands (SignalsCounter.tsx, MotionLab.tsx)
│   │   ├── mdx/                     # Blockquote, Callout, CodeFromFile, Figure, Grid, Link.tsx, index.ts
│   │   ├── a11y/                    # SkipLink.astro
│   │   ├── ThemeSetup.astro         # Theme initialization (ADR-032)
│   │   ├── __tests__/               # _helpers/container.ts (Container API helper, ADR-040) + guard tests
│   │   └── CLAUDE.md                # Component conventions
│   ├── content.config.ts            # Content Layer collection schemas
│   ├── content/
│   │   ├── bio/                     # default.mdx
│   │   ├── blog/                    # One directory per post (four examples)
│   │   ├── experience/              # Experience entries (.mdx)
│   │   ├── navigation/              # header.json
│   │   └── projects/                # One directory per project (two examples)
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Head, SkipLink, Header, <main id="main-content">, Footer
│   │   ├── BlogLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   ├── about.astro, contact.astro, how-it-works.astro, showcase.astro
│   │   ├── blog/                    # index.astro, [slug].astro, tag/[tag].astro
│   │   ├── projects/                # index.astro, [slug].astro
│   │   ├── adr/                     # index.astro, [slug].astro (ADRs as web routes)
│   │   ├── robots.txt.ts            # robots.txt generated at build time
│   │   ├── rss.xml.ts               # RSS feed route
│   │   ├── 404.astro, 500.astro
│   │   └── README.md
│   ├── scripts/                     # featureCardSync.ts (+ __tests__)
│   ├── styles/
│   │   └── global.css               # Tailwind CSS-first config: imports tokens.css, @theme inline, @variant dark, @utility
│   ├── types/
│   │   ├── astro-content.d.ts       # Checked-in `astro:content` module augmentation (generated types live in .astro/)
│   │   ├── content.ts               # Shared content types
│   │   ├── icons.ts                 # IconName union
│   │   └── navigation.ts            # Navigation types
│   ├── utils/                       # blog, formatDate, resolveImageFormat, socialShare, url-utils, validateOgImage (+ __tests__)
│   ├── __mocks__/                   # astro-content.ts — astro:content stub aliased in vitest.config.ts
│   ├── __tests__/                   # Design-token, contrast and policy tests
│   └── config.ts                    # Site metadata
│
├── public/
│   ├── _headers                     # Security headers
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png
│   ├── og-default.png, og-about.png, og-blog.png (+ .svg sources)
│   ├── logo.svg
│   └── site.webmanifest
│
├── scripts/
│   ├── src/                         # tsx scripts (ADR-052 taxonomy): build-tokens, build-og, build-agents-md,
│   │   ├── …                        #   check-image-budget, check-font-preloads, check-doc-counts,
│   │   ├── …                        #   check-version-consistency, track-performance-budgets, validate-*,
│   │   ├── …                        #   optimize-images(-interactive), run-enforcement, remark-*.mjs, …
│   │   └── __tests__/               # Script unit tests + fixtures
│   ├── og-manifest.json             # OG image manifest for build-og
│   └── tsconfig.json                # Scripts TypeScript config
│
├── tokens/
│   ├── base.json                    # Primitive tokens
│   ├── semantic.json                # Role tokens
│   └── dist/                        # Generated (git-ignored): tokens.css, tailwind-tokens.json
│
├── e2e/                             # Playwright specs (10): a11y-axe, about, blog, contact, docs-adr,
│                                    #   header, how-it-works, index, showcase, theme
├── tests/
│   └── fixtures/                    # posts.ts, tokens.ts — shared test data
├── checks/
│   └── enforcement.config.json      # ADR enforcement suite config (ADR-064)
│
├── .devcontainer/                   # devcontainer.json
├── .claude/                         # AI constitution layers: engineering.md, stack.md, workflow.md, roles/, skills/, agents/
├── .husky/                          # pre-commit (lint-staged), commit-msg (commitlint), pre-push (test:unit)
│
├── .audit-allowlist.json            # pnpm audit allowlist (audit:ci)
├── .commitlintrc.cjs                # Commit message linting
├── .editorconfig                    # Editor settings
├── .env.example                     # Environment template
├── .gitattributes
├── .gitignore
├── .gitleaks.toml                   # Secret-scan config (ADR-046)
├── .lintstagedignore
├── .markdown-link-check.json        # link-check.yml config
├── .markdownlint-cli2.jsonc         # Markdown lint config
├── .nvmrc                           # Node version
├── AGENTS.md                        # Cross-tool AI spine (generated by agents:build; see ADR-045)
├── CLAUDE.md                        # AI constitution entry point
├── CHANGELOG.md                     # Release notes
├── CONTRIBUTING.md                  # Contribution guide
├── README.md                        # Project overview
├── SECURITY.md                      # Security policy
├── LICENSE.txt                      # MIT license
├── astro.config.mjs                 # Framework config (fonts, env schema, integrations, image service)
├── biome.json                       # Lint + format config
├── budget-overrides.json            # Temporary budget overrides (validated by budgets:validate)
├── budgets.json                     # Raw-size performance budgets (perf:budgets)
├── ec.config.mjs                    # Expressive Code config
├── lighthouserc.json                # Lighthouse CI (desktop)
├── lighthouserc.mobile.json         # Lighthouse CI (mobile)
├── package.json                     # Scripts + dependencies
├── playwright.config.ts             # E2E config (chromium / firefox / webkit projects)
├── pnpm-lock.yaml                   # Lockfile
├── stryker.conf.json                # Mutation testing config (ADR-042)
├── tsconfig.json                    # Strict mode + path aliases
├── versions.json                    # Public version manifest (ADR-061)
└── vitest.config.ts                 # Unit test config (coverage scoped to src/utils)
```

## Component Architecture (Atomic Design)

### Primary Component Categories

```yaml
src/components/
├── atoms/              # Basic UI building blocks
│   ├── Button.astro    # Interactive elements (primary / secondary / ghost)
│   ├── Badge.astro     # Status/label badges
│   ├── Icon.astro      # Inline SVG icons (ADR-055)
│   ├── Image.astro     # astro:assets wrapper, single-format AVIF default (ADR-030)
│   ├── ThemeToggle.astro # Light/dark switch
│   ├── Tooltip.astro
│   └── …               # SocialLink, ScrollReveal, ReadingProgress, CounterBadge, CursorSpotlight,
│                       #   AnimatedGradientText, SheenEyebrow
│
├── molecules/          # Simple component combinations
│   ├── Card.astro      # Content cards
│   ├── ContactForm.astro # Contact form (+ ContactFormScript.ts progressive enhancement, ADR-021)
│   ├── Dialog.astro    # Modal dialog
│   ├── Head.astro      # Document head (meta, fonts, OG, JSON-LD, preconnect hints)
│   ├── Tabs.astro
│   ├── PostCard.astro / ProjectCard.astro
│   └── …               # ScrollSpy, SectionSeparator, TypeSpecimen, PaletteBand, ColorTokenSwatch,
│                       #   ExpandableFeatureCard, ShowcaseExample
│
├── structural/         # Layout and positioning
│   ├── Container.astro # Content width constraints
│   ├── Section.astro   # Semantic page sections
│   ├── Grid.astro      # Container-query grid
│   ├── Header.astro    # Site header + CSS-only mobile menu
│   ├── Footer.astro    # Site footer
│   └── ParallaxSection.astro
│
├── islands/            # Preact islands (client-side state)
│   ├── SignalsCounter.tsx
│   └── MotionLab.tsx
│
├── mdx/               # Content-specific components
│   ├── Callout.astro   # Information boxes
│   ├── Figure.astro    # Images with captions
│   ├── Grid.astro, Blockquote.astro, Link.tsx, CodeFromFile.astro
│   └── index.ts        # MDX component map passed to mdx() in astro.config.mjs
│
└── a11y/              # Accessibility helpers
    └── SkipLink.astro
```

There is no `organisms/` directory — complex page sections are composed
in pages from `structural/` and `molecules/` components.

### Component Naming Conventions

```typescript
// File naming: PascalCase
Button.astro
HeroSection.astro
NavigationMenu.astro

// Props: every component declares an interface named `Props`
// (src/components/CLAUDE.md). Astro picks it up for type-checking
// the component's attributes; `export` is optional.
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'primary', size = 'md' } = Astro.props;
```

## TypeScript Import Aliases

Pre-configured path aliases for clean imports:

```typescript
// Available aliases
import Button from '@components/atoms/Button.astro';
import { formatDate } from '@utils/formatDate';
import { siteMetadata } from '@/config';
import logo from '@assets/logo.svg';
import BaseLayout from '@layouts/BaseLayout.astro';
import type { NavigationItem } from '@types/navigation';

// tsconfig.json configuration
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
      "@styles/*": ["src/styles/*"],
      "@types/*": ["src/types/*"],
      "@content/*": ["src/content/*"],
      "@assets/*": ["src/assets/*"],
      "@scripts/*": ["scripts/*"]
    }
  }
}
```

The same aliases (minus `@scripts/*`) are mirrored in `vitest.config.ts`, which also aliases the virtual `astro:content` module to `src/__mocks__/astro-content.ts` for unit tests.

## Content Organization

### Content Collections Structure

```yaml
src/content.config.ts   # Collection schemas (Content Layer, at src root)
src/content/
├── blog/              # Blog posts (one directory per post, .md/.mdx)
├── projects/          # Portfolio items (one directory per project)
├── bio/               # Bio/profile content (.md/.mdx/.json)
├── experience/        # Experience entries
└── navigation/        # header.json (JSON/YAML loader)

# A sixth collection, `adr`, loads `[0-9][0-9][0-9]-*.md` from docs/adr/
# (outside src/content/) via a glob() loader and powers the /adr/ routes.
```

### Content Type Patterns

```typescript
// Schema definition pattern (src/content.config.ts — Content Layer)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

// Usage pattern — entries are keyed by `id`, not `slug`
import { getCollection, getEntry } from 'astro:content';

const allPosts = await getCollection('blog');
const post = await getEntry('blog', 'example-post');
```

## Performance Considerations

### Asset Organization

```yaml
Performance Strategy:
  images:
    location: src/assets/ (processed) | public/ (static)
    formats: single-format AVIF by default via atoms/Image.astro (ADR-030); <Picture> for fallback chains
    budget: 200KB per raster file, enforced on source and dist (images:gate, ADR-057)
    
  fonts:
    source: Astro Fonts API, fontProviders.local() (woff2 vendored in src/assets/fonts/) — ADR-053
    format: WOFF2 variable fonts
    loading: preload + metric-adjusted fallbacks generated by Astro (cuts CLS); preload count gated (ADR-058)
    
  icons:
    format: Inline SVG path data in atoms/Icon.astro (ADR-055)
    
  scripts:
    bundling: Vite automatic code splitting
    islands: Lazy loaded via client directives (client:load needs an ADR — ADR-001)
    critical: Inlined via is:inline (sparingly — theme setup, skip-link guard)
```

### Build Output Structure

```bash
dist/                   # Generated at build time
├── _astro/            # Hashed JS/CSS/image/font assets
│   ├── index.abc123.js
│   ├── index.def456.css
│   └── hero.ghi789.avif
├── index.html         # Static HTML at route directories
├── about/, blog/, projects/, adr/, …
├── 404.html
├── robots.txt         # Emitted by src/pages/robots.txt.ts
├── rss.xml            # Emitted by src/pages/rss.xml.ts
├── sitemap-index.xml  # @astrojs/sitemap
└── _headers           # Deployment headers
```

## Development Workflow

### File Creation Patterns

```bash
# New component workflow
1. Create component file: src/components/atoms/NewButton.astro
2. Add to appropriate category (atoms/molecules/structural/islands/a11y/mdx)
3. Declare an `interface Props` with proper TypeScript types
4. Document usage per src/components/CLAUDE.md, and add it to /showcase if it is a design-system primitive (ADR-049)
5. Add a Container API microtest under the category's __tests__/ (ADR-040)

# New content workflow  
1. Define schema in src/content.config.ts
2. Create collection directory: src/content/[collection]/
3. Add content files with proper frontmatter
4. Test with pnpm run check
5. Build and validate output
```

### Folder Naming Conventions

- **Directories**: `kebab-case` (e.g., `hero-section/`)
- **Components**: `PascalCase.astro` (e.g., `HeroSection.astro`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`) — `url-utils.ts` is the one kebab-case exception
- **Content**: `kebab-case.mdx` (e.g., `getting-started.mdx`)
- **Types**: `camelCase.ts` or descriptive names (e.g., `navigation.ts`)

## Integration Points

### Key Configuration Files

```yaml
Critical Files:
  astro.config.mjs:     # Framework configuration
    - integrations (Expressive Code, MDX, Sitemap, Preact)
    - Tailwind via the @tailwindcss/vite plugin
    - fonts (Astro Fonts API), env schema (astro:env), image service
    - markdown.processor: unified/remark with link validation + snippet includes (ADR-062)
    
  src/styles/global.css: # Design system integration (Tailwind CSS-first)
    - imports tokens/dist/tokens.css
    - maps tokens to utilities via @theme inline
    - dark mode @variant
    - @utility sr-only / focus-ring / focus-visible-ring / motion-reduced
    
  tsconfig.json:        # TypeScript configuration
    - strict mode enabled
    - path aliases
    - content collections types
    
  biome.json:          # Code quality
    - linting rules
    - formatting preferences
    - import organization
```

## Architecture Decision Records

This directory structure is enforced by **[ADR-003: Unified Component Structure](/adr/003-unified-component-structure/)**, which establishes:

- Atomic Design as the mandatory component organization pattern
- Import alias requirements for clean code
- Component placement rules and exceptions
- Migration guidelines for existing projects

## Getting Started

1. **Explore components**: Start with `src/components/CLAUDE.md`
2. **Review patterns**: Check [common patterns](/patterns/component-patterns/)
3. **Understand content**: Read [content collections](/patterns/content-collections/)
4. **Learn islands**: Study [islands architecture](/patterns/islands-architecture/)
5. **Performance focus**: Review [budgets & guardrails](/implementation-guides/reference/budgets-guardrails/)

This structure provides a **scalable foundation** that grows with your project while maintaining **performance, accessibility, and developer experience** as core principles.
