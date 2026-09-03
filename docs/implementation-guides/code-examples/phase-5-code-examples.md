---
title: Phase 5 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 5
tableOfContents: true
pagefind: true
---

## Code Examples

These examples are the template's shipped components, reproduced from source and organised by
atomic design (ADR-003): `src/components/{atoms,molecules,structural}/`. Scope labels follow
ADR-033 (Essential / Recommended / Advanced) and match the
[Component Scope Reference](/implementation-guides/active-phases/phase-5-components/) for this phase.
Every component below is rendered live on the `/showcase` page, so you can compare the code with
the real thing in the browser. Composition rules live in
[Component Patterns](/patterns/component-patterns/).

### Button Component (Essential)

Polymorphic button/link: renders an `<a>` when `href` is provided, a `<button>` otherwise.
There is no `as`, `external`, or `danger` variant — extend `getVariantStyles` if your project
needs one.

```astro
---
// src/components/atoms/Button.astro
interface Props {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  class?: string;
  href?: string;
  disabled?: boolean;
  [key: string]: any;
}

const {
  variant = "primary",
  size = "md",
  class: className,
  href,
  disabled = false,
  ...rest
} = Astro.props as Props;

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-semibold no-underline transition-colors duration-200 motion-reduce:transition-none focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 forced-colors:border forced-colors:text-[ButtonText]";

function getVariantStyles(v: Props["variant"]) {
  switch (v) {
    case "secondary":
      // border-emphasis (gray-600 light, gray-300 dark) maintains ≥3:1 against
      // both the page bg and the button bg, satisfying WCAG AA non-text
      // contrast.
      return "bg-surface text-foreground border border-border-emphasis hover:bg-background active:bg-background focus:ring-primary-500 shadow-sm hover:shadow";
    case "ghost":
      // Subtle default border for high-contrast support
      return "text-muted-foreground border border-border/40 hover:border-border hover:bg-surface hover:text-foreground active:bg-surface focus:ring-primary-500";
    default:
      return "bg-primary-600 text-primary-foreground hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-sm hover:shadow-md";
  }
}

function getSizeStyles(s: Props["size"]) {
  // Remove fixed heights to avoid clipping; rely on padding for accessible hit areas
  switch (s) {
    case "sm":
      return "text-xs px-3 py-2 min-h-[2rem]";
    case "lg":
      return "text-base px-6 py-3 min-h-[2.75rem]";
    default:
      return "text-sm px-4 py-2.5 min-h-[2.75rem]";
  }
}

// Render appropriate element without a dynamic uppercase variable to satisfy lint rules
const classList = [baseStyles, getVariantStyles(variant), getSizeStyles(size), className];
---
{href ? (
  <a
    class:list={classList}
    href={href}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : undefined}
    {...rest}
  >
    <slot />
  </a>
) : (
  <button
    class:list={classList}
    type="button"
    aria-disabled={disabled}
    disabled={disabled}
    {...rest}
  >
    <slot />
  </button>
)}
```

**Usage:**

```astro
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost" size="sm">Ghost</Button>
<Button variant="primary" disabled>Disabled</Button>
<Button variant="ghost" size="sm" href="/blog/">Read more →</Button>
```

### Card Component (Essential)

The Card is deliberately minimal: a bordered surface plus an optional `@starting-style` entry
animation. Padding, variants and hover effects are added by the consumer through `class`.

```astro
---
// src/components/molecules/Card.astro
interface Props {
  class?: string;
  animated?: boolean;
}

const { class: className, animated = false } = Astro.props;
---

<div class:list={[
  "card overflow-hidden rounded-lg border border-border bg-surface shadow-sm",
  animated && "card--animated",
  className,
]}>
  <slot />
</div>

<style>
  /*
   * @starting-style enables entry animations when the card first renders —
   * particularly visible during View Transitions page navigation.
   * Previously required JavaScript (requestAnimationFrame or Intersection Observer).
   */
  @media (prefers-reduced-motion: no-preference) {
    .card--animated {
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }

    @starting-style {
      .card--animated {
        opacity: 0;
        transform: translateY(0.5rem);
      }
    }
  }
</style>
```

### Section Component (Essential)

There are no `size` / `background` / `variant` props — vertical rhythm is fixed
(`py-16 sm:py-24 lg:py-32`) and any background or override is passed through `class`.

