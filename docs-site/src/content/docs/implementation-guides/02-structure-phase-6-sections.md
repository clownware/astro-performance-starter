---
title: 'Phase 6: Page Sections & Composition'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers composed page sections, hero components, feature grids, and
  testimonials for Lite (MVP) and Full (Showcase) tracks.
---
## Overview
- **Track**: Lite (MVP) / Full (Showcase)
- **Duration**: 2-3 days
- **Dependencies**: Phase 0-5 completed
- **Deliverables**: Composed page sections, hero components, feature grids, testimonials

## Entry Criteria
- [ ] Component library built (Phase 5)
- [ ] Design tokens integrated
- [ ] Layout system functional
- [ ] Content schemas defined

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 6.01 | Build Hero section | ✅ | ✅ | Text-focused → Animated hero |
| 6.02 | Create Features grid | ✅ | ✅ | Static 3-column → Enhanced animations |
| 6.03 | Add CTA section | ✅ | ✅ | Simple banner → Advanced styling |
| 6.04 | Build Footer section | ✅ | ✅ | Links and copyright |
| 6.05 | Create About section | ✅ | ✅ | Text and image → Enhanced layout |
| 6.06 | Add Contact section | ✅ | ✅ | Form or contact info → Advanced form |
| 6.07 | Build Blog listing | ✅ | ✅ | Card-based layout → Enhanced cards |
| 6.08 | Create Project grid | ✅ | ✅ | Portfolio showcase → Advanced grid |
| 6.09 | Create Testimonials | ❌ | ✅ | Carousel or grid |
| 6.10 | Build Stats section | ❌ | ✅ | Animated numbers |
| 6.11 | Add Timeline | ❌ | ✅ | Project/career history |
| 6.12 | Create FAQ section | ❌ | ✅ | Accordion pattern |
| 6.13 | Build Newsletter | ❌ | ✅ | Form with validation |
| 6.14 | Add Team section | ❌ | ✅ | Member cards |
| 6.15 | Create Pricing table | ❌ | ✅ | Comparison layout |
| 6.16 | Build Process section | ❌ | ✅ | Step-by-step visual |

## Code Examples

### Hero Section (MVP)

```astro
---
// src/components/sections/Hero.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';

export interface Props {
  title: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

const { title, subtitle, primaryCTA, secondaryCTA } = Astro.props;
---

<Section size="xl" class="hero-section">
  <Container size="md" class="text-center">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
      {title}
    </h1>
    
    {subtitle && (
      <p class="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
    
    {(primaryCTA || secondaryCTA) && (
      <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        {primaryCTA && (
          <Button href={primaryCTA.href} size="lg">
            {primaryCTA.text}
          </Button>
        )}
        {secondaryCTA && (
          <Button href={secondaryCTA.href} variant="secondary" size="lg">
            {secondaryCTA.text}
          </Button>
        )}
      </div>
    )}
  </Container>
</Section>

<style>
  .hero-section {
    background: linear-gradient(
      to bottom,
      var(--color-background),
      var(--color-gray-50)
    );
  }
  
  :global(.dark) .hero-section {
    background: linear-gradient(
      to bottom,
      var(--color-background),
      var(--color-gray-900)
    );
  }
</style>
```

### Features Grid Section

```astro
---
// src/components/sections/Features.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Grid from '@/components/ui/Grid.astro';
import Card from '@/components/ui/Card.astro';

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Props {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

const { title = "Features", subtitle, features } = Astro.props;
---

<Section size="lg">
  <Container>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    
    <Grid cols={3} gap="lg">
      {features.map((feature) => (
        <Card padding="lg" hover>
          {feature.icon && (
            <div class="w-12 h-12 mb-4 text-primary-600 dark:text-primary-400">
              <!-- Icon implementation -->
              <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
          )}
          <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
          <p class="text-foreground/80">{feature.description}</p>
        </Card>
      ))}
    </Grid>
  </Container>
</Section>
```

### CTA Section

