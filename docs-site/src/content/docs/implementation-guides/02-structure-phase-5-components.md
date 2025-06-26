---
title: 'Phase 5: UI Component Library'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Details development of reusable UI components, documentation, and
  accessibility patterns for Lite (MVP) and Full (Showcase) tracks.
---
## Overview
- **Track**: Lite (MVP) / Full (Showcase)
- **Duration**: 2-4 days
- **Dependencies**: Phase 0-4 completed
- **Deliverables**: Reusable UI components, component documentation, accessibility patterns

## Entry Criteria
- [ ] Design system tokens available
- [ ] Skeleton layout functional
- [ ] TypeScript configured
- [ ] Tailwind CSS working

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 5.01 | Build Button component | ✅ | ✅ | Primary, secondary, ghost variants |
| 5.02 | Create Card component | ✅ | ✅ | For content display |
| 5.03 | Build Section wrapper | ✅ | ✅ | Consistent spacing |
| 5.04 | Create Container component | ✅ | ✅ | Responsive widths |
| 5.05 | Add Link component | ✅ | ✅ | External indicator |
| 5.06 | Build Image component | ✅ | ✅ | Wrapper for Astro Image |
| 5.07 | Create basic Badge | ✅ | ✅ | For tags/labels |
| 5.08 | Add Grid component | ✅ | ✅ | Responsive layouts |
| 5.09 | Set up Astrobook | ❌ | ✅ | Component documentation |
| 5.10 | Create Input components | ❌ | ✅ | Forms, validation |
| 5.11 | Build Modal component | ❌ | ✅ | Accessible dialogs |
| 5.12 | Add Tooltip component | ❌ | ✅ | Hover information |
| 5.13 | Create Tabs component | ❌ | ✅ | Content organization |
| 5.14 | Build Accordion | ❌ | ✅ | Collapsible content |
| 5.15 | Add Loading states | ❌ | ✅ | Skeletons, spinners |
| 5.16 | Create Alert component | ❌ | ✅ | User feedback |
| 5.17 | Build Pagination | ❌ | ✅ | List navigation |

## Component Management Strategy

To prevent drift between the MVP and Showcase component sets, we will adopt a clear naming convention and maintain a component matrix.

### Naming Convention

When a component has distinct MVP and Showcase versions, use a suffix to differentiate them:

-   **MVP**: `ComponentName.mvp.astro`
-   **Showcase**: `ComponentName.showcase.astro`

If a component is identical across both tracks, no suffix is needed.

### Component Matrix

This table serves as the single source of truth for which component to use for each track.

| Component | MVP Version | Showcase Version | Notes |
|---|---|---|---|
| Button | `Button.mvp.astro` | `Button.showcase.astro` | Showcase adds more variants and states. |
| Card | `Card.astro` | `Card.astro` | Same component, extended with props. |
| Section | `Section.astro` | `Section.astro` | Shared. |
| Container | `Container.astro` | `Container.astro` | Shared. |
| Link | `Link.mvp.astro` | `Link.showcase.astro` | Showcase version may include more icon options. |
| Image | `Image.astro` | `Image.astro` | Shared wrapper for Astro's Image. |
| Badge | `Badge.mvp.astro` | `Badge.showcase.astro` | Showcase adds more color and style options. |
| Grid | `Grid.astro` | `Grid.astro` | Shared. |
| Input | N/A | `Input.showcase.astro` | Showcase only. |
| Modal | N/A | `Modal.showcase.astro` | Showcase only. |

## Code Examples

### Button Component (MVP & Showcase)

```astro
---
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
---

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
---
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
---

<Tag class:list={classes}>
  <slot />
</Tag>
```

### Section Component

```astro
---
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
---

<section class:list={classes}>
  <slot />
</section>
```

### Container Component

```astro
---
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
---

<div class:list={classes}>
  <slot />
</div>
```

### Grid Component

```astro
---
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
---

<div class:list={classes}>
  <slot />
</div>
```

### Image Component Wrapper

```astro
---
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
---

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
---
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
---

<span class:list={classes}>
  <slot />
</span>
```

### Link Component

```astro
---
// src/components/ui/Link.astro
export interface Props {
  href: string;
  external?: boolean;
  underline?: boolean;
  class?: string;
}

const {
  href,
  external = href.startsWith('http'),
  underline = true,
  class: className,
} = Astro.props;

const classes = [
  'text-primary-600 dark:text-primary-400',
  'hover:text-primary-800 dark:hover:text-primary-300',
  'transition-colors duration-200',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
  underline && 'underline underline-offset-2',
  className,
];

const linkProps = external ? {
  target: '_blank',
  rel: 'noopener noreferrer'
} : {};
---

<a href={href} class:list={classes} {...linkProps}>
  <slot />
  {external && (
    <span class="sr-only">(opens in new tab)</span>
  )}
</a>
```

### Showcase Components

#### Modal Component (Showcase)

```astro
---
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
---

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
---
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
---

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

## Common Pitfalls

1. **Over-engineering**: Creating complex components too early
   - **Solution**: Start simple, enhance iteratively

2. **Missing Accessibility**: Forgetting ARIA labels, keyboard nav
   - **Solution**: Test with keyboard and screen readers

3. **Prop Drilling**: Too many component props
   - **Solution**: Use composition over configuration

4. **Style Conflicts**: Tailwind classes overriding each other
   - **Solution**: Use consistent ordering, avoid arbitrary values

## Exit Criteria

### MVP (Lite)
- [ ] Essential components built
- [ ] All components accessible
- [ ] TypeScript types complete
- [ ] Basic documentation written

### Showcase (Full)
- [ ] Complete component library
- [ ] Astrobook configured
- [ ] Visual testing active
- [ ] Interactive components tested
- [ ] Usage patterns documented
- [ ] A11y thoroughly validated

## Rollback Strategy

If components need major refactoring:

1. **Component API Changes**:
   - Keep old version temporarily
   - Add deprecation warnings
   - Migrate usage gradually

2. **Style System Changes**:
   - Use CSS variables for migration
   - Test in isolated pages
   - Update documentation

3. **Breaking Changes**:
   - Version components (v1, v2)
   - Provide migration guide
   - Update in phases

## AI Assistant Notes

### Key Files to Reference
- `src/components/ui/*` - Component library
- `astrobook.config.mjs` - Documentation setup
- Component usage in pages

### Common Prompts for This Phase
- "Create accessible button component with variants"
- "Build responsive grid system with Tailwind"
- "Set up Astrobook for component documentation"
- "Create modal with focus trap and ARIA"

### Context Requirements
- Design system tokens
- Component requirements
- Accessibility standards
- Browser support targets
