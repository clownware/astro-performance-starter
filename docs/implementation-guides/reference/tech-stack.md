---
title: Technology Stack
lastUpdated: 2026-04-02T00:00:00.000Z
description: Details the core technology stack used in the Astro Performance Starter
tableOfContents: true
pagefind: true
---
## Core Stack

### Framework & Build Tools

```yaml
Framework: 
  name: Astro
  version: ^6.0.0
  features:
    - Static Site Generation (SSG) by default
    - Server-Side Rendering (SSR) optional
    - Zero JavaScript by default
    - Content Layer API (glob loaders, Zod v4 schemas)
    - View Transitions API (ClientRouter)
    - Server Islands (stable)

Build:
  bundler: Vite 7.x
  runtime: Node.js 24.x LTS
  package_manager: pnpm 10.x (required)
  typescript: ^5.9.3
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
    - Astro 6 Fonts API with local provider (ADR-053)
    - Vendored WOFF2 in src/assets/fonts/
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
| Component | ❌ | ✅ | `/showcase` style guide (ADR-049) |
| E2E | Manual | ✅ | Playwright |
| A11y | Dev tools | ✅ | axe-core + Playwright |
| Performance | Lighthouse | ✅ | Lighthouse CI |

### Documentation & Component Development

```yaml
Component_Docs:
  tool: /showcase living style guide (ADR-049)
  features:
    - Component gallery (System / Color / Type / Motion / Components)
    - Token swatches + typography specimens
    - Live, build-verified examples
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
    "@astrojs/mdx": "^5.0.2",
    "@astrojs/preact": "^5.1.3",
    "@astrojs/rss": "^4.0.18",
    "@astrojs/sitemap": "^3.7.1",
    "@preact/signals": "^2.9.0",
    "@tailwindcss/vite": "^4.2.2",
    "astro-expressive-code": "^0.42.0",
    "preact": "^10.29.0",
    "sharp": "^0.34.5",
    "tailwindcss": "4.2.2"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "pnpm run env:validate && pnpm run tokens:build && astro build",
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
    "@astrojs/check": "^0.9.9",
    "@biomejs/biome": "^2.4.11",
    "@playwright/test": "^1.59.1",
    "husky": "^9.1.7",
    "lighthouse": "^13.0.3",
    "lint-staged": "^16.4.0",
    "tsx": "^4.22.3",
    "typescript": "^5.9.3",
    "vitest": "^4.1.6"
  },
  "optionalDependencies": {
    "@axe-core/playwright": "^4.11.3",
    "style-dictionary": "^5.4.0",
    "tailwindcss-themer": "^4.1.1"
  },
  "engines": {
    "node": ">=24.0.0"
  }
}
```

## Technology Decision Rationale

### Why These Choices?

1. **Astro 6.x**: Best-in-class static site generator with minimal JavaScript
2. **Tailwind v4**: CSS-native config with `@theme inline` design token integration, 100x faster incremental builds
3. **Biome**: Massive speed improvement over ESLint/Prettier
4. **Preact**: Smaller than React for islands that need state
5. **Cloudflare Pages**: Fast global CDN with great free tier
6. **`/showcase` style guide**: Living component catalog in-app, no separate story runner (ADR-049)

### What We Avoid

- ❌ Multiple build tools (webpack, rollup, etc.)
- ❌ Heavy component frameworks for simple sites
- ❌ Overlapping linters and formatters
- ❌ Client-side routing libraries
- ❌ Large JavaScript frameworks for minimal interactivity
- ❌ External image CDNs (use Astro's built-in optimization)

## Migration Notes

When updating from older versions:

1. **Astro 5 → 6**: Content Layer API stable, Zod v4, Node.js 24+ minimum
2. **Tailwind 3 → 4**: CSS-native `@theme` config replaces `tailwind.config.js`
3. **ESLint → Biome**: Run migration command: `npx @biomejs/biome migrate`
4. **React → Preact**: Update imports in island components
