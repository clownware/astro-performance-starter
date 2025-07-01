---
title: Project Directory Structure
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: Overview of the standardized directory structure for Astro projects.
last_reviewed_on: '2025-07-01'
---
> 📁 **Purpose**: Standardized organization for Astro projects

## Complete Structure

```
project-root/
├── .astro/                     # Astro cache (git-ignored)
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   │   ├── ci.yml             # Main CI pipeline
│   │   └── deploy.yml         # Deployment workflow
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── pull_request_template.md
├── .husky/                     # Git hooks
│   ├── pre-commit             # Format & lint
│   └── commit-msg             # Commit message lint
├── .vscode/                    # VS Code configuration
│   ├── settings.json          # Project settings
│   ├── extensions.json        # Recommended extensions
│   └── launch.json            # Debug configuration
├── dist/                       # Build output (git-ignored)
├── docs/                       # Project documentation
│   ├── adr/                   # Architecture Decision Records
│   │   ├── 001-starter-decisions.md
│   │   └── template.md
│   ├── implementation-guides/ # Implementation guides (flat structure)
│   │   ├── 00-overview-README.md
│   │   ├── 00-overview-tech-stack.md
│   │   ├── 00-overview-budgets-guardrails.md
│   │   ├── 00-overview-directory-structure.md
│   │   ├── 00-overview-table-format-guide.md
│   │   ├── 01-foundation-phase-0-foundation.md
│   │   ├── 01-foundation-phase-1-content-arch.md
│   │   ├── 01-foundation-phase-2-design-system.md
│   │   ├── 01-foundation-phase-3-tooling.md
│   │   ├── 02-structure-phase-4-skeleton.md
│   │   ├── 02-structure-phase-5-components.md
│   │   ├── 02-structure-phase-6-sections.md
│   │   ├── 03-content-phase-7-content.md
│   │   ├── 04-quality-phase-8-qa.md
│   │   ├── 04-quality-phase-9-performance.md
│   │   ├── 05-deployment-phase-10-deployment.md
│   │   ├── 05-deployment-phase-11-documentation.md
│   │   ├── 05-deployment-phase-12-post-launch.md
│   │   ├── tracks/
│   │   ├── patterns/
│   │   └── ai-context/
│   └── design-system-changelog.md
├── node_modules/              # Dependencies (git-ignored)
├── perf-baseline/             # Performance baselines
│   ├── lighthouse-results.json
│   └── bundle-analysis.html
├── public/                    # Static assets (served as-is)
│   ├── fonts/                # Self-hosted fonts
│   │   └── inter-var.woff2
│   ├── images/               # Unprocessed images
│   │   ├── og-default.jpg
│   │   └── favicon.svg
│   ├── _headers              # Security headers
│   ├── _redirects            # URL redirects
│   ├── robots.txt            # Search engine rules
│   └── sitemap.xml           # Generated sitemap
├── scripts/                   # Build & utility scripts
│   ├── build-tokens.ts       # Design token generation
│   ├── validate-content.ts   # Content validation
│   ├── measure-performance.ts # Performance testing
│   └── generate-types.ts     # Type generation
├── src/                       # Source code
│   ├── assets/               # Processed assets
│   │   └── images/          # Images for optimization
│   ├── components/           # UI components
│   │   ├── atoms/           # Basic building blocks
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   └── Link.astro
│   │   ├── molecules/       # Composite components
│   │   │   ├── Card.astro
│   │   │   ├── FormField.astro
│   │   │   └── SearchBar.astro
│   │   ├── organisms/       # Complex components
│   │   │   ├── Hero.astro
│   │   │   ├── FeatureGrid.astro
│   │   │   └── Testimonials.astro
│   │   ├── structural/      # Layout utilities
│   │   │   ├── Container.astro
│   │   │   ├── Grid.astro
│   │   │   └── Section.astro
│   │   └── mdx/             # MDX components
│   │       ├── Callout.astro
│   │       └── CodeBlock.astro
│   ├── content/              # Content collections
│   │   ├── config.ts        # Collection schemas
│   │   ├── blog/            # Blog posts
│   │   │   ├── post-1.mdx
│   │   │   └── drafts/
│   │   ├── projects/        # Portfolio items
│   │   │   └── project-1.mdx
│   │   ├── navigation/      # Nav data
│   │   │   └── main.json
│   │   └── bio/             # About content
│   │       └── about.mdx
│   ├── data/                # Static data
│   │   └── site-config.ts   # Site configuration
│   ├── features/            # Feature-based organization
│   │   ├── blog/           # Blog feature
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── types.ts
│   │   └── projects/       # Projects feature
│   │       ├── components/
│   │       └── utils/
│   ├── layouts/             # Page layouts
│   │   ├── BaseLayout.astro # Main layout wrapper
│   │   ├── BlogLayout.astro # Blog-specific layout
│   │   ├── ProjectLayout.astro # Project layout
│   │   └── partials/        # Layout components
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── Sidebar.astro
│   ├── lib/                 # Core utilities
│   │   ├── constants.ts     # App constants
│   │   └── helpers.ts       # Helper functions
│   ├── pages/               # Routes
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro      # About page
│   │   ├── blog/            # Blog routes
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── projects/        # Project routes
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── api/             # API routes
│   │   │   └── contact.ts
│   │   └── 404.astro        # Error page
│   ├── styles/              # Global styles
│   │   ├── global.css       # Base styles
│   │   └── prose.css        # Typography
│   ├── types/               # TypeScript types
│   │   ├── global.d.ts      # Global types
│   │   └── env.d.ts         # Environment types
│   └── utils/               # Utility functions
│       ├── seo.ts           # SEO utilities
│       ├── dates.ts         # Date formatting
│       └── strings.ts       # String manipulation
├── tests/                    # Test files (Showcase)
│   ├── e2e/                 # End-to-end tests
│   │   └── navigation.spec.ts
│   ├── unit/                # Unit tests
│   │   └── utils.test.ts
│   └── fixtures/            # Test data
├── tokens/                   # Design tokens
│   ├── base.json            # Core tokens
│   ├── semantic.json        # Semantic tokens
│   └── dist/                # Generated tokens
│       ├── tokens.css
│       └── tailwind-tokens.json
├── .env                      # Environment variables (git-ignored)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── .nvmrc                   # Node.js {{versions.node-current}} version
├── astro.config.mjs         # Astro {{versions.astro}} configuration
├── biome.json               # Linter/formatter config
├── package.json             # Dependencies & scripts
├── pnpm-lock.yaml          # Lockfile
├── README.md                # Project documentation
├── tailwind.config.ts       # Tailwind CSS {{versions.tailwindcss}} configuration
└── tsconfig.json            # TypeScript configuration
```

