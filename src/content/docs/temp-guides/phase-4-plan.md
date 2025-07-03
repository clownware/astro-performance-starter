---
title: Phase 4 Plan
description: 'Plan for Phase 4'
lastUpdated: true
tableOfContents: false
pagefind: false
---

After reviewing the guides again, here is where the non-implemented aspects of Phase 4 are better suited:

## 1. Analytics Setup (Step 4.11)

This is the most significant feature we chose not to implement directly. Instead of putting analytics code in the template, we should provide clear instructions and hooks in three key places:

### Better Place 1: A Dedicated Documentation Guide

Location: src/content/docs/implementation-guides/06-optional-features/01-analytics.md (or a similar new guide).
Content: This guide would explain why analytics aren't included by default (privacy, user choice) and provide copy-paste-ready recipes for a few popular, privacy-first options (e.g., Plausible, Fathom). It would show the user exactly:
Which component to create (e.g., src/components/Analytics.astro).
How to add the necessary environment variables to their .env file.
Where to import and place the *Analytics* component in src/layouts/BaseLayout.astro.

### Better Place 2: The Environment Example File (.env.example)

Action: Add commented-out placeholder variables.
Example:

```bash
# ANALYTICS - Uncomment and set if you add an analytics provider
# PUBLIC_PLAUSIBLE_DOMAIN=""
# PUBLIC_FATHOM_SITE_ID=""
```

Purpose: This serves as a direct prompt during the user's initial setup. When they copy the file to .env, they immediately see that analytics is a configurable option and are nudged to consult the documentation.

### Better Place 3: The Onboarding Document (ONBOARDING.md)

Action: Add a checklist item under a "Next Steps" or "Optional Features" section.
Example: [ ] Configure analytics for your site (see our guide on adding Plausible or Fathom).
Purpose: This makes the feature discoverable from the very beginning of the user's journey.
Result: The template remains clean and privacy-focused, but the user is fully equipped to add analytics in minutes by following a clear, documented path.

## 2. User-Defined Page Routes (The rest of Step 4.05)

We decided to only create index.astro and 404.astro. The creation of other pages like /about or /contact is the user's responsibility. Here's how we guide them:

### Better Place 1: The index.astro Page Itself

Action: Treat the minimal index.astro as a "living example." It should be heavily commented, demonstrating exactly how to use the BaseLayout, how to pass props for title and description, and how to import and use the foundational UI components (like Button and Card).
Purpose: It becomes the user's primary reference for creating new pages. They can copy, paste, and modify it to build out the rest of their site.

Better Place 2: The Documentation.

Action: Create a simple guide like "Creating Your First Page."
Content: This guide would walk the user through creating an about.astro page, reinforcing the patterns they see in index.astro. It would explicitly show them how to add the new page to their navigation by creating an entry in the navigation content collection.
Purpose: This removes any guesswork and ensures that the user builds out their site using the template's intended architecture.
By placing these features in the documentation and configuration files, you create a much better user experience. The template remains a clean, unopinionated starting point, but it's surrounded by a rich ecosystem of guides and examples that empower the user to build with confidence.
