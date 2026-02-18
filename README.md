# Astro Performance Starter

**Zero-JS baseline • 97+ Lighthouse scores • Built for speed**

[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-success?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis?url=https://clownware.github.io/astro-starter-template/)

[Live Demo](https://clownware.github.io/astro-starter-template/examples/landing) • [Documentation](https://aps.docs.clownware.org) • [Quick Start](#-quick-start)

---

![Astro Performance Starter Demo](./docs/assets/demo-screenshot.webp)

## Why This Starter?

Most Astro templates sacrifice performance for features. This one delivers **97+ Lighthouse scores** without the bloat.

- **⚡ Performance-first**: < 90KB JS, < 15KB CSS (gzipped) out of the box
- **🛠️ Modern stack**: Astro ^5.0.0 + TypeScript ^5.0.0 + Tailwind ^4.0.0 + Biome ^2.0.0
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
> **No pnpm?** Run `corepack enable` first, or see [troubleshooting](./ONBOARDING.md#troubleshooting).

## ✨ What's Inside

- **Astro** ^5.0.0 with zero-JS by default (islands when needed)
- **TypeScript** ^5.0.0 in strict mode for type safety
- **Tailwind CSS** ^4.0.0 with design token system
- **Biome** ^2.0.0 for formatting and linting (20x faster than ESLint+Prettier)
- **Node.js** 22.x LTS (locked via `.nvmrc`)
- **pnpm** 9.x (enforced via `engine-strict`)
- Atomic design structure in `src/components/`
- Content collections with MDX support
- GitHub Actions CI/CD ready
- Pre-commit hooks for code quality

## 📚 Documentation

Everything you need to customize and extend:

- **[Onboarding Guide](./ONBOARDING.md)** – Detailed setup and concepts
- **[Recommended Extensions](./docs/development/recommended-extensions.md)** – Essential VS Code extensions
- **[Implementation Roadmap](./docs/README.md#implementation-roadmap)** – Phased development guide
- **[Component System](./docs/implementation-guides/)** – Building with atomic design
- **[AI Context Guides](./docs/ai-context/)** – Optimized for AI assistants

> The `/docs` folder contains extensive reference material for local development. These files never ship to production.

## 🎨 Two Paths Forward

Choose your speed:

- **Fast Path** (~2 weeks): Minimal features, maximum performance
- **Full Path** (~4-6 weeks): Rich components, selective interactivity

See **[Track Comparison](https://aps.docs.clownware.org/tracks/track-comparison/)** for details.

## 🔧 Key Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Production build
pnpm run preview          # Preview production build
pnpm run format           # Format with Biome
pnpm run lint             # Lint with Biome
pnpm run build:tokens     # Rebuild design tokens (rarely needed)
```

## 🚀 Performance Budgets

Strict limits enforced via CI:

- **JavaScript**: < 160KB gzipped (max budget for Full Path with interactivity)
- **CSS**: < 50KB uncompressed
- **Lighthouse**: 97+ Performance, 98+ Accessibility

Default starter delivers well under budget: ~90KB JS, ~15KB CSS (gzipped). Fast Path stays even leaner.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

Licensed under the [MIT License](./LICENSE.txt).

---

**Status**: Active development • v0.1.0-beta • [Changelog](./CHANGELOG.md) • [Latest Release](https://github.com/clownware/astro-starter-template/releases)
