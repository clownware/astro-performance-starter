---
title: Phase 5 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 5
tableOfContents: true
pagefind: true
---

## Code Examples

### Button Component (Essential)

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
  'focus:outline-hidden focus:ring-2 focus:ring-offset-2',
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
  variant?: 'default' | 'outline-solid' | 'ghost';
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
  '4/3': 'aspect-4/3',
  '21/9': 'aspect-21/9',
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

## Demo-Specific Components

These are the unique, production-ready components used in the demo site that showcase advanced patterns and real-world implementations.

### SocialLink Component

A semantic social media link component with platform-specific configurations, accessibility features, and external link indicators.

```astro
---
// src/components/atoms/SocialLink.astro
import type { HTMLAttributes } from "astro/types";
import externalIcon from "@/assets/icons/external-link.svg";
import linkIcon from "@/assets/icons/link.svg";

type SocialPlatform = "github" | "linkedin" | "twitter" | "facebook" | "reddit";

interface Props extends HTMLAttributes<"a"> {
  platform: SocialPlatform;
  href: string;
  showIcon?: boolean;
}

const { platform, href, showIcon = true, class: className, ...attrs } = Astro.props;

// Platform-specific configurations (names only; styling is semantic and shared)
const platformConfig = {
  github: { name: "GitHub" },
  linkedin: { name: "LinkedIn" },
  twitter: { name: "Twitter" },
  facebook: { name: "Facebook" },
  reddit: { name: "Reddit" },
} satisfies Record<SocialPlatform, { name: string }>;

const config = platformConfig[platform];
const linkText = `${config.name} profile`;
---

<a 
  class:list={[
    "social-link",
    "inline-flex items-center group",
    "px-3 py-2",
    "text-sm font-medium",
    "text-foreground-secondary",
    "border border-transparent",
    "rounded-md",
    "transition-colors duration-200 motion-safe:transition-transform",
    "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
    // Semantic, accessible hover states
    "hover:text-foreground-primary hover:bg-background-secondary",
    // Respect reduced motion
    "motion-reduce:transition-none",
    className
  ]}
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`Visit my ${linkText} (opens in new tab)`}
  role="link"
  {...attrs}
>
  {showIcon && (
    <img
      src={linkIcon.src}
      alt=""
      aria-hidden="true"
      class="mr-2 h-4 w-4 shrink-0 motion-safe:group-hover:scale-110 motion-reduce:transform-none"
      width="16"
      height="16"
      loading="lazy"
      decoding="async"
    />
  )}
  
  <span class="social-link__text">
    {config.name}
  </span>
  
  <!-- External link indicator -->
  <img
    src={externalIcon.src}
    alt=""
    aria-hidden="true"
    title="Opens in new tab"
    class="ml-1 h-3 w-3 opacity-60 motion-safe:group-hover:translate-x-px motion-safe:group-hover:-translate-y-px motion-reduce:transform-none"
    width="12"
    height="12"
    loading="lazy"
    decoding="async"
  />
  
  <!-- Screen reader only text for context -->
  <span class="sr-only">
    (opens in new tab)
  </span>
</a>
```

**Usage Example:**

```astro
---
import SocialLink from "@/components/atoms/SocialLink.astro";
---

<div class="flex gap-4">
  <SocialLink platform="github" href="https://github.com/yourusername" />
  <SocialLink platform="linkedin" href="https://linkedin.com/in/yourusername" />
  <SocialLink platform="twitter" href="https://twitter.com/yourusername" showIcon={false} />
</div>
```

**Key Features:**

- Type-safe platform configurations
- Semantic design token usage (no hardcoded colors)
- Full accessibility with ARIA labels and screen reader text
- External link indicator with visual feedback
- Respects `prefers-reduced-motion`
- Hover animations with group states

---

### Tooltip Component

A pure CSS tooltip component with multiple positioning options and full accessibility support.

