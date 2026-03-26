---
title: 'Quick Deploy'
description: >-
  Personalize your Astro site and deploy to production in 45-75 minutes
lastUpdated: true
tableOfContents: true
pagefind: true
---

Ready to make the template your own and deploy to production? This guide walks you through personalization, deployment, and verification in under an hour.

**Prerequisites**: You should have completed the [Launch Demo](./launch-demo/) and have the site running locally.

## 🚦 Pre-Deployment Readiness Check

Before starting this guide, ensure you have:

- [ ] Completed [Launch Demo](./launch-demo/) successfully
- [ ] Site runs locally without errors (`pnpm run dev`)
- [ ] No console errors in browser (F12 → Console)
- [ ] `pnpm run build` succeeds locally
- [ ] Git basics understood (commit, push, remote)
- [ ] Hosting platform account created (or will create during guide)

**Why this matters:** Deploying a broken local site wastes time. Fix issues locally first.

**Test your local build:**

```bash
pnpm run build && pnpm run preview  # Build then serve production build locally
```

Open <http://localhost:4321> - if this works, you're ready to deploy.

## 🎯 What You'll Accomplish

### Time Required: 45-75 minutes (first-time users)

- [x] Site personalized with your branding
- [x] Deployed to production
- [x] Live at your custom URL
- [x] Verified and tested

## ✅ Prerequisites

### Required

- [ ] **Completed [Launch Demo](./launch-demo/)** - Local site running successfully
- [ ] **GitHub account** ([sign up](https://github.com/join))
- [ ] **Hosting platform account** (see Platform Selection below)
- [ ] **Basic Git knowledge** (commit, push)

### Platform Selection

**Choose your hosting platform before starting:**

| Platform | Best For | Free Tier | Setup Time | Auto HTTPS | Recommendation |
|----------|----------|-----------|------------|------------|----------------|
| **Cloudflare Pages** ⭐ | Performance, global CDN | Unlimited sites | 10-15 min | ✅ Instant | **Best for most** |
| **Vercel** | Next.js ecosystem, teams | 100GB/month | 10-15 min | ✅ Instant | Great for existing Vercel users |
| **Netlify** | Forms, split testing, CMS | 100GB/month | 10-15 min | ✅ Instant | Good for marketing sites |

:::note[This Guide Uses Cloudflare Pages]
We recommend Cloudflare Pages for optimal performance. For other platforms, see [Platform Deployment Guides](../implementation-guides/active-phases/phase-10-deployment/).

**Why Cloudflare Pages?**

- Generous free tier (unlimited sites)
- Excellent global performance
- Simple setup process
- Built-in analytics
- Perfect for static sites

:::

## 📦 Understanding Your Build

When you run `pnpm run build` (or `pnpm run build:full`), here's what happens:

1. **Token Compilation** (`build:tokens`)
   - Reads `tokens/base.json` and `tokens/semantic.json`
   - Generates CSS custom properties
   - Outputs to `src/styles/tokens.css`

2. **Astro Build** (`astro build`)
   - Compiles `.astro` components to HTML
   - Bundles JavaScript (only interactive islands)
   - Optimizes CSS (removes unused styles)
   - Processes images (AVIF + WebP)
   - Generates sitemap

3. **Output** (`dist/`)
   - Static HTML files
   - Optimized assets (CSS, JS, images)
   - Public files (favicon, fonts, etc.)

**The `dist/` folder is what gets deployed** - not your source code.

:::tip[Automated Token Compilation]
The template's `build` script automatically runs `build:tokens` first, so you don't need to chain commands manually.

**Available build commands:**

```bash
pnpm run build          # Full build (tokens + Astro) - automated
pnpm run preview        # Serve already-built dist/ locally
pnpm run preview:build  # Build then serve (convenience alias)
```

:::

## 📋 Deployment Checklist

Copy this into your notes and check off as you go:

```markdown
- [ ] Prerequisites verified
- [ ] Platform account created
- [ ] Repository created on GitHub
- [ ] Site configuration updated
- [ ] Metadata personalized
- [ ] Favicons replaced
- [ ] Design tokens customized (optional)
- [ ] Changes committed to Git
- [ ] Pushed to GitHub
- [ ] Connected to hosting platform
- [ ] Build successful
- [ ] Live site verified
- [ ] Mobile tested
```

## 🎨 Step 1: Personalize Your Site (20-30 min)

### 1.1 Site Configuration

**File**: `astro.config.mjs` (project root)  
**Why**: Defines your site URL for SEO, sitemaps, and asset linking  
**Lines**: ~15-20

#### Before

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://example.com', // ← Change this
  // ...
});
```

#### After

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://your-domain.com', // Your actual domain
  // OR use Cloudflare Pages URL initially:
  // site: 'https://your-project.pages.dev',
  // ...
});
```

