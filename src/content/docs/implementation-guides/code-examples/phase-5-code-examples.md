---
title: Phase 5 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 5
tableOfContents: true
pagefind: true
---

## Code Examples

### Button Component (MVP & Showcase)

```astro


***


// src/components/ui/Button.astro
import type { HTMLAttributes } from 'astro/types';

export interface Props extends HTMLAttributes<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
  external?: boolean;
}

const {
  variant = 'primary',
  size = 'md',
  disabled = false,
  as: Tag = href ? 'a' : 'button',
  href,
  external = false,
  class: className,
  ...props
} = Astro.props;

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const classes = [
  'inline-flex items-center justify-center font-medium rounded-lg',
  'transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variants[variant],
  sizes[size],
  className,
];

const linkProps = Tag === 'a' ? {
  href,
  ...(external && { target: '_blank', rel: 'noopener noreferrer' })
} : {};


***



<Tag
  class:list={classes}
  disabled={disabled}
  {...linkProps}
  {...props}
>
  <slot />
  {external && (
    <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )}
</Tag>
```

### Card Component

```astro


***


// src/components/ui/Card.astro
export interface Props {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const {
  variant = 'default',
  padding = 'md',
  hover = false,
  as: Tag = 'div',
  class: className,
} = Astro.props;

const variants = {
  default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
  outline: 'border-2 border-gray-200 dark:border-gray-800',
  ghost: 'bg-gray-50 dark:bg-gray-900/50',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const classes = [
  'rounded-lg',
  variants[variant],
  paddings[padding],
  hover && 'transition-shadow hover:shadow-lg',
  className,
];


***



<Tag class:list={classes}>
  <slot />
</Tag>
```

### Section Component

```astro


***


// src/components/ui/Section.astro
export interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'subtle' | 'muted';
  class?: string;
}

const {
  size = 'md',
  background = 'default',
  class: className,
} = Astro.props;

const sizes = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const backgrounds = {
  default: '',
  subtle: 'bg-gray-50 dark:bg-gray-900/50',
  muted: 'bg-gray-100 dark:bg-gray-900',
};

const classes = [
  sizes[size],
  backgrounds[background],
  className,
];


***



<section class:list={classes}>
  <slot />
</section>
```

### Container Component

```astro


***


// src/components/ui/Container.astro
export interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  prose?: boolean;
  class?: string;
}

const {
  size = 'lg',
  prose = false,
  class: className,
} = Astro.props;

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

const classes = [
  'mx-auto px-4 sm:px-6 lg:px-8',
  sizes[size],
  prose && 'prose prose-gray dark:prose-invert max-w-none',
  className,
];


***



<div class:list={classes}>
  <slot />
</div>
```

### Grid Component

```astro


***


// src/components/ui/Grid.astro
export interface Props {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  class?: string;
}

const {
  cols = 3,
  gap = 'md',
  responsive = true,
  class: className,
} = Astro.props;

const columns = {
  1: 'grid-cols-1',
  2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
  3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
  4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
  6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
  12: 'grid-cols-12',
};

const gaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const classes = [
  'grid',
  columns[cols],
  gaps[gap],
  className,
];


***



<div class:list={classes}>
  <slot />
</div>
```

### Image Component Wrapper

```astro


***


// src/components/ui/Image.astro
import { Image as AstroImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface Props {
  src: string | ImageMetadata;
  alt: string;
  caption?: string;
  lazy?: boolean;
  aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
  class?: string;
}

const {
  src,
  alt,
  caption,
  lazy = true,
  aspectRatio,
  class: className,
  ...props
} = Astro.props;

const aspects = {
  'square': 'aspect-square',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '21/9': 'aspect-[21/9]',
};

const imageClass = [
  'w-full h-auto',
  aspectRatio && 'object-cover',
  className,
];

const wrapperClass = [
  'overflow-hidden rounded-lg',
  aspectRatio && aspects[aspectRatio],
];


***



<figure class="space-y-2">
  <div class:list={wrapperClass}>
    <AstroImage
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      class:list={imageClass}
      {...props}
    />
  </div>
  {caption && (
    <figcaption class="text-sm text-gray-600 dark:text-gray-400 text-center">
      {caption}
    </figcaption>
  )}
</figure>
```

### Badge Component