```astro
---
// src/components/atoms/Tooltip.astro
interface Props {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  class?: string;
}

const { text, position = "top", class: className } = Astro.props;

const positionClasses = {
  top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
  left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
  right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
};

const arrowBase = "absolute w-0 h-0 border-4";
type Position = "top" | "bottom" | "left" | "right";
const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 10)}`;

function getArrowClasses(pos: Position) {
  const map: Record<Position, string> = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-background-secondary",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-background-secondary",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-background-secondary",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-background-secondary",
  };
  return `${arrowBase} ${map[pos]}`;
}
---

<span class:list={["relative inline-block group", className]} data-tooltip tabindex="0" aria-describedby={tooltipId}>
  <slot />
  <div 
    class:list={[
      "absolute z-50 px-3 py-2 text-[0.8125rem] sm:text-xs text-foreground-primary bg-background-secondary rounded-md shadow-lg opacity-0 invisible pointer-events-none transition-opacity duration-200 motion-reduce:transition-none whitespace-normal wrap-break-word max-w-[80vw] sm:max-w-xs group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible group-hover:pointer-events-auto group-focus-within:pointer-events-auto",
      positionClasses[position]
    ]}
    data-tooltip-content
    id={tooltipId}
    role="tooltip"
  >
    {text}
    <div 
      class:list={[ getArrowClasses(position) ]}
      aria-hidden="true"
    ></div>
  </div>
</span>

<style>
  @media (prefers-reduced-motion: reduce) {
    [data-tooltip-content] {
      transition: none !important;
    }
  }
</style>
```

**Usage Example:**

```astro
---
import Tooltip from "@/components/atoms/Tooltip.astro";
---

<p>
  This is a <Tooltip text="Additional helpful information" position="top">
    <span class="underline decoration-dotted cursor-help">technical term</span>
  </Tooltip> that needs explanation.
</p>

<Tooltip text="Click to learn more" position="right">
  <button>Help</button>
</Tooltip>
```

**Key Features:**

- Pure CSS implementation (zero JavaScript)
- Four positioning options (top, bottom, left, right)
- Keyboard accessible with `tabindex` and focus states
- Semantic ARIA attributes (`role="tooltip"`, `aria-describedby`)
- Responsive max-width for mobile devices
- Respects `prefers-reduced-motion`
- Uses design tokens for consistent theming

---

### ContactForm Component

A production-ready contact form with real-time validation, loading states, and comprehensive accessibility features.

```astro
---
// src/components/molecules/ContactForm.astro
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"form"> {
  action?: string;
}

const { action = "/contact", class: className, ...attrs } = Astro.props;
---

<form 
  class:list={[
    "contact-form",
    "max-w-lg mx-auto",
    "space-y-6",
    "p-6",
    "bg-background-secondary",
    "border border-primary",
    "rounded-lg",
    "shadow-sm",
    className
  ]}
  action={action}
  name="contact"
  method="POST"
  data-static-form-name="contact"
  {...attrs}
