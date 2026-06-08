# Astro Performance Starter

**Zero-JS baseline • 95+ Lighthouse scores • Built for speed**

[![CI](https://github.com/clownware/starter-astro-performance/actions/workflows/ci.yml/badge.svg)](https://github.com/clownware/starter-astro-performance/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE.txt)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green?logo=node.js)](https://nodejs.org/)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-success?logo=lighthouse&logoColor=white)](#-performance-budgets)

**[🚀 Live Demo](https://clownware.github.io/astro-performance-starter/)** • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

![Astro Performance Starter Demo](./docs/assets/demo-screenshot.webp)

## Why This Starter?

Most Astro templates sacrifice performance for features. This one delivers **95+ Lighthouse scores** without the bloat.

- **Performance-first** — ~17KB JS, ~18KB CSS gzipped out of the box (99 Lighthouse, CLS 0)
- **Agentic discipline built in** — Layered AI constitution (`CLAUDE.md` + `.claude/`), role-separated workflow, halt-on-violation CI gates. Your agent works under the same rules you do.
- **Modern stack** — Astro 6.x + TypeScript 5.x + Tailwind 4.x + Biome 2.x
- **Accessible** — WCAG AA compliance via semantic HTML, ARIA labels, and validated contrast ratios
- **Solo dev optimized** — Build portfolios and client sites fast

## ⚡ Quick Start

### Use as a GitHub template

Click **Use this template** on GitHub, then:

```bash
git clone https://github.com/YOUR_USERNAME/your-site.git
cd your-site
pnpm install
pnpm run dev
```

### Or scaffold with the Astro CLI

```bash
pnpm create astro@latest my-site -- --template clownware/starter-astro-performance
cd my-site
pnpm run dev
```

Open **<http://localhost:4321/>** — you're up and running.

> **First build?** Token compilation happens automatically on first `dev` or `build` command.
>
> **No pnpm?** Run `corepack enable` first, or see [troubleshooting](./docs/getting-started/onboarding.md#troubleshooting).

### One-click deploy

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/clownware/starter-astro-performance)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/clownware/starter-astro-performance)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/clownware/starter-astro-performance)

## 🛠️ Personalization

After cloning, update these files to make the template yours:

| File | What to change |
|------|---------------|
| `src/config.ts` | Site title, author, GitHub URL, docs URL, social links |
| `package.json` | `name`, `description`, `author`, `repository`, `homepage`, `bugs` |
| `LICENSE.txt` | Copyright year and holder name |
| `src/content/navigation/header.json` | Navigation links and GitHub URL |
| `src/content/bio/default.mdx` | Name, title, social links, bio text |
| `public/logo.svg` | Your logo / wordmark |
| `public/favicon.svg` | Your favicon |
| `tokens/base.json` | Brand colors |
| `.github/CODEOWNERS` | Uncomment and set your GitHub username |
| `CHANGELOG.md` | Start fresh for your project |
| `README.md` | CI badge URL, deploy buttons, `--template` command |

## ✨ What's Inside

- **Astro** 6.x with zero-JS by default (islands when needed)
- **TypeScript** 5.x in strict mode for type safety
- **Tailwind CSS** 4.x with CSS-native `@theme` design token system
- **Biome** 2.x for formatting and linting (20x faster than ESLint+Prettier)
- **Node.js** 24.x (locked via `.nvmrc`)
- **pnpm** 10.x (enforced via `engine-strict`)
- Atomic design structure in `src/components/`
- Content collections with MDX support
- GitHub Actions CI/CD (build, lint, type-check, security audit)
- Pre-commit hooks for code quality
- E2E tests with Playwright, unit tests with Vitest

## 📚 Documentation

Everything you need to customize and extend lives in `docs/`:

- **[Onboarding Guide](./docs/getting-started/onboarding.md)** — Detailed setup and concepts
- **[Launch Demo](./docs/getting-started/launch-demo.md)** — Get running in 5-10 minutes
- **[Quick Deploy](./docs/getting-started/quick-deploy.md)** — Ship to production in under an hour
- **[Implementation Roadmap](./docs/README.md#implementation-roadmap)** — Phased development guide
- **[AI Context Guides](./docs/ai-context/)** — Optimized for AI assistants

> The `docs/` folder contains extensive reference material. These files never ship to production.

## 🎨 Progressive Implementation

One path, three natural stopping points:

- **Foundation (Phases 0–4)** — Working site skeleton with design system, content schemas, and CI pipeline — pre-configured in template
- **Build (Phases 5–8)** — Components, pages, content, and QA — scope each phase to Essential / Recommended / Advanced
- **Polish (Phases 9–12)** — Performance budgets, deployment, documentation, monitoring — stop when goals are met

See the **[Implementation Guide](./docs/README.md#implementation-roadmap)** for details.

## 🤖 Working with AI Agents

This template is a reference implementation of the **layered AI constitution** pattern — agent-readable rules with halt-on-violation enforcement. Drop Claude (or any agent) into the repo and it works under the same rules you do.

The constitution layers responsibility:

- **[`CLAUDE.md`](./CLAUDE.md)** — top-level entry: stack, scope boundaries, halt conditions
- **`.claude/engineering.md`** — components, design system, TypeScript, testing discipline ([ADR-037](./docs/adr/037-testing-philosophy.md))
- **`.claude/workflow.md`** — three-pass Architect → Coder → Reviewer ([ADR-038](./docs/adr/038-agent-roles.md)), quality gate ([ADR-039](./docs/adr/039-halt-on-violation-enforcement.md))
- **`.claude/stack.md`** — tooling, versions, performance budgets
- **`.claude/roles/`** — per-pass prompts (architect, coder, reviewer)

Every rule names its halt condition with a stated reason — no soft guidance. `pnpm quality:ci` halts on broken tests, lint, types, or markdown — the same gate your agent must clear before claiming done.

```bash
pnpm quality:ci  # the halt-on-violation gate — agent must clear this before claiming done
```

Pattern source: Robert C. Martin and Justin Martin's _Clean AI: Agentic Discipline_ series. Layered-constitution precedent: [`unclebob/swarm-forge`](https://github.com/unclebob/swarm-forge).

### Multi-tool AI Context

The constitution is the canonical source. The same rules ship in multiple formats so the discipline is tool-agnostic:

| Tool | File(s) | What it does |
|------|---------|-------------|
| All modern AI tools | `AGENTS.md` (root) | Cross-tool spine — read natively by Cursor, Codex CLI, Copilot, Aider, Devin, Zed, Continue, Amp, Amazon Q |
| Claude Code | `CLAUDE.md` + `.claude/` | Constitution, layered engineering/workflow/stack files, skills, subagents |
| Windsurf | `.windsurfrules` (root) | Thin overlay for Cascade-specific directives; full context comes from `AGENTS.md` |
| Maintenance | `pnpm agents:build` | Regenerates `AGENTS.md` from the layered source files; CI fails on drift |

One source of truth, every tool stays in sync. Edit the layered files in `.claude/` (or `CLAUDE.md` for halt-on-violation rules) and run `pnpm agents:build`. See [ADR-045](docs/adr/045-cross-tool-agents-spine.md) for the cross-tool spine rationale and [ADR-036](docs/adr/036-layered-constitution.md) for the layering.

Entry points:

- **Agent workflow**: `.claude/workflow.md` — three-pass pattern, quality gate, ADR discipline
- **Architectural constraints**: `docs/adr/` — every Accepted ADR is a rule the agent must respect
- **Performance limits**: budgets in `.claude/stack.md`, checked before adding dependencies
- **Zero config**: no MCP server, no API — well-structured markdown any agent can read

See [AI Context Setup Guide](docs/ai-context/ai-rules-setup.md) for the multi-tool sync workflow.

## 🔧 Key Commands

```bash
pnpm run dev              # Start dev server
pnpm run build            # Production build
pnpm run preview          # Serve already-built dist/ locally
pnpm run quality          # Full quality check (format + lint + type-check)
pnpm run test:unit        # Unit tests (Vitest)
pnpm run test:e2e         # E2E tests (Playwright)
pnpm run test:a11y        # Accessibility tests (axe-core)
pnpm run tokens:build     # Rebuild design tokens (rarely needed)
```

<details>
<summary><strong>All Scripts Reference</strong></summary>

**Development**

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server on port 4321 |
| `pnpm run dev:host` | Dev server exposed to LAN |
| `pnpm run dev:debug` | Dev server with verbose logging |
| `pnpm run preview` | Serve already-built `dist/` locally |
| `pnpm run preview:build` | Build then preview |

**Code Quality**

| Command | Description |
|---------|-------------|
| `pnpm run quality` | Format + lint + markdown lint + type-check (auto-fixes format) |
| `pnpm run quality:ci` | Same checks, no auto-fix (CI mode) |
| `pnpm run format` | Format with Biome |
| `pnpm run format:check` | Check formatting without writing |
| `pnpm run lint` | Lint with Biome |
| `pnpm run lint:md` | Lint markdown files |
| `pnpm run check` | Astro diagnostics |
| `pnpm run check:types` | TypeScript type-check |

**Testing**

| Command | Description |
|---------|-------------|
| `pnpm run test:unit` | Vitest (single run) |
| `pnpm run test:coverage` | Vitest with coverage report |
| `pnpm run test:e2e` | Playwright (all browsers) |
| `pnpm run test:e2e:ui` | Playwright with interactive UI |
| `pnpm run test:a11y` | Accessibility tests (axe-core via Playwright) |

**Advanced / optional** — not on the clone critical path; not in `quality:ci`.

| Command | Description |
|---------|-------------|
| `pnpm run test:mutate` | Mutation testing (Stryker). Slow; runs nightly in CI, rarely run locally. See [ADR-042](docs/adr/042-mutation-testing-with-stryker.md). |

**Build & Deploy**

| Command | Description |
|---------|-------------|
| `pnpm run build` | Validate env + build tokens + Astro build |
| `pnpm run build:ci` | Same with verbose output |
| `pnpm run tokens:build` | Compile design tokens from `tokens/` |
| `pnpm run clean` | Remove `dist/`, `.astro/`, `tokens/dist/` |
| `pnpm run clean:all` | Clean + clear `node_modules/.cache` |

**Performance & Validation**

| Command | Description |
|---------|-------------|
| `pnpm run perf:lighthouse` | Lighthouse HTML report (requires running dev server) |
| `pnpm run perf:budgets` | Track JS/CSS budget violations |
| `pnpm run perf:baseline` | Establish performance baseline |
| `pnpm run bundle:analyze` | Build + analyze bundle composition |
| `pnpm run design:validate` | Validate semantic color contrast ratios |
| `pnpm run budgets:validate` | Validate budget override configuration |
| `pnpm run images:analyze` | Analyze image sizes and formats |
| `pnpm run images:optimize` | Interactive image optimization |

**Release & Maintenance**

| Command | Description |
|---------|-------------|
| `pnpm run release:changelog` | Generate CHANGELOG from commits |
| `pnpm run audit` | pnpm audit (production deps) |
| `pnpm run roadmap:update` | Update implementation roadmap status |

</details>

## 🚀 Performance Budgets

Budgets (see `.claude/stack.md`):

- **JavaScript**: < 160KB raw total
- **CSS**: < 50KB
- **Lighthouse**: 95+ Performance, 98+ Accessibility

The default starter ships well under budget — measured on a production build:

- **JavaScript**: ~48KB raw (~17KB gzipped) _total_ across the whole site; a
  typical page loads only the view-transition router plus a tiny page script.
- **CSS**: ~18KB gzipped per page (≈22KB on pages with code blocks).
- **Lighthouse**: 99 Performance, CLS 0 on the home and blog routes.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

Licensed under the [MIT License](./LICENSE.txt).

---

**Status**: Active development • v0.9.0
