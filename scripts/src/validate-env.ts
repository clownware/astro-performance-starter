#!/usr/bin/env tsx
/**
 * Validate deployment environment variables before build.
 * Fails (exit code 1) if SITE_URL is missing, contains placeholders,
 * or is malformed. Runs as a prebuild step in the build chain.
 *
 * Usage: pnpm run env:validate (mapped in package.json)
 */

const placeholderPatterns = ["example.com", "your-username", "your-domain", "localhost"];

const siteUrl = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;

if (!siteUrl) {
  console.error("❌ Missing SITE_URL: production builds require SITE_URL or PUBLIC_SITE_URL.");
  console.error("   Set it in your .env file or as a CI environment variable.");
  console.error('   Example: SITE_URL="https://your-username.github.io"');
  process.exit(1);
}

const lowerUrl = siteUrl.toLowerCase();
for (const pattern of placeholderPatterns) {
  if (lowerUrl.includes(pattern)) {
    console.error(`❌ SITE_URL contains a placeholder value: "${siteUrl}"`);
    console.error("   Replace it with your actual production URL.");
    process.exit(1);
  }
}

if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
  console.error(`❌ SITE_URL must be a full URL starting with https:// — got: "${siteUrl}"`);
  process.exit(1);
}

console.log(`✅ Environment validation passed (SITE_URL: ${siteUrl}).`);
