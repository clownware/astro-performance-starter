// src/utils/url-utils.ts

/**
 * Pure base-path resolver, testable without Vite.
 * Prepends the given base to a path, normalising slashes.
 */
export function resolveBasePath(base: string, path: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Prepends the configured base path to an internal URL.
 * No-op when base is "/" (root deployment). Safe to call on external URLs,
 * anchors, and already-prefixed paths.
 *
 * @param path - The path to prefix (e.g., "/blog/", "/logo.svg")
 * @param base - Defaults to import.meta.env.BASE_URL; pass explicitly in tests
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  // Pass through empty, anchors, relative, protocol-relative, and external URLs
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  // Root deployment: no transformation needed
  if (base === "/") {
    return path;
  }

  // Normalize: strip trailing slash from base for clean joining
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  // Idempotency: avoid double-prefixing
  if (path.startsWith(`${normalizedBase}/`) || path === normalizedBase) {
    return path;
  }

  return normalizedBase + path;
}

/**
 * Defines the URL patterns for various parts of the site.
 * All paths are run through `withBase()` so they respect the configured
 * Astro `base` path (e.g. for GitHub Pages sub-path deployments).
 */
export const urlPatterns = {
  home: () => withBase("/"),
  projects: () => withBase("/projects/"),
  project: (slug: string) => withBase(`/projects/${slug}/`),
  blog: () => withBase("/blog/"),
  blogPost: (slug: string) => withBase(`/blog/${slug}/`),
  blogTag: (tag: string) => withBase(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}/`),
  about: () => withBase("/about/"),
  contact: () => withBase("/contact/"),
  blogArchive: (year: number, month?: number) =>
    withBase(month ? `/blog/${year}/${String(month).padStart(2, "0")}/` : `/blog/${year}/`),
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
  id: string; // URL-friendly id (acts as slug in Astro 6+)
  data: ProjectEntryData;
}

/**
 * Gets the canonical URL for a project.
 * @param project A project content entry.
 * @returns The canonical URL string for the project.
 */
export function getProjectUrl(project: ProjectEntry): string {
  return urlPatterns.project(project.id);
}

interface BlogPostEntryData {
  slug?: string;
  title: string;
  date: Date;
}

interface BlogPostEntry {
  id: string; // URL-friendly id (acts as slug in Astro 6+)
  data: BlogPostEntryData;
}

/**
 * Gets the canonical URL for a blog post.
 * @param post A blog post content entry.
 * @returns The canonical URL string for the blog post.
 */
export function getBlogPostUrl(post: BlogPostEntry): string {
  return urlPatterns.blogPost(post.id);
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
