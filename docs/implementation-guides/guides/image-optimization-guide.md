---
title: Image Optimization Guide
lastUpdated: true
description: >-
  Comprehensive guide to image optimization strategies for Astro projects,
  focusing on performance and visual quality
tableOfContents: true
pagefind: true
---

> 🖼️ **Purpose**: Comprehensive asset pipeline for optimal image delivery with automated optimization tools

## Overview

This guide covers image optimization strategies for Astro projects, focusing on performance while maintaining visual quality. The template includes automated scripts for analysis and optimization to help you achieve optimal image performance.

## Quick Start

### 1. Analyze Current Images

```bash
# Analyze all images in your project
pnpm run images:analyze
```

This command will:

- Scan all images in `src/` and `public/` directories
- Show current dimensions and file sizes
- Categorize images by path heuristics (`hero`, `content`, `thumbnail`, `avatar`, `icon`, `logo`, `other` — see `categorizeImage()` in `scripts/src/optimize-images.ts`)
- Provide optimization recommendations

### 2. Interactive Optimization

```bash
# Optimize images interactively with safety features
pnpm run images:optimize
```

This command will:

- Show preview of each optimization
- Ask for confirmation before processing
- Create automatic backups in `.backups/images/originals/`
- Provide real-time feedback on size reductions

## Image Format Selection

### Format Decision Matrix

| Format | Use Case | Browser Support | Compression |
|--------|----------|-----------------|-------------|
| **AVIF** | Primary choice for photos | Modern (90%+) | Best (50-80% smaller than JPEG) |
| **WebP** | Fallback for older browsers | Excellent (97%+) | Excellent (25-50% smaller than JPEG) |
| **JPEG** | Universal fallback | Universal | Good |
| **PNG** | Images with transparency | Universal | Poor for photos, good for graphics |
| **SVG** | Icons, logos, illustrations | Universal | Best for vectors |

### Astro's Built-in Optimization

Astro converts formats at build time through Sharp. Two components are involved, and they differ in what they emit:

- `<Image>` (from `astro:assets`) emits **one** `<img>` in a single output format (`format` prop).
- `<Picture>` emits a `<picture>` element with one `<source>` per entry in `formats` plus a fallback `<img>`.

The starter's `src/components/atoms/Image.astro` wraps `<Image>` and defaults to **single-format AVIF** (`resolveImageFormat()` in `src/utils/resolveImageFormat.ts`, [ADR-030](/adr/030-image-optimisation-defaults/)) with `widths` `[320, 640, 1024]`, `sizes="100vw"`, lazy loading and async decoding. Prefer the atom for content images; reach for `<Picture>` only when you need a multi-format fallback chain.

```astro
---
import Image from '@/components/atoms/Image.astro';
import heroImage from '@/assets/images/hero.jpg';
---

<!-- Shipped atom: AVIF by default, responsive widths, lazy unless told otherwise -->
<Image 
  src={heroImage}
  alt="Descriptive alt text"
  widths={[480, 768, 1200, 1920]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  quality="high"
  loading="eager"
/>
```

## Optimization Pipeline

### 1. Source Image Guidelines

**Recommended source image specifications:**

- **Resolution**: Keep high-quality originals (1024px+ for content images)
- **Format**: PNG or high-quality JPEG for source files
- **Color space**: sRGB
- **Dimensions**: Even numbers preferred

**Size Categories** (the `dimensionGuidelines` table in `scripts/src/optimize-images.ts`):

- **Hero images**: 1200-1920px wide
- **Content images**: 800-1200px wide
- **Thumbnails**: 200-400px wide
- **Avatars**: 100-200px wide
- **Icons**: 180-512px (touch icons, favicons)
- **Logos**: 400-800px wide

### 2. Astro Configuration

```javascript
// astro.config.mjs (shipped excerpt — see ADR-030 for the rationale)
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels max
      },
    },
    responsive: {
      globalStyles: true,
      layout: "constrained",
    },
    domains: [],
    remotePatterns: [],
  },
});
```

### 3. Component Patterns

These are illustrative wrappers. They use `format` (singular) because `<Image>` emits one format; the starter's own wrapper is `src/components/atoms/Image.astro`.

#### Hero Images

