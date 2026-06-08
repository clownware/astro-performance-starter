---
title: "Optional Feature: Adding Web Analytics"
description: "Learn how to integrate privacy-focused analytics like Plausible or Fathom into your Astro project."
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Why Analytics Aren't Included by Default

This template intentionally does not include any analytics provider out-of-the-box. This decision is rooted in two core principles:

1. **Privacy-First:** We believe in respecting user privacy. Including analytics by default, especially those that use cookies or track personal data, would go against this principle.
2. **User Choice:** The world of web analytics is vast. Forcing a specific provider on you would be overly prescriptive. You should have the freedom to choose the tool that best fits your project's needs and your company's privacy policy.

This guide provides simple, copy-paste-ready recipes for adding two popular, privacy-respecting analytics providers: **Plausible** and **Fathom**.

## The General Pattern

The process for adding any analytics provider follows three simple steps:

1. **Create an `Analytics.astro` component** to hold the provider's script.
2. **Add your site-specific keys** to your environment variables.
3. **Import and place the component** in your `BaseLayout.astro` file.

> **A note on `is:inline` and the security budget.** The recipes below use `is:inline`
> because they load a **remote, third-party** script with custom `data-*` attributes —
> Astro cannot bundle or hash a script it doesn't host, so `is:inline` is required here.
> This is the documented exception to the `inline_scripts: 0` guideline in
> [budgets-guardrails](budgets-guardrails) ("avoid `is:inline` unless manually hashed").
> If you ship a Content Security Policy (see [ADR-051](../../adr/051-content-security-policy-strategy)),
> add the provider's origin (e.g. `https://plausible.io`, `https://cdn.usefathom.com`) to your
> `script-src` directive so the script is allowed.

## Recipe 1: Plausible Analytics

Plausible is a lightweight, open-source, and cookie-free analytics tool.

### 1. Create the Analytics Component

Create a new file at `src/components/Analytics.astro` and add the following code. This component will only render in a production environment.

```astro
---
// src/components/Analytics.astro
const { PUBLIC_PLAUSIBLE_DOMAIN } = import.meta.env;
---

{
  import.meta.env.PROD && PUBLIC_PLAUSIBLE_DOMAIN && (
    <script
      is:inline
      defer
      data-domain={PUBLIC_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
    />
  )
}
```

### 2. Configure Environment Variables

Open your `.env` file (or create one by copying `.env.example`) and add your Plausible domain.

```bash
# .env
PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
```

### 3. Add to Base Layout

Finally, import and add the component to the `<head>` section of your `src/layouts/BaseLayout.astro` file.

```astro
---
// src/layouts/BaseLayout.astro
import Analytics from '@/components/Analytics.astro'; // <-- Import the component
// ... other imports
---
<html lang="en">
  <head>
    {/* ... other head tags ... */}
    <Analytics /> {/* <-- Add it here */}
  </head>
  <body>
    {/* ... body content ... */}
  </body>
</html>
```

## Recipe 2: Fathom Analytics

Fathom is another popular, simple, and privacy-focused analytics service.

### 1. Create the Analytics Component

Create a new file at `src/components/Analytics.astro` and add the following code.

```astro
---
// src/components/Analytics.astro
const { PUBLIC_FATHOM_SITE_ID } = import.meta.env;
---

{
  import.meta.env.PROD && PUBLIC_FATHOM_SITE_ID && (
    <script
      is:inline
      src="https://cdn.usefathom.com/script.js"
      data-site={PUBLIC_FATHOM_SITE_ID}
      defer
    />
  )
}
```

### 2. Configure Environment Variables

Open your `.env` file and add your Fathom Site ID.

```bash
# .env
PUBLIC_FATHOM_SITE_ID="YOUR_FATHOM_SITE_ID"
```

### 3. Add to Base Layout

Just like with Plausible, import and add the component to the `<head>` section of your `src/layouts/BaseLayout.astro` file.

```astro
---
// src/layouts/BaseLayout.astro
import Analytics from '@/components/Analytics.astro'; // <-- Import the component
// ... other imports
---
<html lang="en">
  <head>
    {/* ... other head tags ... */}
    <Analytics /> {/* <-- Add it here */}
  </head>
  <body>
    {/* ... body content ... */}
  </body>
</html>
```
