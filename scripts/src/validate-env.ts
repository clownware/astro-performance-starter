#!/usr/bin/env tsx
/**
 * Slim deployment-env guard. Type-safe presence/shape validation of the
 * PUBLIC_* surface now lives in the `env.schema` (astro:env) declared in
 * astro.config.mjs (see ADR-050). This script keeps only the one check
 * astro:env cannot express: the placeholder-content heuristic that catches a
 * cloner shipping with the template's example values still in SITE_URL.
 *
 * Runs as the `env:validate` prebuild step in the build chain.
 * Usage: pnpm run env:validate
 */

const placeholderPatterns = ["example.com", "your-username", "your-domain", "localhost"];

/** True if the URL still contains a template placeholder rather than a real origin. */
export function isPlaceholderUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return placeholderPatterns.some((pattern) => lower.includes(pattern));
}

/** CLI entrypoint — only runs when invoked directly, not when imported by tests. */
function main(): void {
  const siteUrl = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;

  if (!siteUrl) {
    console.error("❌ Missing SITE_URL: production builds require SITE_URL or PUBLIC_SITE_URL.");
    console.error("   Set it in your .env file or as a CI environment variable.");
    console.error('   Example: SITE_URL="https://your-username.github.io"');
    process.exit(1);
  }

  if (isPlaceholderUrl(siteUrl)) {
    console.error(`❌ SITE_URL contains a placeholder value: "${siteUrl}"`);
    console.error("   Replace it with your actual production URL.");
    process.exit(1);
  }

  console.log(`✅ Environment validation passed (SITE_URL: ${siteUrl}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
