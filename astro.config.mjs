import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import astroExpressiveCode from "astro-expressive-code";
import starlightLinksValidator from "starlight-links-validator";

import { remarkSnippetIncludes } from "./scripts/src/remark-snippet-includes.mjs";

import { viteInjectVersions } from "./scripts/src/vite-plugin-inject-versions.mjs";
import { components as mdxComponents } from "./src/components/mdx/index.ts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  trailingSlash: "always",
  site: "https://clownware.github.io/astro-starter-template",
  base: "/astro-starter-template",

  integrations: [
    astroExpressiveCode({
      themes: ["dark-plus", "light-plus"],
      styleOverrides: {
        borderRadius: "0.5rem",
        borderColor: "var(--sl-color-gray-3)",
      },
    }),
    starlight({
      title: "Astro Performance Starter",
      description: "Production-ready Astro starter template with 100/100 Lighthouse scores",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: false,
        width: 28,
        height: 28,
      },
      social: [
        {
          label: "GitHub",
          href: "https://github.com/clownware/astro-starter-template",
          icon: "github",
        },
      ],

      editLink: {
        baseUrl:
          "https://github.com/clownware/astro-starter-template/edit/master/src/content/docs/",
      },
      sidebar: [
        {
          label: "Getting Started",
          badge: { text: "Start Here", variant: "tip" },
          items: [
            {
              label: "Overview",
              link: "readme/",
              badge: { text: "New", variant: "note" },
            },
            {
              label: "Quick Deploy",
              link: "quick-track-deploy/",
              badge: { text: "5 min", variant: "success" },
            },
            { label: "FAQ", link: "faq/" },
          ],
        },
        {
          label: "Implementation Guides",
          collapsed: false,
          badge: { text: "12 Phases", variant: "caution" },
          autogenerate: { directory: "implementation-guides" },
        },
        {
          label: "Development",
          items: [
            { label: "Contributing", link: "contributing/" },
            { label: "Git Workflow", link: "git-workflow/" },
            { label: "Design Tokens", link: "how-to-use-design-tokens/" },
            { label: "Design System Changelog", link: "design-system-changelog/" },
            {
              label: "Content Guidelines",
              autogenerate: { directory: "content" },
            },
          ],
        },
        {
          label: "Architecture",
          items: [
            {
              label: "GitHub Template Structure",
              link: "github-template-structure/",
              badge: { text: "Important", variant: "tip" },
            },
            { label: "Documentation Review Cadence", link: "documentation-review-cadence/" },
            { label: "Link Migration Guide", link: "link-migration-guide/" },
          ],
        },
        {
          label: "Tracks",
          collapsed: false,
          items: [
            {
              label: "Track Comparison",
              link: "tracks/track-comparison/",
              badge: { text: "Compare", variant: "note" },
            },
            {
              label: "MVP Track (2-3 weeks)",
              link: "tracks/mvp-track-guide/",
              badge: { text: "Fast", variant: "success" },
            },
            {
              label: "Showcase Track (4-6 weeks)",
              link: "tracks/showcase-track-guide/",
              badge: { text: "Full", variant: "tip" },
            },
          ],
        },
        {
          label: "Advanced",
          collapsed: true,
          items: [
            {
              label: "Architecture Decision Records (ADRs)",
              badge: "ADRs",
              autogenerate: { directory: "adr" },
            },
            {
              label: "Patterns & Snippets",
              items: [
                {
                  label: "Patterns",
                  badge: "UI",
                  autogenerate: { directory: "patterns" },
                },
                {
                  label: "Code Snippets",
                  badge: "Code",
                  autogenerate: { directory: "snippets" },
                },
              ],
            },
            {
              label: "AI Context",
              badge: { text: "Beta", variant: "caution" },
              autogenerate: { directory: "ai-context" },
            },
          ],
        },
      ],
      customCss: ["./src/styles/starlight-overrides.css"],
      lastUpdated: true,
      pagination: true,
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      favicon: "./src/assets/logo.svg",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
    }),
    mdx({
      components: mdxComponents,
    }),
    // Main site Tailwind with strict isolation
    tailwind({
      configFile: "./tailwind.config.ts",
      applyBaseStyles: false, // Important for isolation from Starlight
    }),
    sitemap(),
    preact(), // Ensure Preact is available for .tsx MDX components
    compress(), // Optional: For compressing output, good for performance
  ],

  markdown: {
    remarkPlugins: [
      [starlightLinksValidator, {}],
      [
        remarkSnippetIncludes,
        {
          rootDir: process.cwd(),
          snippetsDir: "src/content/docs/snippets",
          strict: true,
        },
      ],
    ],
  },

  // Enhanced build configuration
  vite: {
    plugins: [viteInjectVersions({ rootDir })],
    ssr: {
      noExternal: ["@astrojs/starlight"],
    },
    optimizeDeps: {
      exclude: ["@astrojs/starlight"],
    },
  },

  // Performance optimizations
  output: "static",

  build: {
    inlineStylesheets: "auto",
  },
});
