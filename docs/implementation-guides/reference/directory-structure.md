---
title: Project Directory Structure
lastUpdated: 2025-07-04T00:00:00.000Z
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
│   │   │   ├── phase-1-content-arch.md
│   │   │   ├── phase-2-design-system.md
│   │   │   ├── phase-3-tooling.md
│   │   │   └── phase-4-skeleton.md
│   │   ├── active-phases/            # Build & polish phases (5-12)
│   │   │   ├── phase-5-components.md   # ← AI starting point
│   │   │   ├── phase-6-sections.md
│   │   │   ├── phase-7-content.md
│   │   │   ├── phase-8-qa.md
│   │   │   ├── phase-9-performance.md
│   │   │   ├── phase-10-deployment.md
│   │   │   ├── phase-11-documentation.md
│   │   │   └── phase-12-post-launch.md
│   │   ├── guides/                   # Topic-specific guides (suffixed -guide.md)
│   │   │   ├── accessibility-guide.md
│   │   │   ├── components-guide.md
│   │   │   ├── content-model-guide.md
│   │   │   └── testing-strategy-guide.md
│   │   ├── code-examples/            # Per-phase implementation examples
│   │   │   ├── phase-5-code-examples.md
│   │   │   ├── phase-6-code-examples.md
│   │   │   └── …                      # phase-7..12
│   │   └── reference/                # Technical reference
│   │       ├── tech-stack.md
│   │       ├── directory-structure.md
│   │       └── budgets-guardrails.md
│   └── adr/
│       ├── template.md
│       └── 000-starter-decisions.md
│
├── src/                              # Minimal implementation
│   ├── assets/
│   │   └── logo.svg                 # Project logo
│   ├── components/                  # atoms, molecules, structural,
│   │   ├── atoms/                   #   islands, a11y, mdx (+ ThemeSetup.astro)
│   │   │   └── Button.astro         # One example component
│   │   ├── structural/              # Header, Footer, Container, Section live here
│   │   │   ├── Container.astro
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Section.astro
│   │   └── CLAUDE.md                # Component guidelines
│   ├── content/
│   │   └── blog/
│   │       └── example-post.mdx     # One example
│   ├── content.config.ts            # Content Collections schema (Astro 6)
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Complete base layout
│   │   ├── BlogLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css               # With token integration
│   ├── types/
│   │   ├── astro-content.d.ts       # Generated types
│   │   ├── navigation.ts            # Navigation types
│   │   └── content.ts               # Shared content schemas
│   └── utils/
│       └── url-utils.ts             # Example utility
│
├── public/
│   ├── _headers                     # Security headers
{{ ... }}
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
├── AGENTS.md                        # Cross-tool AI spine (generated; see ADR-045)
├── CHANGELOG.md                     # Release notes
├── CONTRIBUTING.md                  # Contribution guide
├── README.md                        # Project overview
├── LICENSE.txt                      # MIT license
├── astro.config.mjs                 # Minimal config
├── biome.json                       # Complete config
├── budget-overrides.json            # Example overrides
├── package.json                     # All deps, no fluff
├── pnpm-lock.yaml                   # Lockfile
├── src/styles/global.css            # Tailwind v4 config + @theme inline tokens
├── tsconfig.json                    # Strict mode
└── vitest.config.ts                 # Testing config
```

## Component Architecture (Atomic Design)

### Primary Component Categories

```yaml
src/components/
├── atoms/              # Basic UI building blocks
│   ├── Button.astro    # Interactive elements
│   ├── Badge.astro     # Status labels
│   ├── Icon.astro      # SVG icons (github, arrows)
│   ├── Image.astro     # Optimized images
│   └── Input.astro     # Form controls
│
├── molecules/          # Simple component combinations
│   ├── Card.astro      # Content cards
│   ├── SectionSeparator.astro # Gradient dividers
│   ├── FormField.astro # Input + label + validation
│   ├── Navigation.astro # Link lists
│   └── SearchBox.astro # Input + button
│
├── organisms/          # Complex page sections (created when needed)
│   ├── Header.astro    # Site header
│   ├── Hero.astro      # Hero sections
│   ├── ArticleList.astro # Content listings
│   └── ContactForm.astro # Complete forms
│
├── structural/         # Layout and positioning
│   ├── Container.astro # Content width constraints
│   ├── Section.astro   # Semantic page sections
│   ├── Grid.astro      # Layout grids
│   └── Stack.astro     # Vertical spacing
│
└── mdx/               # Content-specific components
    ├── CodeBlock.astro # Syntax highlighted code
    ├── Callout.astro   # Information boxes
    └── Figure.astro    # Images with captions