```astro
---
// components/HeroImage.astro (illustrative)
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  priority?: boolean;
}

const { src, alt, priority = false } = Astro.props;
---

<Image 
  src={src}
  alt={alt}
  widths={[768, 1200, 1920]}
  sizes="100vw"
  format="avif"
  quality={85}
  loading={priority ? 'eager' : 'lazy'}
  decoding={priority ? 'sync' : 'async'}
  class="w-full h-auto"
/>
```

#### Content Images

```astro
---
// components/ContentImage.astro (illustrative)
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

const { src, alt, caption } = Astro.props;
---

<figure class="my-8">
  <Image 
    src={src}
    alt={alt}
    widths={[480, 768, 1200]}
    sizes="(max-width: 768px) 100vw, 768px"
    format="avif"
    quality={78}
    loading="lazy"
    class="rounded-lg"
  />
  {caption && (
    <figcaption class="text-sm text-muted-foreground mt-2 text-center">
      {caption}
    </figcaption>
  )}
</figure>
```

#### Thumbnail Grid

```astro
---
// components/ThumbnailGrid.astro (illustrative)
import { Image } from 'astro:assets';

export interface Props {
  images: Array<{
    src: ImageMetadata;
    alt: string;
    href: string;
  }>;
}

const { images } = Astro.props;
---

<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  {images.map((image) => (
    <a href={image.href} class="group">
      <Image 
        src={image.src}
        alt={image.alt}
        widths={[300, 600]}
        sizes="(max-width: 768px) 50vw, 33vw"
        format="avif"
        quality={75}
        loading="lazy"
        class="rounded-lg group-hover:opacity-90 transition-opacity"
      />
    </a>
  ))}
</div>
```

## Optimization Scripts

### Analysis Script

The `images:analyze` script provides comprehensive image analysis:

```bash
pnpm run images:analyze
```

**Features:**

- Scans all images in project
- Shows current dimensions and file sizes
- Categorizes by usage type
- Provides optimization recommendations
- Estimates size reduction potential

**Example Output:**

```bash
📊 Image Analysis Results
Total images: 7
Total size: 6.8 MB

📁 CONTENT Images (800-1200px wide)
   🖼️ src/content/blog/images/code-snippet-example.png
      Size: 1.43 MB (1460KB)
      Current: 1024x1024px
      Suggested: 800x600px (content)
```

### Interactive Optimization Script

The `images:optimize` script provides safe, interactive optimization:

```bash
pnpm run images:optimize
```

**Safety Features:**

- ✅ **Automatic backups** to `.backups/images/originals/`
- ✅ **User confirmation** for each image
- ✅ **Preview before optimization** with size estimates
- ✅ **Graceful exit** options (quit anytime)
- ✅ **Error handling** for unsupported formats

**Optimization Process:**

1. **Analysis**: Identifies oversized images
2. **Preview**: Shows current vs suggested dimensions
3. **Confirmation**: User approves each optimization
4. **Backup**: Creates timestamped backup
5. **Optimize**: Resizes using Sharp with quality settings
6. **Report**: Shows actual size reductions achieved

## Performance Targets

### File Size Budgets

There is exactly one **enforced** image budget: **200KB per raster file** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`; SVG is exempt). It is declared in `budgets.json` (`Images (raw, per-file)`, `maxSizeKb: 200`), implemented by `scripts/src/check-image-budget.ts` (`DEFAULT_BUDGET_KB = 200`), and run twice in `ci.yml` as `pnpm run images:gate` — once over the source tree (`public/`, `src/`) and once over the build output (`IMAGE_GATE_ROOTS=dist`). A file over the ceiling fails the build ([ADR-057](/adr/057-image-budget-gate/)). Override locally with `IMAGE_BUDGET_KB=<kb>` for experiments only.

The per-category numbers below are **advisory** warning thresholds from `images:analyze`; they never fail CI.

| Category | Advisory warning (`images:analyze`) | Enforced ceiling (`images:gate`) |
|----------|-------------------------------------|----------------------------------|
| **Hero** | > 200KB → "consider reducing source size" | 200KB |
| **Content** | > 150KB → "consider reducing dimensions" | 200KB |
| **Thumbnail** | > 100KB → "consider reducing dimensions" | 200KB |
| **Logo** | > 100KB → target < 50KB | 200KB |
| **Icon** | > 32KB → touch icons should be < 32KB | 200KB |
| **Avatar / Other** | dimension guidance only | 200KB |

### Dimension Guidelines

| Category | Recommended Dimensions | Max Source Size |
|----------|----------------------|-----------------|
| **Hero** | 1200x675px (16:9) | 1920x1080px |
| **Content** | 800x600px (4:3) | 1200x800px |
| **Thumbnail** | 200x200px (1:1) | 400x400px |
| **Avatar** | 100x100px (1:1) | 200x200px |
| **Icon** | 180x180px (1:1) | 512x512px |
| **Logo** | 400x300px (4:3) | 800x600px |

## Best Practices

### 1. Loading Strategies

```astro
<!-- Hero image: Load immediately (there is no `priority` prop — eager + sync is the whole story) -->
<Image 
  src={heroImage}
  alt="…"
  loading="eager"
  decoding="sync"
