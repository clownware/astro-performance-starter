// src/utils/socialShare.ts

/**
 * Social media sharing utilities
 * Generates platform-specific share URLs with proper encoding
 */

export type SharePlatform = "twitter" | "linkedin" | "facebook" | "reddit" | "email";

export interface ShareUrlOptions {
  url: string;
  title: string;
  description?: string;
}

/**
 * Generates a share URL for a specific social media platform
 * @param platform - Social media platform
 * @param options - Share content (url, title, description)
 * @returns Encoded share URL
 */
export function generateShareUrl(platform: SharePlatform, options: ShareUrlOptions): string {
  const { url, title, description } = options;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : "";

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "reddit":
      return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
    default:
      throw new Error(`Unsupported share platform: ${platform}`);
  }
}

/**
 * Generates all share URLs for common platforms
 * @param options - Share content (url, title, description)
 * @returns Object with share URLs for each platform
 */
export function generateAllShareUrls(options: ShareUrlOptions): Record<SharePlatform, string> {
  return {
    twitter: generateShareUrl("twitter", options),
    linkedin: generateShareUrl("linkedin", options),
    facebook: generateShareUrl("facebook", options),
    reddit: generateShareUrl("reddit", options),
    email: generateShareUrl("email", options),
  };
}

/**
 * Default export for convenience
 */
export default {
  generateShareUrl,
  generateAllShareUrls,
};
