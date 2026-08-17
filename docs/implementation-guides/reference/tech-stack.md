---
title: Technology Stack
lastUpdated: 2026-08-13T00:00:00.000Z
description: Details the core technology stack used in the Astro Performance Starter
tableOfContents: true
pagefind: true
---
## Core Stack

### Framework & Build Tools

```yaml
Framework: 
  name: Astro
  version: ^7.2.1
  features:
    - Static Site Generation (SSG) by default
    - Server-Side Rendering (SSR) optional
    - Zero JavaScript by default
    - Content Layer API (glob loaders, Zod v4 schemas)
    - View Transitions API (ClientRouter)
    - Server Islands (stable)

Build:
  bundler: Vite 8.x
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
    - Single-format output, AVIF by default (ADR-030)
  fonts:
    - Astro Fonts API with local provider (ADR-053)
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
Primary: GitHub Pages
  benefits:
    - Ships preconfigured (.github/workflows/deploy.yml, push to master)
    - SITE_URL and base path handled by the workflow
    - Free for public repos

Alternatives:
  - Cloudflare Pages (global CDN; honours public/_headers)
  - Vercel (great DX)
  - Netlify (mature platform)
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

Exact pins live in two guarded sources — this doc deliberately duplicates none
of them (duplicated version tables are how this file drifted a full major
behind before the 2026-08 audit):

- [`package.json`](../../../package.json) — dependencies and the full script
  set (see [Custom Scripts](../../development/custom-scripts.md))
- [`versions.json`](../../../versions.json) — the public version contract
  (ADR-061), kept in sync by the `version:check` gate in `quality:ci`

## Technology Decision Rationale

### Why These Choices?

1. **Astro 7.x**: Best-in-class static site generator with minimal JavaScript
2. **Tailwind v4**: CSS-native config with `@theme inline` design token integration, 100x faster incremental builds
3. **Biome**: Massive speed improvement over ESLint/Prettier
4. **Preact**: Smaller than React for islands that need state
5. **GitHub Pages**: Zero-setup deploys via the shipped workflow (header-capable hosts like Cloudflare Pages remain first-class alternatives)
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

1. **Astro 6 → 7**: unified/remark processor retained (ADR-062); background dev server (`dev:agent`, ADR-063)
2. **Astro 5 → 6**: Content Layer API stable, Zod v4, Node.js 24+ minimum
3. **Tailwind 3 → 4**: CSS-native `@theme` config replaces `tailwind.config.js`
4. **ESLint → Biome**: Run migration command: `npx @biomejs/biome migrate`
5. **React → Preact**: Update imports in island components
