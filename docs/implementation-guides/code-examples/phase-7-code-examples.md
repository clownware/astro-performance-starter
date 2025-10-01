---
title: Phase 7 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 7
tableOfContents: true
pagefind: true
---

## Content Examples

### Homepage Content

```mdx


***


# src/content/pages/home.mdx
title: "Home"
description: "I create fast, accessible, and beautiful web experiences that users love"


***



# Crafting Digital Experiences That Matter

I'm a web developer specializing in **performance-focused** websites that don't compromise on design or accessibility. With expertise in modern frameworks and a passion for clean code, I help businesses create web experiences that engage users and drive results.

## What Sets My Work Apart

### ⚡ Lightning Fast
Every site I build scores 95+ on Lighthouse. Your users won't wait, and neither should you.

### ♿ Accessible First  
WCAG AA compliance isn't an afterthought. Everyone deserves a great web experience.

### 📱 Truly Responsive
From phones to ultrawide monitors, your site adapts beautifully to every screen.

## Ready to Build Something Amazing?

Whether you need a portfolio site, business platform, or complex web application, I'm here to help bring your vision to life.

[View My Work](./projects) [Get In Touch](./contact)
```

### About Page Content

```mdx


***


# src/content/pages/about.mdx
title: "About"
description: "Learn about my journey in web development and the values that drive my work"
image: "./images/profile.jpg"


***



# About Me

Hi, I'm **[Your Name]**, a web developer based in [Location] with a passion for creating exceptional digital experiences.

## My Journey

I discovered web development [X years ago] and immediately fell in love with the blend of creativity and logic it requires. What started as curiosity about how websites work evolved into a career focused on pushing the boundaries of what's possible on the web.

## What I Do

I specialize in:

- **Frontend Development**: React, Vue, and Astro for modern web apps
- **Performance Optimization**: Making sites lightning fast
- **Accessibility**: Ensuring everyone can use what I build
- **UI/UX Design**: Creating interfaces that delight users

## My Approach

I believe great websites are:

1. **Fast** - Performance is a feature
2. **Accessible** - The web is for everyone
3. **Beautiful** - Good design matters
4. **Maintainable** - Clean code saves time

## Beyond Code

When I'm not coding, you'll find me [hobbies/interests]. I'm also passionate about [causes/interests], and I try to contribute to open source projects whenever possible.

## Let's Connect

I'm always interested in new projects and opportunities. Whether you need a website, want to collaborate, or just want to chat about web development, I'd love to hear from you.

[Email Me](mailto:your@email.com) [LinkedIn](https://linkedin.com/in/yourprofile) [GitHub](https://github.com/yourusername)
```

### Project Case Study

````mdx


***


# src/content/projects/ecommerce-redesign.mdx
title: "E-commerce Platform Redesign"
description: "Increased conversion rates by 40% through performance optimization and UX improvements"
date: 2024-06-15
client: "TechStyle Fashion"
duration: "3 months"
role: "Lead Frontend Developer"
cover: "./images/projects/ecommerce-cover.jpg"
coverAlt: "Screenshot of the redesigned e-commerce platform showing the modern, clean interface"
featured: true
tags: ["E-commerce", "Performance", "React"]
technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Cloudflare"]
outcomes:
  - metric: "Page Load Time"
    value: "-65%"
    description: "Reduced from 4.2s to 1.5s"
  - metric: "Conversion Rate"
    value: "+40%"
    description: "Increased from 2.1% to 2.9%"
  - metric: "Mobile Traffic"
    value: "+85%"
    description: "Better mobile experience drove more users"
externalUrl: "https://example.com"
sortOrder: 1


***



## Project Overview

TechStyle Fashion came to me with a problem: their e-commerce platform was losing customers due to slow load times and a dated user interface. Mobile users were particularly affected, with conversion rates 60% lower than desktop.

## The Challenge

The existing platform faced several critical issues:

- **Performance**: 4.2 second average load time
- **Mobile Experience**: Not truly responsive, difficult navigation
- **Technical Debt**: jQuery spaghetti code, no build process
- **Accessibility**: Failed WCAG guidelines

<Callout type="stat">
  60% of mobile users abandoned their carts due to performance issues
</Callout>

## My Approach

### 1. Performance Audit

I began with a comprehensive performance audit using:
- Lighthouse CI for continuous monitoring
- WebPageTest for real-world performance data
- Chrome DevTools for bottleneck identification

Key findings:
- Render-blocking resources totaling 800KB
- Unoptimized images (average 500KB each)
- No caching strategy
- Third-party scripts blocking main thread

### 2. Technical Strategy

Based on the audit, I developed a phased approach:

