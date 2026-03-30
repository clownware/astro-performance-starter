// src/content.config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Portfolio/Case Studies Schema
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160), // SEO meta description
      date: z.date(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cardImage: image().optional(),
      cover: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()),
      client: z.string().optional(),
      duration: z.string().optional(),
      role: z.string().optional(),
      technologies: z.array(z.string()),
      outcomes: z
        .array(
          z.object({
            metric: z.string(),
            value: z.string(),
            description: z.string().optional(),
          }),
        )
        .optional(),
      externalUrl: z.url().optional(),
      sortOrder: z.number().default(0),
    }),
});

// Blog Posts Schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.date(),
      updated: z.date().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string(), // Required for accessibility when cover image is used
      cardImage: image().optional(),
      tags: z.array(z.string()).default([]),
      technologies: z.array(z.string()).default([]),
      author: z.string().default("Your Name"), // Default author
      readingTime: z.number().optional(), // Optional: can be calculated
      canonicalUrl: z.url().optional(),
      relatedPosts: z.array(z.string()).optional(), // ids of related posts
    }),
});

// Navigation/Site Data
const navigationCollection = defineCollection({
  loader: glob({ pattern: "**/*.{json,yaml,yml}", base: "./src/content/navigation" }),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
        isExternal: z.boolean().default(false),
        icon: z.string().optional(), // e.g., for an icon component name
        order: z.number().default(0), // For ordering navigation items
      }),
    ),
  }),
});

// Bio/About Content
const bioCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx,json}", base: "./src/content/bio" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      location: z.string().optional(),
      avatar: image(), // Astro's image schema helper
      social: z
        .object({
          github: z.url().optional(),
          linkedin: z.url().optional(),
          twitter: z.url().optional(),
          email: z.email().optional(),
        })
        .optional(),
      skills: z
        .array(
          z.object({
            category: z.string(),
            items: z.array(z.string()),
          }),
        )
        .optional(),
    }),
});

// Experience/Work History Collection
const experienceCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/experience" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(), // Optional for current positions
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    order: z.number().default(0), // For manual ordering
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  navigation: navigationCollection,
  bio: bioCollection,
  experience: experienceCollection,
};
