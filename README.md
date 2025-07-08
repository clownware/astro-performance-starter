# Astro Performance Starter Template

> **Live demo:** [Example landing page](https://clownware.github.io/astro-starter-template/examples/landing)

<!-- BADGE PANEL - AT A GLANCE -->
<p style="text-align: center;">
  <a href="https://github.com/clownware/astro-starter-template/actions/workflows/ci.yml">
    <img alt="CI Status" src="https://github.com/clownware/astro-starter-template/actions/workflows/ci.yml/badge.svg">
  </a>
  <img alt="Node Version" src="https://img.shields.io/badge/node-%3E=22.x-brightgreen">
  <a href="https://github.com/clownware/astro-starter-template/blob/main/LICENSE.txt">
    <img alt="License" src="https://img.shields.io/github/license/clownware/astro-starter-template">
  </a>
  <img alt="Lighthouse Performance" src="https://img.shields.io/badge/Lighthouse-97%2B-brightgreen">
  <a href="#your-pagespeed-insights-badge-url-here">
    <img alt="PageSpeed Score" src="https://img.shields.io/badge/PageSpeed-90%2B-orange">
  </a>
  <a href="#your-demo-url-here">
    <img alt="Live Demo" src="https://img.shields.io/badge/Live_Demo-View%20Here-blue?style=flat-square">
  </a>
</p>

<!-- TOC -->

Welcome to this opinionated, high-performance starter template for Astro projects. This template is meticulously crafted for developers aiming for **top-tier Lighthouse scores (97+ Performance, 98+ Accessibility)**, a cutting-edge developer experience, and a highly structured, maintainable codebase. It's built with AI-assisted development in mind (see [`./docs/ai-context/`](./docs/ai-context/)), adhering to strong principles for optimal quality and efficiency.

🚧 **Project Status:** This template is currently in **beta** (`v0.1.0`). Expect rapid iteration and breaking changes until v1.0.0. Feedback is welcome!

> **Note:** Pre-1.0.0 (`0.x.y`) versions follow [semantic versioning best practices](https://semver.org/#spec-item-4): breaking changes can occur at any time. Use with care in production environments.

🤖 **AI-Accelerated Setup:**
You can point your favorite AI agent (e.g., Cascade, Copilot, ChatGPT) at the [Phase 5 Components Guide](./src/content/docs/implementation-guides/active-phases/phase-5-components.md) to start with optional component customizations. Phase 5 has flexible elements you can implement as needed, while Phase 6 (sections) hasn't been started yet.

## 🧭 Core Principles

- **Performance is Paramount**: Every decision is weighed against its performance impact.
- **Zero-JS first. Islands only when needed.**
- **Token-Driven Design**: All styling (colors, spacing, typography) is managed via a robust design token system ([`./tokens/`](./tokens/)).
- **Accessibility as a Baseline**: WCAG AA compliance is a minimum requirement.
- **Strict Quality Gates**: Automated checks for formatting, linting, type safety, and performance budgets via pre-commit hooks and CI.

## 🤔 Why This Starter?

This isn't just another Astro starter. It's a comprehensive foundation for projects where performance and quality are non-negotiable. We provide:

- **Extreme Performance Focus**: Strict budgets (JS < 160KB gzip, CSS < 50KB uncompressed) and best practices baked in.
- **Default Build Size**: Aims for < 90 KB JS and < 15 KB CSS (gzipped) for the default starter content.
- **Astro v5 + Tailwind v4 + full design-token pipeline.**
- **TypeScript strict**: For robust, type-safe code.
- **Structured Development**: Phased implementation roadmap, atomic design principles, and comprehensive internal documentation.
- **AI-Ready**: Detailed context guides ([`./docs/ai-context/`](./docs/ai-context/)) to empower AI coding assistants to work effectively within the project's constraints and patterns.
- **Two Development Tracks**: Choose between an ultra-lean **MVP Track** (minimal features, zero JS) or a richer **Showcase Track** (full features, selective interactivity) as per the [Implementation Roadmap](./docs/README.md#implementation-roadmap).

<!-- TODO: Add Lighthouse 100/100 screenshot here once the project is deployed and audited. -->

## ⚡ Quick Start

Get up and running in 30 seconds:

```bash
# 1. Create your project from the template
pnpm create astro@latest my-site --template clownware/astro-starter-template

# 2. Navigate into the project
cd my-site

# 3. Install dependencies
pnpm install

# 4. Build the design tokens (required first time)
pnpm run build:tokens

# 5. Start the development server
pnpm run dev
```

You should now see a clean homepage at `http://localhost:4321/` with zero additional steps.

### About the `/docs` directory

This repo includes a large `/docs` folder full of markdown files. These files **do not get shipped to production**. They exist solely as rich context for AI coding assistants and as reference material while you work locally. The live documentation for this starter lives at **[aps.docs.clownware.org](https://aps.docs.clownware.org)**.

(For detailed setup, see [`./ONBOARDING.md`](./ONBOARDING.md).)

## ✨ Enhanced Features

- **Astro v5 (or latest)**: Cutting-edge Astro features and performance.
- **Tailwind CSS v4 (or latest)**: Utility-first CSS, configured with design tokens.
- **Biome**: Integrated for formatting and linting (replaces Prettier/ESLint).
- **TypeScript strict**: End-to-end type safety.
- **Atomic Design Component Structure**: `src/components/` organized by atoms, molecules, organisms, etc.
- **Content Collections**: Type-safe content management with MDX.
- **Comprehensive Documentation**: `/docs` includes:

  - Phased [Implementation Roadmap](./docs/README.md#implementation-roadmap)
  - Detailed [`implementation-guides/`](./docs/implementation-guides/)
  - Architectural Decision Records ([`adr/`](./docs/adr/))
  - AI Assistant Context ([`ai-context/`](./docs/ai-context/))

- **GitHub Actions CI/CD**: Workflows for quality checks, build, and deployment previews.
- **Husky & lint-staged**: Pre-commit hooks for code quality.
- **Devcontainer**: Pre-configured development environment for consistency.

## 🚀 Getting Started

Dive in by following the detailed **[`./ONBOARDING.md`](./ONBOARDING.md)** guide. It covers prerequisites, setup, essential commands, and key project concepts.

## 🗺️ Project Roadmap & Tracks

**Choose Your Implementation Path:**

- **[Track Comparison](https://aps.docs.clownware.org/tracks/track-comparison/)** - Help choosing between MVP and Showcase tracks
- **[MVP Track Guide](https://aps.docs.clownware.org/tracks/mvp-track-guide/)** - Fast deployment (2-3 weeks)
- **[Showcase Track Guide](https://aps.docs.clownware.org/tracks/showcase-track-guide/)** - Technical excellence (4-6 weeks)

Both tracks leverage the same high-performance foundation with pre-configured Astro 5.x, TypeScript, Tailwind CSS, and design tokens.

**Local Documentation**: Review the detailed **[Implementation Roadmap](./docs/README.md#implementation-roadmap)** for phase-by-phase guidance.

## 🤝 Contributing

We welcome contributions! Please read our **[`./CONTRIBUTING.md`](./CONTRIBUTING.md)** for guidelines and best practices. If applicable, also refer to our **[`./CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)**.

## 📄 License

This project is licensed under the terms of the **[`./LICENSE.txt`](./LICENSE.txt)** file.