```astro


***


// src/components/ui/Badge.astro
export interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  pill?: boolean;
  class?: string;
}

const {
  variant = 'default',
  size = 'sm',
  pill = false,
  class: className,
} = Astro.props;

const variants = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

const classes = [
  'inline-flex items-center font-medium',
  pill ? 'rounded-full' : 'rounded',
  variants[variant],
  sizes[size],
  className,
];


***



<span class:list={classes}>
  <slot />
</span>

### Link Component

The `Link` component has been moved into a dedicated tutorial to empower you to build it yourself and understand the template's architecture. This approach avoids providing an overly opinionated component out-of-the-box.

- **Guide: [Creating Components: The Link Component](/implementation-guides/05-components/01-creating-components)**

This guide will walk you through creating a flexible `Link` component that can handle internal and external links, apply consistent styling, and manage accessibility attributes.

### Showcase Components

#### Modal Component (Showcase)

```astro


***


// src/components/ui/Modal.astro
export interface Props {
  id: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

const { id, title, size = 'md' } = Astro.props;

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};


***



<div
  id={id}
  class="fixed inset-0 z-50 hidden overflow-y-auto"
  aria-labelledby={`${id}-title`}
  role="dialog"
  aria-modal="true"
>
  <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
    ></div>

    <!-- Modal -->
    <div class={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizes[size]}`}>
      <div class="bg-white dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div class="flex items-center justify-between mb-4">
          <h3 id={`${id}-title`} class="text-lg font-medium leading-6">
            {title}
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onclick={`document.getElementById('${id}').classList.add('hidden')`}
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-2">
          <slot />
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <slot name="actions" />
      </div>
    </div>
  </div>
</div>
```

#### Tabs Component (Showcase)

```astro


***


// src/components/ui/Tabs.astro
export interface Props {
  items: Array<{
    id: string;
    label: string;
    content: any;
  }>;
  defaultTab?: string;
}

const { items, defaultTab = items[0]?.id } = Astro.props;


***



<div class="tabs" data-default-tab={defaultTab}>
  <div class="border-b border-gray-200 dark:border-gray-700">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs" role="tablist">
      {items.map((item) => (
        <button
          type="button"
          id={`tab-${item.id}`}
          class="tab-button whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium"
          role="tab"
          aria-selected={item.id === defaultTab ? 'true' : 'false'}
          aria-controls={`panel-${item.id}`}
          data-tab-target={item.id}
        >
          {item.label}
        </button>
      ))}
    </nav>
  </div>
  
  <div class="mt-4">
    {items.map((item) => (
      <div
        id={`panel-${item.id}`}
        class="tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${item.id}`}
        hidden={item.id !== defaultTab}
      >
        {item.content}
      </div>
    ))}
  </div>
</div>

<script>
  document.querySelectorAll('.tabs').forEach((tabGroup) => {
    const buttons = tabGroup.querySelectorAll('.tab-button');
    const panels = tabGroup.querySelectorAll('.tab-panel');
    
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab-target');
        
        // Update buttons
        buttons.forEach((btn) => {
          btn.setAttribute('aria-selected', 'false');
          btn.classList.remove('border-primary-500', 'text-primary-600');
          btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        button.setAttribute('aria-selected', 'true');
        button.classList.add('border-primary-500', 'text-primary-600');
        button.classList.remove('border-transparent', 'text-gray-500');
        
        // Update panels
        panels.forEach((panel) => {
          panel.hidden = panel.id !== `panel-${targetId}`;
        });
      });
    });
  });
</script>

<style>
  .tab-button[aria-selected="true"] {
    @apply border-primary-500 text-primary-600 dark:text-primary-400;
  }
  
  .tab-button[aria-selected="false"] {
    @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300;
  }
</style>
```

### Astrobook Configuration (Showcase)

```typescript
// astrobook.config.mjs
import { defineConfig } from 'astrobook';

export default defineConfig({
  title: 'Component Library',
  components: './src/components/ui/**/*.astro',
  output: './astrobook',
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 48%)',
      background: 'hsl(210, 40%, 98%)',
    },
  },
  stories: [
    {
      title: 'Buttons',
      component: './src/components/ui/Button.astro',
      variants: [
        { props: { variant: 'primary' }, label: 'Primary' },
        { props: { variant: 'secondary' }, label: 'Secondary' },
        { props: { variant: 'ghost' }, label: 'Ghost' },
        { props: { variant: 'danger' }, label: 'Danger' },
      ],
    },
    {
      title: 'Cards',
      component: './src/components/ui/Card.astro',
      variants: [
        { props: { variant: 'default' }, label: 'Default' },
        { props: { variant: 'outline' }, label: 'Outline' },
        { props: { variant: 'ghost' }, label: 'Ghost' },
      ],
    },
  ],
});
```