```astro
---
// src/components/sections/CTA.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';

export interface Props {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  variant?: 'default' | 'gradient';
}

const { 
  title, 
  description, 
  buttonText, 
  buttonHref,
  variant = 'default' 
} = Astro.props;
---

<Section size="md" background={variant === 'gradient' ? 'default' : 'subtle'}>
  <Container size="sm">
    <div class={`
      rounded-2xl p-8 md:p-12 text-center
      ${variant === 'gradient' ? 'cta-gradient text-white' : 'bg-white dark:bg-gray-900'}
    `}>
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      {description && (
        <p class={`mb-8 ${variant === 'gradient' ? 'text-white/90' : 'text-foreground/80'}`}>
          {description}
        </p>
      )}
      <Button 
        href={buttonHref} 
        size="lg"
        variant={variant === 'gradient' ? 'secondary' : 'primary'}
      >
        {buttonText}
      </Button>
    </div>
  </Container>
</Section>

<style>
  .cta-gradient {
    background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  }
  
  :global(.dark) .cta-gradient {
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  }
</style>
```

### About Section

```astro
---
// src/components/sections/About.astro
import { Image } from 'astro:assets';
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';

export interface Props {
  title?: string;
  content: string;
  image: ImageMetadata;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
}

const { 
  title = "About", 
  content, 
  image, 
  imageAlt,
  imagePosition = 'right' 
} = Astro.props;
---

<Section size="lg">
  <Container>
    <div class={`grid gap-12 lg:grid-cols-2 items-center ${
      imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''
    }`}>
      <div class={imagePosition === 'left' ? 'lg:col-start-2' : ''}>
        <h2 class="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <div class="prose prose-lg dark:prose-invert">
          <Fragment set:html={content} />
        </div>
      </div>
      
      <div class={`relative ${imagePosition === 'left' ? 'lg:col-start-1' : ''}`}>
        <div class="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
          <Image 
            src={image} 
            alt={imageAlt}
            widths={[400, 800, 1200]}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Decorative element -->
        <div class="absolute -bottom-4 -right-4 w-72 h-72 bg-primary-100 dark:bg-primary-900/20 rounded-lg -z-10" />
      </div>
    </div>
  </Container>
</Section>
```

### Showcase: Animated Hero

```astro
---
// src/components/sections/AnimatedHero.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';

export interface Props {
  title: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  backgroundPattern?: boolean;
}

const { title, subtitle, primaryCTA, backgroundPattern = true } = Astro.props;

// Split title into words for animation
const titleWords = title.split(' ');
---

<Section size="xl" class="animated-hero">
  {backgroundPattern && (
    <div class="pattern-overlay" aria-hidden="true">
      <div class="floating-circle circle-1" />
      <div class="floating-circle circle-2" />
      <div class="floating-circle circle-3" />
    </div>
  )}
  
  <Container size="md" class="relative z-10 text-center">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold">
      {titleWords.map((word, i) => (
        <span 
          class="inline-block animate-word"
          style={`animation-delay: ${i * 0.1}s`}
        >
          {word}{' '}
        </span>
      ))}
    </h1>
    
    {subtitle && (
      <p class="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto animate-fade-up">
        {subtitle}
      </p>
    )}
    
    {primaryCTA && (
      <div class="mt-10 animate-fade-up animation-delay-300">
        <Button href={primaryCTA.href} size="lg" class="hover-lift">
          {primaryCTA.text}
        </Button>
      </div>
    )}
  </Container>
</Section>

<style>
  .animated-hero {
    position: relative;
    overflow: hidden;
  }
  
  .pattern-overlay {
    position: absolute;
    inset: 0;
    opacity: 0.5;
  }
  
  .floating-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600));
    opacity: 0.1;
    animation: float 20s infinite ease-in-out;
  }
  
  .circle-1 {
    width: 400px;
    height: 400px;
    top: -200px;
    left: -100px;
  }
  
  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    right: -150px;
    animation-delay: -5s;
  }
  
  .circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -10s;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(-30px, -20px) scale(1.02); }
  }
  
  .animate-word {
    opacity: 0;
    animation: wordReveal 0.6s ease forwards;
  }
  
  @keyframes wordReveal {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-up {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.6s;
  }
  
  .animation-delay-300 {
    animation-delay: 0.9s;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .hover-lift {
    transition: transform 0.2s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-word,
    .animate-fade-up,
    .floating-circle {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
```