```astro
---
// src/components/structural/Section.astro
interface Props {
  class?: string;
  id?: string;
  fullHeight?: boolean; // Optional: allow disabling full viewport height when needed
  ariaLabel?: string; // Optional: ARIA label for screen readers (recommended for snap sections)
  ariaLabelledBy?: string; // Optional: reference to heading ID that labels this section
}

const {
  class: className,
  id,
  fullHeight = false,
  ariaLabel,
  ariaLabelledBy,
} = Astro.props as Props;
---

<section
  id={id}
  class:list={[
    "py-16 sm:py-24 lg:py-32",
    fullHeight && "min-h-screen flex flex-col justify-center snap-start",
    className,
  ]}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
>
  <slot />
</section>
```

**Usage:**

```astro
<Section id="features" class="bg-surface" ariaLabelledBy="features-heading">
  <Container>
    <h2 id="features-heading">Features</h2>
  </Container>
</Section>
```

### Container Component (Essential)

A single width constraint (`max-w-7xl`) with responsive gutters. Narrower layouts pass an
override such as `class="max-w-3xl"`.

```astro
---
// src/components/structural/Container.astro
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={["mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className]}>
  <slot />
</div>
```

### Grid Component (Essential)

The Grid is a container-query grid: columns respond to the grid's own width (`@md` / `@lg`), not
the viewport. Override columns or gap through `class` (for example
`class="@lg:grid-cols-4 gap-6"`).

```astro
---
// src/components/structural/Grid.astro
interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<div class:list={["@container grid grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-3", className]}>
  <slot />
</div>
```

### Image Component Wrapper (Essential)

