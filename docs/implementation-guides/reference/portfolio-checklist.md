---
title: Portfolio Checklist
description: >-
  Curated scope items for portfolio-quality sites. Use this alongside the
  Essential / Recommended / Advanced labels in each phase guide.
lastUpdated: true
tableOfContents: true
pagefind: true
---

This checklist distills the Recommended and Advanced scope items most relevant to a portfolio site. Use it as a planning tool alongside the phase guides — not as a replacement for them.

## Foundation (Phases 0–4)

All Foundation phases are Essential for every project. No optional items here.

- [x] Repository initialized with pnpm, Node.js 24 LTS, TypeScript strict
- [x] Content Collections schemas defined (blog, projects, pages)
- [x] Design tokens system configured (colors, typography, spacing, motion)
- [x] Dark mode via CSS variables with system preference detection
- [x] Biome configured (linting + formatting)
- [x] GitHub Actions CI pipeline (type check, lint, build)
- [x] Base layout with SEO metadata, OG tags, JSON-LD
- [x] Security headers via `public/_headers`
- [x] Skip links and focus management for accessibility

## Build (Phases 5–8)

### Components — Recommended for Portfolio

- [ ] Button (primary, secondary, ghost variants)
- [ ] Card (project card, blog post card)
- [ ] Badge (technology tags, status labels)
- [ ] Image wrapper (Astro `<Image>` with AVIF/WebP)
- [ ] Pagination (for blog listing)
- [ ] Accordion (for FAQ or skills sections)

### Sections — Recommended for Portfolio

- [ ] Hero with clear value proposition and CTA
- [ ] Featured Projects grid (3–6 items)
- [ ] About section with photo and bio
- [ ] Skills / Technologies section
- [ ] Blog listing with pagination
- [ ] Contact section (form or email link)
- [ ] Testimonials (if available)
- [ ] Timeline (career history or project milestones)

### Content — Essential for Portfolio

- [ ] 3–5 project case studies with results and tech stack
- [ ] 3–5 blog posts demonstrating expertise
- [ ] About page with professional bio
- [ ] All images optimized (AVIF/WebP, responsive srcset)
- [ ] Meta descriptions for all pages
- [ ] OG images for social sharing

### QA — Recommended for Portfolio

- [ ] Manual testing on real mobile devices
- [ ] Cross-browser check (Chrome, Firefox, Safari)
- [ ] Accessibility audit with browser DevTools
- [ ] Lighthouse scores: Performance 95+, Accessibility 98+, SEO 95+
- [ ] No broken links (`pnpm run check:links`) (proposed — not yet implemented)

## Polish (Phases 9–12)

### Performance — Essential for Portfolio

- [ ] Lighthouse Performance 95+ (portfolio sites are judged on this)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] Fonts subsetted and preloaded
- [ ] No render-blocking resources
- [ ] Bundle sizes within budget (JS < 160KB, CSS < 50KB)

### Deployment — Essential for Portfolio

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] CI/CD pipeline (auto-deploy on push to main)
- [ ] Privacy-focused analytics (Plausible or Fathom — optional)

### Documentation — Recommended for Portfolio

- [ ] README with setup instructions and tech stack
- [ ] AI context updated (`docs/ai-context/INDEX.md`)
- [ ] ADRs reflect your actual architectural decisions

### Post-Launch — Recommended for Portfolio

- [ ] Google Search Console configured
- [ ] Sitemap submitted
- [ ] Weekly maintenance schedule established

## Advanced Scope (Optional)

Add these only if they serve a specific goal:

| Feature | When to Add |
|---------|-------------|
| `/showcase` living style guide | Open source or team projects |
| Visual regression tests | High-churn component library |
| Playwright E2E suite | Contact form or interactive features |
| View Transitions animations | When animation enhances UX, not just aesthetics |
| Preact island for stats counter | Animated numbers section |
| Newsletter integration | Active content strategy |
| RUM monitoring | Post-launch, when traffic justifies it |

## Scope Decision Rule

> **Ship when it meets your goals.** A portfolio site with 95+ Lighthouse scores, 3 polished case studies, and a clear contact path outperforms a feature-complete site that never launched.
