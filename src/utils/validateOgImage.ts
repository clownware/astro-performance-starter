import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Validates that an OG image path exists in the public directory.
 *
 * @param imagePath - Relative path to the image (e.g., "/og-default.png") or ImageMetadata object
 * @returns true if valid, false if missing (with console warning)
 */
export function validateOgImage(imagePath: string | { src: string }): boolean {
  // Handle ImageMetadata objects from Astro image imports
  if (typeof imagePath === "object" && imagePath?.src) {
    return true; // ImageMetadata objects are already validated by Astro
  }

  // Ensure we have a string at this point
  if (typeof imagePath !== "string") {
    return true; // Skip validation for unexpected types
  }

  // Skip validation for Astro-processed images (contain special dev server paths)
  if (imagePath.includes("/@fs/") || imagePath.includes("?origWidth=")) {
    return true; // These are Astro ImageMetadata .src strings in dev mode
  }

  // Skip validation for absolute URLs (external images)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return true;
  }

  // Skip validation in production builds
  if (import.meta.env.PROD) {
    return true;
  }

  try {
    // Resolve path to public directory
    const publicDir = fileURLToPath(new URL("../../public", import.meta.url));
    const fullPath = join(publicDir, imagePath);

    if (!existsSync(fullPath)) {
      console.warn(
        `⚠️  OG Image Warning: "${imagePath}" not found in /public/ directory.\n` +
          `   Social media previews may show broken images.\n` +
          `   Expected location: ${fullPath}`,
      );
      return false;
    }

    return true;
  } catch {
    // Silently fail if validation can't run (e.g., in browser context)
    return true;
  }
}
