---
title: 'Quick Track: Deploy Your First Site'
description: >-
  The fastest way to get a personalized version of this {{versions.astro}}
  starter deployed
lastUpdated: true
tableOfContents: true
pagefind: true
---

Welcome! This guide is for users who want to quickly deploy a personalized version of this Astro \{\{versions.astro}} starter template without diving deep into all the phase guides immediately. We'll focus on the **absolute minimum** files you need to touch. First things first:

```bash
# 1. Create your project from the template
pnpm create astro@latest my-site --template your-username/astro-performance-starter

# 2. Navigate into the project
cd my-site

# 3. Install dependencies
pnpm install

# 4. Build the design tokens (required first time)
pnpm run build:tokens

# 5. Start the development server
pnpm run dev
```

Our goal is to get your site live with your own basic information. For detailed explanations and advanced configurations, please refer to the individual phase guides in the `implementation-guides` directory.

## The Four Key Areas to Personalize

To get a unique site deployed, you'll primarily interact with these areas. We're assuming you're using Cloudflare Pages for deployment as recommended in our [Phase 10 Deployment Guide](implementation-guides/05-deployment-phase-10-deployment/).

1. **Site-Wide Configuration (`astro.config.mjs`)**
   * **File**: `astro.config.mjs` (in the project root)
   * **Why**: This file tells \{\{versions.astro}} your site's URL, which is crucial for SEO, sitemaps, and correct asset linking.
   * **Action**:
     * Open `astro.config.mjs`.
     * Find the `site` property within `defineConfig`.
     * Change the placeholder URL to your actual domain (e.g., `https://your-domain.com`). If you don't have a domain yet, you can use the Cloudflare Pages URL you'll get after deployment (e.g., `https://your-project.pages.dev`).

2. **Main Page Content (e.g., `src/pages/index.astro`)**
   * **File**: `src/pages/index.astro` (or the primary landing page of your site)
   * **Why**: This is your homepage content.
   * **Action**:
     * Open `src/pages/index.astro`.
     * Modify the main heading, introductory text, and any other content to reflect your project or personal brand.
     * Look for placeholder text like "Welcome to \{\{versions.astro}} Starter" and replace it.

3. **Global Layout & Metadata (e.g., `src/layouts/BaseLayout.astro` or `src/components/common/SiteMetadata.astro`)**
   * **File(s)**: This might be in a layout file like `src/layouts/BaseLayout.astro` (often imported by pages) or a dedicated metadata component.
   * **Why**: This controls your site's title, meta description, social sharing information, and potentially the favicon.
   * **Action**:
     * Identify the main layout file used by `index.astro`.
     * Update the `<title>` tag, `<meta name="description">`, and any Open Graph tags (`og:title`, `og:description`, etc.) with your site's information.
     * Replace `public/favicon.svg` (and other favicon formats if present) with your own site icon.

4. **Deployment Configuration (e.g., `wrangler.toml` for Cloudflare Pages)**
   * **File**: `wrangler.toml` (if deploying to Cloudflare Pages, as recommended)
   * **Why**: This file configures your Cloudflare Pages project, including its name, which forms part of its default URL.
   * **Action**:
     * Open `wrangler.toml`.
     * Change the `name` property (e.g., `name = "your-project-name"`) to your desired Cloudflare Pages project name. This will affect the default URL (e.g., `your-project-name.pages.dev`).
     * Ensure your Cloudflare Account ID is correctly set up in your GitHub repository secrets (`CLOUDFLARE_ACCOUNT_ID`) as per the deployment guide.

## Next Steps After Personalization

1. **Commit your changes**: `git add . && git commit -m "Initial personalization"`
2. **Push to your repository**: `git push origin master`
3. **Follow Deployment Guide**: Ensure you've followed the steps in [Phase 10: Deployment & Monitoring](../implementation-guides/05-deployment-phase-10-deployment/) to connect your repository to Cloudflare Pages (or your chosen hosting provider).

That's it! With these changes, your deployed site will have your basic branding and content.

## Beyond the Quick Track

This starter template is packed with features and best practices. Once you're comfortable, explore:

* **Content Collections**: `src/content/` for managing blog posts, projects, etc.
* **Design Tokens**: `tokens/` for customizing the look and feel extensively.
* **Component Patterns**: `docs/patterns/` for building new UI elements with \{\{versions.tailwindcss}}.
* **Full Phase Guides**: The `docs/implementation-guides/` directory for in-depth understanding of each setup phase.

**Improving Documentation Discoverability**: As this project's documentation grows, we plan to explore options like a dedicated documentation site with features such as advanced search and collapsible sections to make navigating the detailed guides easier. For now, the phase guides provide a good overview of all available documentation.
