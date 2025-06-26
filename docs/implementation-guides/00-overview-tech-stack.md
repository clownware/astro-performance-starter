---
title: Technology Stack
version: 2.0.0
lastUpdated: '2025-06-10'
review: '2025-12-31'
description: Details the core technology stack used in the Astro Performance Starter.
---
## Core Stack

### Framework & Build Tools

```yaml
Framework: 
  name: Astro
  version: ^{{versions.astro}}
  features:
    - Static Site Generation (SSG) by default
    - Server-Side Rendering (SSR) optional
    - Zero JavaScript by default
    - Content Collections API
    - View Transitions API
    - Server Islands (experimental)

Build:
  bundler: Vite {{versions.vite}} # Note: Experimental. Pin to latest stable for production.
  runtime: Node.js {{versions.node-current}} LTS
  package_manager: pnpm {{versions.pnpm}} (recommended)
  typescript: ^5.6.0
```

### Styling & Design

```yaml
CSS:
  framework: Tailwind CSS {{versions.tailwindcss}}
  approach: Utility-first with design tokens
  features:
    - CSS Variables for theming
    - Container queries support
    - Built-in dark mode
    - JIT compilation

Design_Tokens:
  format: JSON → CSS Variables + Tailwind config
  tools: 
    - style-dictionary (token generation)
    - tailwindcss-themer (theme switching)
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
  3. Alpine.js (simple state)
  4. Preact Islands (complex state)

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
    - Conventional commits (basic for MVP)
```

### Testing Strategy

| Type | MVP | Showcase | Tool |
|------|-----|----------|------|
| Unit | ❌ | If needed | Vitest |
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
  MVP:
    - Cloudflare Web Analytics
    - Uptime monitoring
    - Basic error logging

  Showcase:
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
    "@astrojs/mdx": "^4.0.1",
    "@astrojs/preact": "^{{versions.astro-mdx}}", // See versions.yml for correct key
    "@astrojs/sitemap": "^{{versions.astro-sitemap}}", // See versions.yml for correct key
    "@astrojs/tailwind": "^6.0.0",
    "@fontsource-variable/inter": "^5.1.0",
    "astro": "^{{versions.astro}}",
    "preact": "^{{versions.preact}}",
    "tailwindcss": "^{{versions.tailwindcss}}"
  }
}
```

### Scripts

{% snippet "package-scripts" %}

### Dev Dependencies

```json
{
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@axe-core/playwright": "^4.10.0",
    "@biomejs/biome": "^1.9.4",
    "@playwright/test": "^1.49.0",
    "astrobook": "^0.5.0",
    "husky": "^9.1.0",
    "lighthouse": "^12.0.0",
    "lint-staged": "^15.2.0",
    "sharp": "^0.33.0",
    "style-dictionary": "^{{versions.style-dictionary}}", // See versions.yml for correct key
    "tailwindcss-themer": "^{{versions.tailwindcss-themer}}", // See versions.yml for correct key
    "tsx": "^4.7.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## Technology Decision Rationale

### Why These Choices?

1. **Astro {{versions.astro}}**: Best-in-class static site generator with minimal JavaScript
2. **Tailwind v4**: Modern utility CSS with better performance
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
