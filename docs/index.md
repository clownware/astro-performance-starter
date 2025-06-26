---
title: Astro Performance Starter
description: >-
  Production-ready Astro starter template targeting Performance ≥ 95,
  Accessibility 100, Best-Practices 100, SEO 100 with zero JavaScript by default
template: splash
hero:
  tagline: >-
    Build blazing-fast websites with Astro's modern architecture and
    comprehensive documentation
  image:
    file: ../../assets/logo.svg
  actions:
    - text: Quick Start (5 min)
      link: ./quick-track-deploy
      icon: right-arrow
      variant: primary
    - text: Choose Your Path
      link: "#quick-start-paths"
      icon: down-caret
      variant: secondary
    - text: View on GitHub
      link: 'https://github.com/clownware/astro-starter-template'
      icon: external
      variant: minimal
banner:
  content: "<strong>🚧 Beta Release ({{versions.template}})</strong> This template is in active development and may introduce breaking changes until v1.0.0. <a href=\"./design-system-changelog\">See what's new →</a><br /><span style=\"color:var(--sl-color-gray-5);font-size:0.95em;\">Performance targets: 95+ (see disclaimer below).</span> "

---

## ⚡ Why This Template?

**Stop wasting time on setup.** Start building with a production-ready foundation that delivers:

<CardGrid stagger>
	<Card title="Lightning Fast Performance" icon="rocket">
		<Badge text="95+" variant="success" style="font-size:1.15rem;min-width:60px;" />
		<p>Lighthouse scores out of the box with zero JavaScript by default and strategic island architecture.</p>
	</Card>
	<Card title="Complete Documentation" icon="open-book">
		<Badge text="12 Phases" variant="tip" style="font-size:1.15rem;min-width:60px;" />
		<p>Step-by-step guides from Foundation to Deployment with clear MVP and Showcase tracks.</p>
	</Card>
	<Card title="Modern Design System" icon="seti:stylus">
		<Badge text="Design Tokens" variant="note" />
		<p>Tailwind CSS with design tokens, dark mode, and WCAG AA accessibility standards built-in.</p>
	</Card>
	<Card title="AI-Optimized Workflow" icon="star">
		<Badge text="AI Ready" variant="caution" />
		<p>Documentation structured for AI agents with context management for seamless development.</p>
	</Card>
</CardGrid>

## 🎯 Quick Start Paths {#quick-start-paths}

**Choose your adventure based on your timeline and goals:**

<div class="card-grid">
	<LinkCard
		title="🚀 Quick Deploy (5 min)"
		description="Get your site running immediately with our streamlined deployment guide."
		href="./quick-track-deploy"
	/>
	<LinkCard
		title="⚡ MVP Track (2-3 weeks)"
		description="Launch a minimum viable product with essential features and performance."
		href="./tracks/mvp-track-guide"
	/>
	<LinkCard
		title="✨ Showcase Track (4-6 weeks)"
		description="Build a portfolio-worthy project with all bells and whistles."
		href="./tracks/showcase-track-guide"
	/>
</div>

<Aside type="tip" title="New to this template?">
	**Start here:** 
	1. Try the [Quick Deploy](./quick-track-deploy) to see it in action (5 minutes)
	2. Read the [FAQ](./faq) for common questions
	3. Choose your [implementation track](./tracks/track-comparison) based on your needs
</Aside>

## 📊 Performance Metrics

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin: 2rem 0;">
  <div style="flex: 1 1 220px; min-width: 220px; max-width: 240px; border: 1.5px solid #22c55e; border-radius: 0.75rem; padding: 1.25rem; background: linear-gradient(90deg, #181e29 60%, #1e293b 100%); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <Icon name="rocket" size="1.7rem" />
    <div style="font-size: 1.1rem; margin-top: 0.5rem;">Performance</div>
    <div style="font-weight: bold; font-size: 1.5rem; color: #22c55e;">95+</div>
  </div>
  <div style="flex: 1 1 220px; min-width: 220px; max-width: 240px; border: 1.5px solid #22c55e; border-radius: 0.75rem; padding: 1.25rem; background: linear-gradient(90deg, #181e29 60%, #1e293b 100%); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <Icon name="information" size="1.7rem" />
    <div style="font-size: 1.1rem; margin-top: 0.5rem;">Accessibility</div>
    <div style="font-weight: bold; font-size: 1.5rem; color: #22c55e;">100</div>
  </div>
  <div style="flex: 1 1 220px; min-width: 220px; max-width: 240px; border: 1.5px solid #22c55e; border-radius: 0.75rem; padding: 1.25rem; background: linear-gradient(90deg, #181e29 60%, #1e293b 100%); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <Icon name="setting" size="1.7rem" />
    <div style="font-size: 1.1rem; margin-top: 0.5rem;">Best Practices</div>
    <div style="font-weight: bold; font-size: 1.5rem; color: #22c55e;">100</div>
  </div>
  <div style="flex: 1 1 220px; min-width: 220px; max-width: 240px; border: 1.5px solid #22c55e; border-radius: 0.75rem; padding: 1.25rem; background: linear-gradient(90deg, #181e29 60%, #1e293b 100%); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <Icon name="magnifier" size="1.7rem" />
    <div style="font-size: 1.1rem; margin-top: 0.5rem;">SEO</div>
    <div style="font-weight: bold; font-size: 1.5rem; color: #22c55e;">100</div>
  </div>