```typescript
// Example: Implementing code splitting for route-based chunks
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages/Home'))
  },
  {
    path: '/products/:id',
    component: lazy(() => import('./pages/ProductDetail'))
  }
];
````

### 3. Implementation Highlights

#### Image Optimization Pipeline

- Implemented automatic WebP/AVIF generation
- Lazy loading with native loading attribute
- Responsive images with proper srcset

#### Performance Improvements

- Code splitting reduced initial bundle by 70%
- Service worker for offline functionality
- Edge caching with Cloudflare Workers

#### Mobile-First Redesign

- Touch-optimized interface elements
- Simplified checkout process (3 steps → 1 step)
- Bottom sheet navigation pattern

<Figure src="./images/projects/ecommerce-mobile.jpg" alt="Mobile interface showing the streamlined checkout process" caption="The new one-step checkout process increased mobile conversions by 125%" />

## Technical Deep Dive

### State Management

Moved from prop drilling to Zustand for cleaner state management:

```typescript
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  }))
}));
```

### Performance Monitoring

Implemented RUM (Real User Monitoring) to track Core Web Vitals:

```typescript
// Tracking Core Web Vitals
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    analytics.track('web-vitals', {
      metric: entry.name,
      value: entry.value,
      rating: entry.rating
    });
  }
}).observe({ entryTypes: ['web-vital'] });
```

## Results & Impact

The redesign exceeded all target metrics:

<Grid cols={2}>
  <Card>
    ### Before

    * Load Time: 4.2s
    * Conversion: 2.1%
    * Bounce Rate: 68%
    * Mobile Revenue: 22%
  </Card>

  <Card>
    ### After

    * Load Time: 1.5s (-65%)
    * Conversion: 2.9% (+40%)
    * Bounce Rate: 41% (-40%)
    * Mobile Revenue: 48% (+118%)
  </Card>
</Grid>

## Client Testimonial

> "The transformation was incredible. Not only did our conversion rates improve dramatically, but our customer satisfaction scores reached an all-time high. The attention to performance and user experience made all the difference."
>
> — Sarah Chen, CTO at TechStyle Fashion

## Key Takeaways

1. **Performance is a feature**: Every 100ms improvement in load time increased conversions by 1%
2. **Mobile-first pays off**: Designing for mobile constraints led to better desktop experience too
3. **Accessibility helps everyone**: Keyboard navigation improvements helped power users too
4. **Measure everything**: RUM data guided continuous improvements post-launch

## Technologies Used

- **Frontend**: React 18, TypeScript, Zustand
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastructure**: Cloudflare Workers, Redis
- **Testing**: Playwright, Vitest, Lighthouse CI
- **Monitoring**: Datadog RUM, Sentry

[View Live Site](https://example.com) [Next Project →](/implementation-guides/projects/saas-dashboard/)

### Blog Post Example

```mdx


***


# src/content/blog/web-performance-2024.mdx
title: "Web Performance in 2024: What Really Matters"
description: "Core Web Vitals are just the beginning. Here's what you need to know about modern web performance."
date: 2024-11-20
updated: 2024-11-25
tags: ["Performance", "Web Development", "Core Web Vitals"]
author: "Your Name"
cover: "./images/blog/performance-hero.jpg"
coverAlt: "Dashboard showing performance metrics and Core Web Vitals scores"
canonicalUrl: "https://yourdomain.com/blog/web-performance-2024"
relatedPosts: ["optimizing-images-astro", "lazy-loading-patterns"]


***



Performance isn't just about speed—it's about creating experiences that feel instant and effortless. In 2024, with users expecting native-app-like performance from web apps, the stakes have never been higher.

## The State of Web Performance

Recent data from HTTP Archive shows that the median website now ships **2.2MB of JavaScript**, up from 1.8MB just two years ago. Yet, Core Web Vitals pass rates have actually improved. How? Developers are getting smarter about *when* and *how* we load resources.

<Callout type="info">
  75% of websites now pass Core Web Vitals thresholds, up from 40% in 2022
</Callout>

## What's Changed Since Last Year

### 1. INP Replaces FID

Interaction to Next Paint (INP) is now a Core Web Vital, replacing First Input Delay. This change reflects a shift toward measuring the *entire* interaction, not just the delay before processing begins.

```javascript
// Old way: Optimizing for FID
button.addEventListener('click', () => {
  // Quick acknowledgment
  requestAnimationFrame(() => {
    // Heavy work here
  });
});

// New way: Optimizing for INP
button.addEventListener('click', async () => {
  // Show immediate feedback
  button.classList.add('loading');
  
  // Break up work
  await scheduler.yield();
  await processData();
  await scheduler.yield();
  await updateUI();
  
  button.classList.remove('loading');
});
````

### 2. The Rise of Edge Computing

Edge functions have moved from "nice to have" to essential for performance:

- **Personalization** without client-side JS
- **A/B testing** at the edge
- **Geographic content** delivery
- **Authentication** closer to users

### 3. Framework Performance Wars

The battle between frameworks has shifted from bundle size to runtime performance:

| Framework | Bundle Size | Hydration Time | INP Score |
|-----------|------------|----------------|-----------|
| Astro | 0KB\* | N/A | Excellent |
| Qwik | 1KB | ~0ms | Excellent |
| React RSC | 64KB | 50ms | Good |
| Next.js | 82KB | 120ms | Fair |
| Angular | 130KB | 200ms | Poor |

\*With zero JavaScript by default

## Modern Performance Patterns

### Pattern 1: Speculation Rules API

Prefetch pages intelligently based on user behavior:

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/products", "/about"]
    }
  ],
  "prefetch": [
    {
      "source": "document",
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/logout" }}
        ]
      }
    }
  ]
}
</script>
```

