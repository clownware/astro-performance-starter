import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import astroExpressiveCode from "astro-expressive-code";
import { remarkSnippetIncludes } from "./scripts/src/remark-snippet-includes.mjs";
import { remarkValidateLinks } from "./scripts/src/remark-validate-links.mjs";
import { viteInjectVersions } from "./scripts/src/vite-plugin-inject-versions.mjs";
import { components as mdxComponents } from "./src/components/mdx/index.ts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// --- Deployment Configuration ---
// Read package name to derive GitHub Pages base path automatically.
// This eliminates hardcoded repo names that break when the template is cloned.
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

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

  // --- Fonts (Astro 6 Fonts API) — see ADR-053 (supersedes ADR-026) ---
  // Self-hosted local providers: the latin variable woff2 files are vendored in
  // src/assets/fonts/ so builds stay fully offline/reproducible (no build-time
  // font fetch). Astro fingerprints them, emits the @font-face, and generates
  // metric-adjusted fallback faces (size-adjust/ascent-override) to cut CLS.
  // Consumed via the generated CSS vars, wired to --font-display/--font-text in
  // global.css. Family names stay "Geist"/"Inter" to match tokens/base.json.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/geist-latin-variable.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-variable.woff2"],
          },
        ],
      },
    },
  ],

  // --- Type-safe environment variables (astro:env) — see ADR-050 ---
  // Schema-validated, typed access to the PUBLIC_* surface via astro:env/client.
  // Defaults here are the demo values, so consumers import the value directly
  // without scattered `|| "fallback"` literals. SITE_URL / PUBLIC_SITE_URL and
  // DEPLOY_TARGET are intentionally NOT here: they are read at config-load time
  // (above), before astro:env exists, and the placeholder heuristic that
  // astro:env can't express lives in scripts/src/validate-env.ts (env:validate).
  env: {
    schema: {
      PUBLIC_CONTACT_EMAIL: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "hello@example.com",
      }),
      PUBLIC_CONTACT_PHONE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "+1234567890",
      }),
      PUBLIC_CONTACT_PHONE_DISPLAY: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "+1 (234) 567-890",
      }),
      PUBLIC_CONTACT_LOCATION: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "San Francisco, CA",
      }),
      PUBLIC_CONTACT_TIMEZONE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "Mon-Fri, 9AM-6PM PST",
      }),
      PUBLIC_SOCIAL_GITHUB: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "https://github.com/example",
      }),
      PUBLIC_SOCIAL_LINKEDIN: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "https://linkedin.com/company/example",
      }),
      PUBLIC_SOCIAL_TWITTER: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "https://twitter.com/example",
      }),
    },
  },

  integrations: [
    // Options live in ec.config.mjs so the <Code> component can be used in
    // .astro pages — inline non-serializable config (functions like
    // themeCssSelector) breaks the prerender worker boundary.
    astroExpressiveCode(),
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
          basePaths: ["/docs", "/adr"],
          routeMap: {
            "/adr/": "docs/adr/",
          },
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
