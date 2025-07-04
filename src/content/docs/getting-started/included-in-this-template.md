---
title: What is included in this template?
description: >-
  What is included in the Astro Performance Starter template.
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Overview

The *Astro Performance Starter* gives you a production-ready foundation focused on performance, accessibility, and DX. **Phase 5 ("UI Component Library - MVP") is now complete**, delivering essential UI components alongside the foundational site structure.

## What’s included in this template

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

## UI Components (Phase 5 - Complete)

**Essential UI primitives following atomic design patterns:**

| Component | Path | Purpose |
|-----------|------|----------|
| Button | `src/components/atoms/Button.astro` | Versatile button with size/variant props. Primary foundation for interactions. |
| Badge | `src/components/atoms/Badge.astro` | Non-interactive labels for status, metrics, or categories. |
| Image | `src/components/atoms/Image.astro` | Wrapper around Astro's Image with project defaults (AVIF, optimized sizing). |
| Card | `src/components/molecules/Card.astro` | Flexible content container with consistent spacing and styling. |
| Container | `src/components/structural/Container.astro` | Manages horizontal width and centers content across breakpoints. |
| Section | `src/components/structural/Section.astro` | Controls vertical rhythm and spacing for page sections. |
| Grid | `src/components/structural/Grid.astro` | Responsive CSS Grid with consistent gaps and breakpoint behavior. |

**Link styling:** Basic commented-out styles provided in `src/styles/global.css` - customize as needed or create Link component using provided documentation patterns.

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

**Phase 5 is complete!** ✅ All MVP UI components are implemented and ready to use.

**Up next:** Phase 6 connects content collections for managing blog posts, projects, and structured data. Follow the [implementation guides](../implementation-guides/) for step-by-step progress on remaining phases.