The template's Image atom wraps `astro:assets` with responsive-srcset defaults, AVIF-first format
resolution, and an SVG pass-through (ADR-030). Interface excerpt — see
[`src/components/atoms/Image.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/atoms/Image.astro)
for the full implementation:

```astro
---
// src/components/atoms/Image.astro (excerpt)
import { Image as AstroImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { resolveImageFormat } from "@/utils/resolveImageFormat";

interface Props {
  src: ImageMetadata | string | Promise<{ default: ImageMetadata }>;
  alt: string;
  class?: string;
  format?: "avif" | "webp" | "png" | "jpeg" | "jpg" | "svg" | "gif";
  quality?: number | "low" | "mid" | "high" | "max";
  width?: number;
  height?: number;
  sizes?: string;
  widths?: number[];
  densities?: number[];
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  /** Optional shadow styles for performance modularity */
  hasShadow?: boolean;
}
---
```

Key behaviors:

- Defaults to AVIF output (via `resolveImageFormat`) with `loading="lazy"` and `decoding="async"`
- Named quality presets map to `low: 40`, `mid: 60`, `high: 75` (default), `max: 90`
- Generates a widths-based srcset (`[320, 640, 1024]`, `sizes="100vw"`) unless fixed dimensions
  are passed, in which case it switches to a densities-based srcset (`[1.5, 2]`)
- SVG sources pass through unprocessed — a vector stays a vector
- String `src` paths fall back to a native `<img>` element
- Base classes are `rounded-lg transition-all duration-300 ease-in-out`; `hasShadow` adds
  `shadow-md hover:shadow-xl`

### Badge Component (Essential)

```astro
---
// src/components/atoms/Badge.astro
import type { HTMLAttributes } from "astro/types";

interface Props extends Omit<HTMLAttributes<"span">, "class"> {
  class?: string;
  variant?: "primary" | "secondary" | "neutral";
  size?: "xs" | "sm" | "md";
}

const { class: className, role, variant = "primary", size = "sm", ...rest } = Astro.props;

const variantClasses: Record<"primary" | "secondary" | "neutral", string> = {
  primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
  secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200",
  neutral: "bg-surface text-muted-foreground border border-border",
};

const sizeClasses: Record<"xs" | "sm" | "md", string> = {
  xs: "text-xs px-[0.5rem] py-0.5",
  sm: "text-sm px-2.5 py-0.5",
  md: "text-base px-[0.75rem] py-[0.25rem]",
};
---
<span
  role={role}
  class:list={[
    'badge inline-flex items-center rounded-full font-medium',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]}
  {...rest}
>
  <slot />
</span>

<style>
  /*
   * prefers-contrast: more — strengthens badge visibility for users who
   * request higher contrast.
   */
  @media (prefers-contrast: more) {
    .badge {
      border: 2px solid currentColor;
      font-weight: 700;
    }
  }
</style>
```

### Link Component (Recommended)

The template does not ship an opinionated Astro `Link` atom. Building one is covered step by step
in the dedicated tutorial, so you understand the internal/external split, consistent styling and
accessibility attributes before adopting it:

- **Guide: [Creating Components: The Link Component](/implementation-guides/guides/components-guide/)**

What *is* shipped is a small Preact `Link` for MDX content
([`src/components/mdx/Link.tsx`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/mdx/Link.tsx),
see [MDX Components](/patterns/mdx-components/)). It detects `http://` / `https://` hrefs and
adds `target="_blank"`, `rel="noopener noreferrer"` and an sr-only "(opens in new tab)" hint;
internal links render a plain styled `<a>`:

```tsx
// src/components/mdx/Link.tsx (excerpt)
interface LinkProps {
  children: ComponentChildren;
  href?: string;
  class?: string;
  [key: string]: unknown;
}
```

## Demo-Specific Components

These components power the demo site (blog, projects, contact) and demonstrate the template's
real-world patterns. They are shipped, tested and rendered on `/showcase`; keep, adapt or delete
them per ADR-056 when you replace the demo content.

### SocialLink Component (Recommended)

A semantic social link with platform-specific labels, the shared `Icon` atom (ADR-055), and an
external-link indicator. `purpose="share"` switches the accessible name from "Visit my … profile"
to "Share this post on …" — the blog layout uses it for the share row.

```astro
---
// src/components/atoms/SocialLink.astro
import type { HTMLAttributes } from "astro/types";
import Icon from "@/components/atoms/Icon.astro";

type SocialPlatform = "github" | "linkedin" | "twitter" | "facebook" | "reddit";

interface Props extends HTMLAttributes<"a"> {
  platform: SocialPlatform;
  href: string;
  showIcon?: boolean;
  purpose?: "profile" | "share";
}

const {
  platform,
  href,
  showIcon = true,
  purpose = "profile",
  class: className,
  ...attrs
} = Astro.props;

// Platform-specific configurations with icon names
type IconName = "github" | "arrow-down" | "arrow-right" | "external-link" | "custom";

const platformConfig = {
  github: { name: "GitHub", icon: "github" as IconName },
  linkedin: { name: "LinkedIn", icon: "custom" as IconName },
  twitter: { name: "Twitter", icon: "custom" as IconName },
  facebook: { name: "Facebook", icon: "custom" as IconName },
  reddit: { name: "Reddit", icon: "custom" as IconName },
} satisfies Record<SocialPlatform, { name: string; icon: IconName }>;

const config = platformConfig[platform];
const ariaText =
  purpose === "share"
    ? `Share this post on ${config.name} (opens in new tab)`
    : `Visit my ${config.name} profile (opens in new tab)`;
---

<a
  class:list={[
    "social-link",
    "inline-flex items-center group",
    "px-3 py-2",
    "text-sm font-medium",
    "text-muted-foreground",
    "border border-transparent",
    "rounded-md",
    "transition-colors duration-200 motion-safe:transition-transform",
    "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
    // Semantic, accessible hover states
    "hover:text-foreground hover:bg-surface",
    // Respect reduced motion
    "motion-reduce:transition-none",
    className
  ]}
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={ariaText}
  role="link"
  {...attrs}
>
  {showIcon && (
    <Icon
      name={config.icon}
      class="size-4 mr-2 shrink-0 motion-safe:group-hover:scale-110 motion-reduce:transform-none"
      decorative
    />
  )}

  <span class="social-link__text">
    {config.name}
  </span>

  <!-- External link indicator -->
  <Icon
    name="external-link"
    class="size-3 ml-1 opacity-60 motion-safe:group-hover:translate-x-px motion-safe:group-hover:-translate-y-px motion-reduce:transform-none"
    decorative
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
  <SocialLink platform="twitter" href={shareUrls.twitter} purpose="share" showIcon={false} />
</div>
```

**Key Features:**

- Type-safe platform configurations
- Icons come from the `Icon` atom registry, not per-platform SVG assets
- `purpose` prop switches between profile and share accessible names
- Semantic design token usage (no hardcoded colors)
- External link indicator plus sr-only "(opens in new tab)" text
- Respects `prefers-reduced-motion`

---

### Tooltip Component (Advanced)

A CSS-only tooltip (`group-hover` / `group-focus-within`) with four positions and ARIA wiring.

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
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-surface",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-surface",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-surface",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-surface",
  };
  return `${arrowBase} ${map[pos]}`;
}
---

