---
title: What is included in this template?
description: >-
  What is included in the Astro Performance Starter template.
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Overview

The *Astro Performance Starter* gives you a production-ready foundation focused on performance, accessibility, and DX. Phase&nbsp;4 (“Skeleton & Routing”) delivers the minimal runnable site structure so you can start building immediately.

## What’s included after Phase 4

| Feature | Path | Notes |
|---------|------|-------|
| Base layout | `src/layouts/BaseLayout.astro` | SEO props, OG/Twitter tags, font pre-loading, ViewTransitions, Header, Footer, SkipLink slots. |
| Header | `src/components/structural/Header.astro` | Sticky, responsive shell with placeholder nav & logo. |
| Footer | `src/components/structural/Footer.astro` | Dynamic copyright year. |
| Skip link | `src/components/a11y/SkipLink.astro` | Keyboard-friendly “skip to content”. |
| Error pages | `src/pages/404.astro`, `src/pages/500.astro` | Custom, accessible error templates. |
| Demo landing page | `src/pages/examples/landing.astro` | Shows basic component usage. |
| Global font setup | `@fontsource-variable/inter` | Preloaded WOFF2 assets & CSS vars. |
| Security headers | `public/_headers` | CSP, HSTS, referrer-policy, etc. |
| Robots rules | `public/robots.txt` | Default allow + sitemap reference. |
| Favicon | `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png` | Replace with your own brand assets. |
| Mobile menu island | `src/components/islands/MobileMenuToggle.tsx` | Progressive enhancement; header wiring next. |

## Running the template locally

```bash
pnpm install   # install dependencies
pnpm dev       # start local dev server
```

• Docs home: `http://localhost:4321/astro-starter-template/`
• Demo page: `http://localhost:4321/astro-starter-template/examples/landing`

## Customizing the skeleton

1. **Branding:** update logo text in `Header.astro` and swap `public/favicon.svg`.
2. **Navigation:** edit links in `Header.astro` and wire the mobile menu panel.
3. **Pages:** start new pages under `src/pages/` or copy the demo landing page.
4. **SEO defaults:** change `siteTitle` inside `BaseLayout.astro`.

## Excluded by default

| Item | Reason |
|------|--------|
| `.github/FUNDING.yml` | Funding links vary; add your own if desired |

## Next phases

Phase 5 introduces reusable UI atoms (Button, Card, etc.). Phase 6 connects content collections. Follow the [Structure implementation guide](../implementation-guides/02-structure-phase-4-skeleton) for step-by-step progress.