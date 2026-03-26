---
title: Technology Stack
lastUpdated: 2025-06-10T00:00:00.000Z
description: Details the core technology stack used in the Astro Performance Starter
tableOfContents: true
pagefind: true
---
## Core Stack

### Framework & Build Tools

```yaml
Framework: 
  name: Astro
  version: ^5.0.0
  features:
    - Static Site Generation (SSG) by default
    - Server-Side Rendering (SSR) optional
    - Zero JavaScript by default
    - Content Collections API
    - View Transitions API
    - Server Islands (experimental)

Build:
  bundler: Vite 7.x
  runtime: Node.js 24.x LTS
  package_manager: pnpm 10.x (required)
  typescript: ^5.8.3
```

### Styling & Design

```yaml
CSS:
  framework: Tailwind CSS v4.x
  approach: Utility-first with CSS-native design tokens
  features:
    - CSS Variables for theming
    - Container queries support
    - Built-in dark mode (class-based via @variant dark)
    - Rust-based engine (100x faster incremental builds)

Design_Tokens:
  format: JSON → CSS Variables → @theme inline (CSS)
  tools:
    - style-dictionary (token generation)
    - tokens/dist/tokens.css (CSS custom properties)
    - src/styles/global.css @theme inline block (Tailwind mapping)
```

### Content & Data

```yaml
Content:
  format: MDX with Astro Content Collections
  features:
    - Type-safe frontmatter
    - Custom components in content
    - Automatic image optimization
    - Content Layer API for external data

Assets:
  images: 
    - Astro <Image> component
    - Sharp for processing
    - AVIF + WebP output
  fonts:
    - @fontsource for self-hosting
    - Variable fonts preferred
```

### Interactivity (When Needed)

```yaml
Progressive_Enhancement:
  1. CSS-only solutions (preferred)
  2. View Transitions API (SPA-like navigation)
  3. Preact Islands (complex state)

View_Transitions_vs_Islands:
  View_Transitions: For page-level animations and maintaining state across navigation (e.g., persistent audio player). Manages the "frame" of the app.
  Islands: For component-level interactivity that requires client-side JavaScript (e.g., an interactive form). Manages interactive "widgets" on a page.

Island_Directives:
  - client:visible (lazy load)
  - client:idle (load when idle)
  - client:media (responsive loading)
  - client:only (skip SSR)
  Never: client:load (unless justified in ADR)
```

## Development Tools

### Code Quality

```yaml
Linting_Formatting:
  primary: Biome (replaces ESLint + Prettier)
  config: biome.json
  benefits:
    - 20x faster than ESLint
    - Single tool for lint + format
    - Built-in import sorting
    - TypeScript-first

Type_Checking:
  - TypeScript strict mode
  - @astrojs/check for templates
  - Type generation from Content Collections

Git_Hooks:
  tool: Husky + lint-staged
  pre-commit:
    - Format with Biome
    - Type check changed files
  commit-msg:
    - Conventional commits (enforced)
```

### Testing Strategy

| Type | Essential | Recommended | Tool |
|------|-----------|-------------|------|
| Unit | If needed | If needed | Vitest |
| Component | ❌ | ✅ | Astrobook visual tests |
| E2E | Manual | ✅ | Playwright |
| A11y | Dev tools | ✅ | axe-core + Playwright |
| Performance | Lighthouse | ✅ | Lighthouse CI |

### Documentation & Component Development

```yaml
Component_Docs:
  tool: Astrobook
  features:
    - Component playground
    - Visual regression testing
    - Props documentation
    - Accessibility checks

API_Docs:
  - TypeScript JSDoc
  - Generated from types
  - Markdown for guides
```

## Deployment & Infrastructure

### Hosting

```yaml
Primary: Cloudflare Pages
  benefits:
    - Global CDN
    - Automatic builds
    - Preview deployments
    - Web Analytics included
    - Generous free tier

Alternatives:
  - Vercel (great DX)
  - Netlify (mature platform)
  - AWS Amplify (enterprise)
```

### Performance & Monitoring

```yaml
Build_Time:
  - Image optimization via Sharp
  - CSS purging via Tailwind
  - Bundle analysis via Vite
  - Compression (Brotli/Gzip)

Runtime:
  Essential:
    - Cloudflare Web Analytics
    - Uptime monitoring
    - Basic error logging

  Advanced:
    - Real User Monitoring (RUM)
    - Core Web Vitals tracking
    - Error tracking with source maps
    - Session replay (privacy-safe)
```

## Package Versions

### Dependencies

```json
{
  "dependencies": {
    "@astrojs/mdx": "^5.0.0",
    "@astrojs/preact": "^5.0.0",
    "@astrojs/sitemap": "^3.7.0",
    "@tailwindcss/vite": "^4.2.2",
    "@fontsource-variable/inter": "^5.2.0",
    "astro": "^6.0.0",
    "preact": "^10.29.0",
    "tailwindcss": "4.2.2"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "pnpm run tokens:build && astro build",
    "preview": "astro preview",
    "preview:build": "pnpm run build && astro preview",
    "check": "astro check",
    "format": "biome format . --write",
    "lint": "biome check .",
    "tokens:build": "tsx scripts/src/build-tokens.ts",
    "design:validate": "tsx scripts/src/validate-contrast.ts",
    "perf:baseline": "tsx scripts/src/baseline-performance.ts",
    "prepare": "husky install"
  }
}
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@axe-core/playwright": "^4.10.0",
    "@biomejs/biome": "^2.2.4",
    "@playwright/test": "^1.49.0",
    "astrobook": "^0.5.0",
    "husky": "^9.1.0",
    "lighthouse": "^12.0.0",
    "lint-staged": "^15.2.0",
    "sharp": "^0.33.0",
    "style-dictionary": "^4.0.1",
    "tailwindcss-themer": "^4.1.1",
    "tsx": "^4.7.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  },
  "engines": {
    "node": ">=24.0.0"
  }
}
```

## Technology Decision Rationale

### Why These Choices?

1. **Astro 6.0**: Best-in-class static site generator with minimal JavaScript
2. **Tailwind v4**: CSS-native config with `@theme inline` design token integration, 100x faster incremental builds
3. **Biome**: Massive speed improvement over ESLint/Prettier
4. **Preact**: Smaller than React for islands that need state
5. **Cloudflare Pages**: Fast global CDN with great free tier
6. **Astrobook**: Component documentation without Storybook overhead

### What We Avoid

- ❌ Multiple build tools (webpack, rollup, etc.)
- ❌ Heavy component frameworks for simple sites
- ❌ Overlapping linters and formatters
- ❌ Client-side routing libraries
- ❌ Large JavaScript frameworks for minimal interactivity
- ❌ External image CDNs (use Astro's built-in optimization)

## Migration Notes

When updating from older versions:

1. **Astro 4 → 5**: Check Content Collections API changes
2. **Tailwind 3 → 4**: Review config migration guide
3. **ESLint → Biome**: Run migration command: `npx @biomejs/biome migrate`
4. **React → Preact**: Update imports in island components
