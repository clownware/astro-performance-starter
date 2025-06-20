// src/content/config.ts
import { defineCollection, z } from "astro:content";

// Portfolio/Case Studies Schema
const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160), // SEO meta description
      date: z.date(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
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
      externalUrl: z.string().url().optional(),
      sortOrder: z.number().default(0),
    }),
});

// Blog Posts Schema
const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.date(),
      updated: z.date().optional(),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default("Your Name"), // Default author
      readingTime: z.number().optional(), // Optional: can be calculated
      canonicalUrl: z.string().url().optional(),
      relatedPosts: z.array(z.string()).optional(), // slugs of related posts
    }),
});

// Navigation/Site Data
const navigationCollection = defineCollection({
  type: "data", // 'data' for JSON/YAML files
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
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      location: z.string().optional(),
      avatar: image(), // Astro's image schema helper
      social: z
        .object({
          github: z.string().url().optional(),
          linkedin: z.string().url().optional(),
          twitter: z.string().url().optional(),
          email: z.string().email().optional(),
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

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
  navigation: navigationCollection,
  bio: bioCollection,
};
