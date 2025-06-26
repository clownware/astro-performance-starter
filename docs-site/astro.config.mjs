import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";
import { remarkInjectVersions, rehypeInjectVersions } from "../scripts/remark-inject-versions.mjs";
import { viteInjectVersions } from "../scripts/vite-plugin-inject-versions.mjs";
// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://clownware.github.io",
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
      },
      social: [
        {
          label: "GitHub",
          href: "https://github.com/clownware/astro-starter-template",
          icon: "github",
        },
        {
          label: "Discord",
          href: "#",
          icon: "discord",
        },
        {
          label: "Twitter",
          href: "https://twitter.com/clownware",
          icon: "twitter",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/clownware/astro-starter-template/edit/master/docs/",
      },


      sidebar: [
        {
          label: "Getting Started",
          badge: { text: "Start Here", variant: "tip" },
          items: [
            {
              label: "Overview",
              link: "",  
              badge: { text: "New", variant: "note" },
            },
            {
              label: "Quick Deploy",
              link: "quick-track-deploy",
              badge: { text: "5 min", variant: "success" },
            },
            { label: "FAQ", link: "faq" },
            { label: "README", link: "readme" },
            { label: "Roadmap", link: "roadmap" },
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
            { label: "Contributing", link: "contributing" },
            { label: "Git Workflow", link: "git-workflow" },
            { label: "Design Tokens", link: "how-to-use-design-tokens" },
            { label: "Design System Changelog", link: "design-system-changelog" },
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
              link: "github-template-structure",
              badge: { text: "Important", variant: "tip" },
            },
            { label: "Documentation Review Cadence", link: "documentation-review-cadence" },
            { label: "Link Migration Guide", link: "link-migration-guide" },
          ],
        },
        {
          label: "Tracks",
          collapsed: false,
          items: [
            {
              label: "Track Comparison",
              link: "tracks/track-comparison",
              badge: { text: "Compare", variant: "note" },
            },
            {
              label: "MVP Track (2-3 weeks)",
              link: "tracks/mvp-track-guide",
              badge: { text: "Fast", variant: "success" },
            },
            {
              label: "Showcase Track (4-6 weeks)",
              link: "tracks/showcase-track-guide",
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
      customCss: ["./src/styles/custom.css"],
      lastUpdated: true,
      pagination: true,
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      favicon: "/favicon.svg",

      // Ensure banner.content and other frontmatter strings get version injection
      markdown: {
        remarkPlugins: [[remarkInjectVersions, { rootDir }]],
        rehypePlugins: [[rehypeInjectVersions, { rootDir }]],
      },
      head: [
        // Add meta tags for better SEO
        {
          tag: "meta",
          attrs: {
            name: "keywords",
            content: "astro, performance, lighthouse, starter, template, web development",
          },
        },
        // Add Open Graph tags
        {
          tag: "meta",
          attrs: {
            property: "og:type",
            content: "website",
          },
        },
        // Enhanced font loading
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: true,
          },
        },
      ],
      // Language configuration
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
    }),
    mdx(),
  ],

  // Inject dynamic version placeholders and enhanced markdown configuration
  markdown: {
    remarkPlugins: [[remarkInjectVersions, { rootDir }]],
    rehypePlugins: [[rehypeInjectVersions, { rootDir }]],
    // Enhanced code block configuration
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dark-plus",
      wrap: true,
    },
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
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