### Showcase: Testimonials Section

```astro
---
// src/components/sections/Testimonials.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Card from '@/components/ui/Card.astro';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface Props {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

const { 
  title = "What People Say", 
  subtitle,
  testimonials 
} = Astro.props;
---

<Section size="lg" background="subtle">
  <Container>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial, i) => (
        <Card 
          padding="lg" 
          class="testimonial-card"
          style={`animation-delay: ${i * 0.1}s`}
        >
          <div class="flex flex-col h-full">
            <div class="mb-4">
              <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <blockquote class="flex-1 text-foreground/90 mb-6">
              "{testimonial.quote}"
            </blockquote>
            
            <div class="flex items-center gap-3">
              {testimonial.avatar && (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  class="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
              )}
              <div>
                <div class="font-semibold">{testimonial.author}</div>
                <div class="text-sm text-foreground/60">
                  {testimonial.role}
                  {testimonial.company && ` at ${testimonial.company}`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </Container>
</Section>

<style>
  @media (min-width: 768px) {
    .testimonial-card {
      opacity: 0;
      animation: fadeInUp 0.6s ease forwards;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .testimonial-card {
      animation: none;
      opacity: 1;
    }
  }
</style>
```

### Showcase: Stats Section

```astro
---
// src/components/sections/Stats.astro
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Props {
  stats: Stat[];
  title?: string;
}

const { stats, title } = Astro.props;
---

<Section size="md">
  <Container>
    {title && (
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
    )}
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      {stats.map((stat) => (
        <div class="text-center stat-item">
          <div class="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400">
            <span class="stat-number" data-value={stat.value}>0</span>
            {stat.suffix && <span>{stat.suffix}</span>}
          </div>
          <div class="mt-2 text-foreground/80">{stat.label}</div>
        </div>
      ))}
    </div>
  </Container>
</Section>

<!-- Replaced heavy inline script with a lightweight island to keep bundle small -->
<StatsObserverIsland client:visible />
```

### Blog Listing Section

```astro
---
// src/components/sections/BlogListing.astro
import { getCollection } from 'astro:content';
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Grid from '@/components/ui/Grid.astro';
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Badge from '@/components/ui/Badge.astro';

export interface Props {
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
}

const { 
  title = "Latest Posts", 
  subtitle,
  limit = 6,
  showViewAll = true 
} = Astro.props;

// Get recent blog posts
const posts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = posts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, limit);
---

<Section size="lg">
  <Container>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    
    <Grid cols={3} gap="lg">
      {sortedPosts.map((post) => (
        <article>
          <Card hover class="h-full flex flex-col">
            {post.data.cover && (
              <div class="aspect-video -m-6 mb-4">
                <img 
                  src={post.data.cover} 
                  alt={post.data.coverAlt || ''}
                  class="w-full h-full object-cover rounded-t-lg"
                  loading="lazy"
                />
              </div>
            )}
            
            <div class="flex-1 flex flex-col">
              <div class="flex gap-2 mb-3">
                {post.data.tags.slice(0, 2).map(tag => (
                  <Badge size="sm">{tag}</Badge>
                ))}
              </div>
              
              <h3 class="text-xl font-semibold mb-2">
                <a 
                  href={`/blog/${post.slug}`}
                  class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {post.data.title}
                </a>
              </h3>
              
              <p class="text-foreground/80 mb-4 flex-1">
                {post.data.description}
              </p>
              
              <div class="text-sm text-foreground/60">
                <time datetime={post.data.date.toISOString()}>
                  {post.data.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.data.readingTime && (
                  <span class="mx-2">·</span>
                  <span>{post.data.readingTime} min read</span>
                )}
              </div>
            </div>
          </Card>
        </article>
      ))}
    </Grid>
    
    {showViewAll && (
      <div class="mt-12 text-center">
        <Button href="/blog" variant="secondary">
          View All Posts
        </Button>
      </div>
    )}
  </Container>
</Section>
```