#### Action Steps

1. Open `astro.config.mjs` in your editor
2. Find the `site` property (around line 15-20)
3. Replace with your domain or `https://your-project.pages.dev`
4. Save the file

:::tip[Don't Have a Domain Yet?]
Use a placeholder like `https://my-project.pages.dev` for now. You'll update it after deployment with your actual Cloudflare Pages URL.
:::

### 1.2 Site Metadata & SEO

**File**: `src/layouts/BaseLayout.astro`  
**Why**: Controls site title, description, and social sharing  
**Lines**: ~5-30 (frontmatter and head section)

#### Quick Checklist: What to Update

Open `src/layouts/BaseLayout.astro` and find these lines:

- [ ] **Line ~8**: Default `title` in Props interface → `'Your Site Name'`
- [ ] **Line ~9**: Default `description` → `'Your site description'`
- [ ] **Line ~15**: `<title>` tag → `Your Brand`
- [ ] **Line ~17**: `<meta name="description">` content
- [ ] **Lines ~20-25**: Open Graph tags
- [ ] **Lines ~27-30**: Twitter Card tags

<details>
<summary>Show full diff with before/after</summary>

#### What to Change

```diff
---
// src/layouts/BaseLayout.astro
interface Props {
-  title?: string = 'Astro Starter Template';
+  title?: string = 'Your Site Name';
-  description?: string = 'A performance-focused Astro starter';
+  description?: string = 'Your site description for SEO';
  // ...
}

const { title, description } = Astro.props;
---

<head>
-  <title>{title} | Astro Starter</title>
+  <title>{title} | Your Brand</title>
  
-  <meta name="description" content="A performance-focused Astro starter template" />
+  <meta name="description" content="Your compelling site description" />
  
  <!-- Open Graph / Facebook -->
-  <meta property="og:title" content={title} />
+  <meta property="og:title" content="Your Site Name" />
-  <meta property="og:description" content={description} />
+  <meta property="og:description" content="Your site description" />
  
  <!-- Twitter -->
-  <meta property="twitter:title" content={title} />
+  <meta property="twitter:title" content="Your Site Name" />
-  <meta property="twitter:description" content={description} />
+  <meta property="twitter:description" content="Your site description" />
</head>
```

</details>

:::caution[Keep Descriptions Concise]

- **Title**: 50-60 characters max
- **Description**: 150-160 characters max
- These appear in search results and social shares

:::

### 1.3 Visual Branding

#### Favicon Replacement

**Files**: `public/favicon.svg` (and variants)  
**Why**: Your site icon in browser tabs and bookmarks

**Specifications:**

- **SVG**: Recommended, scalable, supports dark mode
- **PNG**: Fallback, 32×32px minimum, 512×512px ideal
- **ICO**: Legacy support, 16×16 and 32×32 sizes

#### Action Steps

1. **Create your favicon** (use [Favicon.io](https://favicon.io/) or design tool)
2. **Replace** `public/favicon.svg` with your SVG
3. **(Optional)** Add `public/favicon.ico` for legacy browsers
4. **(Optional)** Add `public/favicon-32x32.png` and `public/favicon-16x16.png`

**Verify:**

```bash
# Check files exist
ls -la public/favicon*

# Should show:
# favicon.svg (required)
# favicon.ico (optional)
# favicon-32x32.png (optional)
```

:::tip[Dark Mode Favicon Implementation]

**1. Create adaptive SVG** (`public/favicon.svg`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    @media (prefers-color-scheme: dark) {
      .icon { fill: white; }
    }
    @media (prefers-color-scheme: light) {
      .icon { fill: black; }
    }
  </style>
  <circle class="icon" cx="16" cy="16" r="14"/>
</svg>
```

**2. Update BaseLayout.astro** to reference it:

Open `src/layouts/BaseLayout.astro` and add these lines in the `<head>` section (around line 12-15):

```astro
<!-- src/layouts/BaseLayout.astro -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="alternate icon" href="/favicon.ico" />
  
  <title>{title}</title>
  <!-- ... rest of head -->
</head>
```

:::

#### Logo & Brand Colors (Optional)

**Files**:

- `tokens/semantic.json` - Brand colors
- `src/components/structural/Header.astro` - Logo text

**Quick Color Change:**

```json
// tokens/semantic.json
{
  "color": {
    "brand": {
      "primary": { 
        "value": "#your-primary-color",
        "description": "Primary brand color"
      },
      "secondary": { 
        "value": "#your-secondary-color",
        "description": "Secondary brand color"
      }
    }
  }
}
```

**Rebuild tokens:**

```bash
pnpm run build:tokens  # Compile tokens only
# Or rebuild everything:
pnpm run build
```

**Update logo text:**

```astro
<!-- src/components/structural/Header.astro -->
<a href="/" class="logo">
-  Astro Starter
+  Your Brand
</a>
```

### 1.4 Verify Changes Locally

Before deploying, verify everything looks correct:

```bash
# Restart dev server
pnpm run dev

# Open http://localhost:4321
```

**Verification checklist:**

- [ ] **New title** appears in browser tab
- [ ] **New favicon** displays
- [ ] **Updated metadata** (view page source: Ctrl/Cmd+U)
- [ ] **Logo text** updated (if changed)
- [ ] **Colors** updated (if changed)
- [ ] **No console errors** (F12 → Console)

## 🚀 Step 2: Deploy to Production (15-20 min)

### 2.1 Save Your Changes (Git)

**Check your Git status first:**

```bash
# Check if Git is already initialized
git status

# If you see "not a git repository", initialize it:
git init
```

#### If you already have commits

```bash
git add .
git commit -m "feat: personalize site configuration and branding"
git push
```

#### If this is your first commit

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: personalize site configuration and branding"
```

**Create GitHub repository:**

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `my-astro-site`)
3. Choose **Public** or **Private**
4. **Do NOT** initialize with README (you already have files)
5. Click **Create repository**

**Connect and push:**

```bash
# Add remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

:::tip[Commit Message Format]
This template uses [Conventional Commits](https://www.conventionalcommits.org/):

- **`feat:`** - New features
- **`fix:`** - Bug fixes
- **`docs:`** - Documentation changes
- **`style:`** - Code style changes
- **`refactor:`** - Code refactoring

:::

### 2.2 Platform Configuration

#### Option A: Cloudflare Pages (Recommended)

##### Step 1: Create Cloudflare Account

1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Enter email and create password
3. Verify email address

##### Step 2: Connect GitHub Repository

1. In Cloudflare dashboard, navigate to **Workers & Pages**
2. Click **Create Application**
3. Select **Pages** tab
4. Click **Connect to Git**
5. Choose **GitHub** and authorize Cloudflare
6. Select your repository from the list

##### Step 3: Configure Build Settings

```text
Project name: your-project-name
Production branch: main
Build command: pnpm run build
Build output directory: dist
Root directory: (leave empty)
Environment variables: (see below if needed)
```

:::note[Build Command Options]
Use `pnpm run build` (tokens are automatically compiled first).
:::

##### Step 4: Deploy

1. Click **Save and Deploy**
2. Wait 2-5 minutes for build to complete
3. Your site will be live at `https://your-project-name.pages.dev`

##### Step 5: Update Site URL & Redeploy

Your site is now live, but it's using the placeholder URL from Step 1. Let's fix that:

1. **Copy your actual URL** from Cloudflare (e.g., `https://my-project-abc.pages.dev`)

2. **Update config:**

   ```js
   // astro.config.mjs
   export default defineConfig({
     site: 'https://my-project-abc.pages.dev', // ← Your actual Cloudflare URL
   });
   ```

3. **Commit and push:**

   ```bash
   git add astro.config.mjs
   git commit -m "fix: update site URL with Cloudflare Pages domain"
   git push
   ```

4. **Wait for rebuild** (1-2 min) - Cloudflare auto-deploys on push

5. **Verify** the new build succeeded in Cloudflare dashboard

:::note[Why this step?]
Astro uses `site` for generating sitemaps, canonical URLs, and `og:image` paths. Without the correct URL, social shares and SEO won't work optimally.
:::

### 2.3 Environment Variables (Optional)

<details>
<summary><strong>When and How to Use Environment Variables</strong></summary>

**When you need environment variables:**

- API keys for third-party services
- Analytics tracking IDs
- CMS endpoints
- Feature flags

**Astro v5.x Type-Safe Environment Variables:**

Astro v5 includes built-in type-safe environment variable handling via `astro:env`.

**1. Define in `astro.config.mjs`:**

```js
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: import.meta.env.SITE_URL || 'https://example.com',
  experimental: {
    env: {
      schema: {
        SITE_URL: envField.string({
          context: 'server',
          access: 'public',
          default: 'https://example.com',
        }),
        API_KEY: envField.string({
          context: 'server',
          access: 'secret',
        }),
      },
    },
  },
});
```

**2. Add to your hosting platform:**

**Cloudflare Pages:**

- Go to **Settings** → **Environment Variables**
- Add `SITE_URL`, `API_KEY`, etc.
- Separate variables for **Production** and **Preview** environments

**Vercel:**

- Go to **Settings** → **Environment Variables**
- Add variables with environment selection (Production, Preview, Development)

**Netlify:**

- Go to **Site settings** → **Environment variables**
- Add variables (applies to all deploys by default)

**3. Use in your code:**

```astro
---
import { SITE_URL, API_KEY } from 'astro:env/server';

const response = await fetch(`${API_KEY}/endpoint`);
---
```

**Security best practices:**

- Never commit `.env` files to Git (already in `.gitignore`)
- Use `access: 'secret'` for sensitive data (API keys, tokens)
- Use `access: 'public'` for non-sensitive config (site URL, feature flags)

</details>

#### Option B: Vercel

See [Vercel Deployment Guide](../implementation-guides/active-phases/phase-10-deployment/#vercel) for detailed instructions.

**Quick steps:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Build command**: `pnpm run build`
4. **Output directory**: `dist`
5. Deploy

#### Option C: Netlify

See [Netlify Deployment Guide](../implementation-guides/active-phases/phase-10-deployment/#netlify) for detailed instructions.

**Quick steps:**

1. Go to [app.netlify.com/start](https://app.netlify.com/start)
2. Connect to GitHub
3. **Build command**: `pnpm run build`
4. **Publish directory**: `dist`
5. Deploy

<details>
<summary><strong>More Platform Options</strong></summary>

#### Option D: Render

**Best for:** Full-stack apps, databases, background workers

1. Go to [render.com](https://render.com/)
2. Click **New** → **Static Site**
3. Connect GitHub repository
4. **Build command**: `pnpm run build`
5. **Publish directory**: `dist`
6. Deploy

**Pros:** Free SSL, global CDN, preview environments

#### Option E: GitHub Pages

**Best for:** Open source projects, documentation sites

**Setup with GitHub Actions:**

1. **Create `.github/workflows/deploy.yml`:**

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v3
         - uses: actions/setup-node@v4
           with:
             node-version: '22'
             cache: 'pnpm'
         - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - uses: actions/upload-pages-artifact@v3
           with:
             path: dist
     
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/deploy-pages@v4
           id: deployment
   ```

2. **Enable GitHub Pages:**

   - Repo → Settings → Pages
   - Source: GitHub Actions

3. **Update `astro.config.mjs`:**

   ```js
   export default defineConfig({
     site: 'https://username.github.io',
     base: '/repo-name', // Only if not using custom domain
   });
   ```

   **Note:** GitHub Pages requires `base` path if using `username.github.io/repo-name` format.

</details>

### 2.4 Custom Domain (Optional, +15 min)

#### Cloudflare Pages

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions:
   - Add CNAME record pointing to `your-project.pages.dev`
   - Or use Cloudflare nameservers (recommended)
5. Wait for DNS propagation (5-30 minutes)

**Update astro.config.mjs:**

```js
export default defineConfig({
  site: 'https://yourdomain.com', // ← Your custom domain
  // ...
});
```

**Commit and push:**

```bash
git add astro.config.mjs
git commit -m "fix: update site URL with custom domain"
git push
```

:::tip[SSL Certificate]
Cloudflare automatically provisions SSL certificates for custom domains. Your site will be HTTPS-enabled within minutes.
:::

### 2.5 CI/CD Integration (Optional, Advanced)

<details>
<summary><strong>Custom Deployment Pipelines with GitHub Actions</strong></summary>

**Why use GitHub Actions instead of native Git integration?**

Most platforms (Cloudflare Pages, Vercel, Netlify) automatically deploy when you push to Git. GitHub Actions gives you more control for advanced use cases.

**Use cases for GitHub Actions:**

- **Run tests before deployment** - Prevent broken builds from going live
- **Custom build steps** - Complex preprocessing, code generation
- **Multi-environment deploys** - Staging, preview, production from one workflow
- **Service integrations** - Slack notifications, database migrations, cache invalidation
- **Monorepo deployments** - Deploy multiple projects from one repo

**If you just need "push to deploy," stick with native Git integration.** GitHub Actions adds complexity.

**Setup:**

1. **Create workflow file** `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build site
        run: pnpm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-project-name
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

1. **Add secrets to GitHub:**

   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Add `CLOUDFLARE_API_TOKEN` (get from Cloudflare dashboard)
   - Add `CLOUDFLARE_ACCOUNT_ID` (found in Cloudflare URL)

2. **Get Cloudflare credentials:**

   - **API Token**: Cloudflare dashboard → My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template
   - **Account ID**: In Cloudflare Pages project URL

#### Alternative: Vercel GitHub Integration

Vercel automatically deploys on push without additional configuration. Just connect your repo.

#### Alternative: Netlify GitHub Integration

Netlify also auto-deploys on push. Configure in `netlify.toml`:

```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "9"
```

</details>

## ✓ Step 3: Verify Your Deployment (5-10 min)

### Deployment Checklist

Visit your live site and verify:

- [ ] **Site loads** without errors
- [ ] **Correct title** in browser tab
- [ ] **Correct favicon** displays
- [ ] **Homepage** displays correctly
- [ ] **Example landing page** works (`/examples/landing`)
- [ ] **Dark mode** toggle works
- [ ] **Mobile responsive** (test on phone or DevTools)
- [ ] **No console errors** (F12 → Console)
- [ ] **No 404 errors** for assets

### Performance Check

Run a Lighthouse audit to verify performance:

#### Option 1: Chrome DevTools

1. Open your live site
2. Press F12 → Lighthouse tab
3. Click **Analyze page load**
4. Check scores

#### Option 2: PageSpeed Insights

1. Go to [pagespeed.web.dev](https://pagespeed.web.dev/)
2. Enter your live URL
3. Click **Analyze**

#### Option 3: Accessibility Testing

**WCAG AA Compliance Check:**

1. **WAVE Browser Extension**
   - Install: [wave.webaim.org/extension](https://wave.webaim.org/extension/)
   - Click WAVE icon on your live site
   - Review errors, alerts, and contrast issues

2. **Axe DevTools**
   - Install: [Chrome Web Store](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Open DevTools (F12) → Axe DevTools tab
   - Click **Scan ALL of my page**
   - Fix any critical or serious issues

3. **Lighthouse Accessibility Audit**
   - Already included in Lighthouse (see Option 1)
   - Target: 100/100 score

**Common accessibility checks:**

- [ ] All images have `alt` text
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] Form inputs have labels
- [ ] ARIA attributes used correctly

#### Target Scores (Fresh Deploy)

**These scores assume:**

- No additional content yet
- No third-party scripts (analytics, ads)
- No custom fonts beyond system fonts
- No large images

| Metric | Target | Why This Score |
|--------|--------|----------------|
| **Performance** | 95+ | Astro's static output is blazing fast |
| **Accessibility** | 100 | Semantic HTML + ARIA best practices |
| **Best Practices** | 100 | HTTPS, modern standards, no deprecated APIs |
| **SEO** | 100 | Meta tags, sitemap, semantic structure |

**As you add content, scores will change.** This is normal. Focus on:

- Image optimization (use Astro's `<Image />` component)
- Lazy loading for non-critical content
- Keeping third-party scripts minimal

**Common score impacts:**

- **Performance drops to 85-90** - After adding 10+ images, custom fonts, or analytics
- **Accessibility drops to 95-98** - Missing alt text on new images, contrast issues in custom designs
- **Best Practices drops to 95** - Third-party scripts (Google Analytics, ad networks)
- **SEO stays 100** - Unless you forget meta descriptions or have broken internal links

**Goal:** Keep Performance > 85, everything else > 95 as you add content.

### Test on Multiple Devices

**Quick Wins:**

1. **Chrome DevTools Device Mode** (Ctrl/Cmd+Shift+M)
   - Test iPhone 14 Pro, Pixel 7, iPad Pro
   - Toggle device toolbar, rotate orientation
   - **Good enough for most cases**

2. **Free Real Device Testing**
   - [LambdaTest](https://www.lambdatest.com/) - 100 minutes/month free
   - [BrowserStack](https://www.browserstack.com/) - Free trial, then $29-99/month
   - **Use if you need cross-browser testing on real devices**

3. **Your Own Devices** (Recommended)
   - iOS Safari (iPhone/iPad)
   - Android Chrome
   - Desktop browsers (Chrome, Firefox, Safari)
   - **Most reliable for catching real issues**

**Test Checklist:**

- [ ] Navigation works on mobile
- [ ] Dark mode toggle accessible
- [ ] Text readable without zooming
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44×44px
- [ ] Forms usable on mobile (if applicable)

## 🔎 Advanced Configuration

<details>
<summary><strong>Staying Updated with Astro Releases</strong></summary>

**Current version:** Astro v5.x (as of 2025)

**Monitoring updates:**

Astro releases new versions regularly. Stay informed to benefit from improvements and avoid breaking changes.

**Update strategy:**

1. **Follow release channels:**
   - [Astro changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)
   - [Astro blog](https://astro.build/blog/) for major announcements
   - [@astrodotbuild](https://twitter.com/astrodotbuild) on Twitter/X

2. **Before upgrading:**
   - Review [Astro upgrade guide](https://docs.astro.build/en/guides/upgrade-to/)
   - Check for breaking changes in the changelog
   - Test in a separate branch first

3. **Safe upgrade process:**
   - Create a new branch: `git checkout -b upgrade-astro`
   - Update dependencies: `pnpm update astro`
   - Run build: `pnpm run build`
   - Test locally: `pnpm run preview`
   - Fix any breaking changes
   - Merge when stable

**Staying updated:**

```bash
# Check for updates
pnpm outdated

# Update Astro (minor versions)
pnpm update astro

# Update all dependencies
pnpm update

# Major version upgrade (test first!)
pnpm add astro@latest
```

</details>

## 🆘 Troubleshooting

### Build Fails on Platform

#### Error: `pnpm: command not found`

**Cause:** Platform doesn't have pnpm installed

**Fix:** Update build command to install pnpm first:

```bash
npm install -g pnpm && pnpm run build
```

Or use npm instead:

```bash
npm install && npm run build
```

#### Error: `build:tokens failed`

**Cause:** Missing token files in repository

**Fix:**

1. Verify `tokens/base.json` and `tokens/semantic.json` exist locally
2. Ensure they're committed to Git:

```bash
git add tokens/
git commit -m "fix: add token files"
git push
```

#### Error: `Module not found: @/components/...`

**Cause:** Path aliases not resolved

**Fix:** Ensure `tsconfig.json` has proper paths configuration (should be default in template). If missing, add:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Site Deploys But Shows Blank Page

#### Cause 1: Incorrect `site` URL

**Fix:** Verify URL in `astro.config.mjs` matches deployment URL exactly (including `https://`)

```js
// ✅ Correct
site: 'https://my-project.pages.dev'

// ❌ Incorrect
site: 'my-project.pages.dev'  // Missing https://
site: 'http://my-project.pages.dev'  // Wrong protocol
```

#### Cause 2: Build output directory mismatch

**Fix:** Ensure platform build settings use `dist` as output directory

#### Cause 3: Base path issue

**Fix:** If deploying to subdirectory, add `base` to config:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://yourdomain.com',
  base: '/subdirectory', // Only if deploying to subdirectory
});
```

### Images Not Loading

#### Cause: Incorrect asset paths

**Fix:** Use Astro's image component and relative imports:

```astro
---
// ✅ Correct
import { Image } from 'astro:assets';
import myImage from '@/assets/image.jpg';
---
<Image src={myImage} alt="Description" />

<!-- ❌ Incorrect -->
<img src="/src/assets/image.jpg" alt="Description" />
```

### Styles Look Broken

#### Cause: Design tokens not built

**Fix:** The `build` script automatically compiles tokens. If styles are still broken:

```bash
# Test locally first
pnpm run build
pnpm run preview
```

If it works locally but not on the platform, check:

- Build logs for token compilation step
- Ensure `tokens/` directory is committed to Git
- Verify platform is using `pnpm run build` (not a custom command)

### Fonts Not Loading

#### Cause: Font files not in public directory or incorrect paths

**Fix:** Verify font imports in `BaseLayout.astro`:

```astro
<link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin />
```

Ensure font files are in `public/fonts/` directory.

### Still Stuck?

1. **Check build logs** on your platform dashboard for detailed error messages
2. **Review deployment guide**: [Phase 10: Deployment](../implementation-guides/active-phases/phase-10-deployment/)
3. **Common issues**: [FAQ](./faq/)
4. **Search existing issues**: [GitHub Issues](https://github.com/clownware/astro-performance-starter/issues)
5. **Ask for help**: [GitHub Discussions](https://github.com/clownware/astro-performance-starter/discussions)

## 🎓 What's Next?

Now that you're deployed, choose your path based on your goals:

### Path A: Content-First (Recommended)

**Best for**: Blogs, portfolios, marketing sites

1. [Creating Your First Page](./creating-your-first-page/)
2. [Content Collections Guide](../patterns/content-collections/)
3. Add blog posts or projects
4. Customize page layouts

**Time**: 1-2 hours to first content page

### Path B: Design Customization

**Best for**: Unique branding, custom themes

1. [Design Tokens Guide](../development/how-to-use-design-tokens/)
2. Customize colors, typography, spacing
3. Create custom components
4. Build design system

**Time**: 2-4 hours for basic customization

### Path C: Advanced Features

**Best for**: Complex sites, interactive elements

1. [Component Patterns](../patterns/component-patterns/)
2. [Phase 5: Components](../implementation-guides/active-phases/phase-5-components/)
3. Add interactive islands
4. Implement advanced features

**Time**: 4-8 hours for advanced features

### Path D: Full Implementation

**Best for**: Production-ready, feature-complete sites

1. [Implementation Guide Master Index](/implementation-guides/) — work through phases sequentially
2. Complete all 12 phases
3. Production optimization

**Time**: 2-6 weeks depending on track

## 📊 Time Breakdown

**Actual times for this guide:**

| Phase | Time |
|-------|------|
| Setup & Personalization | 20-30 min |
| Git & Repository Setup | 5-10 min |
| Platform Deployment | 10-20 min |
| Verification & Testing | 5-10 min |
| Custom Domain (optional) | +15 min |
| **Total** | **45-75 min** |

## 🎉 Congratulations

Your site is now live! You've successfully:

- ✅ **Personalized** your branding
- ✅ **Deployed** to production
- ✅ **Verified** performance
- ✅ **Tested** across devices

### Share Your Success

We'd love to see what you've built:

- **GitHub** - Open a [Show & Tell discussion](https://github.com/clownware/astro-performance-starter/discussions)
- **Discord** - Share in [Astro Discord](https://discord.gg/astro)

### Keep Building

Your deployment is just the beginning. Explore the [implementation guides](../implementation-guides/), customize the [design system](../development/how-to-use-design-tokens/), and let's build something amazing.
