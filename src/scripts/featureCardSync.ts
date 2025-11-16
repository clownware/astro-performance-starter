/**
 * Feature Card Synchronization
 * Ensures all expandable feature cards open/close together
 * Loaded once globally instead of per-component for better performance
 */

export function initFeatureCardSync() {
  const details = document.querySelectorAll<HTMLDetailsElement>(".feature-details");

  if (details.length === 0) {
    return;
  }

  const syncAllCards = (shouldOpen: boolean) => {
    details.forEach((detail) => {
      detail.open = shouldOpen;
    });
  };

  const handleToggle = (event: Event) => {
    const target = event.target as HTMLDetailsElement;
    const isOpening = target.open;
    syncAllCards(isOpening);
  };

  // Add event listeners
  details.forEach((detail) => {
    detail.addEventListener("toggle", handleToggle);
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFeatureCardSync);
  } else {
    initFeatureCardSync();
  }

  // Re-initialize after Astro view transitions
  document.addEventListener("astro:page-load", initFeatureCardSync);
}
