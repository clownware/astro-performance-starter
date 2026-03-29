import { sortPostsByDate } from "@utils/blog";
import { describe, expect, it } from "vitest";

// astro:content is a virtual module aliased to a stub in vitest.config.ts,
// enabling direct import of the real sortPostsByDate without Astro's runtime.

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
