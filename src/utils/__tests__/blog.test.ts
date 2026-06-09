import { sortPostsByDate } from "@utils/blog";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { draftPost, publishedPosts } from "../../../tests/fixtures/posts";

// astro:content is a virtual module aliased to a stub in vitest.config.ts,
// enabling direct import of the real sortPostsByDate / getPublishedPosts /
// getFeaturedPosts without Astro's runtime. The stub also exports
// __setMockCollection / __resetMockCollection for controlling fixtures.

const stub = (await import("astro:content")) as any;
const { getPublishedPosts, getFeaturedPosts } = await import("@utils/blog");

// Build a minimal post shape — only the fields sortPostsByDate accesses.
const makePost = (date: Date, title = "Test Post") =>
  ({
    data: { date, draft: false as const, title },
  }) as unknown as Parameters<typeof sortPostsByDate>[0][number];

describe("sortPostsByDate", () => {
  it("sorts posts by date in descending order (newest first)", () => {
    const posts = [
      makePost(new Date("2024-01-01")),
      makePost(new Date("2024-03-01")),
      makePost(new Date("2024-02-01")),
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted[0].data.date).toEqual(new Date("2024-03-01"));
    expect(sorted[1].data.date).toEqual(new Date("2024-02-01"));
    expect(sorted[2].data.date).toEqual(new Date("2024-01-01"));
  });

  it("handles empty array", () => {
    expect(sortPostsByDate([])).toEqual([]);
  });

  it("handles single post", () => {
    const posts = [makePost(new Date("2024-01-01"))];
    const sorted = sortPostsByDate(posts);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].data.date).toEqual(new Date("2024-01-01"));
  });

  it("handles posts with same date", () => {
    const sameDate = new Date("2024-01-01");
    const posts = [makePost(sameDate, "Post A"), makePost(sameDate, "Post B")];
    const sorted = sortPostsByDate(posts);
    expect(sorted).toHaveLength(2);
    expect(sorted.every((post) => post.data.date === sameDate)).toBe(true);
  });

  it("mutates original array (in-place sort)", () => {
    const posts = [makePost(new Date("2024-01-01")), makePost(new Date("2024-02-01"))];
    const firstPost = posts[0];
    sortPostsByDate(posts);
    expect(posts[0]).not.toBe(firstPost);
    expect(posts[1]).toBe(firstPost);
  });
});

describe("getPublishedPosts", () => {
  beforeEach(() => {
    stub.setMockCollection([...publishedPosts, draftPost]);
  });
  afterEach(() => {
    stub.resetMockCollection();
  });

  it("excludes drafts and sorts newest-first", async () => {
    const posts = await getPublishedPosts();
    expect(posts.map((p) => p.id)).toEqual([
      "featured-newest",
      "newer-published",
      "older-published",
    ]);
  });

  it("returns empty array when no posts exist", async () => {
    stub.setMockCollection([]);
    expect(await getPublishedPosts()).toEqual([]);
  });
});

describe("getFeaturedPosts", () => {
  beforeEach(() => {
    stub.setMockCollection(publishedPosts);
  });
  afterEach(() => {
    stub.resetMockCollection();
  });

  it("returns only posts flagged featured", async () => {
    const posts = await getFeaturedPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0]?.id).toBe("featured-newest");
  });

  it("respects the limit argument", async () => {
    // Promote two more posts to featured.
    const allFeatured = publishedPosts.map((p) => ({
      ...p,
      data: { ...p.data, featured: true },
    }));
    stub.setMockCollection(allFeatured);

    const posts = await getFeaturedPosts(2);
    expect(posts).toHaveLength(2);
    // Sorted newest-first.
    expect(posts.map((p) => p.id)).toEqual(["featured-newest", "newer-published"]);
  });

  it("defaults to a limit of 3", async () => {
    const allFeatured = publishedPosts.map((p) => ({
      ...p,
      data: { ...p.data, featured: true },
    }));
    // Add a fourth to confirm slicing.
    allFeatured.push({
      id: "fourth-featured",
      data: {
        title: "Fourth Featured",
        description: "Extra",
        date: new Date("2025-10-01T00:00:00Z"),
        tags: ["x"],
        draft: false,
        featured: true,
      },
    });
    stub.setMockCollection(allFeatured);

    const posts = await getFeaturedPosts();
    expect(posts).toHaveLength(3);
  });

  it("excludes drafts even when featured flag is set", async () => {
    const draftFeatured = {
      ...draftPost,
      data: { ...draftPost.data, featured: true },
    };
    stub.setMockCollection([...publishedPosts, draftFeatured]);

    const posts = await getFeaturedPosts();
    expect(posts.find((p) => p.id === draftPost.id)).toBeUndefined();
  });
});
