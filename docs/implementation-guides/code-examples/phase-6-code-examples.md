---
title: Phase 6 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 6
tableOfContents: true
pagefind: true
---

## Code Examples

These section components are patterns for you to build — the template does not ship a
`sections/` library. Its own pages (`src/pages/index.astro`, `about.astro`, and so on)
compose sections inline from the shipped structural primitives
`src/components/structural/Section.astro`, `Container.astro`, and `Grid.astro`.

Following the atomic layout (ADR-003, `src/components/CLAUDE.md`): a section that
composes atoms inside those primitives is a **molecule**, so the examples below live in
`src/components/molecules/`. Wrappers that only define page structure
(`SectionWrapper`, `DeferredSection`, `DynamicSections`) go in
`src/components/structural/`, skip links in `src/components/a11y/`, and any interactive
logic in a Preact island under `src/components/islands/` (ADR-001). Every file in this
page marked "not shipped" is one you create.

### Building blocks: the real Props

The structural primitives are deliberately minimal — variants are expressed with
Tailwind utilities through `class`, not through `size`/`background`/`cols` props:

| Component | Props | Renders |
|---|---|---|
| `structural/Section.astro` | `class?`, `id?`, `fullHeight?`, `ariaLabel?`, `ariaLabelledBy?` | `<section class="py-16 sm:py-24 lg:py-32 …">` (`fullHeight` adds `min-h-screen flex flex-col justify-center snap-start`) |
| `structural/Container.astro` | `class?` | `<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 …">` |
| `structural/Grid.astro` | `class?` | `<div class="@container grid grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-3 …">` |
| `molecules/Card.astro` | `class?`, `animated?` | `<div class="card overflow-hidden rounded-lg border border-border bg-surface shadow-sm …">` (no padding — add `p-6` yourself) |

Two consequences that shape every example on this page:

- `Section` owns the vertical rhythm. Do not stack a second `py-*` utility on it; put
  extra spacing on an inner element instead.
- `Grid` is the 1/2/3-column container-query grid. When you need a different column
  count (two-up projects, four-up stats) use a plain `<div class="grid …">`.

Design tokens are raw HSL channels (see `src/styles/global.css`), so scoped `<style>`
blocks reference them as `hsl(var(--color-primary-600))`. Prefer the Tailwind
utilities (`bg-primary-600`, `bg-surface`, `text-muted-foreground`) wherever possible.

### Hero Section (Essential)

```astro
---
// src/components/molecules/Hero.astro (not shipped — you build this in Phase 6)
import Button from '@/components/atoms/Button.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

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

<Section fullHeight ariaLabel="Hero section" class="hero-section">
  <Container>
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
        {title}
      </h1>

      {subtitle && (
        <p class="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
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
    </div>
  </Container>
</Section>

<style>
  /* Tokens are HSL channel triples — wrap them in hsl() (see global.css). */
  .hero-section {
    background: linear-gradient(
      to bottom,
      hsl(var(--color-background)),
      hsl(var(--color-surface))
    );
  }
</style>
```

The shipped homepage hero (`src/pages/index.astro`) is the reference implementation: it
layers `AnimatedGradientText`, `SheenEyebrow`, and `ScrollReveal` atoms inside the same
`Section`/`Container` pair.

### Features Grid Section (Essential)

```astro
---
// src/components/molecules/Features.astro (not shipped — you build this in Phase 6)
import Icon from '@/components/atoms/Icon.astro';
import Card from '@/components/molecules/Card.astro';
import Container from '@/components/structural/Container.astro';
import Grid from '@/components/structural/Grid.astro';
import Section from '@/components/structural/Section.astro';
import type { IconName } from '@/types/icons';

export interface Feature {
  title: string;
  description: string;
  icon?: IconName;
}

export interface Props {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

const { title = "Features", subtitle, features } = Astro.props;
---

<Section id="features" ariaLabelledBy="features-heading">
  <Container>
    <div class="text-center mb-12">
      <h2 id="features-heading" class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>

    <Grid>
      {features.map((feature) => (
        <Card class="p-6 transition-shadow hover:shadow-lg">
          {feature.icon && (
            <div class="mb-4 text-primary-600 dark:text-primary-400">
              <Icon name={feature.icon} class="size-8" decorative />
            </div>
          )}
          <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
          <p class="text-muted-foreground">{feature.description}</p>
        </Card>
      ))}
    </Grid>
  </Container>
</Section>
```

`Icon` names come from the `IconName` union in `src/types/icons.ts` (ADR-055) — `zap`,
`search`, `accessibility`, `gauge`, and friends. For a richer card with a metric badge and
expandable detail list, reuse the shipped `molecules/ExpandableFeatureCard.astro`.

### CTA Section (Essential)

