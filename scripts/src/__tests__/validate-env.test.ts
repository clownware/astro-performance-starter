import { describe, expect, it } from "vitest";
import { isPlaceholderUrl } from "../validate-env.ts";

/**
 * The slim placeholder heuristic that astro:env's schema validation cannot
 * express (it checks presence/type, not whether a real value was substituted
 * for the template default). Guards a cloner shipping with example.com /
 * your-username / localhost still in SITE_URL.
 */
describe("isPlaceholderUrl", () => {
  it.each([
    "https://example.com",
    "https://your-username.github.io",
    "https://your-domain.com",
    "http://localhost:4321",
    "HTTPS://EXAMPLE.COM/path", // case-insensitive
  ])("flags placeholder URL %s", (url) => {
    expect(isPlaceholderUrl(url)).toBe(true);
  });

  it.each(["https://clownware.github.io", "https://chrispezza.com", "https://acme.dev"])(
    "passes real URL %s",
    (url) => {
      expect(isPlaceholderUrl(url)).toBe(false);
    },
  );
});