### Pattern 2: Islands of Interactivity

Ship HTML by default, enhance with JavaScript only where needed:

```astro
<!-- Static by default -->
<article class="product-card">
  <h2>{product.name}</h2>
  <p>{product.description}</p>
  
  <!-- Interactive island -->
  <AddToCart 
    client:visible 
    productId={product.id} 
  />
</article>
```

### Pattern 3: Optimistic UI Updates

Make apps feel instant with optimistic updates:

```typescript
async function updateCart(item: CartItem) {
  // Update UI immediately
  setCart(prev => [...prev, item]);
  
  try {
    // Sync with server
    await api.addToCart(item);
  } catch (error) {
    // Revert on failure
    setCart(prev => prev.filter(i => i.id !== item.id));
    showError("Failed to add item");
  }
}
```

## Performance Budgets That Work

Instead of arbitrary limits, tie budgets to business metrics:

```javascript
// performance-budget.js
export const budgets = {
  'product-page': {
    lcp: 2000,    // 2s LCP = 15% higher conversion
    inp: 100,     // 100ms INP = 8% lower bounce rate
    cls: 0.05,    // 0.05 CLS = 12% longer sessions
    size: {
      js: 150_000,      // 150KB JavaScript
      css: 50_000,      // 50KB CSS  
      images: 800_000,  // 800KB images
    }
  }
};
```

## Real-World Optimization Wins

### Case Study: E-commerce Category Pages

**Problem**: 4.5s LCP on category pages with 100+ products

**Solution**:

1. Implemented virtual scrolling
2. Lazy loaded images below fold
3. Used CSS containment for paint optimization
4. Moved filters to URL params (no JS required)

**Result**: 1.8s LCP, 35% increase in products viewed

