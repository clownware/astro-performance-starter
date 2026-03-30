export const siteMetadata = {
  /**
   * Primary site title used in default meta tags.
   */
  title: "Astro Performance Starter",
  /**
   * Fallback description if a page does not provide its own.
   */
  description: "A production-ready Astro starter focused on performance, accessibility, and DX.",
  /**
   * Default author string for meta tags.
   */
  author: "Your Name",
} as const;

/**
 * Configurable URLs and branding for the template.
 * Update these values when you fork/clone the template for your own project.
 */
export const siteLinks = {
  /**
   * GitHub repository URL. Used in header, footer, and CTA links.
   */
  github: "",
  /**
   * Documentation site URL. Set to "" to hide docs links, or point to your own docs site.
   */
  docs: "",
  /**
   * URL for the live demo / GitHub Pages deployment.
   */
  demo: "",
  /**
   * PageSpeed Insights URL for live quality badge. Set to "" to hide.
   */
  pagespeed: "",
} as const;

/**
 * Social links displayed on the About page and footer.
 * Remove or update these for your own profiles.
 */
export const socialLinks = {
  github: "",
  linkedin: "",
  twitter: "",
} as const;
