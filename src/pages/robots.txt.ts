import type { APIRoute } from "astro";

// biome-ignore lint/style/useNamingConvention: Astro requires uppercase GET for API routes
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("sitemap-index.xml", site);
  return new Response(`User-agent: *\nDisallow:\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