>
  <!-- Honeypot field for spam protection -->
  <p class="hidden">
    <label>
      Don't fill this out if you're human: <input name="bot-field" />
    </label>
  </p>
  
  <div class="contact-form__field">
    <label 
      for="contact-name" 
      class="block text-sm font-medium text-foreground-primary mb-2"
    >
      Name <span class="text-secondary-600" aria-label="required">*</span>
    </label>
    <input
      type="text"
      id="contact-name"
      name="name"
      required
      minlength="2"
      maxlength="100"
      autocomplete="name"
      class="w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-foreground-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
      placeholder="Your full name"
      aria-describedby="name-error"
    />
    <div id="name-error" class="contact-form__error mt-1 text-sm text-secondary-600" role="alert" aria-live="polite"></div>
  </div>

  <div class="contact-form__field">
    <label 
      for="contact-email" 
      class="block text-sm font-medium text-foreground-primary mb-2"
    >
      Email <span class="text-secondary-600" aria-label="required">*</span>
    </label>
    <input
      type="email"
      id="contact-email"
      name="email"
      required
      maxlength="254"
      autocomplete="email"
      class="w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-foreground-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
      placeholder="your.email@example.com"
      aria-describedby="email-error"
    />
    <div id="email-error" class="contact-form__error mt-1 text-sm text-secondary-600" role="alert" aria-live="polite"></div>
  </div>

  <div class="contact-form__field">
    <label 
      for="contact-subject" 
      class="block text-sm font-medium text-foreground-primary mb-2"
    >
      Subject
    </label>
    <input
      type="text"
      id="contact-subject"
      name="subject"
      maxlength="200"
      class="w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-foreground-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
      placeholder="What's this about?"
      aria-describedby="subject-error"
    />
    <div id="subject-error" class="contact-form__error mt-1 text-sm text-secondary-600" role="alert" aria-live="polite"></div>
  </div>

  <div class="contact-form__field">
    <label 
      for="contact-message" 
      class="block text-sm font-medium text-foreground-primary mb-2"
    >
      Message <span class="text-secondary-600" aria-label="required">*</span>
    </label>
    <textarea
      id="contact-message"
      name="message"
      required
      minlength="10"
      maxlength="2000"
      rows="5"
      class="w-full px-3 py-2 border border-default rounded-md shadow-sm placeholder-foreground-secondary focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical transition-colors duration-200"
      placeholder="Tell us more about your inquiry..."
      aria-describedby="message-error message-help"
    ></textarea>
    <div id="message-help" class="mt-1 text-sm text-foreground-secondary">
      Minimum 10 characters, maximum 2000 characters
    </div>
    <div id="message-error" class="contact-form__error mt-1 text-sm text-secondary-600" role="alert" aria-live="polite"></div>
  </div>

  <div class="contact-form__actions">
    <button
      type="submit"
      class="contact-form__submit w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      aria-describedby="submit-help"
    >
      <span class="contact-form__submit-text">Send Message</span>
      <span class="contact-form__submit-loading hidden ml-2" aria-hidden="true">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    </button>
    <div id="submit-help" class="mt-2 text-sm text-foreground-secondary text-center">
      Your message will be sent securely
    </div>
  </div>

  <!-- Success/Error Messages -->
  <div class="contact-form__status hidden" role="status" aria-live="polite">
    <div class="contact-form__success hidden p-4 bg-success-50 border border-success-200 rounded-md">
      <div class="flex items-center">
        <span class="text-success-600 mr-2" aria-hidden="true">✓</span>
        <span class="text-success-800 font-medium">Message sent successfully!</span>
      </div>
      <p class="text-success-700 mt-1">Thank you for your message. We'll get back to you soon.</p>
    </div>
    
    <div class="contact-form__error-message hidden p-4 bg-error-50 border border-error-200 rounded-md">
      <div class="flex items-center">
        <span class="text-secondary-600 mr-2" aria-hidden="true">⚠</span>
        <span class="text-secondary-800 font-medium">Error sending message</span>
      </div>
      <p class="text-secondary-700 mt-1">Please try again or contact us directly.</p>
    </div>
  </div>
</form>

