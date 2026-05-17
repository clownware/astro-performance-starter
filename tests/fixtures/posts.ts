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

// PostCard fixture shape: extends BlogPostFixture with the `metadata` block
// PostCard.astro expects (publishedDate / readingTime / isRecent). Used by
// `src/components/molecules/__tests__/PostCard.test.ts`.
interface PostCardFixture extends BlogPostFixture {
  data: BlogPostFixture["data"] & {
    cover?: string;
    cardImage?: string;
    coverAlt?: string;
  };
  metadata: {
    publishedDate: string;
    readingTime: string;
    isRecent: boolean;
  };
}

export const makePostCardPost = (
  overrides: Partial<PostCardFixture> = {},
): PostCardFixture => ({
  id: overrides.id ?? "test-card-post",
  data: {
    title: "A Card Post",
    description: "A blog post used to exercise PostCard rendering",
    date: new Date("2025-09-15T00:00:00Z"),
    tags: ["astro", "perf"],
    draft: false,
    ...overrides.data,
  },
  metadata: {
    publishedDate: "Sep 15, 2025",
    readingTime: "4 min read",
    isRecent: false,
    ...overrides.metadata,
  },
});
