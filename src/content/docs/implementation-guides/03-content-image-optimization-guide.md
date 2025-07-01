---
title: Image Optimization Guide
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Comprehensive guide to image optimization strategies for Astro projects,
  focusing on performance and visual quality
tableOfContents: true
pagefind: true
---
> 🖼️ **Purpose**: Comprehensive asset pipeline for optimal image delivery

## Overview

This guide covers image optimization strategies for Astro projects, focusing on performance while maintaining visual quality. All images should be optimized to meet our performance budgets while providing the best user experience.

## Image Format Selection

### Format Decision Matrix

| Format | Use Case | Browser Support | Compression |
|--------|----------|-----------------|-------------|
| **AVIF** | Primary choice for photos | Modern (85%) | Best (50% smaller than JPEG) |
| **WebP** | Fallback for older browsers | Good (95%) | Excellent (30% smaller than JPEG) |
| **JPEG** | Universal fallback | Universal | Good |
| **PNG** | Images with transparency | Universal | Poor for photos |
| **SVG** | Icons, logos, illustrations | Universal | Best for vectors |

### Implementation Strategy

```astro


***


// Always provide multiple formats
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';


***



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

### 1. Source Image Preparation

```bash
# Recommended source image guidelines
- Resolution: 2x the largest display size
- Format: Uncompressed PNG or high-quality JPEG
- Color space: sRGB
- Dimensions: Even numbers (avoid odd dimensions)
```

### 2. Astro Image Component Setup

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    // Sharp {{versions.sharp}} is the default and recommended service
    service: 'sharp',
    
    // Global defaults
    defaults: {
      formats: ['avif', 'webp'],
      quality: 80,
      
      // Density descriptors for retina
      densities: [1, 2],
      
      // Default widths for responsive images
      widths: [480, 768, 1200, 1920],
    }
  }
});
```

### 3. Component Patterns

#### Hero Images

```astro


***


// components/HeroImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  priority?: boolean;
}

const { src, alt, priority = false } = Astro.props;


***



<Image 
  src={src}
  alt={alt}
  widths={[768, 1200, 1920, 2400]}
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


***


// components/ContentImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

const { src, alt, caption } = Astro.props;


***



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


***


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


***



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
        class="aspect-square object-cover rounded group-hover:opacity-90 transition-opacity"
      />
    </a>
  ))}
</div>
```

## Performance Optimization Techniques

### 1. Above-the-Fold Images

```astro


***


// Prioritize LCP image
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';


***



<!-- Preload the LCP image -->
<link 
  rel="preload" 
  as="image" 
  href={heroImage.src} 
  imagesrcset={`${heroImage.src} 1x, ${heroImage.src} 2x`}
  imagesizes="100vw"
/>

<Image 
  src={heroImage}
  alt="Hero"
  priority
  loading="eager"
  fetchpriority="high"
/>
```

### 2. Responsive Images

```typescript
// utils/responsive-images.ts
export function getImageSizes(layout: 'full' | 'half' | 'third' | 'content') {
  const sizes = {
    full: '100vw',
    half: '(max-width: 768px) 100vw, 50vw',
    third: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    content: '(max-width: 768px) 100vw, 768px'
  };
  
  return sizes[layout];
}

export function getImageWidths(layout: 'full' | 'half' | 'third' | 'content') {
  const widths = {
    full: [768, 1200, 1920, 2400],
    half: [480, 768, 1200],
    third: [300, 600, 900],
    content: [480, 768, 1200]
  };
  
  return widths[layout];
}
```

### 3. Art Direction

```astro


***


// Different images for different viewports
import { Picture } from 'astro:assets';
import mobileHero from '@/assets/images/hero-mobile.jpg';
import desktopHero from '@/assets/images/hero-desktop.jpg';


***



<Picture
  sources={[
    {
      media: '(max-width: 768px)',
      src: mobileHero,
      widths: [480, 768],
    },
    {
      media: '(min-width: 769px)',
      src: desktopHero,
      widths: [1200, 1920, 2400],
    }
  ]}
  alt="Hero image"
  formats={['avif', 'webp']}
  loading="eager"
/>
```

## Image Processing Scripts

### Batch Optimization Script

