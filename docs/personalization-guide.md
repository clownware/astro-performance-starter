# Personalization Guide

After cloning, update these files to make the template yours.
Time to complete: ~15 minutes.

---

## Required (site won't make sense without these)

### 1. `src/config.ts`

| Field | What it controls |
|-------|-----------------|
| `title` | Browser tab, meta tags, OG tags |
| `author` | Footer, meta tags |
| `github` | Header icon, footer link, CTA buttons |
| Social links | Set to `""` to hide any you don't use |

Optional fields: `docs` (enables "View Docs" CTA), `demo`, `pagespeed` (enables live score badge on homepage).

### 2. `src/content/bio/default.mdx`

Your name, title, location, skills, and social links. The About page pulls from this file — change it once and every surface updates.

- **Frontmatter**: name, title, location, avatar, social links, skills by category
- **MDX body**: "About Me" and "Current Focus" sections rendered on the About page

### 3. `src/content/experience/*.mdx`

Replace the demo entries with your actual work history. Delete entries you don't need. Each file is a separate job with:

- Title, company, location, dates
- Description and highlights
- Technologies (rendered as badges)
- `order` field controls sort order (1 = most recent)

### 4. Images

| File | What to replace |
|------|----------------|
| `src/content/bio/default.mdx` (`avatar:` field) | Your photo — point it at an image in `src/assets/` (rendered on the About page) |
| `public/logo.svg` | Your logo or wordmark (used in header) |

---

## Optional (enhance but not required)

### 5. `tokens/base.json`

Brand colors — update the primary and secondary palettes. Changes propagate to all components automatically, including dark mode. Run `pnpm run tokens:build` after editing (or it runs automatically on next `dev`/`build`).

### 6. `src/content/navigation/header.json`

Add, remove, or reorder navigation items. The GitHub URL should match `src/config.ts`.

### 7. `src/content/blog/`

Replace demo posts with your own, or keep them as documentation while you add new ones. Each post is a directory with an MDX file and optional cover images.

Blog schema supports: title, description, date, tags, technologies, cover/card images, related posts. See `src/content.config.ts` for the full Zod schema.

### 8. `src/content/projects/`

Replace demo projects with your own case studies. The existing "Building This Template" entry demonstrates the full schema — keep it as a reference or replace it.

### 9. `SITE_URL` environment variable

Set `SITE_URL` (in `.env` locally; in your platform's settings for deploys) to your production domain — `astro.config.mjs` derives `site` from it, and production builds fail without it. This controls canonical URLs, sitemap generation, and OG image paths. The shipped GitHub Pages workflow sets it automatically.

---

## Quick verification

After personalizing, run the quality checks:

```bash
pnpm run quality        # Format + lint + type-check
pnpm run build          # Full production build
pnpm run preview        # Preview the built site locally
```

If everything passes, you're ready to deploy.
