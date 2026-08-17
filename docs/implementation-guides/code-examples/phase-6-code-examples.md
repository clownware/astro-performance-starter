---
title: Phase 6 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 6
tableOfContents: true
pagefind: true
---

## Code Examples

### Hero Section (Essential)

```astro
---
// src/components/sections/Hero.astro
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Button from '@/components/atoms/Button.astro';

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
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Grid from '@/components/structural/Grid.astro';
import Card from '@/components/molecules/Card.astro';

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
            <div class="w-12 h-12 mb-4 text-primary-600">
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
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Button from '@/components/atoms/Button.astro';

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
      ${variant === 'gradient' ? 'cta-gradient text-primary-foreground' : 'bg-surface'}
    `}>
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      {description && (
        <p class={`mb-8 ${variant === 'gradient' ? 'text-primary-foreground/90' : 'text-foreground/80'}`}>
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
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

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
        <div class="aspect-4/3 overflow-hidden rounded-lg shadow-xl">
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
        <div class="absolute -bottom-4 -right-4 w-72 h-72 bg-primary-100/20 rounded-lg -z-10" />
      </div>
    </div>
  </Container>
</Section>
```

### Advanced: Animated Hero

```astro
---
// src/components/sections/AnimatedHero.astro
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Button from '@/components/atoms/Button.astro';

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

### Advanced: Testimonials Section

```astro
---
// src/components/sections/Testimonials.astro
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Card from '@/components/molecules/Card.astro';

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
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
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

### Advanced: Stats Section

```astro
---
// src/components/sections/Stats.astro
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

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
          <div class="text-4xl md:text-5xl font-bold text-primary-600">
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
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Grid from '@/components/structural/Grid.astro';
import Card from '@/components/molecules/Card.astro';
import Button from '@/components/atoms/Button.astro';
import Badge from '@/components/atoms/Badge.astro';

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
                  class="hover:text-primary-600 transition-colors"
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
        <Button href="./blog" variant="secondary">
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
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Grid from '@/components/structural/Grid.astro';
import Card from '@/components/molecules/Card.astro';
import Badge from '@/components/atoms/Badge.astro';

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
              <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-semibold">
                  <a 
                    href={`/projects/${project.slug}`}
                    class="hover:text-primary-600 transition-colors"
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
  light: 'bg-surface',
  dark: 'bg-surface text-primary-foreground',
  primary: 'bg-primary-600 text-primary-foreground'
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
      <div class="h-8 bg-surface rounded w-3/4 mx-auto mb-4"></div>
      <div class="h-4 bg-surface rounded w-1/2 mx-auto"></div>
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

<!-- Example implementation — create this file when building critical section prioritization -->

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

---

## Layout Components

Layouts provide the structural foundation for pages, handling SEO, navigation, and consistent page structure.

### BaseLayout

The foundational layout that all other layouts extend. Handles HTML structure, SEO meta tags, fonts, and global components.

**File**: `src/layouts/BaseLayout.astro`

```astro
---
import { ClientRouter } from "astro:transitions";
import SkipLink from "@/components/a11y/SkipLink.astro";
import Footer from "@/components/structural/Footer.astro";
import Header from "@/components/structural/Header.astro";
import ThemeSetup from "@/components/ThemeSetup.astro";
import { siteMetadata } from "@/config";
import { Font } from "astro:assets";

import "@/styles/global.css";

// Fonts use the Astro 6 Fonts API (ADR-053): configured in astro.config.mjs and
// emitted (with preload + metric-adjust) via <Font> below. No @fontsource imports.

export interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: URL;
  noindex?: boolean;
}

const {
  title,
  description,
  image = "/og-default.jpg",
  canonicalUrl = new URL(Astro.url.pathname, Astro.site),
  noindex = false,
} = Astro.props;

const siteTitle = siteMetadata.title;
const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- Primary Meta Tags -->
    <title>{fullTitle}</title>
    <meta name="title" content={fullTitle} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl.href} />

    {noindex && <meta name="robots" content="noindex, nofollow" />}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl.href} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />
    <meta property="og:site_name" content={siteTitle} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalUrl.href} />
    <meta property="twitter:title" content={fullTitle} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={new URL(image, Astro.site)} />

    <!-- Fonts (Astro 6 Fonts API): emits @font-face + preload automatically -->
    <Font cssVariable="--font-geist" preload />
    <Font cssVariable="--font-inter" preload />

    <ClientRouter />
  </head>
  <body class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <!-- Theme Detection & Setup -->
    <ThemeSetup />
    <SkipLink />
    <Header />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Usage Example:**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout 
  title="About" 
  description="Learn more about our company"
  image="/og-about.jpg"
>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <h1>About Us</h1>
      <p>Your content here...</p>
    </div>
  </section>
</BaseLayout>
```

**Key Features:**

- Complete HTML5 document structure
- SEO meta tags (Open Graph, Twitter Cards)
- Canonical URL management
- Font preloading for performance
- Astro View Transitions support
- Accessibility components (SkipLink)
- Theme setup and detection
- Responsive viewport configuration

---

### BlogLayout

Specialized layout for blog posts with rich metadata, table of contents, social sharing, and post navigation.

**File**: `src/layouts/BlogLayout.astro`

```astro
---
import type { CollectionEntry } from "astro:content";
import Badge from "@components/atoms/Badge.astro";
import Button from "@components/atoms/Button.astro";
import Image from "@components/atoms/Image.astro";
import SocialLink from "@components/atoms/SocialLink.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { formatPostMetadata } from "@utils/formatDate";

export interface Props {
  post: CollectionEntry<"blog">;
  prevPost?: CollectionEntry<"blog">;
  nextPost?: CollectionEntry<"blog">;
}

const { post, prevPost, nextPost } = Astro.props;
const { title, description, cover, coverAlt, tags, author, date, updated } = post.data;

// Format post metadata
const { publishedDate, updatedDate, readingTime, isRecent } = formatPostMetadata(
  date,
  post.body,
  updated,
);

// Generate table of contents from headings
const { headings } = await post.render();

// Social sharing URLs
const currentUrl = new URL(Astro.url.pathname, Astro.site).href;
const encodedTitle = encodeURIComponent(title);
const encodedUrl = encodeURIComponent(currentUrl);

const shareUrls = {
  twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
};
---

<BaseLayout
  title={title}
  description={description}
  image={cover ? cover.src : "/og-blog.jpg"}
>
  <article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Article Header -->
    <header class="mb-12">
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-muted-foreground">
          <li>
            <a href="/" class="hover:text-foreground transition-colors">
              Home
            </a>
          </li>
          <li>
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li>
            <a href="/blog/" class="hover:text-foreground transition-colors">
              Blog
            </a>
          </li>
          <li>
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>
          <li class="text-foreground" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <!-- Article Title -->
      <h1 class="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      <!-- Article Meta -->
      <div class="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{author}</span>
        </div>
        <div class="flex items-center">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time datetime={date.toISOString()}>{publishedDate}</time>
        </div>
        {updatedDate && (
          <div class="flex items-center">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Updated {updatedDate}</span>
          </div>
        )}
        <div class="flex items-center">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{readingTime}</span>
        </div>
        {isRecent && (
          <Badge class="bg-secondary-600 text-primary-foreground">New</Badge>
        )}
      </div>

      <!-- Tags -->
      {tags.length > 0 && (
        <div class="mb-8">
          <div class="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <Badge>{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      <!-- Featured Image -->
      {cover && (
        <div class="mb-8">
          <Image
            src={cover}
            alt={coverAlt || `Cover image for ${title}`}
            class="w-full rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 1024px"
            loading="eager"
          />
        </div>
      )}
    </header>

    <!-- Article Content with Sidebar -->
    <div class="lg:grid lg:grid-cols-4 lg:gap-12">
      <!-- Main Content -->
      <div class="lg:col-span-3">
        <div class="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <slot />
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <div class="sticky top-8 space-y-8">
          <!-- Table of Contents -->
          {headings.length > 0 && (
            <nav class="rounded-lg border border-default bg-surface p-6">
              <h3 class="mb-4 text-sm font-semibold text-foreground">
                Table of Contents
              </h3>
              <ul class="space-y-2 text-sm">
                {headings.map((heading: any) => (
                  <li style={`margin-left: ${(heading.depth - 1) * 12}px`}>
                    <a
                      href={`#${heading.slug}`}
                      class="text-muted-foreground hover:text-primary-600 transition-colors"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <!-- Social Sharing -->
          <div class="rounded-lg border border-default bg-surface p-6">
            <h3 class="mb-4 text-sm font-semibold text-foreground">
              Share this post
            </h3>
            <div class="flex flex-col space-y-3">
              <SocialLink platform="twitter" href={shareUrls.twitter} />
              <SocialLink platform="linkedin" href={shareUrls.linkedin} />
              <SocialLink platform="facebook" href={shareUrls.facebook} />
              <SocialLink platform="reddit" href={shareUrls.reddit} />
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Previous/Next Navigation -->
    {(prevPost || nextPost) && (
      <nav class="mt-16 border-t border-default pt-8" aria-label="Post navigation">
        <div class="grid gap-8 md:grid-cols-2">
          {prevPost && (
            <div class="group">
              <p class="mb-2 text-sm font-medium text-muted-foreground">Previous Post</p>
              <Button
                href={`/blog/${prevPost.slug}/`}
                variant="ghost"
                class="h-auto p-4 text-left justify-start group-hover:bg-surface"
              >
                <div>
                  <div class="flex items-center text-sm text-muted-foreground mb-1">
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </div>
                  <div class="text-base font-medium text-foreground group-hover:text-primary-600">
                    {prevPost.data.title}
                  </div>
                </div>
              </Button>
            </div>
          )}
          {nextPost && (
            <div class="group md:text-right">
              <p class="mb-2 text-sm font-medium text-muted-foreground">Next Post</p>
              <Button
                href={`/blog/${nextPost.slug}/`}
                variant="ghost"
                class="h-auto p-4 text-right justify-end group-hover:bg-surface"
              >
                <div>
                  <div class="flex items-center justify-end text-sm text-muted-foreground mb-1">
                    Next
                    <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div class="text-base font-medium text-foreground group-hover:text-primary-600">
                    {nextPost.data.title}
                  </div>
                </div>
              </Button>
            </div>
          )}
        </div>
      </nav>
    )}
  </article>
</BaseLayout>

<style>
  /* Enhanced prose styling for blog content */
  .prose {
    @apply text-foreground;
  }
  
  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4,
  .prose h5,
  .prose h6 {
    @apply text-foreground font-bold;
  }
  
  .prose h2 {
    @apply text-2xl mt-12 mb-6;
  }
  
  .prose h3 {
    @apply text-xl mt-8 mb-4;
  }
  
  .prose p {
    @apply mb-6 leading-relaxed;
  }
  
  .prose a {
    @apply text-primary-600 hover:text-primary-700;
  }
  
  .prose code {
    @apply bg-surface px-1.5 py-0.5 rounded text-sm;
  }
  
  .prose pre {
    @apply bg-surface rounded-lg p-4 overflow-x-auto;
  }
  
  .prose pre code {
    @apply bg-transparent p-0;
  }
  
  .prose blockquote {
    @apply border-l-4 border-primary-500 pl-6 italic;
  }
  
  .prose ul,
  .prose ol {
    @apply mb-6;
  }
  
  .prose li {
    @apply mb-2;
  }
</style>
```

**Usage Example:**

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  // Sort posts once for all pages (performance optimization)
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  
  return sortedPosts.map((post, index) => ({
    params: { slug: post.slug },
    props: {
      post,
      prevPost: index > 0 ? sortedPosts[index - 1] : null,
      nextPost: index < sortedPosts.length - 1 ? sortedPosts[index + 1] : null,
    },
  }));
}

const { post, prevPost, nextPost } = Astro.props;

// Render once to avoid double parsing (pass headings to layout)
const { Content, headings } = await post.render();
---

<BlogLayout post={post} prevPost={prevPost} nextPost={nextPost} headings={headings}>
  <Content />
</BlogLayout>
```

**Key Features:**

- Breadcrumb navigation
- Rich metadata display (author, date, reading time)
- Featured image support
- Tag display
- Automatic table of contents generation
- Social sharing buttons
- Previous/Next post navigation
- Sticky sidebar on desktop
- Responsive prose styling
- "New" badge for recent posts

---

### ProjectLayout

Specialized layout for project showcase pages with hero section, tech stack display, and project metadata.

**File**: `src/layouts/ProjectLayout.astro`

```astro
---
import type { ImageMetadata } from "astro";
import Badge from "@/components/atoms/Badge.astro";
import Button from "@/components/atoms/Button.astro";
import Image from "@/components/atoms/Image.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { formatDate } from "@/utils/formatDate";

export interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: URL;
  // Project-specific props
  project: {
    title: string;
    description: string;
    cover: ImageMetadata | string;
    coverAlt: string;
    technologies: string[];
    date?: Date | string;
    client?: string;
    duration?: string;
    role?: string;
    tags?: string[];
    externalUrl?: string;
  };
}

const { title, description, image, canonicalUrl, project } = Astro.props;

// Format dates if provided
const publishedDate = project.date ? formatDate(project.date, "full") : null;
---

<BaseLayout
  title={title}
  description={description}
  image={image}
  canonicalUrl={canonicalUrl}
>
  <article class="project-article">
    <!-- Project Hero Section -->
    <header class="project-hero relative overflow-hidden bg-linear-to-br from-background-primary to-background-secondary">
      <div class="mx-auto max-w-4xl px-4 py-12 lg:py-20 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Project Info -->
          <div class="project-info">
            <!-- Breadcrumb Navigation -->
            <nav class="breadcrumb mb-6" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="/projects/" 
                    class="hover:text-foreground transition-colors duration-200"
                    aria-label="Back to projects"
                  >
                    Projects
                  </a>
                </li>
                <li class="flex items-center">
                  <span class="mx-2" aria-hidden="true">→</span>
                  <span class="text-foreground font-medium">{project.title}</span>
                </li>
              </ol>
            </nav>

            <!-- Project Title -->
            <h1 class="project-title text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {project.title}
            </h1>

            <!-- Project Description -->
            <p class="project-description text-lg text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>

            <!-- Project Meta -->
            <div class="project-meta flex flex-wrap items-center gap-4 mb-8">
              {project.client && (
                <Badge class="text-sm">
                  {project.client}
                </Badge>
              )}
              {project.role && (
                <span class="text-sm text-muted-foreground">
                  {project.role}
                </span>
              )}
              {publishedDate && (
                <span class="text-sm text-muted-foreground">
                  <time datetime={project.date?.toString()}>
                    {publishedDate}
                  </time>
                </span>
              )}
              {project.duration && (
                <span class="text-sm text-muted-foreground">
                  {project.duration}
                </span>
              )}
            </div>

            <!-- Call-to-Action Buttons -->
            <div class="project-actions flex flex-wrap gap-4">
              {project.externalUrl && (
                <Button 
                  variant="primary" 
                  size="lg"
                  href={project.externalUrl}
                  class="inline-flex items-center"
                >
                  <span class="mr-2" aria-hidden="true">🚀</span>
                  View Project
                </Button>
              )}
              <Button 
                variant="secondary" 
                size="lg"
                href="/projects/"
                class="inline-flex items-center"
              >
                <span class="mr-2" aria-hidden="true">←</span>
                Back to Projects
              </Button>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="project-hero-image">
            <div class="relative rounded-xl overflow-hidden shadow-2xl">
              {project.cover && (
                <Image
                  src={project.cover}
                  alt={project.coverAlt || project.title}
                  class="w-full h-auto"
                  format="avif"
                  quality="high"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  widths={[400, 600, 800, 1200]}
                />
              )}
              <div class="absolute inset-0 bg-linear-to-t from-foreground-primary/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="project-content mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Tech Stack Section -->
      <section class="tech-stack-section mb-12" aria-labelledby="tech-stack-heading">
        <h2 id="tech-stack-heading" class="text-2xl font-bold text-foreground mb-6">
          Tech Stack
        </h2>
        <div class="tech-stack-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(project.technologies ?? []).map((tech: string) => (
             <div class="tech-item text-center p-4 bg-surface border border-primary rounded-lg hover:border-primary-300 transition-colors duration-200">
               <Badge class="w-full justify-center text-sm font-medium">
                 {tech}
               </Badge>
             </div>
           ))}
        </div>
      </section>

      <!-- Project Details -->
      <section class="project-details mb-12" aria-labelledby="details-heading">
        <h2 id="details-heading" class="text-2xl font-bold text-foreground mb-6">
          Project Details
        </h2>
        <div class="prose prose-lg max-w-none text-muted-foreground">
          <!-- Slot for additional content -->
          <slot />
        </div>
      </section>

      <!-- Back to Projects -->
      <section class="back-navigation text-center">
        <Button 
          variant="ghost" 
          size="lg"
          href="/projects"
          class="inline-flex items-center"
        >
          <span class="mr-2" aria-hidden="true">←</span>
          Back to Projects
        </Button>
      </section>
    </main>
  </article>
</BaseLayout>

<style>
  .project-hero {
    background-image: 
      radial-gradient(circle at 25% 25%, hsl(var(--color-primary-300) / 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, hsl(var(--color-secondary-300) / 0.1) 0%, transparent 50%);
  }

  .tech-stack-grid .tech-item {
    transition: all 0.2s ease;
  }

  .tech-stack-grid .tech-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--color-foreground) / 0.1);
  }

  .prose {
    @apply text-foreground;
    line-height: 1.7;
  }

  .prose h2 {
    @apply text-2xl font-bold text-foreground mt-10 mb-5;
  }

  .prose h3 {
    @apply text-xl font-semibold text-foreground mt-8 mb-4;
  }

  .prose p {
    @apply mb-6 leading-relaxed text-muted-foreground;
  }

  .prose ul, .prose ol {
    @apply mb-6 pl-6 space-y-2;
  }

  .prose code {
    @apply bg-surface px-1.5 py-0.5 rounded text-sm font-mono;
  }

  .prose blockquote {
    @apply border-l-4 border-primary-500 pl-4 italic my-6;
  }
</style>
```

**Usage Example:**

```astro
---
// src/pages/projects/[...slug].astro
import { getCollection } from 'astro:content';
import ProjectLayout from '@/layouts/ProjectLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<ProjectLayout
  title={project.data.title}
  description={project.data.description}
  image={project.data.cover.src}
  project={project.data}
>
  <Content />
</ProjectLayout>
```

**Key Features:**

- Hero section with gradient background
- Two-column layout (info + image)
- Breadcrumb navigation
- Project metadata display (client, role, date, duration)
- Tech stack grid with hover effects
- Call-to-action buttons
- Responsive image optimization
- Prose styling for content
- Back navigation
- Design token integration

---

## Layout Best Practices

### 1. Layout Hierarchy

```
BaseLayout (foundation)
  ├── BlogLayout (extends BaseLayout)
  ├── ProjectLayout (extends BaseLayout)
  └── CustomLayout (extends BaseLayout)
```

### 2. SEO Optimization

All layouts include:

- Proper meta tags (Open Graph, Twitter Cards)
- Canonical URLs
- Structured data ready
- Image optimization
- Font preloading

### 3. Accessibility

- Semantic HTML5 structure
- Skip links for keyboard navigation
- Proper heading hierarchy
- ARIA labels and landmarks
- Focus management

### 4. Performance

- Font preloading
- Image optimization
- Minimal JavaScript
- CSS inlining for critical styles
- View Transitions support

---

## Related Documentation

- [Component Patterns](/patterns/component-patterns) - Component design patterns
- [Content Collections](/implementation-guides/07-content/01-content-collections) - Using layouts with content
- [SEO Guide](/patterns/seo) - SEO best practices
- [Accessibility](/patterns/accessibility) - WCAG compliance
