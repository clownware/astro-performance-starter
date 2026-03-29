import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
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

// Prefer environment-provided site for production builds to avoid placeholder canonicals
// Use SITE_URL or PUBLIC_SITE_URL; fall back to GH Pages domain when not provided
const envSite = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
const site = isGhPages
  ? (envSite ?? "https://clownware.github.io")
  : (envSite ?? "https://clownware.github.io");

const base = isGhPages ? "/astro-performance-starter" : "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",

  prefetch: true,

  integrations: [
    astroExpressiveCode({
      themes: ["dark-plus", "light-plus"],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root:not(.dark)"),
    }),
    mdx({
      components: mdxComponents,
    }),
    sitemap(),
    preact(), // Ensure Preact is available for .tsx MDX components
  ],

  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dark-plus",
    },
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
  },

  // Enhanced build configuration
  vite: {
    plugins: [tailwindcss(), viteInjectVersions({ rootDir })],
    build: {
      cssMinify: "lightningcss",
    },
  },

  // Performance optimizations
  output: "static",

  build: {
    inlineStylesheets: "auto",
    // biome-ignore lint/style/useNamingConvention: Astro requires the exact key `compressHTML`
    compressHTML: true,
  },

  // Image optimization configuration using Sharp
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels max
      },
    },
    responsive: {
      globalStyles: true,
      layout: "constrained",
    },
    domains: [],
    remotePatterns: [],
  },
});