<script>
  // Enhanced form handling with validation and loading states
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form') as HTMLFormElement;
    if (!form) return;

    const submitButton = form.querySelector('.contact-form__submit') as HTMLButtonElement;
    const submitText = form.querySelector('.contact-form__submit-text') as HTMLElement;
    const submitLoading = form.querySelector('.contact-form__submit-loading') as HTMLElement;
    const statusContainer = form.querySelector('.contact-form__status') as HTMLElement;
    const successMessage = form.querySelector('.contact-form__success') as HTMLElement;
    const errorMessage = form.querySelector('.contact-form__error-message') as HTMLElement;

    // Form submission handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous status
      statusContainer.classList.add('hidden');
      successMessage.classList.add('hidden');
      errorMessage.classList.add('hidden');
      
      // Show loading state
      submitButton.disabled = true;
      submitText.textContent = 'Sending...';
      submitLoading.classList.remove('hidden');
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          // Success
          statusContainer.classList.remove('hidden');
          successMessage.classList.remove('hidden');
          form.reset();
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        // Error
        statusContainer.classList.remove('hidden');
        errorMessage.classList.remove('hidden');
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitText.textContent = 'Send Message';
        submitLoading.classList.add('hidden');
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });

    function validateField(e: Event) {
      const field = e.target as HTMLInputElement | HTMLTextAreaElement;
      const errorElement = document.getElementById(`${field.name}-error`);
      if (!errorElement) return;

      let errorMessage = '';

      if (field.hasAttribute('required') && !field.value.trim()) {
        errorMessage = `${field.labels?.[0]?.textContent?.replace('*', '').trim()} is required`;
      } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        errorMessage = 'Please enter a valid email address';
      } else if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength') || '0')) {
        errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
      }

      if (errorMessage) {
        errorElement.textContent = errorMessage;
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('border-secondary-500', 'focus:border-secondary-500', 'focus:ring-secondary-500');
      } else {
        clearFieldError(e);
      }
    }

    function clearFieldError(e: Event) {
      const field = e.target as HTMLInputElement | HTMLTextAreaElement;
      const errorElement = document.getElementById(`${field.name}-error`);
      if (!errorElement) return;

      errorElement.textContent = '';
      field.removeAttribute('aria-invalid');
      field.classList.remove('border-secondary-500', 'focus:border-secondary-500', 'focus:ring-secondary-500');
    }

    function isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
</script>