## Directory Purposes

### Configuration Files (Root)
- **astro.config.mjs**: Framework configuration
- **tailwind.config.ts**: CSS framework setup
- **tsconfig.json**: TypeScript settings
- **biome.json**: Code quality tools
- **package.json**: Dependencies and scripts

### Source Code (/src)
- **components/**: Reusable UI components (Atomic Design)
- **content/**: Markdown/MDX content with schemas
- **layouts/**: Page wrapper components
- **pages/**: File-based routing
- **styles/**: Global CSS files
- **utils/**: Helper functions
- **types/**: TypeScript definitions

### Documentation (/docs)
- **adr/**: Architecture decisions
- **implementation-guides/**: Phase-by-phase guides
- **design-system-changelog.md**: UI updates

### Build & Deploy
- **dist/**: Production build output
- **public/**: Static assets served as-is
- **scripts/**: Build and utility scripts
- **.github/**: CI/CD workflows

### Quality & Testing
- **tests/**: Test suites (Showcase track)
- **perf-baseline/**: Performance benchmarks
- **.husky/**: Git hooks for quality

## File Naming Conventions

### Components
```
PascalCase.astro     # Astro components
kebab-case.ts        # TypeScript files
kebab-case.css       # Style files
```

### Content
```
blog/
  2024-01-15-post-title.mdx    # Date prefix for posts
  draft-post-idea.mdx           # Drafts clearly marked
  
projects/
  project-name.mdx              # URL-friendly slugs
```

### Utilities
```
utils/
  format-date.ts                # Descriptive function names
  parse-markdown.ts             # Action-object pattern
```

## Import Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Usage:
```typescript
import Button from '@/components/atoms/Button.astro';
import { formatDate } from '@/utils/dates';
import type { Project } from '@/types/content';
```

> **Note**: The `@/*` alias is the required convention for this project. Always use it to reference files from the `src` directory.

## Organization Principles

### 1. Atomic Design for Components
- **Atoms**: Smallest building blocks (Button, Input)
- **Molecules**: Simple combinations (Card, FormField)
- **Organisms**: Complex sections (Header, Hero)

### 2. Feature-Based Organization
Group related code by feature when it grows:
```
features/
  blog/
    components/
    utils/
    types.ts
```

### 3. Colocation
Keep related files together:
```
projects/
  ProjectCard.astro      # Component
  ProjectCard.test.ts    # Test
  ProjectCard.stories.ts # Storybook
```

### 4. Public vs Processed
- **public/**: Served as-is, no processing
- **src/assets/**: Processed by build tools

## Git Ignore Patterns

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.astro/
*.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.sublime-*

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
test-results/
playwright-report/

# Temporary
*.tmp
*.cache
.vercel/
.netlify/
```

## Best Practices

### 1. Keep Pages Thin
Pages should primarily compose components:
```astro
---
// pages/index.astro
import Layout from '@layouts/BaseLayout.astro';
import Hero from '@components/organisms/Hero.astro';
import Features from '@components/organisms/Features.astro';
---

<Layout>
  <Hero />
  <Features />
</Layout>
```

### 2. Centralize Types
Define types once, import everywhere:
```typescript
// types/content.ts
export interface Project {
  title: string;
  description: string;
  technologies: string[];
}
```

### 3. Use Index Files Sparingly
Only for public APIs:
```typescript
// components/atoms/index.ts
export { default as Button } from './Button.astro';
export { default as Badge } from './Badge.astro';
```

### 4. Organize by Concern
- **Business logic**: /src/lib or /src/features
- **UI components**: /src/components
- **Content**: /src/content
- **Utilities**: /src/utils

## Migration Guide

When restructuring existing projects:

1. **Start with pages/**: Ensure routes work
2. **Extract components**: Move to atomic structure
3. **Organize content**: Set up collections
4. **Add types**: Gradually type everything
5. **Configure aliases**: Update imports
6. **Test thoroughly**: Verify all imports

## Maintenance

Regular tasks:
- Clean up unused files monthly
- Update dependencies weekly
- Review structure quarterly
- Document new patterns

Remember: A well-organized project is a maintainable project.