```astro
---
// src/components/molecules/CTA.astro (not shipped — you build this in Phase 6)
import Button from '@/components/atoms/Button.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

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
  variant = 'default',
} = Astro.props;

const isGradient = variant === 'gradient';
---

<Section ariaLabel="Call to action section" class={isGradient ? undefined : 'bg-surface'}>
  <Container>
    <div
      class:list={[
        'mx-auto max-w-3xl rounded-2xl p-8 md:p-12 text-center',
        isGradient
          ? 'bg-linear-to-br from-primary-600 to-secondary-600 text-primary-foreground'
          : 'border border-border bg-background',
      ]}
    >
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      {description && (
        <p class:list={['mb-8', isGradient ? 'text-primary-foreground/90' : 'text-muted-foreground']}>
          {description}
        </p>
      )}
      <Button
        href={buttonHref}
        size="lg"
        variant={isGradient ? 'secondary' : 'primary'}
      >
        {buttonText}
      </Button>
    </div>
  </Container>
</Section>
```

The gradient variant uses the same `bg-linear-to-br from-primary-600 to-secondary-600`
utilities as the homepage's shipped CTA section, so no scoped CSS is needed.

### About Section (Essential)

```astro
---
// src/components/molecules/About.astro (not shipped — you build this in Phase 6)
import type { ImageMetadata } from 'astro';
import Image from '@/components/atoms/Image.astro';
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
  imagePosition = 'right',
} = Astro.props;
---

<Section id="about" ariaLabelledBy="about-heading">
  <Container>
    <div class="grid gap-12 lg:grid-cols-2 items-center">
      <div class:list={[imagePosition === 'left' && 'lg:col-start-2']}>
        <h2 id="about-heading" class="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <div class="prose prose-lg dark:prose-invert">
          <Fragment set:html={content} />
        </div>
      </div>

      <div class:list={['relative', imagePosition === 'left' && 'lg:col-start-1 lg:row-start-1']}>
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
        <div class="absolute -bottom-4 -right-4 w-72 h-72 bg-primary-100/20 rounded-lg -z-10" aria-hidden="true"></div>
      </div>
    </div>
  </Container>
</Section>
```

`atoms/Image.astro` is the shipped `astro:assets` wrapper (ADR-030); it accepts
`ImageMetadata`, a string path, or a dynamic `import()` promise, plus `widths`, `sizes`,
`format`, and `quality`. `set:html` renders trusted, pre-authored HTML only — never pass
user input through it.

### Animated Hero (Advanced)

Before hand-rolling keyframes, check the shipped CSS-native motion system (ADR-048):
`atoms/ScrollReveal.astro` (scroll-driven reveals, `animation`/`delay` props),
`atoms/AnimatedGradientText.astro` (gradient headline, `speed`/`morph` props), and
`structural/ParallaxSection.astro`. This example shows a bespoke word-by-word entrance
for when those are not enough.

```astro
---
// src/components/molecules/AnimatedHero.astro (not shipped — you build this in Phase 6)
import Button from '@/components/atoms/Button.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

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

<Section fullHeight ariaLabel="Hero section" class="animated-hero">
  {backgroundPattern && (
    <div class="pattern-overlay" aria-hidden="true">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
    </div>
  )}

  <Container class="relative z-10">
    <div class="mx-auto max-w-3xl text-center">
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
        <p class="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up">
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
    </div>
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
    background: linear-gradient(
      135deg,
      hsl(var(--color-primary-400)),
      hsl(var(--color-primary-600))
    );
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

### Testimonials Section (Recommended)

```astro
---
// src/components/molecules/Testimonials.astro (not shipped — you build this in Phase 6)
import Image from '@/components/atoms/Image.astro';
import Card from '@/components/molecules/Card.astro';
import Container from '@/components/structural/Container.astro';
import Grid from '@/components/structural/Grid.astro';
import Section from '@/components/structural/Section.astro';

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
  testimonials,
} = Astro.props;
---