```css
/* CSS Containment for product grid */
.product-grid {
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

## Tools & Monitoring in 2024

### Essential Tools

1. **[Unlighthouse](https://unlighthouse.dev/)** - Bulk Lighthouse testing
2. **[Speedlify](https://speedlify.netlify.app/)** - Competitive monitoring
3. **[Treo](https://treo.sh/)** - Real user monitoring
4. **[WebPageTest](https://webpagetest.org/)** - Detailed analysis

### Monitoring Stack

```typescript
// monitoring.ts
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics({name, value, rating}) {
  // Batch metrics for efficiency
  navigator.sendBeacon('/analytics', JSON.stringify({
    metric: name,
    value: Math.round(value),
    rating,
    url: location.href,
    connectionType: navigator.connection?.effectiveType
  }));
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Image Optimization

### 1. Image Pipeline Setup

```typescript
// scripts/optimize-images.ts
import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const FORMATS = ['avif', 'webp', 'jpg'] as const;
const WIDTHS = [320, 640, 960, 1280, 1920, 2560];

async function optimizeImage(inputPath: string) {
  const outputDir = path.dirname(inputPath).replace('/original', '/optimized');
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  await fs.mkdir(outputDir, { recursive: true });
  
  for (const width of WIDTHS) {
    for (const format of FORMATS) {
      const outputPath = path.join(
        outputDir,
        `${filename}-${width}w.${format}`
      );
      
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFormat(format, {
          quality: format === 'avif' ? 50 : 80,
          effort: format === 'avif' ? 4 : 6
        })
        .toFile(outputPath);
    }
  }
  
  console.log(`✅ Optimized: ${filename}`);
}

// Process all images
const images = await glob('src/assets/images/original/**/*.{jpg,jpeg,png}');
await Promise.all(images.map(optimizeImage));
```

### 2. Art Direction for Images

```astro


***


// src/components/OptimizedPicture.astro
import { getImage } from 'astro:assets';

export interface Props {
  src: ImageMetadata;
  alt: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  artDirection?: {
    media: string;
    src: ImageMetadata;
  }[];
}

const {
  src,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  artDirection = []
} = Astro.props;

// Generate optimized versions
const avif = await getImage({ src, format: 'avif' });
const webp = await getImage({ src, format: 'webp' });
const fallback = await getImage({ src, format: 'jpg' });


***



<picture>
  <!-- Art direction sources -->
  {artDirection.map(async ({ media, src: artSrc }) => {
    const artAvif = await getImage({ src: artSrc, format: 'avif' });
    const artWebp = await getImage({ src: artSrc, format: 'webp' });
    
    return (
      <>
        <source
          media={media}
          type="image/avif"
          srcset={artAvif.src}
        />
        <source
          media={media}
          type="image/webp"
          srcset={artWebp.src}
        />
      </>
    );
  })}
  
  <!-- Default sources -->
  <source
    type="image/avif"
    srcset={avif.src}
    sizes={sizes}
  />
  <source
    type="image/webp"
    srcset={webp.src}
    sizes={sizes}
  />
  
  <!-- Fallback -->
  <img
    src={fallback.src}
    alt={alt}
    loading={loading}
    decoding="async"
    width={src.width}
    height={src.height}
  />
</picture>
```

### 3. Social Media Images

```typescript
// scripts/generate-og-images.ts
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';

interface OGImageOptions {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  brandColor?: string;
}

async function generateOGImage({
  title,
  subtitle,
  backgroundImage,
  brandColor = '#0066CC'
}: OGImageOptions): Promise<Buffer> {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Background
  if (backgroundImage) {
    const bg = await loadImage(backgroundImage);
    ctx.drawImage(bg, 0, 0, 1200, 630);
    
    // Overlay for text readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, 1200, 630);
  } else {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, brandColor);
    gradient.addColorStop(1, adjustColor(brandColor, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
  }
  
  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap for long titles
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > 1000 && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });
  lines.push(currentLine.trim());
  
  // Draw title lines
  const lineHeight = 90;
  const startY = subtitle ? 250 : 315;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, 600, startY + (i * lineHeight));
  });
  
  // Subtitle
  if (subtitle) {
    ctx.font = '36px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(subtitle, 600, 450);
  }
  
  // Brand mark
  ctx.font = 'bold 24px Inter';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.textAlign = 'left';
  ctx.fillText('yourdomain.com', 60, 570);
  
  return canvas.toBuffer('image/png');
}

// Generate OG images for all content
const content = [
  { title: 'Web Developer & Designer', subtitle: 'Creating fast, beautiful web experiences' },
  { title: 'E-commerce Platform Redesign', subtitle: 'Case Study' },
  { title: 'Web Performance in 2024', subtitle: 'Blog Post' },
];

for (const item of content) {
  const buffer = await generateOGImage(item);
  await fs.writeFile(
    `public/og/${slugify(item.title)}.png`,
    buffer
  );
}
```

## Meta Descriptions & SEO

### SEO Component

```astro


***


// src/components/SEO.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: Date;
  modifiedTime?: Date;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

const {
  title,
  description,
  image = '/og/default.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);


***



<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={imageURL} />

<!-- Article specific -->
{type === 'article' && (
  <>
    {publishedTime && (
      <meta property="article:published_time" content={publishedTime.toISOString()} />
    )}
    {modifiedTime && (
      <meta property="article:modified_time" content={modifiedTime.toISOString()} />
    )}
    {author && <meta property="article:author" content={author} />}
    {tags?.map(tag => (
      <meta property="article:tag" content={tag} />
    ))}
  </>
)}

<!-- Schema.org -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": type === 'article' ? 'BlogPosting' : 'WebPage',
  headline: title,
  description: description,
  image: imageURL.toString(),
  url: canonicalURL.toString(),
  ...(publishedTime && { datePublished: publishedTime.toISOString() }),
  ...(modifiedTime && { dateModified: modifiedTime.toISOString() }),
  ...(author && {
    author: {
      "@type": "Person",
      name: author
    }
  })
})} />
```

### Meta Description Guidelines

```markdown
# Meta Description Best Practices

## Character Limits
- **Optimal**: 150-160 characters
- **Minimum**: 120 characters  
- **Maximum**: 160 characters (truncated after)

## Writing Formula
1. **Start with action verb** (Discover, Learn, Create, Build)
2. **Include primary keyword** naturally
3. **Add unique value proposition**
4. **Include call-to-action** if space allows

## Examples by Page Type

### Homepage
"I create lightning-fast, accessible websites that delight users and drive results. Specializing in React, Astro, and modern web development. Let's build something amazing."

### Service Page
"Need a blazing-fast website? I build performance-focused web applications using React, Astro, and modern tools. 100% Lighthouse scores guaranteed. Get a free consultation."

### Blog Post
"Core Web Vitals got you down? Learn proven strategies to achieve Performance ≥ 95, Accessibility 100, Best-Practices 100, SEO 100, optimize INP, and create instant-feeling web experiences. Code examples included."

### Project Case Study
"See how I helped TechStyle Fashion increase conversions by 40% through performance optimization and UX improvements. Detailed case study with metrics and technical insights."

### About Page
"Hi, I'm [Name], a web developer passionate about performance and accessibility. Learn about my journey, skills, and approach to creating exceptional digital experiences."
```

## Navigation & Footer Content

### Navigation Data

```json
// src/content/navigation/main.json
{
  "items": [
    {
      "label": "Home",
      "href": "/",
      "order": 1
    },
    {
      "label": "Projects",
      "href": "/projects",
      "order": 2
    },
    {
      "label": "Blog",
      "href": "/blog",
      "order": 3
    },
    {
      "label": "About",
      "href": "/about",
      "order": 4
    },
    {
      "label": "Contact",
      "href": "/contact",
      "order": 5
    }
  ]
}
```

### Footer Content

```json
// src/content/navigation/footer.json
{
  "sections": [
    {
      "title": "Quick Links",
      "links": [
        { "label": "Home", "href": "/" },
        { "label": "Projects", "href": "/projects" },
        { "label": "Blog", "href": "/blog" },
        { "label": "About", "href": "/about" }
      ]
    },
    {
      "title": "Services",
      "links": [
        { "label": "Web Development", "href": "/services/development" },
        { "label": "Performance Audit", "href": "/services/performance" },
        { "label": "Consulting", "href": "/services/consulting" }
      ]
    },
    {
      "title": "Connect",
      "links": [
        { "label": "GitHub", "href": "https://github.com/yourusername", "external": true },
        { "label": "LinkedIn", "href": "https://linkedin.com/in/yourprofile", "external": true },
        { "label": "Twitter", "href": "https://twitter.com/yourusername", "external": true },
        { "label": "Email", "href": "mailto:your@email.com" }
      ]
    }
  ],
  "bottom": {
    "copyright": "© 2024 Your Name. All rights reserved.",
    "links": [
      { "label": "Privacy Policy", "href": "/privacy" },
      { "label": "Terms of Service", "href": "/terms" },
      { "label": "Sitemap", "href": "/sitemap.xml" }
    ]
  }
}
```

## Legal Pages

### Privacy Policy

```mdx


***


# src/content/pages/privacy.mdx
title: "Privacy Policy"
description: "How we collect, use, and protect your information"
noindex: true


***



# Privacy Policy



## Introduction

Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## Information We Collect

### Information You Provide
- **Contact Information**: Name, email address when you use our contact form
- **Project Details**: Information about your project needs when requesting a quote

### Automatically Collected Information
- **Analytics Data**: Page views, session duration, bounce rate (via privacy-focused analytics)
- **Technical Data**: Browser type, device type, screen resolution
- **No Cookies**: This site does not use tracking cookies

## How We Use Your Information

We use collected information to:
- Respond to your inquiries
- Send project proposals and quotes
- Improve our website and services
- Analyze website performance

## Data Security

We implement appropriate technical and organizational security measures to protect your personal information.

## Third-Party Services

We use the following third-party services:
- **Cloudflare**: Content delivery and DDoS protection
- **Plausible Analytics**: Privacy-focused website analytics (no cookies)

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of communications

## Contact

For privacy concerns, contact: privacy@yourdomain.com
```

### Terms of Service

```mdx


***


# src/content/pages/terms.mdx
title: "Terms of Service"
description: "Terms and conditions for using this website"
noindex: true


***



# Terms of Service



## Acceptance of Terms

By accessing this website, you agree to be bound by these Terms of Service.

## Intellectual Property

All content on this website is protected by copyright and other intellectual property laws.

## Use License

You may:
- View and download materials for personal, non-commercial use
- Share links to our content

You may not:
- Modify or copy materials without permission
- Use materials for commercial purposes
- Remove any copyright notices

## Disclaimer

The information on this website is provided "as is" without warranties of any kind.

## Limitation of Liability

We shall not be liable for any damages arising from the use or inability to use materials on this website.

## Contact

For questions about these terms: legal@yourdomain.com
```

## 404 Error Page

```astro


***


// src/pages/404.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';

const popularPages = [
  { title: 'Homepage', href: '/', description: 'Start from the beginning' },
  { title: 'Projects', href: '/projects', description: 'View my recent work' },
  { title: 'Blog', href: '/blog', description: 'Read my latest articles' },
  { title: 'Contact', href: '/contact', description: 'Get in touch' }
];


***



<BaseLayout
  title="404 - Page Not Found"
  description="The page you're looking for doesn't exist"
  noindex={true}
>
  <Section size="xl">
    <Container size="sm" class="text-center">
      <div class="mb-8">
        <div class="text-8xl font-bold text-primary-600 dark:text-primary-400">
          404
        </div>
        <h1 class="mt-4 text-3xl font-bold">Page Not Found</h1>
        <p class="mt-4 text-lg text-foreground/80">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
      </div>
      
      <div class="mb-12">
        <Button href="./" size="lg">
          Go Back Home
        </Button>
      </div>
      
      <div class="border-t border-border pt-12">
        <h2 class="text-xl font-semibold mb-6">Popular Pages</h2>
        <div class="grid gap-4 text-left max-w-md mx-auto">
          {popularPages.map(page => (
            <a
              href={page.href}
              class="block p-4 rounded-lg border border-border hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
            >
              <div class="font-medium">{page.title}</div>
              <div class="text-sm text-foreground/60">{page.description}</div>
            </a>
          ))}
        </div>
      </div>
    </Container>
  </Section>
  
  <script>
    // Log 404s for monitoring
    if (typeof window !== 'undefined') {
      const referrer = document.referrer || 'direct';
      const path = window.location.pathname;
      
      // Send to analytics
      if (window.analytics) {
        window.analytics.track('404_error', {
          path,
          referrer,
          timestamp: new Date().toISOString()
        });
      }
    }
  </script>
</BaseLayout>
```

## Microcopy Guidelines (Showcase)

### UI Text Patterns

```typescript
// src/content/microcopy.ts
export const microcopy = {
  // Buttons
  buttons: {
    primary: 'Get Started',
    secondary: 'Learn More',
    submit: 'Send Message',
    loading: 'Please Wait...',
    success: 'Success!',
    error: 'Try Again'
  },
  
  // Form labels
  forms: {
    name: {
      label: 'Your Name',
      placeholder: 'John Doe',
      error: 'Please enter your name'
    },
    email: {
      label: 'Email Address',
      placeholder: 'john@example.com',
      error: 'Please enter a valid email'
    },
    message: {
      label: 'Your Message',
      placeholder: 'Tell me about your project...',
      error: 'Please enter a message'
    }
  },
  
  // Status messages
  status: {
    loading: 'Loading content...',
    error: 'Something went wrong. Please try again.',
    offline: 'You appear to be offline. Check your connection.',
    success: 'Thank you! I\'ll get back to you soon.'
  },
  
  // Empty states
  empty: {
    projects: 'No projects found. Check back soon!',
    posts: 'No posts match your search. Try different keywords.',
    comments: 'Be the first to comment!'
  }
};
```

---

## Real Page Implementations

Complete page examples showing how components, layouts, and content work together.

### Homepage Implementation

Full-featured homepage with hero, features, metrics, tech stack, and CTA sections.

**File**: `src/pages/index.astro`

**Key Features:**

- Hero section with gradient background and scroll indicator
- Lighthouse metrics showcase
- Expandable feature cards with synchronized expansion
- Tech stack grid with category badges
- Implementation track comparison
- Call-to-action section

**Pattern**: Section-based composition with reusable components

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Section from "@/components/structural/Section.astro";
import Container from "@/components/structural/Container.astro";
import Button from "@/components/atoms/Button.astro";
import Badge from "@/components/atoms/Badge.astro";
import Card from "@/components/molecules/Card.astro";
import ExpandableFeatureCard from "@/components/molecules/ExpandableFeatureCard.astro";

// Data structures
const features = [
  {
    icon: "🚀",
    title: "Performance-First Architecture",
    description: "Zero-JS baseline with islands architecture...",
    metric: "95+ Lighthouse",
    expandedDetails: [/* ... */],
  },
  // ... more features
];

const metrics = [
  { label: "Performance", score: "95+", icon: "🚀" },
  { label: "Accessibility", score: "100", icon: "♿" },
  // ... more metrics
];
---

<BaseLayout title="..." description="...">
  <!-- Hero Section -->
  <Section class="min-h-[calc(100vh-4rem)]">
    <Container>
      <Badge>🎆 Production-Ready Template</Badge>
      <h1>Astro Performance Starter</h1>
      <p>Build blazing-fast websites...</p>
      <Button href="..." variant="primary">Get Started</Button>
    </Container>
  </Section>

  <!-- Metrics Section -->
  <Section class="bg-background-secondary">
    <Container>
      <h2>Lighthouse Performance Scores</h2>
      <div class="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card>
            <div class="text-3xl font-bold">{metric.score}</div>
            <div>{metric.label}</div>
          </Card>
        ))}
      </div>
    </Container>
  </Section>

  <!-- Features Section -->
  <Section>
    <Container>
      <h2>Why Choose This Template?</h2>
      <Grid>
        {features.map((feature) => (
          <ExpandableFeatureCard {...feature} />
        ))}
      </Grid>
    </Container>
  </Section>

  <!-- CTA Section -->
  <Section class="bg-foreground-primary">
    <Container>
      <h2 class="text-background-primary">Ready to Build?</h2>
      <Button href="..." variant="primary" size="lg">Get Started</Button>
    </Container>
  </Section>
