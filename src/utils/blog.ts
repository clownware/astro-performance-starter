import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

/**
 * Sort blog posts by date (newest first)
 * Centralized sorting logic to maintain consistency across the application
 */
export function sortPostsByDate(posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] {
  return posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

/**
 * Get all published blog posts, sorted by date (newest first)
 * @returns Sorted array of published blog posts
 */
export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const allPosts = await getCollection("blog", ({ data }: CollectionEntry<"blog">) => {
    return data.draft !== true;
  });

  return sortPostsByDate(allPosts);
}

/**
 * Get featured blog posts, sorted by date (newest first)
 * @param limit - Maximum number of featured posts to return (default: 3)
 * @returns Sorted array of featured blog posts
 */
export async function getFeaturedPosts(limit = 3): Promise<CollectionEntry<"blog">[]> {
  const featuredPosts = await getCollection("blog", ({ data }: CollectionEntry<"blog">) => {
    return data.draft !== true && data.featured === true;
  });

  return sortPostsByDate(featuredPosts).slice(0, limit);
}
