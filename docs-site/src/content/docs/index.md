---
title: Astro Performance Starter
description: >-
  Production-ready Astro starter template targeting 100/100 Lighthouse scores
  with zero JavaScript by default
template: splash
hero:
  tagline: Build blazing-fast websites with Astro's modern architecture and comprehensive documentation
  image:
    file: ../../assets/logo.svg
  actions:
    - text: Get Started
      link: ./quick-track-deploy
      icon: right-arrow
      variant: primary
    - text: View on GitHub
      link: 'https://github.com/clownware/astro-starter-template'
      icon: external
      variant: secondary
banner:
  content: |
    <strong>🚀 Version 1.0 Released!</strong> This template now targets 100/100 Lighthouse scores with comprehensive documentation and AI-optimized structure. <a href="./design-system-changelog">See what's new →</a>
---

import { Card, CardGrid, LinkCard, Aside, Badge, Icon } from '@astrojs/starlight/components';

## Why Choose Astro Performance Starter?

Build production-ready websites that score perfect on all metrics while maintaining an excellent developer experience.

<CardGrid stagger>
	<Card title="Lightning Fast Performance" icon="rocket">
		<Badge text="100/100" variant="success" />
		<p>Target perfect Lighthouse scores with zero JavaScript by default and strategic island architecture.</p>
	</Card>
	<Card title="Comprehensive Documentation" icon="open-book">
		<Badge text="12 Phases" variant="tip" />
		<p>Phase-based implementation guides from Foundation to Deployment with MVP and Showcase tracks.</p>
	</Card>
	<Card title="Modern Design System" icon="seti:stylus">
		<Badge text="v4.0-beta" variant="note" />
		<p>Tailwind CSS v4.0-beta with design tokens, dark mode, and WCAG AA accessibility standards.</p>
	</Card>
	<Card title="AI-Optimized Workflow" icon="star">
		<Badge text="AI Ready" variant="caution" />
		<p>AI-friendly documentation structure with context management for seamless development workflows.</p>
	</Card>
</CardGrid>

## 🎯 Quick Start Paths

Choose the path that best fits your timeline and project requirements:

<div class="card-grid">
	<LinkCard
		title="MVP Track"
		description="Launch a minimum viable product in 2-3 weeks with essential features and performance."
		href="./tracks/mvp-track-guide"
	/>
	<LinkCard
		title="Showcase Track"
		description="Build a portfolio-worthy project in 4-6 weeks with all bells and whistles."
		href="./tracks/showcase-track-guide"
	/>
	<LinkCard
		title="Quick Deploy"
		description="Get your site running in minutes with our streamlined deployment guide."
		href="./quick-track-deploy"
	/>
</div>

<Aside type="tip" title="Not sure which track to choose?">
	Start with the **MVP Track** if you need to launch quickly, or choose the **Showcase Track** if you want to explore all features. You can always upgrade from MVP to Showcase later!
</Aside>

## 📊 Performance Metrics

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 2rem 0;">
	<div class="metric perfect">
		<Icon name="rocket" size="1.5rem" />
		<span>Performance</span>
		<strong>100</strong>
	</div>
	<div class="metric perfect">
		<Icon name="information" size="1.5rem" />
		<span>Accessibility</span>
		<strong>100</strong>
	</div>
	<div class="metric perfect">
		<Icon name="setting" size="1.5rem" />
		<span>Best Practices</span>
		<strong>100</strong>
	</div>
	<div class="metric perfect">
		<Icon name="magnifier" size="1.5rem" />
		<span>SEO</span>
		<strong>100</strong>
	</div>
</div>

## 🛠️ Modern Tech Stack

Built with the latest tools and best practices for optimal developer experience:

- **Framework**: <Badge text="Astro v5.x" variant="note" /> with Vite 6.x bundler
- **Package Manager**: <Badge text="pnpm 9.x" variant="caution" /> (required)
- **Runtime**: Node.js 20.x LTS
- **Styling**: <Badge text="Tailwind CSS v4.0-beta" variant="tip" /> with design tokens
- **Code Quality**: <Badge text="Biome" variant="success" /> (20x faster than ESLint + Prettier)
- **Content**: MDX with Astro Content Collections API
- **Images**: Astro Image component with Sharp processing

## ✨ What's Included

Everything you need for production-ready development:

<CardGrid>
	<Card title="Zero-Config TypeScript" icon="seti:typescript">
		Strict mode TypeScript setup with proper type definitions and path aliases configured out of the box.
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

## 📚 Featured Guides

<LinkCard
	title="Implementation Roadmap"
	description="Complete 12-phase guide from project setup to deployment and monitoring."
	href="./implementation-guides"
/>

<LinkCard
	title="Architecture Decisions"
	description="Understand the technical choices and trade-offs made in this template."
	href="./adr"
/>

<LinkCard
	title="Design Patterns"
	description="Reusable UI patterns and components built with Tailwind CSS."
	href="./patterns"
/>

## 🚀 Ready to Start?

<div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
	<a href="./quick-track-deploy" class="sl-flex action primary">
		<Icon name="rocket" />
		Quick Deploy Guide
	</a>
	<a href="./faq" class="sl-flex action secondary">
		<Icon name="question" />
		Frequently Asked Questions
	</a>
	<a href="https://github.com/clownware/astro-starter-template" class="sl-flex action secondary">
		<Icon name="github" />
		Star on GitHub
	</a>
</div>

---

<div style="text-align: center; margin-top: 3rem; color: var(--sl-color-gray-5);">
	<p>Built with ❤️ by the Astro community</p>
	<p>
		<a href="./contributing">Contribute</a> • 
		<a href="https://github.com/clownware/astro-starter-template/issues">Report Issues</a> • 
		<a href="https://discord.gg/astro">Join Discord</a>
	</p>
</div>