</BaseLayout>
```

**Best Practices:**

- Separate data from presentation
- Use semantic section IDs for anchor links
- Implement scroll indicators for long pages
- Provide clear CTAs throughout
- Use gradient backgrounds sparingly

---

### Blog Index with Pagination

Blog listing page with featured posts, pagination, and filtering capabilities.

**File**: `src/pages/blog/index.astro`

**Key Features:**

- Featured posts section (first page only)
- Paginated post grid
- Reading time and date metadata
- "New" badge for recent posts
- Responsive card layouts
- Empty state handling

**Pattern**: Content Collections with Astro pagination

```astro
---
import { getCollection } from "astro:content";
import type { GetStaticPaths, Page } from "astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import Card from "@/components/molecules/Card.astro";
import Badge from "@/components/atoms/Badge.astro";
import Button from "@/components/atoms/Button.astro";
import { formatPostMetadata } from "@/utils/formatDate";

const postsPerPage = 6;

export const getStaticPaths: GetStaticPaths = async ({ paginate }) => {
  const allPosts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = allPosts.sort((a, b) => 
    b.data.date.getTime() - a.data.date.getTime()
  );
  return paginate(sortedPosts, { pageSize: postsPerPage });
};

const { page } = Astro.props;
const posts = page.data;

// Get featured posts (first page only)
const featuredPosts = page.currentPage === 1
  ? await getCollection("blog", ({ data }) => !data.draft && data.featured)
      .then(posts => posts.slice(0, 3))
  : [];