<style>
  .contact-form__field {
    position: relative;
  }
  
  .contact-form__error:empty {
    display: none;
  }
  
  .contact-form__submit:disabled {
    cursor: not-allowed;
  }
  
  /* Enhanced focus styles for better accessibility */
  .contact-form input:focus,
  .contact-form textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  /* Improved error state styling */
  .contact-form input[aria-invalid="true"],
  .contact-form textarea[aria-invalid="true"] {
    border-color: rgb(239 68 68);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  /* Loading animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
```

**Usage Example:**

```astro
---
import ContactForm from "@/components/molecules/ContactForm.astro";
---

<section class="py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Get In Touch</h2>
    <ContactForm action="/api/contact" />
  </div>
</section>
```

**Key Features:**

- Real-time client-side validation with error messages
- Loading states with spinner animation
- Success/error feedback with ARIA live regions
- Honeypot field for spam protection
- Full accessibility (ARIA labels, error associations, keyboard navigation)
- Semantic HTML with proper autocomplete attributes
- Progressive enhancement (works without JavaScript)
- Uses design tokens for consistent theming

---

### ExpandableFeatureCard Component

An interactive feature card with CSS-only expandable details and synchronized expansion across multiple cards.

```astro
---
// src/components/molecules/ExpandableFeatureCard.astro
import Badge from "@/components/atoms/Badge.astro";
import Card from "@/components/molecules/Card.astro";

interface Props {
  icon: string;
  title: string;
  description: string;
  metric: string;
  expandedDetails: string[];
  techTerms: Record<string, string>;
}

const { icon, title, description, metric, expandedDetails, techTerms } = Astro.props;

// Function to wrap technical terms with tooltips
function wrapTechTerms(text: string, _terms?: Record<string, string>): string {
  // Tooltip highlighting removed per UX requirements
  return text;
}

const processedDescription = wrapTechTerms(description, techTerms);
---

<Card data-card class="relative p-6 bg-background-primary border border-primary hover:border-primary-300 transition-colors group">
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-start space-x-4 flex-1">
      <div class="text-2xl" aria-hidden="true">{icon}</div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-foreground-primary pr-4">
          {title}
        </h3>
      </div>
    </div>
    <Badge class="bg-primary-100 text-primary-800 text-xs shrink-0">
      {metric}
    </Badge>
  </div>
  
  <div class="pl-12">
    <p class="text-foreground-secondary mb-4" set:html={processedDescription}></p>
    
    <!-- Expandable details with working CSS-only solution -->
    <details class="feature-details group">
      <summary class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 mb-3 transition-colors cursor-pointer list-none">
        <span>Show details</span>
        <svg class="w-4 h-4 transform transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </summary>
      
      <div class="expand-content">
        <ul class="space-y-2 text-sm text-foreground-secondary">
          {expandedDetails.map((detail) => (
            <li class="flex items-start gap-2">
              <span class="text-primary-500 mt-1 text-xs">▸</span>
              <span set:html={wrapTechTerms(detail, techTerms)}></span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  </div>
</Card>

<script>
  // Functional approach for synchronized expand behavior
  const syncFeatureCards = () => {
    const details = document.querySelectorAll<HTMLDetailsElement>('.feature-details');
    
    const syncAllCards = (shouldOpen: boolean) => {
      details.forEach(detail => {
        detail.open = shouldOpen;
      });
    };
    
    const handleToggle = (event: Event) => {
      const target = event.target as HTMLDetailsElement;
      const isOpening = target.open;
      syncAllCards(isOpening);
    };
    
    // Add event listeners using functional approach
    details.forEach(detail => {
      detail.addEventListener('toggle', handleToggle);
    });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFeatureCards);
  } else {
    syncFeatureCards();
  }
</script>

<style>
  /* Remove default details/summary styling */
  .feature-details summary::-webkit-details-marker {
    display: none;
  }
  
  .feature-details summary::marker {
    display: none;
  }
  
  /* Smooth expand animation */
  .feature-details .expand-content {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

**Usage Example:**

```astro
---
import ExpandableFeatureCard from "@/components/molecules/ExpandableFeatureCard.astro";
---

<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <ExpandableFeatureCard
    icon="⚡"
    title="Lightning Fast"
    description="Optimized for speed with minimal JavaScript"
    metric="95+ Score"
    expandedDetails={[
      "Zero JavaScript by default",
      "Optimized asset loading",
      "Efficient caching strategies",
      "Core Web Vitals optimized"
    ]}
    techTerms={{}}
  />
  
  <ExpandableFeatureCard
    icon="♿"
    title="Accessible First"
    description="WCAG AA compliant out of the box"
    metric="100% A11y"
    expandedDetails={[
      "Semantic HTML structure",
      "Keyboard navigation support",
      "Screen reader optimized",
      "Color contrast validated"
    ]}
    techTerms={{}}
  />
</div>
```

**Key Features:**

- CSS-only expandable details (no JavaScript required for basic functionality)
- Synchronized expansion across all cards on the page
- Smooth animations with `@keyframes`
- Badge for metrics display
- Flexible content with HTML support
- Functional programming approach in script
- Uses design tokens for theming

---

### PostCard Component

A reusable blog post card component with image, metadata, tags, and reading time. Supports both featured and regular variants with optimized loading strategies.

```astro
---
// src/components/molecules/PostCard.astro
import type { CollectionEntry } from "astro:content";
import Badge from "@/components/atoms/Badge.astro";
import Image from "@/components/atoms/Image.astro";
import Card from "@/components/molecules/Card.astro";

interface Props {
  post: CollectionEntry<"blog"> & {
    metadata: {
      publishedDate: string;
      readingTime: string;
      isRecent: boolean;
    };
  };
  featured?: boolean;
  class?: string;
}

const { post, featured = false, class: className } = Astro.props;
const img = post.data.cardImage ?? post.data.cover;
---

<Card class:list={["group relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg", className]}>
  <div class="aspect-video overflow-hidden">
    {img && (
      typeof img === "string" ? (
        <img
          src={img}
          alt={post.data.coverAlt || `Image for ${post.data.title}`}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <Image
          src={img}
          alt={post.data.coverAlt || `Image for ${post.data.title}`}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" : undefined}
          loading={featured ? "eager" : "lazy"}
        />
      )
    )}
    {post.metadata.isRecent && (
      <div class="absolute left-3 top-3">
        <Badge>New</Badge>
      </div>
    )}
  </div>

  <div class="p-6">
    <div class="mb-3 flex flex-wrap gap-2">
      {featured
        ? post.data.tags?.slice(0, 3).map((tag: string) => <Badge>{tag}</Badge>)
        : post.data.tags?.map((tag: string) => <Badge>{tag}</Badge>)
      }
    </div>

    <h3 class="mb-3 text-xl font-semibold text-foreground-default">
      <a
        href={`/blog/${post.slug}/`}
        class:list={[
          "transition-colors",
          featured ? "stretched-link hover:text-accent-600" : "after:absolute after:inset-0 group-hover:text-accent-600"
        ]}
      >
        {post.data.title}
      </a>
    </h3>

    <p class="mb-4 text-foreground-subtle line-clamp-3">
      {post.data.description}
    </p>

    <div class="flex items-center justify-between text-sm text-foreground-subtle">
      <span>{post.metadata.publishedDate}</span>
      <span>{post.metadata.readingTime}</span>
    </div>
  </div>
</Card>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .stretched-link::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    content: "";
  }
</style>
```

**Usage Example:**

```astro
---
import { getCollection } from "astro:content";
import PostCard from "@/components/molecules/PostCard.astro";
import { formatPostMetadata } from "@/utils/formatDate";

// Get featured posts
const featuredPosts = await getCollection("blog", ({ data }) => 
  data.featured && !data.draft
);

// Add metadata
const postsWithMetadata = featuredPosts.map((post) => ({
  ...post,
  metadata: formatPostMetadata(post.data.date, post.body),
}));
---

<div class="flex flex-wrap justify-center gap-8">
  {postsWithMetadata.map((post) => (
    <PostCard
      post={post}
      featured={true}
      class="md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
    />
  ))}
</div>
```

**Key Features:**

- Accepts `CollectionEntry<"blog">` with pre-computed metadata
- `featured` prop controls loading strategy (eager vs lazy) and tag display (3 vs all)
- Supports both string URLs and Astro Image assets
- "New" badge for recent posts (controlled by `metadata.isRecent`)
- Responsive image with hover zoom effect
- Line-clamped description (3 lines max)
- Reading time and publish date display
- Stretched link pattern for entire card clickability (featured) or pseudo-element (regular)
- Fully accessible with semantic HTML
- Composable with responsive grid layouts

---

### ProjectCard Component

A comprehensive project showcase card with metadata, tech stack display, and action buttons for demos and source code.

```astro
---
// src/components/molecules/ProjectCard.astro
import type { HTMLAttributes } from "astro/types";
import Badge from "@/components/atoms/Badge.astro";
import { formatDate } from "@/utils/formatDate";

interface Props extends HTMLAttributes<"article"> {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  href?: string;
  date?: Date | string;
  tags?: string[];
  client?: string;
  projectRole?: string;
  duration?: string;
}

const {
  title,
  description,
  image,
  techStack,
  demoUrl,
  githubUrl,
  href,
  date,
  tags = [],
  client,
  projectRole,
  duration,
  class: className,
  ...attrs
} = Astro.props;

// Format date if provided
const formattedDate = date ? formatDate(date, "short") : null;
const isRecent = date ? Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000 : false;
---

{href ? (
  <a href={href} class="block w-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg transition-shadow duration-300 hover:shadow-lg">
    <article 
      class:list={["w-full", 
        "project-card",
        "bg-background-secondary",
        "border border-primary",
        "rounded-lg",
        "overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-lg hover:border-primary-300",
        "focus-within:ring-2 focus-within:ring-primary-500",
        className
      ]} 
      {...attrs}
    >
      <div class="project-card__image-container relative overflow-hidden">
        <img 
          src={image} 
          alt={`Screenshot of ${title} project`}
          class="project-card__image w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <div class="project-card__content p-6">
        <header class="project-card__header mb-4">
          <div class="project-card__meta flex flex-wrap items-center gap-2 mb-3 text-sm text-foreground-secondary">
            {formattedDate && (
              <time datetime={date instanceof Date ? date.toISOString() : date}>
                {formattedDate}
              </time>
            )}
            {isRecent && (
              <Badge class="bg-secondary-600 text-white text-xs px-2 py-0.5">New</Badge>
            )}
            {client && (
              <span class="flex items-center gap-1">
                <span class="text-foreground-secondary">•</span>
                <span class="font-medium">{client}</span>
              </span>
            )}
            {projectRole && (
              <span class="flex items-center gap-1">
                <span class="text-foreground-secondary">•</span>
                <span>{projectRole}</span>
              </span>
            )}
            {duration && (
              <span class="flex items-center gap-1">
                <span class="text-foreground-secondary">•</span>
                <span>{duration}</span>
              </span>
            )}
          </div>
          
          <h3 class="project-card__title text-xl font-semibold text-foreground-primary mb-2">
            {title}
          </h3>
          <p class="project-card__description text-foreground-secondary leading-relaxed">
            {description}
          </p>
        </header>
        
        {tags.length > 0 && (
          <div class="project-card__tags mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-medium text-foreground-secondary uppercase tracking-wide">Categories</span>
            </div>
            <ul class="flex flex-wrap gap-2" role="list">
              {tags.map((tag) => (
                <li>
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div class="project-card__tech-stack mb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-medium text-foreground-secondary uppercase tracking-wide">Technologies</span>
          </div>
          <ul class="flex flex-wrap gap-2" role="list">
            {techStack.map((tech) => (
              <li>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {(demoUrl || githubUrl) && (
          <footer class="project-card__actions flex gap-3">
            {demoUrl && (
              <a 
                href={demoUrl}
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live demo of ${title} project`}
              >
                <span class="mr-2" aria-hidden="true">🚀</span>
                Live Demo
              </a>
            )}
            {githubUrl && (
              <a 
                href={githubUrl}
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground-primary bg-background-secondary border border-primary rounded-md hover:bg-background-primary focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${title} source code on GitHub`}
              >
                <span class="mr-2" aria-hidden="true">📁</span>
                Source Code
              </a>
            )}
          </footer>
        )}
      </div>
    </article>
  </a>
) : (
  <!-- Non-linked version (same structure without wrapper link) -->
  <article 
    class:list={["w-full", 
      "project-card",
      "bg-background-subtle",
      "border border-default",
      "rounded-lg",
      "overflow-hidden",
      "transition-all duration-300",
      "hover:shadow-lg hover:border-primary-300",
      className
    ]} 
    {...attrs}
  >
    <!-- Same content structure as above -->
  </article>
)}

<style>
  .project-card {
    /* Ensure consistent card height in grid layouts */
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .project-card__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .project-card__actions {
    margin-top: auto;
  }
  
  .project-card__image-container::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 70%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }
  
  /* Enhanced focus states for better accessibility */
  .project-card:focus-within .project-card__image {
    transform: scale(1.02);
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .project-card__actions {
      flex-direction: column;
    }
    
    .project-card__actions a {
      justify-content: center;
    }
  }
</style>
```

**Usage Example:**

```astro
---
import ProjectCard from "@/components/molecules/ProjectCard.astro";
---

<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <ProjectCard
    title="E-Commerce Platform"
    description="A modern, performant e-commerce solution built with Astro and Stripe"
    image="/images/projects/ecommerce.jpg"
    techStack={["Astro", "React", "Stripe", "Tailwind CSS"]}
    tags={["Web App", "E-Commerce"]}
    demoUrl="https://demo.example.com"
    githubUrl="https://github.com/username/project"
    href="/projects/ecommerce"
    date={new Date("2024-01-15")}
    client="Acme Corp"
    projectRole="Lead Developer"
    duration="3 months"
  />
</div>
```

**Key Features:**

- Flexible metadata display (date, client, role, duration)
- "New" badge for recent projects (< 7 days old)
- Tech stack and category tags
- Optional wrapper link for entire card
- Action buttons for demo and source code
- Responsive image with hover zoom effect
- Gradient overlay on images
- Flexbox layout ensures consistent card heights in grids
- Full accessibility with semantic HTML and ARIA labels
- Mobile-responsive action buttons

---

### Advanced Components

#### Modal Component (Advanced)

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
            class="text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
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

#### Tabs Component (Advanced)

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

### Astrobook Configuration (Advanced)

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
