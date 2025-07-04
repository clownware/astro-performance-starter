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
import remarkBasePrefix from "./scripts/src/remark-base-prefix.mjs";
import { remarkSnippetIncludes } from "./scripts/src/remark-snippet-includes.mjs";
import { remarkValidateLinks } from "./scripts/src/remark-validate-links.mjs";
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
      disable404Route: true,
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
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Quick Deploy",
          link: "/getting-started/quick-track-deploy/",
          badge: { text: "Start Here", variant: "tip" },
        },
        {
          label: "Implementation Guides",
          collapsed: false,
          items: [
            {
              label: "Overview",
              collapsed: true,
              items: [
                { label: "Introduction", link: "implementation-guides/00-overview-readme" },
                {
                  label: "Budgets & Guardrails",
                  link: "implementation-guides/00-overview-budgets-guardrails",
                },
                {
                  label: "Directory Structure",
                  link: "implementation-guides/00-overview-directory-structure",
                },
                {
                  label: "Table Format Guide",
                  link: "implementation-guides/00-overview-table-format-guide",
                },
                { label: "Tech Stack", link: "implementation-guides/00-overview-tech-stack" },
              ],
            },
            {
              label: "Foundation",
              badge: { text: "Phases DONE", variant: "success" },
              collapsed: true,
              items: [
                {
                  label: "Phase 0: Foundation",
                  link: "implementation-guides/01-foundation-phase-0-foundation",
                },
                {
                  label: "Phase 1: Content Architecture",
                  link: "implementation-guides/01-foundation-phase-1-content-arch",
                },
                {
                  label: "Phase 2: Design System",
                  link: "implementation-guides/01-foundation-phase-2-design-system",
                },
                {
                  label: "Phase 3: Tooling",
                  link: "implementation-guides/01-foundation-phase-3-tooling",
                },
              ],
            },
            {
              label: "Structure",
              badge: { text: "Phases 4-6", variant: "note" },
              collapsed: true,
              items: [
                {
                  label: "Phase 4: Skeleton",
                  link: "implementation-guides/02-structure-phase-4-skeleton",
                },
                {
                  label: "Phase 5: Components",
                  link: "implementation-guides/02-structure-phase-5-components",
                },
                {
                  label: "Phase 6: Sections",
                  link: "implementation-guides/02-structure-phase-6-sections",
                },
              ],
            },
            {
              label: "Content",
              badge: { text: "Phase 7", variant: "note" },
              collapsed: true,
              items: [
                {
                  label: "Phase 7: Content",
                  link: "implementation-guides/03-content-phase-7-content",
                },
                {
                  label: "Content Model Guide",
                  link: "implementation-guides/03-content-content-model-guide",
                },
                {
                  label: "Image Optimization Guide",
                  link: "implementation-guides/03-content-image-optimization-guide",
                },
              ],
            },
            {
              label: "Quality",
              badge: { text: "Phases 8-9", variant: "note" },
              collapsed: true,
              items: [
                { label: "Phase 8: QA", link: "implementation-guides/04-quality-phase-8-qa" },
                {
                  label: "Phase 9: Performance",
                  link: "implementation-guides/04-quality-phase-9-performance",
                },
                {
                  label: "Accessibility Guide",
                  link: "implementation-guides/04-quality-accessibility-guide",
                },
                {
                  label: "Rollback Strategies Guide",
                  link: "implementation-guides/04-quality-rollback-strategies-guide",
                },
                {
                  label: "Testing Strategy Guide",
                  link: "implementation-guides/04-quality-testing-strategy-guide",
                },
              ],
            },
            {
              label: "Deployment",
              badge: { text: "Phases 10-12", variant: "note" },
              collapsed: true,
              items: [
                {
                  label: "Phase 10: Deployment",
                  link: "implementation-guides/05-deployment-phase-10-deployment",
                },
                {
                  label: "Phase 11: Documentation",
                  link: "implementation-guides/05-deployment-phase-11-documentation",
                },
                {
                  label: "Phase 12: Post-Launch",
                  link: "implementation-guides/05-deployment-phase-12-post-launch",
                },
              ],
            },
          ],
        },
        {
          label: "Development",
          autogenerate: { directory: "development" },
        },
        {
          label: "Architecture",
          collapsed: true,
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
          collapsed: true,
          items: [
            {
              label: "Track Comparison",
              link: "tracks/track-comparison/",
            },
            {
              label: "MVP Track (2-3 weeks)",
              link: "tracks/mvp-track-guide/",
            },
            {
              label: "Showcase Track (4-6 weeks)",
              link: "tracks/showcase-track-guide/",
            },
          ],
        },
        {
          label: "Advanced",
          collapsed: true,
          items: [
            {
              label: "Architecture Decision Records",
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
    starlightLinksValidator({ base: "/astro-starter-template" }),
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
      [remarkBasePrefix, { base: "/astro-starter-template" }],
      [
        remarkValidateLinks,
        {
          rootDir: rootDir,
          excludePaths: ["src/content/docs"],
        },
      ],
      [
        remarkSnippetIncludes,
        {
          rootDir: process.cwd(),
          snippetsDir: "src/content/docs/snippets",
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
