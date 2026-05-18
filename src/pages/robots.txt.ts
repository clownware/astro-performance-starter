import type { APIRoute } from "astro";

// biome-ignore lint/style/useNamingConvention: Astro requires uppercase GET for API routes
export const GET: APIRoute = ({ site }) => {
  // Resolve the sitemap URL against the deploy base path so sub-path deploys
  // (e.g. GitHub Pages at /astro-performance-starter/) produce the correct
  // absolute URL. `BASE_URL` is normalised with a trailing slash by Astro,
  // which is required for `new URL("relative", base)` to *append* rather than
  // replace the final path segment.
  const baseUrl = new URL(import.meta.env.BASE_URL, site);
  const sitemapUrl = new URL("sitemap-index.xml", baseUrl);
  return new Response(`User-agent: *\nDisallow:\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