<span class:list={["tooltip-trigger relative inline-block group", className]} data-tooltip tabindex="0" aria-describedby={tooltipId}>
  <slot />
  <div
    class:list={[
      "tooltip-content absolute z-50 px-3 py-2 text-[0.8125rem] sm:text-xs text-foreground bg-surface rounded-md shadow-lg opacity-0 invisible pointer-events-none transition-opacity duration-200 motion-reduce:transition-none whitespace-normal wrap-break-word max-w-[80vw] sm:max-w-xs group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible group-hover:pointer-events-auto group-focus-within:pointer-events-auto",
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
    <span class="underline decoration-dashed decoration-muted-foreground cursor-help">technical term</span>
  </Tooltip> that needs explanation.
</p>

<Tooltip text="Click to learn more" position="right">
  <button type="button">Help</button>
</Tooltip>
```

**Key Features:**

- Pure CSS implementation (zero JavaScript)
- Four positioning options (top, bottom, left, right)
- Keyboard accessible with `tabindex` and focus states
- Semantic ARIA attributes (`role="tooltip"`, `aria-describedby`)
- Responsive max-width for mobile devices
- Respects `prefers-reduced-motion`
- Uses design tokens (`bg-surface`, `text-foreground`) for consistent theming

---

### ContactForm Component (Recommended)

A progressively enhanced contact form (ADR-021): the plain HTML form submits natively with browser
constraint validation, and a small script module layers on real-time validation, a loading state
and ARIA live-region feedback. Props and the load-bearing markup are shown below — the full
component is ~210 lines; read
[`ContactForm.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/molecules/ContactForm.astro)
and
[`ContactFormScript.ts`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/molecules/ContactFormScript.ts)
for the rest.

```astro
---
// src/components/molecules/ContactForm.astro (excerpt)
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"form"> {
  action?: string;
}

const { action = "/contact", class: className, ...attrs } = Astro.props;
---

<form
  class:list={[
    "contact-form",
    "max-w-lg w-full mx-auto",
    "space-y-6",
    "p-6",
    "bg-surface",
    "border border-border",
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
  <!-- Honeypot: off-screen so bots see and fill it but humans and AT cannot. -->
  <p class="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
    <label>
      Don’t fill this out if you’re human:
      <input name="bot-field" type="text" tabindex="-1" autocomplete="off" />
    </label>
  </p>

  <!-- One field; email (maxlength 254), subject (optional) and message
       (textarea, minlength 10 / maxlength 2000) follow the same pattern. -->
  <div class="contact-form__field">
    <label for="contact-name" class="block text-sm font-medium text-foreground mb-2">
      Name <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      type="text"
      id="contact-name"
      name="name"
      required
      aria-required="true"
      minlength="2"
      maxlength="100"
      autocomplete="name"
      class="w-full px-3 py-2 min-h-[2.75rem] border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
      placeholder="Your full name"
      aria-describedby="name-error"
    />
    <div id="name-error" class="contact-form__error mt-1 text-sm text-error" role="alert" aria-live="polite"></div>
  </div>

  <!-- … email, subject, message fields … -->

  <div class="contact-form__actions">
    <button
      type="submit"
      class="contact-form__submit w-full flex justify-center items-center px-4 py-2.5 min-h-[2.75rem] text-sm font-medium text-primary-foreground bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      aria-describedby="submit-help"
    >
      <span class="contact-form__submit-text">Send Message</span>
      <span class="contact-form__submit-loading hidden ml-2" aria-hidden="true">
        <!-- spinner svg -->
      </span>
    </button>
    <div id="submit-help" class="mt-2 text-sm text-muted-foreground text-center">
      Your message will be sent securely
    </div>
  </div>

  <!-- Success/Error Messages -->
  <div class="contact-form__status invisible" role="status" aria-live="polite" tabindex="-1">
    <div class="contact-form__success hidden p-4 bg-success/10 border border-success/30 rounded-md">…</div>
    <div class="contact-form__error-message hidden p-4 bg-error/10 border border-error/30 rounded-md">…</div>
  </div>
</form>

<script>
  // Progressive enhancement: Form works without JavaScript
  // This script adds client-side validation and enhanced UX
  import { initContactForm } from './ContactFormScript';
  initContactForm();
</script>
```

What `ContactFormScript.ts` does once it runs:

- Sets `novalidate` on the form only after the enhanced handlers attach, so native
  `required` / `minlength` checks still apply when JavaScript is unavailable
- Validates every field on submit (not just blurred ones), focuses the first invalid field, and
  renders messages into the matching `<name>-error` live region with `aria-invalid="true"`
- Fields without an error slot (the honeypot) are skipped
- Submits with `fetch(form.action, { method: "POST", body: new FormData(form) })`, toggles the
  button's loading state, and moves focus to the status region on success or failure

**Usage Example:**

```astro
---
// src/pages/contact.astro (excerpt)
import ContactForm from "@/components/molecules/ContactForm.astro";
import { withBase } from "@/utils/url-utils";
---

<ContactForm action={withBase("/contact")} />
```

The default `action="/contact"` targets a static-form handler on the host (the form carries
`name="contact"` and `data-static-form-name="contact"` for that purpose). Point `action` at your
own endpoint or a form service; the starter ships no server-side handler.

**Key Features:**

- Works without JavaScript (native submission and constraint validation)
- Real-time client-side validation with per-field error messages and `aria-invalid`
- Loading state with spinner, success/error feedback in ARIA live regions, focus management
- Off-screen honeypot field for spam protection
- Semantic labels, `aria-required`, `autocomplete` attributes, 44px minimum hit areas
- Error and focus styling uses design tokens (`--color-error`, `--color-primary-500`)

---

### ExpandableFeatureCard Component (Advanced)

A feature card with native `<details>` expansion. Icons come from the `Icon` atom registry
(`IconName`, ADR-055) and all cards on a page open and close together via the shared
`src/scripts/featureCardSync.ts` module (ADR-014) — Astro dedupes the module script, so it loads
once per page, not per card.

```astro
---
// src/components/molecules/ExpandableFeatureCard.astro
import Icon from "@/components/atoms/Icon.astro";
import type { IconName } from "@/types/icons";

interface Props {
  /** Icon name from the Icon atom registry (see ADR-055). */
  icon: IconName;
  title: string;
  description: string;
  metric: string;
  expandedDetails: string[];
}

const { icon, title, description, metric, expandedDetails } = Astro.props;
---

<div
  class="overflow-hidden rounded-lg border border-border bg-background shadow-sm relative p-6 hover:border-primary-300 transition-colors group"
>
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-start gap-4 flex-1">
      <div class="text-primary-600 dark:text-primary-400 shrink-0" aria-hidden="true">
        <Icon name={icon} class="size-8" decorative />
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-foreground pr-4">{title}</h3>
      </div>
    </div>
    <span class="inline-flex items-center rounded-full font-medium bg-primary-100 text-primary-800 text-xs px-[0.5rem] py-0.5 shrink-0">
      {metric}
    </span>
  </div>

  <div class="pl-12">
    <p class="text-muted-foreground mb-4">{description}</p>

    <details class="feature-details group/details">
      <summary
        class="text-link text-sm font-medium flex items-center gap-1 mb-3 transition-colors cursor-pointer list-none"
        aria-label="Toggle feature details"
      >
        <span class="details-show">Show details</span>
        <span class="details-hide">Hide details</span>
        <svg
          class="size-4 transform transition-transform duration-200 details-chevron"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <section class="expand-content" aria-label="Feature details">
        <ul class="flex flex-col gap-2 text-sm text-muted-foreground">
          {expandedDetails.map((detail) => (
            <li class="flex items-start gap-2 not-last:border-b not-last:border-border not-last:pb-2">
              <span class="text-primary-500 mt-1 text-xs" aria-hidden="true">
                ▸
              </span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </details>
  </div>
</div>

<script>
  // Keeps all feature cards' <details> state in lockstep (ADR-014). Astro
  // dedupes this module script, so it loads once per page, not per card.
  import "@/scripts/featureCardSync";
</script>

<style>
  /* Toggle text visibility based on details open state */
  .details-hide {
    display: none;
  }
  details[open] .details-show {
    display: none;
  }
  details[open] .details-hide {
    display: inline;
  }
  details[open] .details-chevron {
    transform: rotate(180deg);
  }
</style>
```

**Usage Example:**

```astro
---
import ExpandableFeatureCard from "@/components/molecules/ExpandableFeatureCard.astro";
import Grid from "@/components/structural/Grid.astro";
---

<Grid class="gap-6">
  <ExpandableFeatureCard
    icon="gauge"
    title="Performance"
    description="Fast by default, measured not assumed."
    metric="99 Lighthouse"
    expandedDetails={["Zero-JS baseline", "AVIF/WebP images", "Metric-matched font fallbacks"]}
  />
  <ExpandableFeatureCard
    icon="shield-check"
    title="Security"
    description="Hardened headers and CI scanning."
    metric="CSP + HSTS"
    expandedDetails={["Header-based CSP", "Gitleaks + Semgrep in CI", "No third-party requests"]}
  />
</Grid>
```

**Key Features:**

- Native `<details>` / `<summary>` — expansion works with zero JavaScript
- "Show details" / "Hide details" label swap and chevron rotation are pure CSS (`details[open]`)
- Synchronized expansion across all cards via the shared `featureCardSync` module, re-initialised
  on `astro:page-load`
- Typed `icon` prop (`IconName`) — a typo is a build error, not a missing glyph
- Uses design tokens for theming

---

### PostCard Component (Recommended)

A blog post card that takes a `CollectionEntry<"blog">` plus pre-computed metadata from
`formatPostMetadata`. `featured` switches the image to eager loading and caps tags at three.

```astro
---
// src/components/molecules/PostCard.astro
import type { CollectionEntry } from "astro:content";
import Badge from "@/components/atoms/Badge.astro";
import Image from "@/components/atoms/Image.astro";
import Card from "@/components/molecules/Card.astro";
import { formatDateIso } from "@/utils/formatDate";
import { withBase } from "@/utils/url-utils";

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

<article class:list={["post-card", className]}>
<Card class="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
  {img ? (
    <div class="aspect-video overflow-hidden">
      {typeof img === "string" ? (
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
      )}
      {post.metadata.isRecent && (
        <div class="absolute left-3 top-3">
          <Badge>New</Badge>
        </div>
      )}
    </div>
  ) : (
    <div class="border-b border-border" />
  )}

  <div class="p-6">
    <div class="mb-3 flex flex-wrap gap-2">
      {featured
        ? post.data.tags?.slice(0, 3).map((tag: string) => (
            <a href={withBase(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}/`)} class="no-underline relative z-10">
              <Badge>{tag}</Badge>
            </a>
          ))
        : post.data.tags?.map((tag: string) => (
            <a href={withBase(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}/`)} class="no-underline relative z-10">
              <Badge>{tag}</Badge>
            </a>
          ))
      }
    </div>

    <h3 transition:name={"post-title-" + post.id} class="mb-3 text-xl font-semibold text-foreground">
      <a
        href={withBase(`/blog/${post.id}/`)}
        class:list={[
          "transition-colors",
          featured ? "stretched-link hover:text-link" : "after:absolute after:inset-0 group-hover:text-link"
        ]}
      >
        {post.data.title}
      </a>
    </h3>

    <p class="mb-4 text-muted-foreground line-clamp-3">
      {post.data.description}
    </p>

    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <time datetime={formatDateIso(post.data.date) ?? undefined}>{post.metadata.publishedDate}</time>
      <span>{post.metadata.readingTime}</span>
    </div>
  </div>
</Card>
</article>

<style>
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
// src/pages/blog/index.astro (excerpt)
import PostCard from "@/components/molecules/PostCard.astro";
import { getFeaturedPosts } from "@/utils/blog";
import { formatPostMetadata } from "@/utils/formatDate";

// Featured posts (published, featured: true), limited to 3
const featuredPosts = await getFeaturedPosts(3);

// Add metadata
const featuredPostsWithMetadata = featuredPosts.map((post) => ({
  ...post,
  metadata: formatPostMetadata(post.data.date, post.body),
}));
---

<div class="flex flex-wrap justify-center gap-8">
  {featuredPostsWithMetadata.map((post) => (
    <PostCard
      post={post}
      featured={true}
      class="md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
    />
  ))}
</div>
```

**Key Features:**

- Accepts `CollectionEntry<"blog">` with pre-computed metadata (`formatPostMetadata`)
- `featured` prop controls loading strategy (eager vs lazy) and tag display (3 vs all)
- Supports both string URLs and `astro:assets` images (`cardImage` falls back to `cover`)
- Tags link to `/blog/tag/<slug>/`; all internal hrefs go through `withBase` for sub-path deploys
- `transition:name` on the heading pairs with the post page for View Transitions (ADR-009)
- "New" badge for recent posts (controlled by `metadata.isRecent`)
- Line-clamped description (Tailwind `line-clamp-3`) and a `<time datetime>` publish date
- Stretched-link pattern makes the whole card clickable while tag links stay independently
  focusable (`relative z-10`)

---

### ProjectCard Component (Advanced)

A project showcase card with metadata, tech stack, category tags and demo/source actions. Two
render branches share the same content: with `href` the title becomes a stretched link covering
the card (`.project-card__title-link::after`, with the action links lifted above it); without
`href` the title is plain text. The full component is ~370 lines because the two branches are
spelled out — see
[`ProjectCard.astro`](https://github.com/clownware/astro-performance-starter/blob/master/src/components/molecules/ProjectCard.astro).

```astro
---
// src/components/molecules/ProjectCard.astro (excerpt)
import type { ImageMetadata } from "astro";
import type { HTMLAttributes } from "astro/types";
import Badge from "@/components/atoms/Badge.astro";
import Icon from "@/components/atoms/Icon.astro";
import Image from "@/components/atoms/Image.astro";
import { formatDate } from "@/utils/formatDate";

interface Props extends HTMLAttributes<"article"> {
  title: string;
  description: string;
  image: ImageMetadata | string;
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
  <article class:list={["w-full", "project-card", "bg-surface", "border border-border", "rounded-lg", "overflow-hidden", "transition-all duration-300", "hover:shadow-lg hover:border-primary-300", "focus-within:ring-2 focus-within:ring-primary-500", className]} {...attrs}>
    <div class="project-card__image-container relative overflow-hidden">
      {typeof image === "string" ? (
        <img src={image} alt={`Screenshot of ${title} project`} class="project-card__image w-full h-48 object-cover transition-transform duration-300 hover:scale-105" loading="lazy" decoding="async" />
      ) : (
        <Image src={image} alt={`Screenshot of ${title} project`} class="project-card__image w-full h-48 object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" />
      )}
    </div>

    <div class="project-card__content p-6">
      <header class="project-card__header mb-4">
        {/* date + "New" Badge (< 7 days) + client / projectRole / duration */}
        <h3 class="project-card__title text-xl font-semibold text-foreground mb-2">
          <a href={href} class="project-card__title-link hover:text-link focus:outline-hidden">
            {title}
          </a>
        </h3>
        <p class="project-card__description text-muted-foreground leading-relaxed">{description}</p>
      </header>

      {/* tags → <Badge> list; techStack → pill list */}

      {(demoUrl || githubUrl) && (
        <footer class="project-card__actions flex gap-3">
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View live demo of ${title} (opens in new tab)`} class="…">
              <Icon name="external-link" class="size-4 mr-2" decorative />
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} source code on GitHub (opens in new tab)`} class="…">
              <Icon name="github" class="size-4 mr-2" decorative />
              Source Code
            </a>
          )}
        </footer>
      )}
    </div>
  </article>
) : (
  <article class:list={["w-full", "project-card", /* same classes */ className]} {...attrs}>
    {/* Same content; the title is plain text and the tag/tech lists use sr-only headings */}
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

  /* Stretched link: title link covers the entire card surface */
  .project-card__title-link::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  /* Action links sit above the stretched-link overlay */
  .project-card__actions {
    margin-top: auto;
    position: relative;
    z-index: 1;
  }
</style>
```

**Usage Example:**

```astro
---
// src/pages/projects/index.astro (excerpt)
import ProjectCard from "@/components/molecules/ProjectCard.astro";
---

<div class="flex flex-wrap justify-center gap-8">
  {displayedProjects.map((project) => (
    <ProjectCard
      class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
      title={project.title}
      description={project.description}
      image={project.image}
      techStack={project.techStack}
      demoUrl={project.demoUrl}
      githubUrl={project.githubUrl}
      href={project.href}
      date={project.date}
      tags={project.tags}
    />
  ))}
</div>
```

**Key Features:**

- `image` accepts an `ImageMetadata` import (optimised through the `Image` atom) or a plain URL
- Flexible metadata display (date, client, role, duration) and a "New" badge for projects
  less than 7 days old
- Category tags (`Badge`) and tech-stack pills as `role="list"` lists
- Optional stretched title link for whole-card clickability; demo/source actions stay clickable
  above it
- `Icon` atom glyphs on the action links, with "(opens in new tab)" in the accessible names
- Flexbox layout keeps card heights consistent in grids; actions stack on small screens
- Extra attributes (e.g. `data-tech-stack` for client-side filtering) pass through to the
  `<article>`

---

### Interactive Components

#### Dialog (Modal) Component (Recommended)

The template ships its modal as `src/components/molecules/Dialog.astro`, built on the native
`<dialog>` element — the browser provides focus trapping, backdrop rendering, Escape-to-close,
and stacking context, so no modal library is needed. Open/close transitions use
`@starting-style` + `transition-behavior: allow-discrete`, gated by `prefers-reduced-motion`.
Interface excerpt:

```astro
---
// src/components/molecules/Dialog.astro (excerpt)
interface Props {
  id: string;
  title: string;
  size?: "sm" | "md" | "lg";
  class?: string;
  /**
   * Heading level for the dialog title only. Defaults to "h2" for top-level
   * dialogs. Pass a deeper level when the dialog is nested inside a section
   * that already uses h2/h3 — heading hierarchy should not skip levels.
   */
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
}

const { id, title, size = "md", class: className, headingLevel = "h2" } = Astro.props;

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;
---
```

Usage — open it with the native `showModal()` API. The default footer renders a Close button;
pass a `footer` slot to replace it:

```astro
<Dialog id="my-dialog" title="Dialog Title" size="md" headingLevel="h3">
  <p>Dialog content here</p>
  <Button slot="footer" variant="secondary" onclick="this.closest('dialog').close()">Done</Button>
</Dialog>

<Button variant="secondary" onclick="document.getElementById('my-dialog').showModal()">
  Open Dialog
</Button>
```

#### Tabs Component (Recommended)

The template's Tabs live at `src/components/molecules/Tabs.astro`. Panel switching is CSS-only
(hidden radio inputs plus `:has(...:checked)` selectors); the visible `<label>` elements carry
`role="tab"` and a roving `tabindex`, and a ~30-line inline script adds arrow/Home/End key
navigation and panel ARIA wiring per the WAI-ARIA tabs pattern. Interface excerpt:

```astro
---
// src/components/molecules/Tabs.astro (excerpt)
interface TabItem {
  id: string;
  label: string;
}

interface Props {
  tabs: TabItem[];
  defaultTab?: string;
  class?: string;
}

const { tabs, defaultTab, class: className } = Astro.props;
---
```

Usage — panels are slotted content matched by `data-tab-panel`; the script assigns each panel its
`id`, `role="tabpanel"` and `aria-labelledby` at runtime:

```astro
<Tabs tabs={[
  { id: "overview", label: "Overview" },
  { id: "usage", label: "Usage" },
]} defaultTab="overview">
  <div data-tab-panel="overview">First panel</div>
  <div data-tab-panel="usage">Second panel</div>
</Tabs>
```

### Component Catalog: the `/showcase` Living Style Guide (Advanced)

The template does not use a separate story runner. Component documentation lives in the in-app
`/showcase` page — the canonical living style guide (ADR-049), organised as
System / Color / Type / Motion / Components / Content. A standalone `astrobook` dependency was
evaluated and removed (an unused second catalog with no config, stories or CI usage).

To document a component, add it to the relevant section of `src/pages/showcase.astro` wrapped in
`ShowcaseExample.astro`, which renders the title, description, feature tags, an optional
accessibility note and an HTML-escaped code snippet alongside the live example:

```astro
---
// src/pages/showcase.astro (excerpt)
import Button from "@/components/atoms/Button.astro";
import ShowcaseExample from "@/components/molecules/ShowcaseExample.astro";
---

<ShowcaseExample
  title="Button"
  description="Polymorphic button/link component. Renders as <a> when href is provided, <button> otherwise. Supports disabled state with proper aria."
  features={["zero-js", "wcag-aa"]}
  a11yNote="Disabled state uses aria-disabled and removes from tab order"
  codeSnippet={'&lt;Button variant="primary"&gt;Primary&lt;/Button&gt;\n&lt;Button variant="secondary"&gt;Secondary&lt;/Button&gt;\n&lt;Button variant="ghost" size="sm"&gt;Ghost&lt;/Button&gt;'}
>
  <div class="flex flex-wrap gap-3 items-center">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost" size="sm">Ghost</Button>
    <Button variant="primary" disabled>Disabled</Button>
  </div>
</ShowcaseExample>
```

Because `/showcase` is a normal Astro page, it ships through the same performance and
accessibility gates as the rest of the site (`e2e/showcase.spec.ts` and the axe sweep in
`e2e/a11y-axe.spec.ts`) — there is no separate config file or snapshot tool to keep in sync.
