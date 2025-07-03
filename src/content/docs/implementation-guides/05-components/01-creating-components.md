---
title: 'Creating Components: The Link Component'
description: 'A step-by-step guide to creating a flexible, reusable Link component in your Astro project.'
lastUpdated: 2025-07-03
---

This guide walks you through creating a reusable `Link` component. This is a powerful pattern that teaches you how to abstract away complexity and enforce consistency across your site.

## Why Create a Link Component?

A custom `Link` component can handle logic that a simple `<a>` tag can't:

- Differentiate between internal and external links.
- Automatically add `rel="noopener noreferrer"` to external links for security.
- Apply specific styles or add an icon to external links.
- Ensure all links are accessible and consistently styled.

## Step 1: Create the Component File

Create a new file at `src/components/ui/Link.astro`.

## Step 2: Define the Component Props

We'll use a TypeScript interface to define the props our component will accept.

```astro
---
// src/components/ui/Link.astro
interface Props {
  href: string;
  class?: string;
  ariaLabel?: string;
  isExternal?: boolean;
}

const { href, class: className, ariaLabel, isExternal } = Astro.props;
---
```

## Step 3: Implement the Link Logic

Now, let's add the markup. We'll use a conditional to handle the `rel` and `target` attributes for external links.

```astro
---
// ... (props definition from above)
---
<a
  href={href}
  class={`inline-block transition hover:text-primary-600 focus-visible-ring ${className}`}
  aria-label={ariaLabel}
  target={isExternal ? '_blank' : undefined}
  rel={isExternal ? 'noopener noreferrer' : undefined}
>
  <slot />
  {isExternal && (
    <span class="ml-1 inline-block size-4 align-text-bottom">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </span>
  )}
</a>
```

## Step 4: Using Your New Component

Now you can use your `Link` component anywhere in your project.

**Internal Link:**

```astro
<Link href="/about">About Us</Link>
```

**External Link:**

```astro
<Link href="https://github.com" isExternal={true}>GitHub</Link>
```

By creating this component, you've made your links more consistent, secure, and maintainable. You can now extend this pattern to other UI elements in your project.
