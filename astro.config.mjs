import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import astroExpressiveCode from "astro-expressive-code";
import { remarkSnippetIncludes } from "./scripts/src/remark-snippet-includes.mjs";
import { remarkValidateLinks } from "./scripts/src/remark-validate-links.mjs";
import { viteInjectVersions } from "./scripts/src/vite-plugin-inject-versions.mjs";
import { components as mdxComponents } from "./src/components/mdx/index.ts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// --- Deployment Configuration ---
// Determines config based on DEPLOY_TARGET environment variable.
// - `gh-pages`: Builds for GitHub Pages with a base path.
// - `undefined` (or any other value): Builds for root deployment (e.g., Cloudflare Pages).
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

const site = isGhPages ? "https://clownware.github.io/astro-starter-template" : "https://your-production-domain.com"; // TODO: Update with your production domain

const base = isGhPages ? "/astro-starter-template/" : "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",

  integrations: [
    astroExpressiveCode({
      themes: ["dark-plus", "light-plus"],
    }),
    mdx({
      components: mdxComponents,
    }),
    // Main site Tailwind with strict isolation
    tailwind({
      configFile: "./tailwind.config.ts",
      applyBaseStyles: true, // Important for isolation from Starlight
    }),
    sitemap(),
    preact(), // Ensure Preact is available for .tsx MDX components
  ],

  markdown: {
    remarkPlugins: [
      [
        remarkValidateLinks,
        {
          rootDir: rootDir,
          excludePaths: ["docs"],
        },
      ],
      [
        remarkSnippetIncludes,
        {
          rootDir: process.cwd(),
          snippetsDir: "docs/snippets",
          strict: true,
        },
      ],
    ],
    rehypePlugins: [],
    mdxComponents,
  },

  // Enhanced build configuration
  vite: {
    plugins: [viteInjectVersions({ rootDir })],
  },

  // Performance optimizations
  output: "static",

  build: {
    inlineStylesheets: "auto",
  },

  // Image optimization configuration using Sharp
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels max
      },
    },
    domains: [],
    remotePatterns: [],
  },
});