</div>
<div style="margin-top: 0.5rem; text-align: center; font-size: 1rem; color: var(--sl-color-gray-5);">
  <strong>Lighthouse Target Benchmarks</strong><br/>
  <span>Automated CI/CD enforcement ensures no regressions</span><br/>
  <span style="font-size:0.95em;">Scores reflect ideal conditions (empty starter). Real-world results may vary by deployment and content. <a href='./design-system-changelog'>See changelog →</a></span>
</div>

## 🛠️ Tech Stack Highlights

**Modern tools with excellent developer experience:**

- **Framework**: Astro v{{versions.astro}} with Vite 6.x bundler
- **Styling**: Tailwind CSS v{{versions.tailwindcss}} + Design tokens system
- **TypeScript**: v{{versions.typescript}} in strict mode with path aliases
- **Package Manager**: pnpm v{{versions.pnpm}} (required for performance)
- **Code Quality**: Biome v{{versions.biome}} (20x faster than ESLint + Prettier)
- **Testing**: Playwright v{{versions.playwright}} + Vitest for comprehensive coverage
- **Performance**: Sharp v{{versions.sharp}} image optimization + Lighthouse CI

<details>
<summary><strong>View full tech stack details</strong></summary>

### Core Dependencies
- **UI Framework**: Preact v{{versions.preact}} for interactive islands
- **Content**: MDX with Astro Content Collections API
- **Images**: Astro Image component with Sharp processing (AVIF + WebP)
- **Fonts**: @fontsource for self-hosting variable fonts

### Development Experience
- Zero-config TypeScript with strict mode
- Automated code formatting and linting
- Git hooks for quality enforcement
- Hot reloading with Vite
- Component-driven development

### Performance & Quality
- Performance budgets with CI enforcement
- Automated accessibility testing with axe-core
- Broken link detection with Lychee
- Design token compilation system
- Bundle size monitoring

</details>

## 📚 Documentation Guide

**Navigate the docs efficiently:**

### Quick Reference
- **[FAQ](./faq)** - Common questions and troubleshooting
- **[Quick Deploy](./quick-track-deploy)** - 5-minute setup guide
- **[Track Comparison](./tracks/track-comparison/)** - MVP vs Showcase decision guide

### Implementation Paths
- **[Implementation Guides](./implementation-guides/)** - 12-phase walkthrough (start at Phase 4)
- **[MVP Track Guide](./tracks/mvp-track-guide/)** - 2-3 week implementation
- **[Showcase Track Guide](./tracks/showcase-track-guide/)** - 4-6 week full-featured build

### Deep Dive Resources
- **[Design System](./design-system-changelog)** - Tokens, patterns, and accessibility
- **[Architecture Decisions](./adr/)** - Technical decision log and templates
- **[AI Context](./ai-context/)** - Using AI agents with this template
- **[Contributing](./contributing)** - Development workflow and guidelines

## 🧩 Key Features

<CardGrid>
	<Card title="Zero-Config TypeScript" icon="seti:typescript">
		Strict mode setup with proper type definitions and path aliases configured out of the box.
	</Card>
	<Card title="Performance Budgets" icon="graph">
		CI/CD performance monitoring with automated Lighthouse testing to maintain perfect scores.
	</Card>
	<Card title="Accessibility Testing" icon="approve-check-circle">
		WCAG AA compliance with automated testing using axe-core and Playwright.
	</Card>
	<Card title="Design Token System" icon="seti:stylus">
		Comprehensive token system with dark mode support and automatic CSS generation.
	</Card>
</CardGrid>

## 🤖 AI-Accelerated Development

**Get started instantly with AI assistance:**

Point your favorite AI agent (Cascade, Copilot, ChatGPT) at the [Phase 4 Implementation Guide](./implementation-guides/02-structure-phase-4-skeleton) to start customizing immediately. Our documentation is structured for optimal AI context.

<Aside type="note" title="AI Context Available">
	Check the **[AI Context](./ai-context/)** section for prompt templates and context management strategies designed for this template.
</Aside>

## 🚀 Ready to Build?

<div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
	<a href="./quick-track-deploy" class="sl-flex action primary">
		<Icon name="rocket" />
		Start Building (5 min)
	</a>
	<a href="./tracks/track-comparison" class="sl-flex action secondary">
		<Icon name="list" />
		Compare Tracks
	</a>
	<a href="./faq" class="sl-flex action secondary">
		<Icon name="question" />
		FAQ
	</a>
	<a href="https://github.com/clownware/astro-starter-template" class="sl-flex action minimal">
		<Icon name="github" />
		Star on GitHub
	</a>
</div>

---

> **Project Status:** This template is currently in **beta** ({{versions.template}}). Expect rapid iteration and breaking changes until v1.0.0. [See what's new →](./design-system-changelog)

<div style="text-align: center; margin-top: 3rem; color: var(--sl-color-gray-5);">
	<p>Built with ❤️ by the Astro community</p>
	<p>
		<a href="./contributing">Contribute</a> • 
		<a href="https://github.com/clownware/astro-starter-template/issues">Report Issues</a> • 
		<a href="https://discord.gg/astro">Join Discord</a>
	</p>
</div>
