import { afterEach, describe, expect, it } from "vitest";
import { initFeatureCardSync } from "../featureCardSync";

function mountCards(count: number): HTMLDetailsElement[] {
  document.body.innerHTML = Array.from(
    { length: count },
    (_, i) => `
      <details class="feature-details">
        <summary>Card ${i}</summary>
        <section>Details ${i}</section>
      </details>
    `,
  ).join("");
  return Array.from(document.querySelectorAll<HTMLDetailsElement>(".feature-details"));
}

// jsdom does not fire the toggle event when .open changes programmatically,
// so simulate a user toggle: flip the property, then dispatch the event.
function userToggle(detail: HTMLDetailsElement, open: boolean) {
  detail.open = open;
  detail.dispatchEvent(new Event("toggle"));
}

describe("featureCardSync", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens every card when one card is opened", () => {
    const cards = mountCards(3);
    initFeatureCardSync();

    userToggle(cards[0], true);

    expect(cards.map((c) => c.open)).toEqual([true, true, true]);
  });

  it("closes every card when one card is closed", () => {
    const cards = mountCards(3);
    for (const card of cards) {
      card.open = true;
    }
    initFeatureCardSync();

    userToggle(cards[1], false);

    expect(cards.map((c) => c.open)).toEqual([false, false, false]);
  });

  it("does nothing on pages without feature cards", () => {
    document.body.innerHTML = "<details><summary>Unrelated</summary></details>";
    expect(() => initFeatureCardSync()).not.toThrow();
  });
});
