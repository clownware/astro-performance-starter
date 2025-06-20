import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
// astro.config.mjs
import { defineConfig } from "astro/config";
import { rehypeInjectVersions, remarkInjectVersions } from "./scripts/remark-inject-versions.mjs";
import { remarkSnippetIncludes } from "./scripts/remark-snippet-includes.mjs";
import { remarkValidateLinks } from "./scripts/remark-validate-links.mjs";
import { components as mdxComponents } from "./src/components/mdx/index.ts";

export default defineConfig({
  site: "https://example.com",

  integrations: [
    mdx({
      components: mdxComponents,
      remarkPlugins: [
        // Add snippet includes plugin first (processes shortcodes before other plugins)
        [
          remarkSnippetIncludes,
          {
            rootDir: process.cwd(),
            snippetsDir: "docs/snippets",
            strict: true,
          },
        ],
        // Add our version injection plugin
        [remarkInjectVersions, { rootDir: process.cwd() }],
        // Add link validation plugin
        [
          remarkValidateLinks,
          {
            rootDir: process.cwd(),
            basePaths: ["/docs", "/src/content"],
            strict: true,
          },
        ],
      ],
      rehypePlugins: [
        // Optional: also process HTML nodes
        [rehypeInjectVersions, { rootDir: process.cwd() }],
      ],
    }),
    tailwind(),
    sitemap(),
    preact(), // Ensure Preact is available for .tsx MDX components
    compress(), // Optional: For compressing output, good for performance
  ],

  // Also apply to regular markdown files
  markdown: {
    remarkPlugins: [
      // Add snippet includes plugin first
      [
        remarkSnippetIncludes,
        {
          rootDir: process.cwd(),
          snippetsDir: "docs/snippets",
          strict: true,
        },
      ],
      [remarkInjectVersions, { rootDir: process.cwd() }],
      [
        remarkValidateLinks,
        {
          rootDir: process.cwd(),
          basePaths: ["/docs", "/src/content"],
          strict: true,
        },
      ],
    ],
    rehypePlugins: [[rehypeInjectVersions, { rootDir: process.cwd() }]],
  },
});
