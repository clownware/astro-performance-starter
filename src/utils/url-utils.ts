// src/utils/url-utils.ts

/**
 * Defines the URL patterns for various parts of the site.
 * This provides a single source of truth for URL structures.
 */
export const urlPatterns = {
  home: "/",
  projects: "/projects",
  project: (slug: string) => `/projects/${slug}`,
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  blogTag: (tag: string) => `/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`,
  about: "/about",
  contact: "/contact",
  // Archive patterns for blog posts by year and optionally month
  blogArchive: (year: number, month?: number) =>
    month ? `/blog/${year}/${String(month).padStart(2, "0")}` : `/blog/${year}`,
} as const;

/**
 * Generates a URL-friendly slug from a given string (e.g., a title).
 * @param title The string to slugify.
 * @returns A URL-friendly slug.
 */
export function generateSlug(title: string): string {
  if (!title) {
    return "";
  }
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim(); // Trim leading/trailing hyphens (if any after replacements)
}

// Example of a type-safe URL builder function
// You would typically define these based on your `collections` types
// For instance, if `project` is an entry from `getCollection('projects')`

interface ProjectEntryData {
  slug?: string; // Assuming slug might be pre-generated and stored in frontmatter
  title: string; // Or generate from title if slug isn't present
}

interface ProjectEntry {
  id: string; // e.g., 'example-project.mdx'
  slug: string; // The actual slug used in the URL, derived from id or frontmatter
  data: ProjectEntryData;
}

/**
 * Gets the canonical URL for a project.
 * Prefers a pre-defined slug in frontmatter, otherwise generates from title.
 * @param project A project content entry.
 * @returns The canonical URL string for the project.
 */
export function getProjectUrl(project: ProjectEntry): string {
  // In Astro, collection entry slugs are usually derived from file names or a 'slug' field in frontmatter.
  // If you have a `slug` field in your schema that's manually set, use `project.data.slug`.
  // If slugs are generated from file names, `project.slug` (provided by Astro) is the one to use.
  return urlPatterns.project(project.slug);
}

interface BlogPostEntryData {
  slug?: string;
  title: string;
  date: Date;
}

interface BlogPostEntry {
  id: string;
  slug: string;
  data: BlogPostEntryData;
}

/**
 * Gets the canonical URL for a blog post.
 * @param post A blog post content entry.
 * @returns The canonical URL string for the blog post.
 */
export function getBlogPostUrl(post: BlogPostEntry): string {
  return urlPatterns.blogPost(post.slug);
}

/**
 * Gets the URL for a blog tag page.
 * @param tag The tag string.
 * @returns The URL string for the tag page.
 */
export function getBlogTagUrl(tag: string): string {
  return urlPatterns.blogTag(tag);
}
