---
title: 'Launch Demo'
description: >-
  Get the Astro starter template running locally in 5-10 minutes with zero configuration
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Why This Guide Exists

Most template quickstarts assume you want to deploy immediately. This guide respects that you might just want to **see it work first**.

No configuration. No customization. No deployment. Just: "Does this thing actually run?" ✅

## 🎯 What You'll Accomplish

### Time Required: 5-10 minutes

- [x] Template installed locally
- [x] Development server running
- [x] Demo site viewable at localhost:4321
- [x] Ready to explore or customize

## ✅ Prerequisites

**Already a developer?** You probably have these. Quick check:

```bash
node --version && pnpm --version && git --version
```

**New to this?** You'll need three free tools:

- **Node.js 24+** - JavaScript runtime ([get it](https://nodejs.org))
- **pnpm 10+** - Fast package manager (install: `corepack enable && corepack prepare pnpm@latest --activate`)
- **Git 2.30+** - Version control ([get it](https://git-scm.com))

⏱️ **5-10 minutes** if installing from scratch

:::tip[Verify Your Setup]
All three installed? Run this to confirm:

```bash
node --version  # Should show v24.x.x or higher
pnpm --version  # Should show 10.x.x or higher
git --version   # Should show 2.30.x or higher
```

:::

:::caution[Windows Users]
**For best performance:**

- Use WSL (Windows Subsystem for Linux) for faster pnpm operations
- Enable long paths: `git config --system core.longpaths true`
- Consider using Windows Terminal for better CLI experience

:::

## ⚡ Quick Start

### Step 1: Create Your Project (2 min)

```bash
# Create from template (uses latest Astro CLI v6.x)
pnpm create astro@latest my-site --template YOUR_ORG/YOUR_REPO

# Navigate into project
cd my-site
```

:::note[Template Name]
Replace `my-site` with your preferred project name. This is just a local folder name—you can change it anytime.

**Pinning to a specific version?** Use `--template YOUR_ORG/YOUR_REPO@<tag>` to lock to a release tag.
:::

### Step 2: Install & Start Dev Server (3-5 min)

```bash
# One command to rule them all
pnpm install && pnpm run dev

# ⏱️ 3-5 minutes total
# Grab coffee ☕ — the first install takes a minute
# You'll see a localhost URL when ready
```

**Expected Output:**

```text
🚀 astro v6.x.x started in XXXms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

:::tip[What's Happening?]

- `pnpm install` - Downloads all dependencies (~2-3 minutes)
- `pnpm run dev` - Compiles design tokens via `predev` hook, then starts dev server with hot reload (~15 seconds)

:::

### Step 3: Verify Installation (1 min)

1. **Open browser** to `http://localhost:4321`
2. **You'll see** the starter template homepage
3. **Explore** the blog and projects pages from the navigation

✅ **Success!** You're locked in.

**Visual confirmation:** You should see a clean, modern homepage with:

- Header with navigation
- Hero section with gradient background
- Feature cards
- Dark mode toggle (try it!)

:::tip[Accessibility Check]
**Navigate with keyboard only** to verify WCAG AA compliance:

- Press `Tab` to move through interactive elements
- Press `Enter` or `Space` to activate buttons/links
- All interactive elements should have visible focus indicators
- Screen reader users: ARIA roles are properly implemented

:::

## 🗺️ What Just Happened?

You now have:

- ✅ A complete Astro site running locally
- ✅ Live reload on every save
- ✅ Production-grade components and patterns
- ✅ A design system you can customize

**But you haven't changed anything yet.** This is the template as-is. Your next move determines what you build.

## 💡 Before You Start Editing

Three things that'll save you headaches:

1. **Hot Reload Works** - Save any file and see changes instantly (except config files)
2. **Design Tokens Auto-Compile** - Edit `tokens/*.json`, save, and changes apply automatically
3. **Path Aliases FTW** - Use `@/components/Button` not `../../components/Button`

## 🔍 What You Have

### Project Structure

**TL;DR**: Standard Astro project with:

- **Components** organized by atomic design (atoms → molecules → organisms)
- **Type-safe content collections** (blog posts, projects with validation)
- **Token-based design system** (change colors/fonts in one place)
- **Zero-config dark mode** (respects system preferences)

<details>
<summary><strong>Full Directory Structure</strong></summary>

```text
my-site/
├── src/
│   ├── components/     # UI components (atoms, molecules, organisms)
│   │   ├── atoms/      # Basic elements (Button, Input)
│   │   ├── molecules/  # Simple combos (Card, FormField)
│   │   ├── organisms/  # Complex sections (created when needed)
│   │   └── structural/ # Layout components (Container, Section)
│   ├── layouts/        # Page layouts (BaseLayout.astro)
│   ├── pages/          # Routes (index.astro, 404.astro)
│   ├── content/        # Content collections (blog, projects)
│   ├── styles/         # Global styles
│   └── utils/          # Helper functions
├── public/             # Static assets (favicon, images)
├── tokens/             # Design tokens (colors, typography)
├── astro.config.mjs    # Astro configuration
├── src/styles/global.css # Tailwind v4 CSS config
└── package.json        # Dependencies and scripts
```

</details>

### Key Features Included

| Feature | Benefit |
|---------|----------|
| **Zero-JS by default** | 95+ Lighthouse scores out-of-box, blazing fast load times |
| **Token-based design** | Single-file customizations (change colors/fonts in one place) |
| **Content collections** | Type-safe MDX with validation (catch errors before deploy) |
| **Dark mode** | Automatic system preference detection (zero config needed) |
| **Accessibility** | WCAG AA compliant components (keyboard nav, ARIA, contrast) |
| **TypeScript** | Strict mode with path aliases (catch bugs at compile time) |
| **Tailwind CSS** | Utility-first styling with design tokens (rapid prototyping) |

### Available Commands

```bash
pnpm run dev          # Start dev server (auto-compiles tokens first)
pnpm run build        # Build for production (tokens + Astro - fully automated)
pnpm run preview      # Serve already-built dist/ locally (run build first)
pnpm run tokens:build # Compile design tokens only (manual - rarely needed)
pnpm run check        # Type-check TypeScript
pnpm run format       # Format code with Biome
pnpm run lint         # Lint code with Biome
```

:::note[About preview]
`pnpm run preview` serves an already-built `dist/` folder. Always run `pnpm run build` first. Use `pnpm run preview:build` as a convenience alias that does both in sequence.
:::

## 🎓 Next Steps

Choose your path based on your goals:

### Path A: Deploy Now ⚡

**Ready to make it yours and go live?**

→ [Quick Deploy Guide](./quick-deploy/)

- Personalize branding (20-30 min)
- Deploy to production (15-20 min)
- Custom domain setup (optional)
- **Total time: 45-75 minutes**

### Path B: Explore First 🔍

**Want to understand the template before customizing?**

→ [Directory Structure](./directory-structure/)  
→ [What's Included](./included-in-this-template/)  
→ [FAQ](./faq/)

- Learn the architecture
- Explore components
- Review design tokens
- Understand the build system

### Path C: Start Building 🛠️

**Jump into development immediately?**

→ [Creating Your First Page](./creating-your-first-page/)  
→ [Component Patterns](../patterns/component-patterns/)  
→ [Content Collections](../patterns/content-collections/)

- Add new pages
- Customize components
- Work with content collections
- Build custom features

### Path D: Full Implementation 📚

**Want the complete guided experience?**

→ [Implementation Guide Master Index](/implementation-guides/) — work through phases sequentially, stop when goals are met

- Complete all 12 phases
- Production-ready features
- Performance optimization
- Advanced patterns

## 🆘 Troubleshooting

### Common Issues (80% of problems)

#### Port already in use

```bash
# Use a different port (works everywhere)
pnpm run dev -- --port 3000
```

#### Styles missing or broken

```bash
# Tokens auto-compile on dev start, but you can force it:
pnpm run tokens:build
pnpm run dev
```

#### Module not found errors

```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Less Common Issues

#### Build fails during token compilation

**Cause**: Missing or corrupted token files

**Fix**:

```bash
# Verify token files exist
ls -la tokens/

# Should see: base.json, semantic.json
# If missing, re-clone the template
```

#### Kill process using the port (alternative)

```bash
# macOS/Linux:
lsof -ti:4321 | xargs kill -9

# Windows:
netstat -ano | findstr :4321
taskkill /PID <PID> /F
```

#### "Cannot find package '@astrojs/...'"

**Cause**: Astro integrations not installed

**Fix**: Reinstall dependencies (see "Module not found" above)

#### Red squiggly lines in VS Code

**You're seeing**: TypeScript errors or warnings in your editor  
**Cause**: Editor's TypeScript server needs to catch up

**Fix**:

```bash
# Generate fresh types
pnpm run check

# Then restart TypeScript in VS Code:
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### Still stuck?

1. **Check FAQ**: [Getting Started FAQ](./faq/)
2. **Review Phase 4**: [Skeleton Implementation Guide](../implementation-guides/completed/phase-4-skeleton/)
3. **Search Issues**: Check your repo's GitHub Issues
4. **Ask for Help**: Open a GitHub Discussion on your repo

## 💡 Pro Tips

### Hot Reload

**Save any file → instant update.** No restart needed.

**What triggers reload:**

- `.astro`, `.ts`, `.js`, `.css` files
- Content collections

**What requires restart:**

- Config files (`astro.config.mjs`, `src/styles/global.css`)
- New dependencies

### Design Tokens

**Edit once → change everywhere.** Colors, typography, and spacing are defined in `tokens/` and compiled to CSS variables.

**To customize:**

```bash
# 1. Edit tokens/semantic.json (or tokens/base.json)
# 2. Save the file
# 3. Changes apply automatically (dev server auto-reloads)

# For production builds, tokens compile automatically:
pnpm run build
```

### Path Aliases

**Clean imports → no more `../../`** Import from anywhere using absolute paths:

```typescript
import Button from '@/components/atoms/Button.astro';
import { formatDate } from '@/utils/date';
import type { Post } from '@/types/content';
```

**Available aliases:**

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@utils/*` → `src/utils/*`

### Dark Mode

**Respects system preferences → zero config.** Toggle it by changing your OS theme.

**To test:**

- **macOS**: System Preferences → General → Appearance
- **Windows**: Settings → Personalization → Colors
- **Linux**: Depends on desktop environment

## 🎉 You're Ready

Your local development environment is set up and running. You can now:

- ✅ View the template at `localhost:4321`
- ✅ Make changes and see them live
- ✅ Explore the codebase
- ✅ Start customizing

**Next**: Choose your path above and let's build.
