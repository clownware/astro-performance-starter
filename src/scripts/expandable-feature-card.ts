// Synchronized expand/collapse behavior for ExpandableFeatureCard components
// When one card expands, all cards in the same sync group expand together

class SyncedExpandableCards {
  private syncGroups = new Map<string, HTMLDetailsElement[]>();
  private isUpdating = false;

  constructor() {
    this.init();
  }

  private init() {
    // Find all expandable cards and group them by sync-group
    const cards = document.querySelectorAll<HTMLDetailsElement>("[data-sync-group]");

    cards.forEach((card) => {
      const syncGroup = card.dataset.syncGroup;
      if (!syncGroup) {
        return;
      }

      // Group cards by sync-group
      if (!this.syncGroups.has(syncGroup)) {
        this.syncGroups.set(syncGroup, []);
      }
      const group = this.syncGroups.get(syncGroup);
      if (group) {
        group.push(card);
      }

      // Add event listener for toggle events
      card.addEventListener("toggle", (event) => {
        if (this.isUpdating) {
          return; // Prevent infinite loops
        }
        this.handleToggle(event.target as HTMLDetailsElement, syncGroup);
      });
    });
  }

  private handleToggle(triggeredCard: HTMLDetailsElement, syncGroup: string) {
    const cardsInGroup = this.syncGroups.get(syncGroup);
    if (!cardsInGroup) {
      return;
    }

    const isExpanded = triggeredCard.open;
    this.isUpdating = true;

    // Synchronize all cards in the group
    cardsInGroup.forEach((card) => {
      if (card !== triggeredCard) {
        card.open = isExpanded;
      }
      this.updateCardText(card, isExpanded);
    });

    this.isUpdating = false;
  }

  private updateCardText(card: HTMLDetailsElement, isExpanded: boolean) {
    const textElement = card.querySelector(".expand-text");
    if (textElement) {
      textElement.textContent = isExpanded ? "Hide details" : "Show details";
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new SyncedExpandableCards());
} else {
  new SyncedExpandableCards();
}
