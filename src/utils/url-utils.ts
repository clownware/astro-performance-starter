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
 * Preserves accented characters for better internationalization (RFC 3987 - IRIs).
 * @param title The string to slugify.
 * @returns A URL-friendly slug.
 */
export function generateSlug(title: string): string {
  if (!title) {
    return "";
  }
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // Remove special chars, preserve letters (including accented) and numbers
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

/**
 * Validates if a URL is trusted and safe to link to.
 * Prevents open redirect vulnerabilities by checking against allowed domains.
 * @param url The URL to validate.
 * @param allowedDomains Optional array of allowed domains. If not provided, allows common trusted domains.
 * @returns True if the URL is trusted, false otherwise.
 */
export function isTrustedUrl(url: string, allowedDomains?: string[]): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    // Allow relative URLs (same-origin)
    if (!parsedUrl.protocol || parsedUrl.protocol === "javascript:") {
      return false;
    }

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    // If no allowedDomains provided, allow all https URLs (basic validation)
    // In production, you should configure specific allowed domains
    if (!allowedDomains || allowedDomains.length === 0) {
      return parsedUrl.protocol === "https:";
    }

    // Check if domain matches any allowed domain
    const hostname = parsedUrl.hostname.toLowerCase();
    return allowedDomains.some((domain) => {
      const normalizedDomain = domain.toLowerCase();
      // Exact match or subdomain match
      return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
    });
  } catch {
    // Invalid URL format
    return false;
  }
}
