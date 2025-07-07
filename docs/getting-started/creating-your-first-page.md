---
title: "Creating Your First Page"
description: "A step-by-step guide to creating a new page in your Astro project using the template's architecture."
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Overview

This guide will walk you through the process of creating a new page, such as an "About Us" page, using the patterns and components provided by this template. The best way to learn is by following the example set in the minimal homepage at `src/pages/index.astro`.

### The Core Pattern

Creating a new page in Astro is as simple as adding a new `.astro` file to the `src/pages/` directory. The filename will directly map to the URL of the page.

- `src/pages/about.astro` → `/about`
- `src/pages/contact.astro` → `/contact`
- `src/pages/blog/my-first-post.astro` → `/blog/my-first-post`

## Step 1: Create the Page File

Create a new file at `src/pages/about.astro`.

## Step 2: Add the Basic Structure

Every page should use the `BaseLayout` component to ensure a consistent header, footer, and metadata system. Copy the following structure into your new file.

```astro
---
// src/pages/about.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';

const pageTitle = 'About Us';
const pageDescription = 'Learn more about our company and our mission.';
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <Section>
    <Container>
      <h1 class="text-4xl font-bold">{pageTitle}</h1>
      <p class="mt-4 text-lg">
        {pageDescription}
      </p>
      <p class="mt-4">
        This is where you can add more content about your company.
      </p>
    </Container>
  </Section>
</BaseLayout>
```

### Key Concepts in this Example

- **Layout:** The entire page is wrapped in `<BaseLayout>`, which handles all the `<head>` tags, metadata, header, and footer.
- **Props:** We pass `title` and `description` props to the layout to control the page's SEO and browser tab information.
- **Structural Components:** We use `<Section>` and `<Container>` to create consistent, responsive spacing and width for our content, just like on the homepage.

## Step 3: Add the Page to Navigation (Optional)

If you want your new page to appear in the site's main navigation menu, you need to add it to the navigation configuration.

1. **Navigate** to `src/content/navigation/`.
2. **Edit** the `header.json` file.
3. **Add a new entry** to the JSON array:

    ```json
    {
      "text": "About",
      "href": "/about"
    }
    ```

Your new page will now automatically appear in the header and footer navigation. This separation of content and configuration makes it easy to manage your site's structure.