const postsWithMetadata = posts.map(post => ({
  ...post,
  metadata: formatPostMetadata(post.data.date, post.body),
}));
---

<BaseLayout title={`Blog - Page ${page.currentPage}`} description="...">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Header -->
    <h1 class="text-4xl font-bold text-center mb-12">Blog</h1>

    <!-- Featured Posts (first page only) -->
    {page.currentPage === 1 && featuredPosts.length > 0 && (
      <section class="mb-16">
        <h2 class="text-2xl font-bold mb-8">Featured Posts</h2>
        <div class="grid md:grid-cols-3 gap-8">
          {featuredPosts.map(post => (
            <Card class="group">
              <div class="aspect-video overflow-hidden">
                <img src={post.data.cover} alt={post.data.coverAlt} 
                     class="group-hover:scale-105 transition-transform" />
              </div>
              <div class="p-6">
                <div class="flex gap-2 mb-3">
                  {post.data.tags.slice(0, 3).map(tag => (
                    <Badge>{tag}</Badge>
                  ))}
                </div>
                <h3 class="text-xl font-semibold mb-3">
                  <a href={`/blog/${post.slug}/`}>{post.data.title}</a>
                </h3>
                <p class="text-foreground-secondary mb-4">
                  {post.data.description}
                </p>
                <div class="flex justify-between text-sm">
                  <span>{formatPostMetadata(post.data.date).publishedDate}</span>
                  <span>{formatPostMetadata(post.data.date, post.body).readingTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    )}

    <!-- All Posts Grid -->
    <section>
      <h2 class="text-2xl font-bold mb-8">
        {page.currentPage === 1 ? "All Posts" : `Posts - Page ${page.currentPage}`}
      </h2>
      
      {posts.length === 0 ? (
        <div class="text-center py-16">
          <p class="text-lg text-foreground-secondary">No blog posts found.</p>
          <Button href="/" variant="secondary" class="mt-4">Back to Home</Button>
        </div>
      ) : (
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsWithMetadata.map(post => (
            <Card class="group">
              {/* Same card structure as featured posts */}
            </Card>
          ))}
        </div>
      )}

      <!-- Pagination -->
      {page.lastPage > 1 && (
        <nav class="mt-12 flex justify-center" aria-label="Blog pagination">
          <div class="flex items-center space-x-2">
            {page.url.prev && (
              <Button href={page.url.prev} variant="secondary" size="sm">
                Previous
              </Button>
            )}
            
            <div class="hidden sm:flex space-x-1">
              {Array.from({ length: page.lastPage }, (_, i) => i + 1).map(pageNum => {
                const href = pageNum === 1 ? '/blog/' : `/blog/${pageNum}/`;
                return pageNum === page.currentPage ? (
                  <span class="px-3 py-2 bg-primary-100 text-primary-600 rounded">
                    {pageNum}
                  </span>
                ) : (
                  <Button href={href} variant="ghost" size="sm">{pageNum}</Button>
                );
              })}
            </div>
            
            {page.url.next && (
              <Button href={page.url.next} variant="secondary" size="sm">
                Next
              </Button>
            )}
          </div>
        </nav>
      )}
    </section>
  </div>
</BaseLayout>
```

**Best Practices:**

- Use Astro's built-in pagination
- Show featured content on first page only
- Implement empty states
- Provide clear pagination controls
- Add mobile-friendly page indicators
- Use `line-clamp` for consistent card heights

---

### Projects Index with Filtering

Projects portfolio page with client-side filtering by technology.

**File**: `src/pages/projects/index.astro`

**Key Features:**

- Client-side technology filtering
- Dynamic filter badges
- Empty state with reset button
- Project cards with metadata
- Responsive grid layout

**Pattern**: Static generation with progressive enhancement

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import ProjectCard from "@/components/molecules/ProjectCard.astro";
import Button from "@/components/atoms/Button.astro";
import Badge from "@/components/atoms/Badge.astro";

const entries = await getCollection("projects", ({ data }) => !data.draft);

const projects = entries
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .map(entry => ({
    title: entry.data.title,
    description: entry.data.description,
    image: entry.data.cover.src,
    techStack: entry.data.technologies,
    demoUrl: entry.data.externalUrl,
    githubUrl: entry.data.githubUrl,
    href: `/projects/${entry.slug}/`,
    date: entry.data.date,
    tags: entry.data.tags,
  }));

// Extract unique technologies for filters
const allTechStack = [...new Set(projects.flatMap(p => p.techStack))].sort();
---

<BaseLayout title="Projects" description="...">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-12">Projects</h1>

    <!-- Filter Controls -->
    <section class="mb-12">
      <h2 class="text-xl font-bold text-center mb-4">Filter by Technology</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          class="filter-btn active"
          data-filter="all"
        >
          All Projects
        </Button>
        {allTechStack.map(tech => (
          <Badge 
            class="cursor-pointer hover:bg-primary-200 filter-badge" 
            data-filter={tech.toLowerCase()}
          >
            {tech}
          </Badge>
        ))}
      </div>
    </section>

    <!-- Projects Grid -->
    <section>
      <h2 class="text-2xl font-bold text-center mb-8">All Projects</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <ProjectCard
            {...project}
            data-tech-stack={project.techStack.map(t => t.toLowerCase()).join(' ')}
          />
        ))}
      </div>
    </section>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold mb-2">No projects found</h3>
      <p class="text-foreground-secondary mb-6">
        Try selecting a different technology filter.
      </p>
      <Button variant="primary" class="reset-filter-btn">
        Show All Projects
      </Button>
    </div>
  </div>
</BaseLayout>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn, .filter-badge');
    const projectCards = document.querySelectorAll('[data-tech-stack]');
    const emptyState = document.getElementById('empty-state');
    const resetButton = document.querySelector('.reset-filter-btn');

    const filterProjects = (filterValue) => {
      let visibleCount = 0;

      projectCards.forEach(card => {
        const techStack = card.getAttribute('data-tech-stack') || '';
        const shouldShow = filterValue === 'all' || techStack.includes(filterValue);
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) visibleCount++;
      });

      emptyState?.classList.toggle('hidden', visibleCount > 0);
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter') || 'all';
        filterProjects(filterValue);
        button.classList.add('active');
      });
    });

    resetButton?.addEventListener('click', () => filterProjects('all'));
  });
</script>

<style>
  .filter-btn.active,
  .filter-badge.active {
    @apply bg-primary-600 text-white;
  }
  
  [data-tech-stack] {
    transition: opacity 0.3s ease;
  }
  
  [data-tech-stack][style*="display: none"] {
    opacity: 0;
  }
</style>
```

**Best Practices:**

- Generate filters from actual data
- Use `data-*` attributes for filtering
- Implement smooth transitions
- Show empty states
- Provide reset functionality
- Keep JavaScript minimal and progressive

---

### Contact Page with Form

Contact page with integrated ContactForm component.

**File**: `src/pages/contact.astro`

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import ContactForm from "@/components/molecules/ContactForm.astro";
import Section from "@/components/structural/Section.astro";
import Container from "@/components/structural/Container.astro";
---

<BaseLayout 
  title="Contact" 
  description="Get in touch with us"
>
  <Section>
    <Container size="md">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Get In Touch</h1>
        <p class="text-lg text-foreground-secondary">
          Have a question or want to work together? Send us a message.
        </p>
      </div>

      <ContactForm action="/api/contact" />

      <div class="mt-12 text-center text-sm text-foreground-secondary">
        <p>Or email us directly at: <a href="mailto:hello@example.com" class="text-primary-600 hover:underline">hello@example.com</a></p>
      </div>
    </Container>
  </Section>
</BaseLayout>
```

---

## Page Patterns Summary

### 1. Section-Based Composition

```astro
<BaseLayout>
  <Section id="hero">...</Section>
  <Section id="features" class="bg-background-secondary">...</Section>
  <Section id="cta">...</Section>
</BaseLayout>
```

### 2. Content Collections Integration

```astro
const posts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = posts.sort((a, b) => b.data.date - a.data.date);
```

### 3. Progressive Enhancement

```astro
<!-- Works without JavaScript -->
<div class="grid">
  {items.map(item => <Card {...item} />)}
</div>

<!-- Enhanced with JavaScript -->
<script>
  // Add filtering, sorting, etc.
</script>
```

### 4. Responsive Layouts

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => <Card {...item} />)}
</div>
```

### 5. Empty States

```astro
{items.length === 0 ? (
  <div class="text-center py-16">
    <p>No items found.</p>
    <Button href="/">Go Home</Button>
  </div>
) : (
  <div class="grid">{/* items */}</div>
)}
```

---

## Related Documentation

- [Layout Components](/implementation-guides/code-examples/phase-6-code-examples#layout-components) - Layout examples
- [Component Patterns](/patterns/component-patterns) - Component design patterns
- [Content Collections](/implementation-guides/07-content/01-content-collections) - Content management
- [Performance](/patterns/performance) - Optimization strategies
