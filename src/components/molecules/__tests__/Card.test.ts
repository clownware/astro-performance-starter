// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Card from "../Card.astro";

const renderCard = (props: Record<string, unknown> = {}, slot = "Body") =>
  render(Card, props, { default: slot });

describe("Card (molecule)", () => {
  describe("rendering", () => {
    it("renders default slot content", async () => {
      const html = await renderCard({}, "Hello world");
      expect(html).toContain("Hello world");
    });

    it("renders as a <div> wrapper", async () => {
      const html = await renderCard();
      expect(html).toMatch(/<div[^>]*class="[^"]*card[^"]*"/);
    });
  });

  describe("base styling", () => {
    it("applies the card base class", async () => {
      const html = await renderCard();
      expect(html).toContain("card");
    });

    it("applies background, border, and shadow tokens", async () => {
      const html = await renderCard();
      expect(html).toContain("bg-background-secondary");
      expect(html).toContain("border-primary");
      expect(html).toContain("shadow-sm");
    });

    it("clips overflow and rounds corners", async () => {
      const html = await renderCard();
      expect(html).toContain("overflow-hidden");
      expect(html).toContain("rounded-lg");
    });
  });

  describe("animated variant", () => {
    it("does NOT apply card--animated by default", async () => {
      const html = await renderCard();
      expect(html).not.toContain("card--animated");
    });

    it("applies card--animated when animated=true", async () => {
      const html = await renderCard({ animated: true });
      expect(html).toContain("card--animated");
    });

    it("does NOT apply card--animated when animated=false explicitly", async () => {
      const html = await renderCard({ animated: false });
      expect(html).not.toContain("card--animated");
    });
  });

  describe("class composition", () => {
    it("merges a custom class with base classes", async () => {
      const html = await renderCard({ class: "my-extra" });
      expect(html).toContain("my-extra");
      expect(html).toContain("card");
    });
  });
});
