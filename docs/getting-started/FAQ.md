---
title: Frequently Asked Questions (FAQ)
description: >-
  Answers to common questions about the Astro Performance Starter template.
lastUpdated: true
tableOfContents: true
pagefind: true
---

This document answers common questions about the Astro Performance Starter template.

## Getting Started

### What are the usage terms?

This project is released under the **MIT License**, which means you can use it for any purpose - personal, commercial, or otherwise. You can modify, distribute, and even sell projects built with this template. No attribution required, though we always appreciate a mention!

### I'm a vibecoder who uses AI agents - where do I start?

Perfect! This template is designed for AI-assisted development. Here's your quickstart:

1. **Point your AI agent at Phase 5** to conduct an analysis and create a development plan
2. **Use the [Getting Started](../getting-started/)** guide for immediate deployment
3. **Progress through other phases** as your AI agent identifies needs

The documentation structure is optimized for AI context, so your agent can efficiently parse implementation guides and provide accurate assistance.

### What's included in this template?

This is a **production-ready foundation** with:

- Complete Astro 6.x setup with zero JavaScript by default
- Essential UI component library (buttons, cards, grids, forms, and more)
- Design token system with Tailwind CSS integration
- Performance optimization (targets 95+ Lighthouse scores)
- Accessibility compliance (WCAG AA)
- TypeScript strict mode configuration

For a complete inventory, see [What's Included in This Template](./included-in-this-template.md).

### Why is deployment focused on Cloudflare Pages?

This is an **opinionated template** that prioritizes performance and developer experience. The default CI/CD pipeline (`.github/workflows/deploy.yml`) targets **GitHub Pages**, while the [Quick Deploy guide](./quick-deploy.md) recommends **Cloudflare Pages** for production deployments due to:

- Excellent performance with global edge deployment
- Zero-config deployment for Astro sites
- Generous free tier
- Built-in analytics and performance monitoring

You can deploy anywhere — the template includes guidance for Cloudflare Pages, Vercel, Netlify, and GitHub Pages.

### How can I contribute or sponsor this project?

We welcome contributions! You can:

- **Report bugs** or suggest features via GitHub Issues
- **Submit pull requests** for improvements
- **Share your sites** built with this template
- **Sponsor development** through GitHub Sponsors (link in repository)

Contributions that improve performance, accessibility, or developer experience are especially appreciated.

## Technical Questions

### What performance can I expect?

The template targets **95+ Lighthouse scores** across all metrics:

- Performance: 95+ (CI enforced minimum)
- Accessibility: 98+
- Best Practices: 100
- SEO: 95+

Actual scores may vary ±3 points depending on device and network conditions.

### What browsers are supported?

Modern browsers with ES2022 support. The template uses:

- CSS Grid and Flexbox (IE11+ equivalent)
- CSS custom properties (modern browsers)
- Progressive enhancement patterns

Legacy browser support can be added via Astro's built-in polyfills if needed.

### How do I customize the design tokens?

The template includes a complete design token system:

1. **Edit** `tokens/base.json` and `tokens/semantic.json`
2. **Save the file** - tokens auto-compile during `dev` or `build`
3. **Tokens automatically integrate** with Tailwind CSS classes

Manual compilation (rarely needed): `pnpm run tokens:build`

This approach ensures consistent spacing, colors, and typography across your site.

### How do I decide how much to build?

Use the Essential / Recommended / Advanced scope labels in each phase guide:

- **Essential**: Core functionality every project needs — do these first
- **Recommended**: Adds quality and polish for most projects
- **Advanced**: Portfolio-grade or enterprise features — stop when your goals are met

See [ADR-033](/adr/033-track-consolidation/) for the rationale behind this model.

### Is this production-ready?

Yes! This template is designed for production use with:

- Security headers configured
- Performance budgets enforced
- Accessibility compliance built-in
- TypeScript strict mode
- Comprehensive testing setup

Many sites are already running in production using this foundation.

### How do I get help or support?

1. **Check the documentation** - comprehensive guides cover most scenarios
2. **Search GitHub Issues** - your question may already be answered
3. **Ask your AI agent** - the docs are optimized for AI assistance
4. **Create a GitHub Issue** - for bugs or missing documentation
5. **Join community discussions** - check GitHub Discussions for the repository

### How does this compare to other Astro starters?

This template is uniquely focused on:

- **Performance-first** approach with enforceable budgets
- **AI-assisted development** with optimized documentation
- **Production readiness** out of the box
- **Comprehensive component system** following atomic design
- **Enterprise-grade** tooling (Biome, strict TypeScript, etc.)

Most other starters focus on features rather than performance and maintainability.

### How do I handle Astro version upgrades?

The template is designed to be upgrade-friendly:

- **Minimal dependencies** reduce breaking change surface area
- **Standard Astro patterns** align with framework evolution
- **Version pinning** in package.json prevents unexpected breaks

Upgrade guides will be provided for major Astro releases that affect the template.