```typescript
// scripts/optimize-images.ts
import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

async function optimizeImages() {
  const images = await glob('src/assets/images/raw/**/*.{jpg,jpeg,png}');
  
  for (const imagePath of images) {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const outputBase = imagePath.replace('/raw/', '/optimized/').replace(/\.[^.]+$/, '');
    
    // Create output directory
    await fs.mkdir(path.dirname(outputBase), { recursive: true });
    
    // Generate AVIF
    await image
      .avif({ quality: 80, effort: 4 })
      .toFile(`${outputBase}.avif`);
    
    // Generate WebP
    await image
      .webp({ quality: 85 })
      .toFile(`${outputBase}.webp`);
    
    // Generate optimized JPEG
    if (metadata.format !== 'png' || !metadata.hasAlpha) {
      await image
        .jpeg({ quality: 85, progressive: true })
        .toFile(`${outputBase}.jpg`);
    }
    
    console.log(`✅ Optimized ${path.basename(imagePath)}`);
  }
}

optimizeImages().catch(console.error);
```

### Image Validation Script

```typescript
// scripts/validate-images.ts
import { glob } from 'glob';
import sharp from 'sharp';
import chalk from 'chalk';

const MAX_FILE_SIZE = 200 * 1024; // 200KB
const MAX_DIMENSIONS = { width: 2400, height: 2400 };

async function validateImages() {
  const images = await glob('src/assets/images/**/*.{jpg,jpeg,png,webp,avif}');
  let hasErrors = false;
  
  for (const imagePath of images) {
    const stats = await fs.stat(imagePath);
    const metadata = await sharp(imagePath).metadata();
    
    // Check file size
    if (stats.size > MAX_FILE_SIZE) {
      console.error(chalk.red(`❌ ${imagePath}: File size ${(stats.size / 1024).toFixed(2)}KB exceeds limit`));
      hasErrors = true;
    }
    
    // Check dimensions
    if (metadata.width > MAX_DIMENSIONS.width || metadata.height > MAX_DIMENSIONS.height) {
      console.error(chalk.red(`❌ ${imagePath}: Dimensions ${metadata.width}x${metadata.height} exceed limit`));
      hasErrors = true;
    }
    
    // Check format
    if (!['jpeg', 'png', 'webp', 'avif', 'svg'].includes(metadata.format)) {
      console.error(chalk.red(`❌ ${imagePath}: Invalid format ${metadata.format}`));
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    process.exit(1);
  } else {
    console.log(chalk.green('✅ All images validated successfully'));
  }
}

validateImages().catch(console.error);
```

## CDN Integration

### Cloudflare Images

```typescript
// utils/cloudflare-images.ts
export function getCloudflareImageURL(
  imageId: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'auto' | 'avif' | 'webp' | 'json';
    fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  } = {}
) {
  const { width, quality = 85, format = 'auto', fit = 'scale-down' } = options;
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  params.set('fit', fit);
  
  return `https://imagedelivery.net/${process.env.CF_ACCOUNT_HASH}/${imageId}/${params}`;
}
```

## Performance Monitoring

### Image Performance Metrics

```typescript
// components/ImageWithMetrics.astro


***


import { Image } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  // ... other props
}

const { src, alt, ...props } = Astro.props;


***



<Image 
  src={src}
  alt={alt}
  {...props}
  data-image-metric
  onload="performance.mark('image-loaded-' + this.src)"
/>

<script>
  // Track image loading performance
  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('[data-image-metric]');
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('image-loaded-')) {
          console.log(`Image loaded: ${entry.startTime}ms`);
          // Send to analytics
        }
      }
    });
    
    observer.observe({ entryTypes: ['mark'] });
  });
</script>
```

## Common Issues and Solutions

### 1. CLS from Images

**Problem**: Layout shift when images load
**Solution**: Always specify dimensions

```astro
<Image 
  src={myImage}
  alt=""
  width={800}
  height={600}
  class="aspect-[4/3]" // Maintain aspect ratio
/>
```

### 2. Slow LCP

**Problem**: Hero image loads too slowly
**Solution**: Preload and prioritize

```astro
<link rel="preload" as="image" href="./hero.avif" type="image/avif">
<link rel="preload" as="image" href="./hero.webp" type="image/webp">
```

### 3. Memory Issues During Build

**Problem**: Too many images processed at once
**Solution**: Process in batches

```typescript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      config: {
        limitInputPixels: 100000000, // Limit input size
      }
    }
  }
});
```

## Checklist

### Pre-Development

- [ ] Audit all image assets
- [ ] Define responsive breakpoints
- [ ] Set up image processing pipeline
- [ ] Configure CDN if using

### During Development

- [ ] Use appropriate formats (AVIF > WebP > JPEG)
- [ ] Implement responsive images
- [ ] Add loading strategies
- [ ] Include descriptive alt text
- [ ] Validate image sizes

### Pre-Deployment

- [ ] Run image optimization scripts
- [ ] Validate all images < 200KB
- [ ] Check Core Web Vitals impact
- [ ] Test on slow connections
- [ ] Verify CDN caching headers
