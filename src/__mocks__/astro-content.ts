// Minimal runtime stub for the astro:content virtual module.
// Aliased in vitest.config.ts so unit tests can import utilities
// that depend on it (e.g. src/utils/blog.ts) without Astro's runtime.
export const getCollection = () => Promise.resolve([]);
