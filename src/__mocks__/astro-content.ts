// Minimal runtime stub for the astro:content virtual module.
// Aliased in vitest.config.ts so unit tests can import utilities
// that depend on it (e.g. src/utils/blog.ts) without Astro's runtime.
//
// Tests can override the dataset via setMockCollection(entries) and the
// optional filter passed by callers (e.g. blog.ts) is honoured.

import { z } from "astro/zod";

type Entry = { id: string; data: Record<string, unknown> };

let mockCollection: Entry[] = [];

export const setMockCollection = (entries: Entry[]): void => {
  mockCollection = entries;
};

export const resetMockCollection = (): void => {
  mockCollection = [];
};

export const getCollection = (
  _name: string,
  filter?: (entry: Entry) => boolean,
): Promise<Entry[]> => {
  const data = filter ? mockCollection.filter(filter) : mockCollection;
  // Return a shallow copy so callers that sort in-place don't mutate the source.
  return Promise.resolve([...data]);
};

/**
 * Identity stub for defineCollection: Astro's real implementation only tags
 * the config object, so returning it unchanged lets tests reach into a
 * collection's Zod schema and assert against it directly
 * (see src/__tests__/content-schemas.test.ts).
 */
export const defineCollection = <T>(config: T): T => config;

/**
 * Parse-shape stub for reference(): a frontmatter id becomes the
 * `{ collection, id }` object Astro's helper emits. Astro also logs an unknown
 * id at build time, but does not fail the build on it.
 */
export const reference = (collection: string) => z.string().transform((id) => ({ collection, id }));

/**
 * Resolves references against the mock dataset, keeping the caller's order.
 * Like Astro's, a reference with no matching entry resolves to `undefined`.
 */
export const getEntries = (
  refs: { collection: string; id: string }[],
): Promise<(Entry | undefined)[]> =>
  Promise.resolve(refs.map((ref) => mockCollection.find((entry) => entry.id === ref.id)));
