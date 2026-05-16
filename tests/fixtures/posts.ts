// Test fixtures for blog Content Collection entries (ADR-023 §5).
// Loose typing — the unit-test virtual stub doesn't carry Astro's CollectionEntry
// generics. Cast at the call site if needed.

interface BlogPostFixture {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    draft: boolean;
    featured?: boolean;
    author?: string;
  };
}

export const makePost = (overrides: Partial<BlogPostFixture> = {}): BlogPostFixture => ({
  id: overrides.id ?? "test-post",
  data: {
    title: "Test Post",
    description: "A test fixture",
    date: new Date("2025-01-01T00:00:00Z"),
    tags: ["test"],
    draft: false,
    ...overrides.data,
  },
});

export const draftPost = makePost({
  id: "draft-post",
  data: {
    title: "Draft Post",
    description: "Not published yet",
    date: new Date("2025-06-01T00:00:00Z"),
    tags: ["draft"],
    draft: true,
  },
});

export const publishedPosts: BlogPostFixture[] = [
  makePost({
    id: "older-published",
    data: {
      title: "Older Published",
      description: "An earlier post",
      date: new Date("2025-01-01T00:00:00Z"),
      tags: ["intro"],
      draft: false,
    },
  }),
  makePost({
    id: "newer-published",
    data: {
      title: "Newer Published",
      description: "A later post",
      date: new Date("2025-06-01T00:00:00Z"),
      tags: ["follow-up"],
      draft: false,
    },
  }),
  makePost({
    id: "featured-newest",
    data: {
      title: "Featured Newest",
      description: "The hero post",
      date: new Date("2025-09-01T00:00:00Z"),
      tags: ["featured"],
      draft: false,
      featured: true,
    },
  }),
];

export const featuredPosts: BlogPostFixture[] = publishedPosts.filter(
  (post) => post.data.featured === true,
);
