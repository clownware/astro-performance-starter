---
title: "Content Model Guide - Schema Design Patterns"
version: "1.0.0"
lastUpdated: "2025-06-10"
description: "Best practices for designing content schemas in Astro using Content Collections."
---

# Content Model Guide - Schema Design Patterns

## Overview

This guide covers best practices for designing content schemas in Astro using Content Collections. Well-designed schemas ensure type safety, content consistency, and excellent developer experience.

## Core Principles

1. **Type Safety First**: Leverage Zod for runtime validation
2. **Future-Proof**: Design for content evolution
3. **DRY**: Reuse schema components
4. **Validation**: Catch errors at build time
5. **Flexibility**: Support various content needs

## Schema Design Patterns

### 1. Base Schema Pattern

Create reusable base schemas for common fields:

```typescript {{versions.typescript}}
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

// Reusable schema components
const seoSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const authorSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  social: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

const