/>

<!-- Content images: Lazy load -->
<Image 
  src={contentImage}
  loading="lazy"
  decoding="async"
/>
```

### 2. Responsive Images

```astro
<!-- Provide multiple sizes for different viewports -->
<Image 
  src={image}
  widths={[480, 768, 1200]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

### 3. Format Fallbacks

```astro
---
import { Picture } from 'astro:assets';
---

<!-- <Picture> emits one <source> per format plus a fallback <img>
     (PNG, or JPEG when the source is a JPEG). <Image> has no `formats` prop. -->
<Picture 
  src={image}
  alt="…"
  formats={['avif', 'webp']}
/>
```

## Common Issues and Solutions

### 1. Large Bundle Sizes

**Problem**: Images are too large
**Solution**: Use the optimization scripts

```bash
# Analyze current state
pnpm run images:analyze

# Optimize interactively
pnpm run images:optimize
```

### 2. Cumulative Layout Shift (CLS)

**Problem**: Layout shifts when images load
**Solution**: Always specify dimensions or aspect ratios

```astro
<Image 
  src={myImage}
  alt=""
  width={800}
  height={600}
  class="aspect-4/3"
/>
```

### 3. Slow Largest Contentful Paint (LCP)

**Problem**: Hero image loads too slowly
**Solution**: Optimize and preload critical images

```astro
---
import { getImage, Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';

// Resolve the same optimised asset the <Image> will render so the
// preload URL matches (heroImage.src is the unprocessed original).
const heroAvif = await getImage({ src: heroImage, format: 'avif', width: 1200 });
---

<!-- Preload hero image -->
<link rel="preload" as="image" href={heroAvif.src} type="image/avif" />

<!-- Use eager loading -->
<Image 
  src={heroImage}
  alt="…"
  format="avif"
  width={1200}
  loading="eager"
  decoding="sync"
/>
```

## Workflow Integration

### Development Workflow

1. **Add images** to appropriate directories
2. **Run analysis** to check current state
3. **Optimize if needed** using interactive script
4. **Test performance** with build
5. **Monitor metrics** in production

### CI/CD Integration

```yaml
# .github/workflows/ci.yml (shipped steps — images:analyze is a local tool and does not run in CI)
- name: Build site
  run: pnpm run build

- name: Enforce per-image size budget — source (ADR-057)
  run: pnpm run images:gate

- name: Enforce per-image size budget — build output (ADR-057)
  run: IMAGE_GATE_ROOTS=dist pnpm run images:gate
```

## Checklist

### Pre-Development

- [ ] Set up image optimization scripts
- [ ] Define responsive breakpoints
- [ ] Configure Astro image service
- [ ] Plan image directory structure

### During Development

- [ ] Use appropriate source image sizes
- [ ] Implement responsive images with `sizes` attribute
- [ ] Add proper loading strategies
- [ ] Include descriptive alt text
- [ ] Run `images:analyze` regularly

### Pre-Deployment

- [ ] Run `images:optimize` for final optimization
- [ ] Validate all images meet the 200KB ceiling (`pnpm run images:gate`)
- [ ] Test Core Web Vitals impact
- [ ] Verify backup creation
- [ ] Check build output sizes

### Post-Deployment

- [ ] Monitor image loading performance
- [ ] Track Core Web Vitals metrics
- [ ] Review user experience on slow connections
- [ ] Update optimization strategy based on metrics
