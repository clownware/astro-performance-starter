---
title: Image Optimization Guide
lastUpdated: 2025-07-07T00:00:00.000Z
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
pnpm run analyze:images
```

This command will:

- Scan all images in `src/` and `public/` directories
- Show current dimensions and file sizes
- Categorize images by usage (hero, content, thumbnail, avatar)
- Provide optimization recommendations

### 2. Interactive Optimization

```bash
# Optimize images interactively with safety features
pnpm run optimize:images
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

Astro automatically handles format conversion at build time:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';
---

<!-- Astro automatically generates AVIF and WebP versions -->
<Image 
  src={heroImage}
  alt="Descriptive alt text"
  widths={[480, 768, 1200, 1920]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  formats={['avif', 'webp']}
  quality={80}
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

**Size Categories:**

- **Hero images**: 1200-1920px wide
- **Content images**: 800-1200px wide  
- **Thumbnails**: 200-400px wide
- **Avatars**: 100-200px wide

### 2. Astro Configuration

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels max
      },
    },
  },
});
```

### 3. Component Patterns

#### Hero Images

```astro
---
// components/HeroImage.astro
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
  formats={['avif', 'webp']}
  quality={85}
  loading={priority ? 'eager' : 'lazy'}
  decoding={priority ? 'sync' : 'async'}
  class="w-full h-auto"
/>
```

#### Content Images

```astro
---
// components/ContentImage.astro
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
    formats={['avif', 'webp']}
    quality={78}
    loading="lazy"
    class="rounded-lg"
  />
  {caption && (
    <figcaption class="text-sm text-gray-600 mt-2 text-center">
      {caption}
    </figcaption>
  )}
</figure>
```

#### Thumbnail Grid

```astro
---
// components/ThumbnailGrid.astro
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
        formats={['avif', 'webp']}
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

The `analyze:images` script provides comprehensive image analysis:

```bash
pnpm run analyze:images
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

The `optimize:images` script provides safe, interactive optimization:

```bash
pnpm run optimize:images
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

| Image Type | Target Size | Max Acceptable |
|------------|-------------|----------------|
| **Hero images** | < 500KB | < 800KB |
| **Content images** | < 200KB | < 400KB |
| **Thumbnails** | < 100KB | < 150KB |
| **Avatars** | < 50KB | < 100KB |

### Dimension Guidelines

| Category | Recommended Dimensions | Max Source Size |
|----------|----------------------|-----------------|
| **Hero** | 1200x675px (16:9) | 1920x1080px |
| **Content** | 800x600px (4:3) | 1200x900px |
| **Thumbnail** | 200x200px (1:1) | 400x400px |
| **Avatar** | 100x100px (1:1) | 200x200px |

## Best Practices

### 1. Loading Strategies

```astro
<!-- Hero image: Load immediately -->
<Image 
  src={heroImage}
  loading="eager"
  decoding="sync"
  priority
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
<!-- Astro automatically provides fallbacks -->
<Image 
  src={image}
  formats={['avif', 'webp']} 
  <!-- JPEG fallback is automatic -->
/>
```

## Common Issues and Solutions

### 1. Large Bundle Sizes

**Problem**: Images are too large
**Solution**: Use the optimization scripts

```bash
# Analyze current state
pnpm run analyze:images

# Optimize interactively
pnpm run optimize:images
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
  class="aspect-[4/3]"
/>
```

### 3. Slow Largest Contentful Paint (LCP)

**Problem**: Hero image loads too slowly
**Solution**: Optimize and preload critical images

```astro
<!-- Preload hero image -->
<link rel="preload" as="image" href={heroImage.src} type="image/avif">

<!-- Use eager loading -->
<Image 
  src={heroImage}
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
# .github/workflows/ci.yml
- name: Analyze Images
  run: pnpm run analyze:images

- name: Build with optimized images
  run: pnpm run build
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
- [ ] Run `analyze:images` regularly

### Pre-Deployment

- [ ] Run `optimize:images` for final optimization
- [ ] Validate all images meet size budgets
- [ ] Test Core Web Vitals impact
- [ ] Verify backup creation
- [ ] Check build output sizes

### Post-Deployment

- [ ] Monitor image loading performance
- [ ] Track Core Web Vitals metrics
- [ ] Review user experience on slow connections
- [ ] Update optimization strategy based on metrics
