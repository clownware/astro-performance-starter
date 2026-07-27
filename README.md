# Astro Performance Starter

**Hard performance budgets, enforced on every PR • Zero-JS baseline • Astro 7**

[![CI](https://github.com/clownware/astro-performance-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/clownware/astro-performance-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE.txt)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green?logo=node.js)](https://nodejs.org/)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-success?logo=lighthouse&logoColor=white)](#-performance-budgets)

**[🚀 Live Demo](https://clownware.github.io/astro-performance-starter/)** • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

![Astro Performance Starter Demo](./docs/assets/demo-screenshot.webp)

## Why This Starter?

Most Astro templates hand you a fast first commit and no way to keep it fast. This one ships a **performance ratchet** — hard budgets wired into CI that fail the build when a change regresses them. The Lighthouse score is the _evidence_; the enforcement is the point.

- **Enforced, not aspirational** — halt-on-violation CI gates on JS bundle size, per-image size (source _and_ build output), font-preload count, and Lighthouse on **both mobile and desktop**. A regression fails the PR — it doesn't ship. ([ADR-039](./docs/adr/039-halt-on-violation-enforcement.md))
- **Images can't sink you** — the #1 real-world perf killer is gated: Astro `<Image>` → AVIF with responsive `srcset`, plus a 200KB-per-raster ceiling checked in CI (details in the next section).
- **Agentic discipline built in** — Layered AI constitution (`CLAUDE.md` + `.claude/`), role-separated workflow. Your agent clears the same gates you do.
- **Fast by default, measured** — ~48KB raw JS (~17KB gzipped) _total_ across the site; ~19–21KB gzipped CSS per page; 99 Performance / CLS 0 on home and blog, **desktop and mobile**.
- **Modern stack** — Astro 7.x · TypeScript 5.x (strict) · Tailwind 4.x · Biome 2.x · Node 24.x · pnpm 10.x
- **Accessible** — WCAG AA via semantic HTML, ARIA, and validated contrast; accessibility gated ≥ 95 in CI (most routes score 100).

## 🖼️ The image pipeline (the #1 perf killer)

One oversized hero image can cost more Lighthouse points than every other issue combined — it's the single most common regression adopters hit. So images are a first-class, gated concern here, not an afterthought:

- **Modern formats by default** — [`src/components/atoms/Image.astro`](./src/components/atoms/Image.astro) wraps Astro's `<Image>`, emitting **AVIF** with responsive `srcset` and lazy loading. Raw `<img>` for raster is discouraged; SVG passes through untouched. ([ADR-030](./docs/adr/030-image-optimisation-defaults.md))
- **A hard per-image ceiling** — **200KB per raster file**, enforced in CI on both source (`public/`, `src/`) _and_ build output (`dist/`) — so a heavyweight PNG, including an accidental fallback emitted alongside AVIF/WebP, fails the build. Override with `IMAGE_BUDGET_KB`. ([ADR-057](./docs/adr/057-image-budget-gate.md))
- **Font preloads capped** — ≤ 2 preloaded fonts per page, so preloads don't crowd out the LCP image. ([ADR-058](./docs/adr/058-font-preload-budget.md))

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
pnpm create astro@latest my-site -- --template clownware/astro-performance-starter
cd my-site
pnpm run dev
```

Open **<http://localhost:4321/>** — you're up and running.

> **First build?** Token compilation happens automatically on first `dev` or `build` command.
>
> **No pnpm?** Run `corepack enable` first, or see [troubleshooting](./docs/getting-started/onboarding.md#troubleshooting).

### One-click deploy

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/clownware/astro-performance-starter)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/clownware/astro-performance-starter)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/clownware/astro-performance-starter)

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

## 🔍 Use as an audit reference

You don't have to _build on_ this template to benefit from it — you can point an agent at an **existing** site and use this repo as the standard to audit against. In one real case that workflow took a personal site from **Lighthouse 73 to 100** (desktop) by surfacing exactly the regressions these gates encode.

The workflow:

1. Clone this repo next to your project (or open both side by side).
2. Tell your agent: _"Audit this site against the norms in the astro-performance-starter repo — its ADRs, `.claude/stack.md` budgets, and CI gates. Report deviations ranked by performance impact."_
3. Have it check what this template treats as non-negotiable:
   - **Images** — modern formats, responsive `srcset`, every raster under the 200KB ceiling (source _and_ shipped). Usually the single biggest win.
   - **Islands** — Preact for interactive islands ([ADR-001](./docs/adr/001-preact-island-usage-policy.md)), hydrated as late as possible up the ladder **`client:visible` → `client:idle` → `client:media` → `client:load`** (`client:load` only with ADR justification).
   - **Fonts** — subset `woff2`, ≤ 2 preloads per page so preloads don't fight the LCP image ([ADR-053](./docs/adr/053-fonts-via-astro-fonts-api.md)).
   - **Budgets & gates** — JS/CSS/image/font budgets and Lighthouse floors, run on every PR so nothing silently regresses.

Because each norm has an ADR behind it, the agent can justify every recommendation from the _why_ rather than cargo-culting it.

## 🎚️ Minimum viable gate (solo / personal sites)

The full apparatus is built for a template that must never regress. A personal site rarely needs all of it. **Keep the ratchet, drop the ceremony** — this is subtraction from one config, not a second maintained tier:

**Keep** — this _is_ the performance ratchet, and it's cheap to run:

- `lighthouserc.json` + `lighthouserc.mobile.json` — the Lighthouse gates
- the JS bundle-size step, `images:gate`, and `fonts:gate` in CI
- `pnpm test:e2e` as a smoke test that pages actually render

**Safe to drop** for less overhead:

- **Mutation testing** — remove `.github/workflows/mutation.yml`, the `test:mutate` script, and Stryker from devDependencies ([ADR-042](./docs/adr/042-mutation-testing-with-stryker.md)).
- **The full ADR apparatus** — `docs/adr/` and the `docs:count` guard keep a _shared_ template honest; a solo project can keep a lightweight `DECISIONS.md` (or nothing) and drop `docs:count` from `quality:ci`.
- **Cross-tool agent spine** — if you use only one agent, drop `agents:build` / `agents:check` and keep just `CLAUDE.md`.
- **Template-invariant guards** — `version:check` and `og:check` protect template-specific invariants; trim them from `quality:ci` as needed.

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
| `pnpm run images:gate` | Fail on any raster image over the per-file budget (CI gate, ADR-057) |
| `pnpm run fonts:gate` | Fail on any built page over the font-preload budget (CI gate, ADR-058) |
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
- **Images**: < 200KB per raster file, source + build output — enforced in CI ([ADR-057](./docs/adr/057-image-budget-gate.md)); override with `IMAGE_BUDGET_KB`
- **Font preloads**: ≤ 2 per page — enforced in CI ([ADR-058](./docs/adr/058-font-preload-budget.md)); override with `MAX_FONT_PRELOADS`
- **Lighthouse**: gated on **desktop _and_ mobile** — Performance ≥ 90, Accessibility ≥ 95, Best-Practices ≥ 95, SEO ≥ 90 (CI floors; see `lighthouserc.json` + `lighthouserc.mobile.json`)

The default starter ships well under budget — measured on a production build:

- **JavaScript**: ~48KB raw (~17KB gzipped) _total_ across the whole site; a
  typical page loads only the view-transition router plus a tiny page script.
- **CSS**: ~19–21KB gzipped per page — a ~17.6KB shared stylesheet plus
  1–3.5KB of inlined critical styles (fonts, view transitions); ≈23–24KB on
  pages with code blocks.
- **Lighthouse**: 99 Performance / CLS 0 on home and blog — **desktop and mobile**
  (measured; desktop re-verified at 100/CLS 0 on home, blog index, and a post,
  July 2026); accessibility 96–100 across all gated routes.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

Licensed under the [MIT License](./LICENSE.txt).

---

**Status**: Active development • v0.9.0