```

### Component Naming Conventions

```typescript
// File naming: PascalCase
Button.astro
HeroSection.astro
NavigationMenu.astro

// Component exports: Match filename
export default Button;
export default HeroSection;
export default NavigationMenu;

// Props interface: ComponentProps
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}
```

## TypeScript Import Aliases

Pre-configured path aliases for clean imports:

```typescript
// Available aliases
import Button from '@components/atoms/Button.astro';
import { formatDate } from '@utils/date-utils';
import { siteConfig } from '@/config';
import heroImage from '@assets/hero.jpg';
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
      "@assets/*": ["src/assets/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```

## Content Organization

### Content Collections Structure

```yaml
src/
├── content.config.ts   # Collection schemas (Astro 6 — lives at src/ root)
└── content/
    ├── bio/            # Author bio
    ├── blog/           # Blog posts (MDX)
    │   └── example/example.mdx
    ├── experience/     # Work experience (MDX)
    ├── navigation/     # Navigation config (JSON)
    └── projects/       # Portfolio items (MDX)
        └── example/index.mdx
```

### Content Type Patterns

```typescript
// Schema definition pattern
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

// Usage pattern
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
    formats: AVIF → WebP → JPEG fallback
    optimization: Automatic via Astro Image component
    
  fonts:
    source: Astro 6 Fonts API, vendored WOFF2 in src/assets/fonts/ (ADR-053)
    format: WOFF2 variable fonts preferred
    loading: font-display + metric-adjust handled by the Fonts API
    
  icons:
    format: SVG inline (< 2KB) or sprite
    optimization: SVGO processing
    
  scripts:
    bundling: Vite automatic code splitting
    islands: Lazy loaded via client directives
    critical: Inlined via is:inline (sparingly)
```

### Build Output Structure

```bash
dist/                   # Generated at build time
├── assets/            # Hashed assets
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── hero-ghi789.avif
├── _astro/           # Astro runtime assets
├── pages/            # Static HTML files
└── _headers          # Deployment headers
```

## Development Workflow

### File Creation Patterns

```bash
# New component workflow
1. Create component file: src/components/atoms/NewButton.astro
2. Add to appropriate category (atoms/molecules/structural/islands/a11y/mdx)
3. Export component with proper TypeScript props
4. Document usage in src/components/CLAUDE.md or the showcase page
5. Add to component index if needed

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
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Content**: `kebab-case.mdx` (e.g., `getting-started.mdx`)
- **Types**: `camelCase.ts` or descriptive names (e.g., `navigation.ts`)

## Integration Points

### Key Configuration Files

```yaml
Critical Files:
  astro.config.mjs:     # Framework configuration
    - integrations (Tailwind, MDX, Sitemap)
    - build settings
    - deployment config
    
  src/styles/global.css:  # Tailwind v4 CSS-native config
    - @theme inline design token mapping
    - @variant dark (class-based dark mode)
    - @utility custom utilities (focus-ring, sr-only)
    
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

1. **Explore components**: Start with `src/components/README.md`
2. **Review patterns**: Check `/implementation-guides/patterns/`
3. **Understand content**: Read `/implementation-guides/patterns/content-collections/`
4. **Learn islands**: Study `/implementation-guides/patterns/islands-architecture/`
5. **Performance focus**: Review `/implementation-guides/00-overview/budgets-guardrails/`

This structure provides a **scalable foundation** that grows with your project while maintaining **performance, accessibility, and developer experience** as core principles.
