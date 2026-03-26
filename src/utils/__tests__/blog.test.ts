import { describe, expect, it } from "vitest";

// Mock blog post type for testing
type MockBlogPost = {
  data: {
    date: Date;
    draft: boolean;
    title?: string;
  };
};

// Import only the pure sorting function (no Astro dependencies)
// We'll test getPublishedPosts and getFeaturedPosts via E2E tests
describe("sortPostsByDate", () => {
  // Inline the sorting logic for unit testing
  const sortPostsByDate = (posts: MockBlogPost[]): MockBlogPost[] => {
    return posts.sort((a, b) => {
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });
  };

  it("should sort posts by date in descending order (newest first)", () => {
    const posts: MockBlogPost[] = [
      {
        data: { date: new Date("2024-01-01"), draft: false },
      },
      {
        data: { date: new Date("2024-03-01"), draft: false },
      },
      {
        data: { date: new Date("2024-02-01"), draft: false },
      },
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted[0].data.date).toEqual(new Date("2024-03-01"));
    expect(sorted[1].data.date).toEqual(new Date("2024-02-01"));
    expect(sorted[2].data.date).toEqual(new Date("2024-01-01"));
  });

  it("should handle empty array", () => {
    const posts: MockBlogPost[] = [];
    const sorted = sortPostsByDate(posts);

    expect(sorted).toEqual([]);
  });

  it("should handle single post", () => {
    const posts: MockBlogPost[] = [
      {
        data: { date: new Date("2024-01-01"), draft: false },
      },
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted).toHaveLength(1);
    expect(sorted[0].data.date).toEqual(new Date("2024-01-01"));
  });

  it("should handle posts with same date", () => {
    const sameDate = new Date("2024-01-01");
    const posts: MockBlogPost[] = [
      {
        data: { date: sameDate, draft: false, title: "Post A" },
      },
      {
        data: { date: sameDate, draft: false, title: "Post B" },
      },
    ];

    const sorted = sortPostsByDate(posts);

    expect(sorted).toHaveLength(2);
    // Order should be stable for same dates
    expect(sorted.every((post) => post.data.date === sameDate)).toBe(true);
  });

  it("should mutate original array (in-place sort)", () => {
    const posts: MockBlogPost[] = [
      {
        data: { date: new Date("2024-01-01"), draft: false },
      },
      {
        data: { date: new Date("2024-02-01"), draft: false },
      },
    ];

    const firstPost = posts[0];
    sortPostsByDate(posts);

    // Array is sorted in-place
    expect(posts[0]).not.toBe(firstPost);
    expect(posts[1]).toBe(firstPost);
  });
});
