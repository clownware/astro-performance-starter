import { readFileSync } from "node:fs";
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
// Read package name to derive GitHub Pages base path automatically.
// This eliminates hardcoded repo names that break when the template is cloned.
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
);

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

// Site URL: require explicit configuration for builds, default to localhost for dev.
// The validate-env.ts prebuild script catches misconfiguration before we get here.
const envSite = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
const isDev = process.argv.slice(2).includes("dev");
const site = envSite || (isDev ? "http://localhost:4321" : undefined);
if (!site) {
  throw new Error(
    "SITE_URL is required for production builds. " +
      "Set SITE_URL or PUBLIC_SITE_URL in your environment or .env file.",
  );
}

// Base path: derive from package.json name for GH Pages, root for all others.
const base = isGhPages ? `/${pkg.name}` : "/";

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
