# Astro Performance Starter

**Zero-JS baseline • 95+ Lighthouse scores • Built for speed**

[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-success?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis?url=https://clownware.github.io/astro-starter-template/)

[Live Demo](https://clownware.github.io/astro-starter-template/examples/landing) • [Documentation](https://aps.docs.clownware.org) • [Quick Start](#-quick-start)

---

![Astro Performance Starter Demo](./docs/assets/demo-screenshot.webp)

## Why This Starter?

Most Astro templates sacrifice performance for features. This one delivers **95+ Lighthouse scores** without the bloat.

- **⚡ Performance-first**: < 90KB JS, < 15KB CSS (gzipped) out of the box
- **🛠️ Modern stack**: Astro ^5.0.0 + TypeScript ^5.0.0 + Tailwind ^3.0.0 + Biome ^2.0.0
- **♿ Accessibility**: WCAG AA compliance via semantic HTML, ARIA labels, and validated contrast ratios
- **🎯 Solo dev optimized**: Build portfolios and client sites fast
- **🤖 AI-ready**: Rich context for AI coding assistants—use `docs/ai-context/` to prompt tools like GitHub Copilot on atomic components

## ⚡ Quick Start

```bash
# Create and start in 3 commands
pnpm create astro@latest my-site -- --template clownware/astro-starter-template
cd my-site
pnpm run dev
```

Open **<http://localhost:4321/>** – you're up and running.

> **First build?** Token compilation happens automatically on first `dev` or `build` command.
>
> **No pnpm?** Run `corepack enable` first, or see [troubleshooting](./docs/getting-started/onboarding.md#troubleshooting).

## ✨ What's Inside

- **Astro** ^5.0.0 with zero-JS by default (islands when needed)
- **TypeScript** ^5.0.0 in strict mode for type safety
- **Tailwind CSS** ^3.0.0 with design token system
- **Biome** ^2.0.0 for formatting and linting (20x faster than ESLint+Prettier)
- **Node.js** 24.x LTS (locked via `.nvmrc`)
- **pnpm** 10.x (enforced via `engine-strict`)
- Atomic design structure in `src/components/`
- Content collections with MDX support
- GitHub Actions CI/CD ready
- Pre-commit hooks for code quality

## 📚 Documentation

Everything you need to customize and extend:

- **[Onboarding Guide](./docs/getting-started/onboarding.md)** – Detailed setup and concepts
- **[Recommended Extensions](./docs/development/recommended-extensions.md)** – Essential VS Code extensions
- **[Implementation Roadmap](./docs/README.md#implementation-roadmap)** – Phased development guide
- **[Component System](./docs/implementation-guides/)** – Building with atomic design
- **[AI Context Guides](./docs/ai-context/)** – Optimized for AI assistants

> The `/docs` folder contains extensive reference material for local development. These files never ship to production.

## 🎨 Progressive Implementation

One path, three natural stopping points:

- **Foundation (Phases 0–4)**: Working site skeleton with design system, content schemas, and CI pipeline — pre-configured in template
- **Build (Phases 5–8)**: Components, pages, content, and QA — scope each phase to Essential / Recommended / Advanced
- **Polish (Phases 9–12)**: Performance budgets, deployment, documentation, monitoring — stop when goals are met

See **[Implementation Guide](https://astro.clownware.org/getting-started/)** for details.

## 🤖 AI Context Layer

This template includes structured documentation designed for AI coding assistants. The `docs/` directory serves as both a rendered documentation site and filesystem-readable context for tools like Windsurf, Cursor, and GitHub Copilot.

- **Entry point**: `docs/ai-context/INDEX.md` — project overview, constraints, and navigation
- **Architectural constraints**: `docs/adr/` — every accepted ADR is a rule AI must respect
- **Performance limits**: Budgets and guardrails checked before adding dependencies
- **Zero config**: No MCP server, no API — just well-structured markdown that any AI can read

## 🔧 Key Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Production build
pnpm run preview          # Serve already-built dist/ locally
pnpm run format           # Format with Biome
pnpm run lint             # Lint with Biome
pnpm run tokens:build     # Rebuild design tokens (rarely needed)
```

## 🚀 Performance Budgets

Strict limits enforced via CI:

- **JavaScript**: < 160KB gzipped
- **CSS**: < 50KB uncompressed
- **Lighthouse**: 95+ Performance, 98+ Accessibility

Default starter delivers well under budget: ~90KB JS, ~15KB CSS (gzipped).

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

Licensed under the [MIT License](./LICENSE.txt).

---

**Status**: Active development • v0.1.0-beta • [Latest Release](https://github.com/clownware/astro-starter-template/releases)
