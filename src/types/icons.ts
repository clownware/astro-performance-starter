/**
 * Canonical icon name union for the Icon atom.
 *
 * Source of truth for both the Icon component's `name` prop and any data
 * structure (features, metrics, etc.) that needs to reference an icon. Keep
 * this in sync with the path registry in `src/components/atoms/Icon.astro`.
 *
 * See ADR-055 (icon system) for the Lucide-aligned line family and the
 * one-gradient-per-view rule.
 */
export type IconName =
  | "github"
  | "arrow-down"
  | "arrow-right"
  | "external-link"
  | "custom"
  // Feature cards
  | "zap"
  | "bot"
  | "palette"
  | "gauge"
  | "puzzle"
  | "layers"
  // Metrics
  | "accessibility"
  | "shield-check"
  | "search"
  // Decorative / utility
  | "check"
  | "target"
  | "wrench"
  | "lock"
  | "book-open";
