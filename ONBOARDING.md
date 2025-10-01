---
title: "Developer Onboarding"
version: "1.0.0"
lastUpdated: "2025-06-10"
description: "Guide for developers to set up and start working with the Astro Performance Starter project."
---

# 🚀 Developer Onboarding

> **Project**: High-performance Astro static site with Tailwind CSS, zero JavaScript by default, and industry-leading performance metrics.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 22.x or later ([install](https://nodejs.org/))
- **pnpm** 9.x or later (`npm install -g pnpm`)
- **Git** for version control
- **VS Code** (recommended) - see [Recommended Extensions](./docs/development/recommended-extensions.md)

## Quick Start

Get up and running in 2 minutes:

```bash
# 1. Clone the repository
git clone <repository-url>
cd <project-name>

# 2. Install dependencies
pnpm install

# 3. Build design tokens (required first time)
pnpm run build:tokens

# 4. Start development server
pnpm run dev

# 5. Open in browser
# → http://localhost:4321
```

### Next Steps

Once you're up and running, consider these initial configuration steps:

- [ ] **Configure Analytics**: This template is privacy-first. See our guide on [Adding Web Analytics](/implementation-guides/06-optional-features/01-analytics) to add Plausible or Fathom.
- [ ] **Customize Content**: Edit the example blog post in `src/content/blog/` and update your site configuration in `.env`.
- [ ] **Review the Guides**: The `src/content/docs/implementation-guides/active-phases/` contain current development phase instructions. Start with [Phase 5 Components](./src/content/docs/implementation-guides/active-phases/phase-5-components.md) which has optional elements you can customize.

## Essential Commands

```bash
# Development
pnpm run dev              # Start dev server with hot reload
pnpm run build            # Build for production
pnpm run preview          # Preview production build

# Code Quality (runs automatically on commit)
pnpm run format           # Format code with Biome
pnpm run lint             # Check for code issues
pnpm run check            # Type checking
pnpm run quality          # Run all checks

# Design System
pnpm run build:tokens     # Rebuild design tokens
pnpm run validate:contrast # Check WCAG compliance
```

## Project Structure at a Glance

```bash
src/
├── pages/        # Routes (file = URL)
├── layouts/      # Page wrappers
├── components/   # Reusable UI (Atomic Design)
├── content/      # Blog posts, projects (MDX)
├── styles/       # Global CSS
└── utils/        # Helper functions
```

## Architectural Notes

### The Role of `src/pages/index.astro`

This template ships with a clean homepage located at `src/pages/index.astro` by default. When you run `pnpm dev`, this is the page you will see at the root of your local server.

- **Local AI Context**: The `/docs` directory in this repository is not part of the production build. It exists to provide rich, local-only context for AI development assistants, enabling them to understand the project's architecture and patterns.

## Development Workflow

1. **Pick up a task** from your project board
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** (hot reload will show updates)
4. **Test locally**: Check desktop & mobile views
5. **Commit**: `git commit -m "feat: add new component"`
   - Pre-commit hooks will auto-format and lint
6. **Push**: `git push origin feature/your-feature`
7. **Open PR**: CI will run quality checks

## Key Concepts

- **Zero JS by default**: We ship static HTML/CSS unless interactivity is essential
- **Islands Architecture**: JavaScript loads only where needed
- **Design Tokens**: All colors, spacing, etc. come from `tokens/`
- **Type Safety**: TypeScript strict mode is enforced
- **Performance First**: Every PR must meet our performance budgets

## Common Tasks

### Adding a New Page

Create a file in `src/pages/`:

```astro
---
// src/pages/example.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Example Page">
  <h1>Hello World</h1>
</BaseLayout>
```

### Creating a Component

Add to appropriate atomic level:

```astro
---
// src/components/atoms/MyButton.astro
export interface Props {
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary' } = Astro.props;
---

<button class={variant}>
  <slot />
</button>
```

### Working with Content

Add MDX files to `src/content/`:

```mdx
---
# src/content/blog/my-post.mdx
title: "My First Post"
date: 2024-01-15
draft: false
---

# Hello from MDX!

This supports **markdown** and components.
```

## Getting Help

- **Framework Guide**: See [Implementation Overview](./src/content/docs/implementation-guides/README.md)
- **Tech Stack**: Review [Technology Choices](./src/content/docs/implementation-guides/reference/tech-stack.md)
- **Component Docs**: Run `pnpm run astrobook` (Showcase track only)
- **Team Chat**: [Link to Team Chat] <!-- TODO: Update Slack/Discord link -->

## Next Steps

1. ✅ Confirm dev server is running
2. 📚 Read the [Implementation Overview](./src/content/docs/implementation-guides/README.md)
3. 🎯 Start with [Phase 5 Components](./src/content/docs/implementation-guides/active-phases/phase-5-components.md) - optional elements you can customize
4. 💪 Pick your first task!

---

*Welcome to the team! We're excited to have you contributing to this project. Remember: when in doubt, check the performance budget and prefer static solutions.