### Project Grid Section

```astro
---
// src/components/sections/ProjectGrid.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Grid from '@/components/ui/Grid.astro';
import Card from '@/components/ui/Card.astro';
import Badge from '@/components/ui/Badge.astro';

export interface Props {
  title?: string;
  subtitle?: string;
  featured?: boolean;
}

const { 
  title = "Featured Projects", 
  subtitle,
  featured = false 
} = Astro.props;

// Get projects
const projects = await getCollection('projects', ({ data }) => 
  !data.draft && (!featured || data.featured)
);
const sortedProjects = projects.sort((a, b) => 
  (a.data.sortOrder || 999) - (b.data.sortOrder || 999)
);
---

<Section size="lg" background="subtle">
  <Container>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
    
    <Grid cols={2} gap="lg">
      {sortedProjects.map((project) => (
        <article class="project-card group">
          <Card padding="none" hover class="overflow-hidden h-full">
            <div class="aspect-video relative overflow-hidden">
              <Image 
                src={project.data.cover}
                alt={project.data.coverAlt}
                widths={[400, 800]}
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-semibold">
                  <a 
                    href={`/projects/${project.slug}`}
                    class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {project.data.title}
                  </a>
                </h3>
                {project.data.externalUrl && (
                  <a 
                    href={project.data.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="View live project"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              
              <p class="text-foreground/80 mb-4">
                {project.data.description}
              </p>
              
              <div class="flex flex-wrap gap-2">
                {project.data.technologies.slice(0, 4).map(tech => (
                  <Badge size="sm" variant="secondary">{tech}</Badge>
                ))}
                {project.data.technologies.length > 4 && (
                  <Badge size="sm" variant="secondary">
                    +{project.data.technologies.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </article>
      ))}
    </Grid>
  </Container>
</Section>
```

## Section Composition Patterns

### 1. Page Assembly

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import Features from '@/components/sections/Features.astro';
import About from '@/components/sections/About.astro';
import ProjectGrid from '@/components/sections/ProjectGrid.astro';
import BlogListing from '@/components/sections/BlogListing.astro';
import CTA from '@/components/sections/CTA.astro';

// Import content or define inline
import aboutImage from '@/assets/images/about-me.jpg';

const features = [
  {
    title: "Fast by Default",
    description: "Zero JavaScript unless you need it. Lightning-fast load times.",
    icon: "zap"
  },
  {
    title: "SEO Optimized",
    description: "Built-in sitemap, RSS, and meta tag management.",
    icon: "search"
  },
  {
    title: "Fully Accessible",
    description: "WCAG AA compliant with keyboard navigation and screen reader support.",
    icon: "accessibility"
  }
];
---

<BaseLayout 
  title="Your Name - Web Developer"
  description="Creating beautiful, performant web experiences"
>
  <Hero 
    title="Build Amazing Web Experiences"
    subtitle="I create fast, accessible, and beautiful websites that users love"
    primaryCTA={{ text: "View My Work", href: "#projects" }}
    secondaryCTA={{ text: "Get In Touch", href: "/contact" }}
  />
  
  <Features 
    title="What I Offer"
    subtitle="Modern web development with a focus on performance and user experience"
    features={features}
  />
  
  <About 
    title="About Me"
    content="I'm a web developer passionate about creating exceptional digital experiences. With expertise in modern frameworks and a keen eye for design, I build websites that not only look great but perform exceptionally well."
    image={aboutImage}
    imageAlt="Profile photo"
  />
  
  <ProjectGrid 
    title="Recent Projects"
    subtitle="A selection of my recent work"
    featured={true}
  />
  
  <BlogListing 
    title="Latest Articles"
    subtitle="Thoughts on web development, design, and technology"
    limit={3}
  />
  
  <CTA 
    title="Ready to Start Your Project?"
    description="Let's work together to bring your ideas to life"
    buttonText="Get In Touch"
    buttonHref="/contact"
    variant="gradient"
  />
