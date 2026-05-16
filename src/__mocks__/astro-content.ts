// Minimal runtime stub for the astro:content virtual module.
// Aliased in vitest.config.ts so unit tests can import utilities
// that depend on it (e.g. src/utils/blog.ts) without Astro's runtime.
//
// Tests can override the dataset via setMockCollection(entries) and the
// optional filter passed by callers (e.g. blog.ts) is honoured.

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
