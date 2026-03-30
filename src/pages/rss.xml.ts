import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteMetadata } from "@/config";
import { getPublishedPosts } from "@/utils/blog";
import { withBase } from "@/utils/url-utils";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site: context.site?.href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: withBase(`/blog/${post.id}/`),
    })),
  });
}