</BaseLayout>
```

### 2. Dynamic Section Loading

```astro
---
// src/components/sections/DynamicSections.astro
const sections = [
  { component: 'Hero', props: { title: 'Welcome' } },
  { component: 'Features', props: { features: [] } },
  { component: 'CTA', props: { title: 'Get Started' } }
];

// Import all section components
const sectionComponents = {
  Hero: await import('./Hero.astro'),
  Features: await import('./Features.astro'),
  CTA: await import('./CTA.astro'),
};
---

{sections.map(({ component, props }) => {
  const Component = sectionComponents[component]?.default;
  return Component ? <Component {...props} /> : null;
})}
```

### 3. Section Variants

```astro
---
// src/components/sections/SectionWrapper.astro
export interface Props {
  variant?: 'default' | 'wide' | 'narrow' | 'full';
  theme?: 'light' | 'dark' | 'primary';
  spacing?: 'compact' | 'normal' | 'spacious';
  id?: string;
}

const { 
  variant = 'default',
  theme = 'light',
  spacing = 'normal',
  id
} = Astro.props;

const variantClasses = {
  default: 'container mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'container-wide mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  full: 'w-full'
};

const themeClasses = {
  light: 'bg-white dark:bg-gray-900',
  dark: 'bg-gray-900 text-white',
  primary: 'bg-primary-600 text-white'
};

const spacingClasses = {
  compact: 'py-8 md:py-12',
  normal: 'py-12 md:py-20',
  spacious: 'py-20 md:py-32'
};
---

<section 
  id={id}
  class:list={[
    variantClasses[variant],
    themeClasses[theme],
    spacingClasses[spacing]
  ]}
>
  <slot />
</section>
```

## Performance Considerations

### 1. Lazy Loading Sections

```astro
---
// src/components/sections/LazySection.astro
export interface Props {
  name: string;
  threshold?: number;
}

const { name, threshold = 0.1 } = Astro.props;
const sectionId = `lazy-${name}-${Math.random().toString(36).slice(2)}`;
---

<div 
  id={sectionId}
  class="lazy-section min-h-[400px] flex items-center justify-center"
  data-section={name}
  data-threshold={threshold}
>
  <div class="loading-skeleton">
    <div class="animate-pulse">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const lazyObserver = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const sectionName = element.dataset.section;
          
          try {
            // Dynamically import and render section
            const response = await fetch(`/api/sections/${sectionName}`);
            const html = await response.text();
            element.innerHTML = html;
            element.classList.remove('lazy-section');
          } catch (error) {
            console.error(`Failed to load section: ${sectionName}`, error);
          }
          
          lazyObserver.unobserve(element);
        }
      }
    }, {
      rootMargin: '50px',
      threshold: 0.01
    });
    
    document.querySelectorAll('.lazy-section').forEach(section => {
      lazyObserver.observe(section);
    });
  });
</script>
```

### 2. Critical Sections

```typescript
// src/utils/critical-sections.ts
export const criticalSections = ['hero', 'features'];

export function isCriticalSection(sectionName: string): boolean {
  return criticalSections.includes(sectionName.toLowerCase());
}

export function getSectionLoadPriority(sectionName: string): 'eager' | 'lazy' {
  return isCriticalSection(sectionName) ? 'eager' : 'lazy';
}
```

## Accessibility Patterns

### 1. Section Navigation

```astro
---
// src/components/sections/SkipToSection.astro
const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Features' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];
---

