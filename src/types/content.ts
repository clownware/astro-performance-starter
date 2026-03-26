/**
 * Shared type definitions for content data structures.
 * Used across pages for consistent typing and better DX.
 */

/**
 * Feature card data structure for homepage features section
 */
export interface Feature {
  /** Emoji icon representing the feature */
  icon: string;
  /** Feature title */
  title: string;
  /** Short description of the feature */
  description: string;
  /** Metric or badge text (e.g., "95+ Lighthouse") */
  metric: string;
  /** Detailed feature breakdown shown when expanded */
  expandedDetails: string[];
}

/**
 * Lighthouse metric data structure
 */
export interface LighthouseMetric {
  /** Metric label (e.g., "Performance", "Accessibility") */
  label: string;
  /** Score value (e.g., "95+", "100") */
  score: string;
  /** Emoji icon for the metric */
  icon: string;
}

/**
 * Technology stack item
 */
export interface TechStackItem {
  /** Technology name */
  name: string;
  /** Version string (e.g., "v5.x") */
  version: string;
  /** Brief description of the technology */
  description: string;
  /** Key benefit or value proposition */
  benefit: string;
  /** Category for grouping (e.g., "Framework", "Tooling") */
  category: string;
}

/**
 * Technical term definitions for tooltips and glossary
 */
export type TechTerms = Record<string, string>;

/**
 * Stack rationale sections
 */
export interface StackRationale {
  /** Performance-focused reasoning */
  performance: string;
  /** Developer experience reasoning */
  developerExperience: string;
  /** Production readiness reasoning */
  productionReady: string;
  /** Future-proofing reasoning */
  futureProof: string;
}