<Section id="testimonials" ariaLabelledBy="testimonials-heading" class="bg-surface">
  <Container>
    <div class="text-center mb-12">
      <h2 id="testimonials-heading" class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>

    <Grid>
      {testimonials.map((testimonial, i) => (
        <div class="testimonial-card" style={`animation-delay: ${i * 0.1}s`}>
          <Card class="p-6 h-full bg-background">
            <div class="flex flex-col h-full">
              <div class="mb-4">
                <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <blockquote class="flex-1 text-foreground/90 mb-6">
                "{testimonial.quote}"
              </blockquote>

              <div class="flex items-center gap-3">
                {testimonial.avatar && (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    class="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <div class="font-semibold">{testimonial.author}</div>
                  <div class="text-sm text-muted-foreground">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </Grid>
  </Container>
</Section>

<style>
  @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
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
</style>
```

`Card` has no `padding`/`hover` props — padding and hover effects are plain utilities
passed through `class`. It also does not forward unknown attributes (its `Props` are
`class` and `animated` only), which is why the staggered `animation-delay` sits on a
wrapper `<div>` rather than on the `Card` itself.

### Stats Section (Recommended)

The animated count-up is the one part of this page that genuinely needs JavaScript, so
it lives in a Preact island hydrated with `client:visible` — zero JS until the section
scrolls into view, exactly like the shipped `islands/SignalsCounter.tsx` and
`islands/MotionLab.tsx`. The template does not ship a stats island; you build both files.

```astro
---
// src/components/molecules/Stats.astro (not shipped — you build this in Phase 6)
import StatsObserver from '@/components/islands/StatsObserver.tsx';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

export interface Props {
  stats: Stat[];
  title?: string;
}

const { stats, title } = Astro.props;
---

<Section id="stats" ariaLabel={title ?? 'Key statistics'}>
  <Container>
    {title && (
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
    )}

    <!-- Server-rendered with final values; the island animates from 0 once hydrated -->
    <StatsObserver stats={stats} client:visible />
  </Container>
</Section>
```

```tsx
// src/components/islands/StatsObserver.tsx (not shipped — you build this)
import { useEffect, useState } from "preact/hooks";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface Props {
  stats: Stat[];
  durationMs?: number;
}

/**
 * Count-up stats. SSR renders the final values (meaningful without JS);
 * once hydrated via client:visible the numbers tween from 0. Respects
 * prefers-reduced-motion by skipping the tween entirely.
 */
export default function StatsObserver({ stats, durationMs = 1200 }: Props) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // ease-out cubic
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    setProgress(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);

  return (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      {stats.map((stat) => (
        <div class="text-center" key={stat.label}>
          <div class="text-4xl md:text-5xl font-bold text-link tabular-nums">
            {Math.round(stat.value * progress)}
            {stat.suffix && <span>{stat.suffix}</span>}
          </div>
          <div class="mt-2 text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
```

Because `client:visible` only hydrates when the element enters the viewport, the island
needs no `IntersectionObserver` of its own — the directive is the observer.

### Blog Listing Section (Essential)

The homepage already renders a "From the Blog" section this way (`src/pages/index.astro`);
this extracts it into a reusable molecule built on the shipped `PostCard`.

```astro
---
// src/components/molecules/BlogListing.astro (not shipped — you build this in Phase 6)
import Button from '@/components/atoms/Button.astro';
import PostCard from '@/components/molecules/PostCard.astro';
import Container from '@/components/structural/Container.astro';
import Grid from '@/components/structural/Grid.astro';
import Section from '@/components/structural/Section.astro';
import { getPublishedPosts } from '@/utils/blog';
import { formatPostMetadata } from '@/utils/formatDate';
import { withBase } from '@/utils/url-utils';

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
  showViewAll = true,
} = Astro.props;

// getPublishedPosts() filters drafts and sorts newest-first (src/utils/blog.ts)
const posts = (await getPublishedPosts()).slice(0, limit);
const postsWithMetadata = posts.map((post) => ({
  ...post,
  metadata: formatPostMetadata(post.data.date, post.body),
}));
---

{postsWithMetadata.length > 0 && (
  <Section id="latest-posts" ariaLabelledBy="latest-posts-heading">
    <Container>
      <div class="mx-auto max-w-2xl text-center mb-12">
        <h2 id="latest-posts-heading" class="text-3xl md:text-4xl font-bold text-balance">{title}</h2>
        {subtitle && (
          <p class="mt-4 text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <Grid>
        {postsWithMetadata.map((post) => (
          <PostCard post={post} />
        ))}
      </Grid>

      {showViewAll && (
        <div class="mt-12 text-center">
          <Button href={withBase("/blog/")} variant="secondary">
            View all posts →
          </Button>
        </div>
      )}
    </Container>
  </Section>
)}
```

`PostCard` expects the entry plus a `metadata` object (`publishedDate`, `readingTime`,
`isRecent`) — that is what `formatPostMetadata` returns. Post URLs are built from
`post.id` (the content-layer identifier) and wrapped in `withBase()` so the site works
under a sub-path deploy.

### Project Grid Section (Essential)

Mirrors the mapping in `src/pages/projects/index.astro`, rendering through the shipped
`ProjectCard` molecule.

```astro
---
// src/components/molecules/ProjectGrid.astro (not shipped — you build this in Phase 6)
import { type CollectionEntry, getCollection } from 'astro:content';
import ProjectCard from '@/components/molecules/ProjectCard.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import { withBase } from '@/utils/url-utils';

export interface Props {
  title?: string;
  subtitle?: string;
  featured?: boolean;
}

const {
  title = "Featured Projects",
  subtitle,
  featured = false,
} = Astro.props;

const entries = await getCollection(
  'projects',
  ({ data }: CollectionEntry<'projects'>) => !data.draft && (!featured || data.featured),
);
const projects = entries.sort((a, b) => a.data.sortOrder - b.data.sortOrder);
---

<Section id="projects" ariaLabelledBy="projects-heading" class="bg-surface">
  <Container>
    <div class="text-center mb-12">
      <h2 id="projects-heading" class="text-3xl md:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>

    <!-- Two-up layout: Grid.astro is fixed at 1/2/3 columns, so use a plain grid here -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      {projects.map((entry) => (
        <ProjectCard
          title={entry.data.title}
          description={entry.data.description}
          image={entry.data.cardImage ?? entry.data.cover}
          techStack={entry.data.technologies}
          demoUrl={entry.data.externalUrl}
          href={withBase(`/projects/${entry.id}/`)}
          date={entry.data.date}
          tags={entry.data.tags}
        />
      ))}
    </div>
  </Container>
</Section>
```

The `projects` schema (`src/content.config.ts`) has `sortOrder` defaulting to `0`,
`cover` (required), `cardImage` (optional, preferred for cards), `technologies`, `tags`,
and `externalUrl` — no `coverAlt` is needed on the card because `ProjectCard` derives its
alt text from `title`.

## Section Composition Patterns

### 1. Page Assembly

```astro
---
// src/pages/index.astro (replaces the shipped homepage once your sections exist)
import About from '@/components/molecules/About.astro';
import BlogListing from '@/components/molecules/BlogListing.astro';
import CTA from '@/components/molecules/CTA.astro';
import Features from '@/components/molecules/Features.astro';
import Hero from '@/components/molecules/Hero.astro';
import ProjectGrid from '@/components/molecules/ProjectGrid.astro';
import BaseLayout from '@/layouts/BaseLayout.astro';
import { withBase } from '@/utils/url-utils';
import type { Feature } from '@/components/molecules/Features.astro';

// Import content or define inline
import aboutImage from '@/assets/images/about-me.jpg';

const features: Feature[] = [
  {
    title: "Fast by Default",
    description: "Zero JavaScript unless you need it. Lightning-fast load times.",
    icon: "zap",
  },
  {
    title: "SEO Optimized",
    description: "Built-in sitemap, RSS, and meta tag management.",
    icon: "search",
  },
  {
    title: "Fully Accessible",
    description: "WCAG AA compliant with keyboard navigation and screen reader support.",
    icon: "accessibility",
  },
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
    secondaryCTA={{ text: "Get In Touch", href: withBase("/contact/") }}
  />

  <Features
    title="What I Offer"
    subtitle="Modern web development with a focus on performance and user experience"
    features={features}
  />

  <About
    title="About Me"
    content="<p>I'm a web developer passionate about creating exceptional digital experiences.</p>"
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
    buttonHref={withBase("/contact/")}
    variant="gradient"
  />
</BaseLayout>
```

### 2. Dynamic Section Loading

Useful when section order comes from data (a CMS export, a JSON file, per-page config).
Static imports keep the map type-safe and let Astro tree-shake unused sections.

```astro
---
// src/components/structural/DynamicSections.astro (not shipped — you build this)
import CTA from '@/components/molecules/CTA.astro';
import Features from '@/components/molecules/Features.astro';
import Hero from '@/components/molecules/Hero.astro';

const sectionComponents = { Hero, Features, CTA } as const;
type SectionName = keyof typeof sectionComponents;

export interface Props {
  sections: Array<{ component: SectionName; props: Record<string, unknown> }>;
}

const { sections } = Astro.props;
---

{sections.map(({ component, props }) => {
  const Component = sectionComponents[component];
  return Component ? <Component {...(props as any)} /> : null;
})}
```

### 3. Section Variants

Rather than a parallel `<section>` implementation, wrap the shipped `Section` and map
named variants onto its `class` prop. Width is applied to an inner element (so
`Container`'s `max-w-7xl` is never fought with a second `max-w-*`), and spacing is left
to `Section`.

```astro
---
// src/components/structural/SectionWrapper.astro (not shipped — you build this)
import Section from '@/components/structural/Section.astro';

export interface Props {
  width?: 'default' | 'narrow' | 'full';
  theme?: 'default' | 'surface' | 'primary';
  id?: string;
  ariaLabel?: string;
}

const {
  width = 'default',
  theme = 'default',
  id,
  ariaLabel,
} = Astro.props;

const widthClasses = {
  default: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  narrow: 'mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8',
  full: 'w-full',
};

const themeClasses = {
  default: '',
  surface: 'bg-surface',
  primary: 'bg-primary-600 text-primary-foreground',
};
---

<Section id={id} ariaLabel={ariaLabel} class={themeClasses[theme]}>
  <div class={widthClasses[width]}>
    <slot />
  </div>
</Section>
```

## Performance Considerations

### 1. Deferring Below-the-Fold Sections

This is a static build (GitHub Pages by default), so there is no `/api/sections/*`
endpoint to fetch markup from at runtime — and you do not need one. Two zero-JS tools
cover the lazy-section use case:

- `content-visibility: auto` lets the browser skip layout and paint for off-screen
  sections until they approach the viewport.
- `client:visible` on any island defers its JavaScript until the section is on screen
  (ADR-001).

```astro
---
// src/components/structural/DeferredSection.astro (not shipped — you build this)
import Section from '@/components/structural/Section.astro';

export interface Props {
  id?: string;
  ariaLabel?: string;
  /** Estimated rendered height, used as the placeholder size (px). */
  estimatedHeight?: number;
  class?: string;
}

const { id, ariaLabel, estimatedHeight = 600, class: className } = Astro.props;
---

<!-- Section.astro does not forward `style`, so the wrapper carries the custom property -->
<div class="deferred-section" style={`--deferred-height: ${estimatedHeight}px`}>
  <Section id={id} ariaLabel={ariaLabel} class={className}>
    <slot />
  </Section>
</div>

<style>
  .deferred-section {
    content-visibility: auto;
    /* Reserve space so the scrollbar doesn't jump when the section renders */
    contain-intrinsic-size: auto var(--deferred-height);
  }
</style>
```

Never defer the hero or anything that contributes to LCP — `content-visibility: auto`
is for sections below the first viewport only.

### 2. Critical Sections

A small helper for deciding which sections render eagerly (and which islands get
`client:visible` versus `client:idle`).

```typescript
// src/utils/critical-sections.ts (not shipped — you build this)
export const criticalSections = ['hero', 'features'] as const;

export function isCriticalSection(sectionName: string): boolean {
  return (criticalSections as readonly string[]).includes(sectionName.toLowerCase());
}

export function getSectionLoadPriority(sectionName: string): 'eager' | 'lazy' {
  return isCriticalSection(sectionName) ? 'eager' : 'lazy';
}
```

## Accessibility Patterns

### 1. Section Navigation

The template ships `src/components/a11y/SkipLink.astro` ("Skip to content", targeting
`#main-content`, rendered by `BaseLayout`). A per-section skip list follows the same
visually-hidden-until-focused pattern. Note that `sr-only` goes on the links, not the
`<nav>` — a visually hidden parent would clip a focused child.

```astro
---
// src/components/a11y/SkipToSection.astro (not shipped — you build this)
export interface Props {
  sections: Array<{ id: string; label: string }>;
}

const { sections } = Astro.props;
---

<nav aria-label="Skip to section">
  <ul class="contents">
    {sections.map((section) => (
      <li>
        <a
          href={`#${section.id}`}
          class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] rounded-md bg-background px-4 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary-500"
        >
          Skip to {section.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

Every target `id` must exist on a `Section` (`<Section id="features" …>`); the shipped
`SkipLink` script shows how to validate that at runtime.

### 2. Section Announcements

`Section` already exposes `ariaLabel` / `ariaLabelledBy`, so a labelled section is just
a `Section` with a heading. The optional live-region announcement is the only extra.

```astro
---
// src/components/molecules/AccessibleSection.astro (not shipped — you build this)
import Section from '@/components/structural/Section.astro';

export interface Props {
  id: string;
  title: string;
  announceOnScroll?: boolean;
}

const { id, title, announceOnScroll = false } = Astro.props;
const headingId = `${id}-title`;
---

<!-- Section.astro does not forward data-* attributes, so the observer target is a wrapper -->
<div data-announce={announceOnScroll ? 'true' : undefined}>
  <Section id={id} ariaLabelledBy={headingId}>
    <h2 id={headingId} class="sr-only">
      {title}
    </h2>
    <slot />
  </Section>
</div>

<script>
  // Astro hoists and bundles <script> once per page regardless of how many
  // instances render, so the script is unconditional and gated by the data attribute.
  const targets = document.querySelectorAll('[data-announce="true"]');
  if (targets.length > 0) {
    const announceObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const title = entry.target.querySelector('h2')?.textContent;
        if (!title) continue;

        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Now viewing: ${title}`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      }
    }, { threshold: 0.5 });

    for (const target of targets) announceObserver.observe(target);
  }
</script>
```

Use scroll announcements sparingly — they interrupt screen-reader users on every
section change, which is usually more noise than help.

---

## Layout Components

Layouts provide the structural foundation for pages. All three below are shipped in
`src/layouts/` and are reproduced from the current source; check the linked files on
GitHub if you suspect drift.

### BaseLayout

The foundational layout that all other layouts extend. It delegates the entire `<head>`
to `molecules/Head.astro` (the shipped SEO head — ADR-029), so pages never assemble meta
tags themselves.

**File**: [`src/layouts/BaseLayout.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/layouts/BaseLayout.astro)

```astro
---
import { ClientRouter } from "astro:transitions";
import SkipLink from "@/components/a11y/SkipLink.astro";
import Head from "@/components/molecules/Head.astro";
import Footer from "@/components/structural/Footer.astro";
import Header from "@/components/structural/Header.astro";
import ThemeSetup from "@/components/ThemeSetup.astro";

import "@/styles/global.css";

export interface Props {
  /** Page title. Will be combined with site title unless it already includes it. */
  title: string;
  /** Page description for meta tags and social sharing. */
  description: string;
  /**
   * Open Graph image for social media previews. Relative paths are converted to
   * absolute URLs using Astro.site.
   * @default "/og-default.png"
   */
  image?: string;
  /** Canonical URL for this page. Defaults to current page URL. */
  canonicalUrl?: URL;
  /** If true, adds noindex/nofollow meta tags. @default false */
  noindex?: boolean;
  /** Open Graph type. "article" for blog posts, "website" for other pages. */
  ogType?: "website" | "article";
  /** Additional Open Graph metadata for articles. Only used when ogType is "article". */
  ogArticle?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  /** External domains to preconnect for performance optimization. @default [] */
  preconnectDomains?: string[];
}
---

<!doctype html>
<html lang="en">
  <head>
    <Head {...Astro.props} />
    <ThemeSetup />
    <ClientRouter />
  </head>
  <body class="flex min-h-screen flex-col bg-background text-foreground antialiased">
    <SkipLink />
    <Header />
    <main
      id="main-content"
      class="flex-1"
      aria-label="Main content"
      role="main"
      tabindex="-1"
    >
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**What `Head.astro` emits** (`src/components/molecules/Head.astro`, same `Props` as above):

- Charset, viewport, `color-scheme`, generator, and `theme-color` metas
- RSS `<link rel="alternate">`, favicons, `apple-touch-icon`, and `site.webmanifest`
- `<title>` (site name appended unless the title already starts with it), description, canonical
- Open Graph (`og:type`, `og:image` resolved to an absolute URL, `article:*` tags when `ogType="article"`) and Twitter cards
- JSON-LD `@graph` with `WebSite` + `Organization` on every page and `BlogPosting` on articles
- Both self-hosted fonts via the Astro Fonts API (`<Font cssVariable="--font-geist" preload />`, `--font-inter`) — ADR-053; preload count is gated by `pnpm fonts:gate` (ADR-058)
- `dns-prefetch` + `preconnect` for each entry in `preconnectDomains`

`validateOgImage()` (`src/utils/validateOgImage.ts`) warns in dev when the `image` path
does not exist under `public/`.

**Usage Example:**

```astro
---
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title="About"
  description="Learn more about our company"
  image="/og-about.png"
>
  <Section ariaLabel="About us">
    <Container>
      <h1>About Us</h1>
      <p>Your content here...</p>
    </Container>
  </Section>
</BaseLayout>
```

**Key Features:**

- Complete HTML5 document structure with `lang="en"`
- Full SEO head via `Head.astro` (Open Graph, Twitter Cards, canonical, JSON-LD)
- Self-hosted, subset fonts with preload through the Astro Fonts API (ADR-053)
- `ThemeSetup` runs inline in `<head>` to apply the stored/dark-first theme before paint (ADR-032)
- Astro View Transitions via `ClientRouter` (ADR-009)
- `SkipLink` plus a focusable `<main id="main-content" tabindex="-1">` landmark
- Site-wide `Header` and `Footer`

---

### BlogLayout

Specialized layout for blog posts with breadcrumb, metadata strip, tag links, cover
image, a `ScrollSpy` table of contents, social sharing, and previous/next navigation.
The markup is long; the frontmatter and skeleton below are what you need to extend it.

**File**: [`src/layouts/BlogLayout.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/layouts/BlogLayout.astro)

```astro
---
import type { CollectionEntry } from "astro:content";
import Badge from "@components/atoms/Badge.astro";
import Button from "@components/atoms/Button.astro";
import Image from "@components/atoms/Image.astro";
import SocialLink from "@components/atoms/SocialLink.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { formatPostMetadata } from "@utils/formatDate";
import { generateAllShareUrls } from "@utils/socialShare";
import ReadingProgress from "@/components/atoms/ReadingProgress.astro";
import ScrollSpy from "@/components/molecules/ScrollSpy.astro";
import { withBase } from "@/utils/url-utils";

export interface Props {
  post: CollectionEntry<"blog">;
  prevPost?: CollectionEntry<"blog"> | null;
  nextPost?: CollectionEntry<"blog"> | null;
  headings: { depth: number; slug: string; text: string }[];
}

const { post, prevPost, nextPost, headings } = Astro.props;
const { title, description, cover, coverAlt, tags, author, date, updated } = post.data;

// Format post metadata
const { publishedDate, updatedDate, readingTime, isRecent } = formatPostMetadata(
  date,
  post.body,
  updated,
);

// Social sharing URLs (src/utils/socialShare.ts — ADR-010)
const currentUrl = new URL(Astro.url.pathname, Astro.site).href;
const shareUrls = generateAllShareUrls({
  url: currentUrl,
  title,
  description,
});

const tocSections = headings
  .filter((h) => h.depth <= 3)
  .map((h) => ({ id: h.slug, label: h.text }));
---

<BaseLayout
  title={title}
  description={description}
  image={cover ? cover.src : withBase("/og-blog.png")}
  ogType="article"
  ogArticle={{
    publishedTime: date.toISOString(),
    modifiedTime: updated?.toISOString(),
    author,
    tags,
  }}
>
  <ReadingProgress />
  <article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-background-default">
    <header class="mb-12">
      <!-- Breadcrumb: Home / Blog / {title}, links wrapped in withBase() -->
      <!-- <h1 transition:name={"post-title-" + post.id}> pairs with PostCard for View Transitions -->
      <!-- Meta strip: author, <time datetime>, "Updated …", readingTime, "New" Badge when isRecent -->
      <!-- Tags: each <Badge> links to withBase(`/blog/tag/${slug}/`) -->
      {cover && (
        <Image src={cover} alt={coverAlt || `Cover image for ${title}`} class="w-full rounded-lg" loading="eager" decoding="async" />
      )}
    </header>

    <div class="lg:grid lg:grid-cols-4 lg:gap-12">
      <div class="lg:col-span-3">
        <div class="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <slot />
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="sticky top-8 space-y-8">
          {tocSections.length > 0 && (
            <ScrollSpy sections={tocSections} ariaLabel="Table of contents" />
          )}
          <!-- Share: <SocialLink platform="twitter" href={shareUrls.twitter} purpose="share" /> ×4 -->
        </div>
      </aside>
    </div>

    <!-- Previous/Next: ghost <Button href={withBase(`/blog/${prevPost.id}/`)}> pair -->
  </article>
</BaseLayout>

<style>
  @reference "../styles/global.css";
  /* Prose overrides use @apply; the @reference line is required for @apply in scoped styles */
</style>
```

**Usage Example** (the shipped `src/pages/blog/[slug].astro`):

```astro
---
import type { CollectionEntry } from "astro:content";
import { getCollection, render } from "astro:content";
import BlogLayout from "@/layouts/BlogLayout.astro";
import { withBase } from "@/utils/url-utils";

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  // Sort posts once for all pages (performance optimization)
  const sortedPosts = posts.sort(
    (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return sortedPosts.map((post: CollectionEntry<"blog">, index: number) => ({
    params: { slug: post.id },
    props: {
      post,
      prevPost: index > 0 ? sortedPosts[index - 1] : null,
      nextPost: index < sortedPosts.length - 1 ? sortedPosts[index + 1] : null,
    },
  }));
}

interface Props {
  post: CollectionEntry<"blog">;
  prevPost: CollectionEntry<"blog"> | null;
  nextPost: CollectionEntry<"blog"> | null;
}

const { post, prevPost, nextPost } = Astro.props;

// Error handling: redirect to 404 if post is undefined (ADR-011)
if (!post) {
  return Astro.redirect(withBase("/404/"));
}

// Render once and pass headings to the layout to avoid a double render (ADR-012)
const { Content, headings } = await render(post);
---

<BlogLayout post={post} prevPost={prevPost} nextPost={nextPost} headings={headings}>
  <Content />
</BlogLayout>
```

Note the content-layer API: `render(entry)` is imported from `astro:content` and the
route param is `post.id` — there is no `post.slug` or `post.render()`.

**Key Features:**

- Breadcrumb navigation
- Rich metadata display (author, date, updated date, reading time)
- Cover image via `atoms/Image.astro`, eager-loaded as the likely LCP element
- Tag badges linking to `/blog/tag/[tag]/`
- `ScrollSpy` table of contents built from the `headings` prop (depth ≤ 3)
- Social sharing via `generateAllShareUrls` and `SocialLink purpose="share"`
- Previous/next post navigation
- `ReadingProgress` bar and a `transition:name` on the title for View Transitions
- `ogType="article"` with `article:*` Open Graph tags and `BlogPosting` JSON-LD

---

### ProjectLayout

Specialized layout for project case-study pages with a two-column hero, optional
outcome metrics, tech-stack badges, and MDX content slot.

**File**: [`src/layouts/ProjectLayout.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/layouts/ProjectLayout.astro)

```astro
---
import type { ImageMetadata } from "astro";
import Badge from "@/components/atoms/Badge.astro";
import Button from "@/components/atoms/Button.astro";
import Icon from "@/components/atoms/Icon.astro";
import Image from "@/components/atoms/Image.astro";
import { siteLinks, siteMetadata } from "@/config";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { formatDate, formatDateIso } from "@/utils/formatDate";
import { withBase } from "@/utils/url-utils";

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
    outcomes?: Array<{
      metric: string;
      value: string;
      description?: string;
    }>;
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
  ogType="article"
  ogArticle={{
    publishedTime: project.date ? formatDateIso(project.date) ?? undefined : undefined,
    author: siteMetadata.author,
    tags: project.tags,
  }}
>
  <article class="project-article">
    <header class="project-hero relative overflow-hidden bg-linear-to-br from-background to-surface">
      <div class="mx-auto max-w-4xl px-4 py-12 lg:py-20 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="project-info">
            <!-- Breadcrumb: Projects → {project.title} -->
            <h1 class="project-title text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {project.title}
            </h1>
            <p class="project-description text-lg text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>
            <!-- Meta: client Badge, role, <time> with formatDateIso, duration -->
            <div class="project-actions flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                href={project.externalUrl || siteLinks.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon name="github" class="size-5 mr-2" decorative />
                Clone the Template
              </Button>
            </div>
          </div>

          <div class="project-hero-image">
            <div class="relative rounded-xl overflow-hidden shadow-2xl bg-surface">
              {project.cover && (
                <Image
                  src={project.cover}
                  alt={project.coverAlt || project.title}
                  class="w-full h-auto"
                  format="avif"
                  quality="high"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                  widths={[400, 600, 800, 1200, 1536]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="project-content mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- "Key Results" grid rendered when project.outcomes has entries -->
      <section class="tech-stack-section mb-12" aria-labelledby="tech-stack-heading">
        <h2 id="tech-stack-heading" class="text-2xl font-bold text-foreground mb-6">Tech Stack</h2>
        <div role="list" class="flex flex-wrap gap-3">
          {(project.technologies ?? []).map((tech: string) => (
            <div role="listitem">
              <Badge size="md" class="font-medium">{tech}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section class="project-details mb-12" aria-label="Project details">
        <div class="prose prose-lg max-w-none">
          <slot />
        </div>
      </section>

      <!-- Back to Projects: ghost <Button href={withBase("/projects/")}> -->
    </div>
  </article>
</BaseLayout>

<style>
  @reference "../styles/global.css";

  .project-hero {
    background-image:
      radial-gradient(circle at 25% 25%, hsl(var(--color-primary-300) / 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, hsl(var(--color-secondary-300) / 0.1) 0%, transparent 50%);
  }
  /* Prose overrides via @apply follow */
</style>
```

The primary button is demo-persona behaviour (ADR-054/ADR-056): it links to
`project.externalUrl` when present, otherwise to the template's GitHub repo. Replace it
with your own "View Project" / "Back to Projects" pair when you adopt the layout.

**Usage Example** (abridged from the shipped `src/pages/projects/[slug].astro`):

```astro
---
import { type CollectionEntry, getCollection, render } from "astro:content";
import ProjectLayout from "@/layouts/ProjectLayout.astro";
import { withBase } from "@/utils/url-utils";

export async function getStaticPaths() {
  const entries = await getCollection(
    "projects",
    ({ data }: CollectionEntry<"projects">) => !data.draft,
  );

  return entries.map((entry: CollectionEntry<"projects">) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props as { entry: CollectionEntry<"projects"> };

const project = entry.data;
const { Content } = await render(entry);

// OG image: prefer cardImage, fall back to cover (ImageMetadata → .src)
const heroImage = project.cover ?? withBase("/logo.svg");
const heroSrc = typeof heroImage === "string" ? heroImage : heroImage.src;
const pageImage = project.cardImage?.src ?? heroSrc;
---

<ProjectLayout
  title={`${project.title} - Project Details`}
  description={project.description}
  image={pageImage}
  project={{ ...project, slug: entry.id }}
>
  <Content />
</ProjectLayout>
```

The shipped page also renders a meta strip (client / role / duration / launch date) and a
"More Projects" grid inside the slot — see the file on GitHub.

**Key Features:**

- Hero section with radial-gradient background over the `background`→`surface` tokens
- Two-column layout (info + AVIF cover image, eager-loaded)
- Breadcrumb navigation
- Project metadata display (client, role, date, duration)
- Optional "Key Results" outcome cards
- Tech stack badge list with `role="list"` semantics
- `ogType="article"` metadata
- Prose styling for MDX content
- Back navigation

---

## Layout Best Practices

### 1. Layout Hierarchy

```
BaseLayout (foundation — owns <head> via Head.astro, Header, Footer, SkipLink)
  ├── BlogLayout (extends BaseLayout with ogType="article")
  ├── ProjectLayout (extends BaseLayout with ogType="article")
  └── YourLayout (extends BaseLayout — add page chrome, never re-implement <head>)
```

### 2. SEO Optimization

All layouts inherit from `Head.astro` (ADR-029):

- Open Graph and Twitter Card meta tags
- Canonical URLs (override with `canonicalUrl` when a page has multiple routes)
- JSON-LD structured data (`WebSite`, `Organization`, `BlogPosting`)
- Article metadata through `ogType="article"` + `ogArticle`
- `noindex` for utility pages (404/500, drafts, search results)

### 3. Accessibility

- Semantic HTML5 structure with `<main>`, `<article>`, `<aside>`, `<nav>` landmarks
- `SkipLink` targets a focusable `#main-content` (`tabindex="-1"`)
- Heading hierarchy: one `h1` per page; sections start at `h2`
- `ariaLabel` / `ariaLabelledBy` on every `Section`
- Decorative SVGs carry `aria-hidden="true"`; `Icon decorative` does this for you
- The Playwright axe suite (`e2e/a11y-axe.spec.ts`, `pnpm test:a11y`) fails CI on serious/critical violations

### 4. Performance

- Self-hosted subset fonts with preload, gated by `pnpm fonts:gate` (ADR-053, ADR-058)
- Images through `atoms/Image.astro`; source and dist sizes gated by `pnpm images:gate` (ADR-057)
- Zero JS by default; islands hydrate with `client:visible` (ADR-001)
- `inlineStylesheets: "auto"` in `astro.config.mjs` inlines small stylesheets
- `prefetch: true` in `astro.config.mjs` (ADR-028) plus `ClientRouter` View Transitions
- Raw-size budgets enforced by `pnpm perf:budgets` (`budgets.json`); Lighthouse floors by `pnpm perf:lhci`

---

## Related Documentation

- [Phase 6 – Sections](/implementation-guides/active-phases/phase-6-sections/) - The phase these examples support
- [Component Patterns](/patterns/component-patterns/) - Component design patterns
- [Islands Architecture](/patterns/islands-architecture/) - When and how to use Preact islands
- [Content Collections](/patterns/content-collections/) - Using layouts with content
- [ADR-029: SEO Metadata Architecture](/adr/029-seo-metadata-architecture/) - How `Head.astro` is designed
- [ADR-048: CSS-Native Motion System](/adr/048-css-native-motion-system/) - Shipped animation atoms
- [Accessibility Guide](/implementation-guides/guides/accessibility-guide/) - WCAG compliance