<nav class="sr-only" aria-label="Skip to section">
  <ul>
    {sections.map(section => (
      <li>
        <a href={`#${section.id}`} class="skip-link">
          Skip to {section.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### 2. Section Announcements

```astro
---
// src/components/sections/AccessibleSection.astro
export interface Props {
  title: string;
  announceOnScroll?: boolean;
}

const { title, announceOnScroll = false } = Astro.props;
const sectionId = `section-${Math.random().toString(36).slice(2)}`;
---

<section 
  id={sectionId}
  aria-labelledby={`${sectionId}-title`}
  data-announce={announceOnScroll}
>
  <h2 id={`${sectionId}-title`} class="sr-only">
    {title}
  </h2>
  <slot />
</section>

{announceOnScroll && (
  <script>
    // Announce section when it comes into view
    const announceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector('h2')?.textContent;
          if (title) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Now viewing: ${title}`;
            document.body.appendChild(announcement);
            
            setTimeout(() => announcement.remove(), 1000);
          }
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-announce="true"]').forEach(section => {
      announceObserver.observe(section);
    });
  </script>
)}
```

## Lightweight Section Loading

> **Why this change?** Earlier versions embedded large inline scripts for each section. We now extract the observer/animation logic into a tiny Preact island (`StatsObserverIsland.tsx`) imported **once**. Each section renders minimal HTML on the server so users without JavaScript still see meaningful content.
>
> **Implementation tips**
> 1. Render placeholders server-side (numbers without animation).
> 2. In the island, hydrate only when the section becomes visible (`client:visible`).
> 3. Share a single IntersectionObserver utility.

## Common Pitfalls

1. **Over-nesting Sections**: Don't wrap sections in sections unnecessarily
   - **Solution**: Use semantic HTML, sections for major content areas only

2. **Missing Semantic Structure**: Using divs instead of section/article
   - **Solution**: Use appropriate HTML5 elements

3. **Poor Mobile Experience**: Desktop-only section designs
   - **Solution**: Design mobile-first, test at all breakpoints

4. **Inaccessible Animations**: Motion without considering preferences
   - **Solution**: Always respect prefers-reduced-motion

5. **Heavy Section Components**: Loading too much JavaScript
   - **Solution**: Keep sections static, use islands sparingly

## Exit Criteria

| Criteria | MVP | Showcase | Description |
|----------|-----|----------|-------------|
| Hero section with text focus | ✅ | ✅ | Clear messaging → Animated patterns |
| Features grid (static) | ✅ | ✅ | Basic grid → Advanced layouts |
| Simple CTA section | ✅ | ✅ | Basic styling → Enhanced design |
| About section | ✅ | ✅ | Text and image → Enhanced layout |
| Blog/Project listings | ✅ | ✅ | Card-based → Advanced grid |
| All sections accessible | ✅ | ✅ | WCAG AA compliance |
| Mobile responsive | ✅ | ✅ | All breakpoints tested |
| Testimonials section | ❌ | ✅ | Carousel or grid layout |
| Stats with animations | ❌ | ✅ | Animated number counters |
| Smooth scroll interactions | ❌ | ✅ | CSS scroll-behavior |
| Section transitions | ❌ | ✅ | View transitions |

## Rollback Strategy

If section implementation causes issues:

1. **Performance Regression**:
   - Remove animations/islands
   - Simplify to static HTML
   - Check bundle size impact

2. **Layout Issues**:
   - Revert to basic grid
   - Remove complex positioning
   - Test on real devices

3. **Accessibility Problems**:
   - Simplify interactions
   - Add missing ARIA labels
   - Test with screen readers

## AI Assistant Notes

### Key Files to Reference
- `src/components/sections/*` - All section components
- `src/pages/index.astro` - Section composition
- Section-specific assets and content

### Common Prompts for This Phase
- "Create a testimonials section with carousel"
- "Build an accessible FAQ accordion section"
- "Design a hero section with animated background"
- "Compose sections for landing page"

### Context Requirements
- Brand guidelines for styling
- Content requirements per section
- Performance constraints
- Animation preferences
