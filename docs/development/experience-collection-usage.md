# Experience Collection Usage Guide

This guide shows how to migrate from hardcoded experience data to the content collection approach.

## Current Implementation (Hardcoded)

The `about.astro` page currently uses hardcoded experience data:

```astro
---
const experiences = [
  {
    title: "Senior Full-Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2022 - Present",
    description: "Leading development of modern web applications...",
  },
  // ...
];
---
```

**When to keep this approach:**

- Experience data is ONLY used on the about page
- You prefer simplicity over reusability
- You don't need rich MDX content for descriptions

## Migration to Content Collection (Optional)

### Step 1: Use the Experience Collection

Replace the hardcoded data in `about.astro`:

```astro
---
import { getCollection } from 'astro:content';

// Fetch all experience entries
const experiences = await getCollection('experience');

// Sort by order field (ascending)
const sortedExperiences = experiences
  .sort((a, b) => a.data.order - b.data.order);

// Format dates helper
function formatPeriod(startDate: Date, endDate?: Date, current?: boolean) {
  const start = startDate.getFullYear();
  if (current) return `${start} - Present`;
  const end = endDate?.getFullYear() || 'Present';
  return `${start} - ${end}`;
}
---

<ol class="space-y-8" role="list" aria-label="Work experience timeline">
  {sortedExperiences.map((exp) => (
    <li class="relative pl-8 pb-8 border-l-2 border-border-primary last:border-l-0 last:pb-0">
      <div class="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary-600 ring-4 ring-background-primary" aria-hidden="true"></div>
      <article>
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground-primary">
            {exp.data.title}
          </h3>
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <p class="text-primary-600 font-medium">
              {exp.data.company}
            </p>
            <p class="text-sm text-foreground-secondary">
              {formatPeriod(exp.data.startDate, exp.data.endDate, exp.data.current)}
            </p>
          </div>
          <p class="text-foreground-secondary leading-relaxed">
            {exp.data.description}
          </p>
        </div>
      </article>
    </li>
  ))}
</ol>
```

### Step 2: Add Rich Content (Optional)

If you want detailed descriptions with formatting, render the MDX content:

```astro
{sortedExperiences.map(async (exp) => {
  const { Content } = await exp.render();
  return (
    <li class="relative pl-8 pb-8 border-l-2 border-border-primary last:border-l-0 last:pb-0">
      <div class="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary-600 ring-4 ring-background-primary" aria-hidden="true"></div>
      <article>
        <div class="space-y-2">
          <h3 class="text-xl font-semibold text-foreground-primary">
            {exp.data.title}
          </h3>
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <p class="text-primary-600 font-medium">
              {exp.data.company}
            </p>
            <p class="text-sm text-foreground-secondary">
              {formatPeriod(exp.data.startDate, exp.data.endDate, exp.data.current)}
            </p>
          </div>
          <div class="prose prose-sm max-w-none text-foreground-secondary">
            <Content />
          </div>
        </div>
      </article>
    </li>
  );
})}
```

### Step 3: Display Technologies as Badges

```astro
---
import Badge from '@/components/atoms/Badge.astro';
---

{exp.data.technologies && exp.data.technologies.length > 0 && (
  <div class="mt-4">
    <p class="text-sm font-medium text-foreground-primary mb-2">Technologies:</p>
    <ul class="flex flex-wrap gap-2" role="list">
      {exp.data.technologies.map((tech) => (
        <li>
          <Badge variant="neutral" size="xs">
            {tech}
          </Badge>
        </li>
      ))}
    </ul>
  </div>
)}
```

## Benefits of Content Collection Approach

1. **Reusability**: Use experience data on resume page, homepage, etc.
2. **Type Safety**: Zod validation ensures data integrity
3. **Rich Content**: MDX support for formatted descriptions
4. **Separation of Concerns**: Content separate from presentation
5. **Easy Updates**: Edit MDX files without touching component code

## When to Migrate

Migrate to content collections when:

- You need to display experience data on multiple pages
- You want rich formatting in descriptions (headings, lists, links)
- You're building a resume/CV page
- You want to add more fields (company logo, project links, etc.)

## Example Files

See the following example experience entries:

- `src/content/experience/senior-developer.mdx`
- `src/content/experience/frontend-developer.mdx`
- `src/content/experience/junior-developer.mdx`

These demonstrate the full schema with MDX content.
