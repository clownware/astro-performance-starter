// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import Callout from "../Callout.astro";

const renderCallout = (props: Record<string, unknown>, slot = "Callout body") =>
  render(Callout, props, { default: slot });

describe("Callout (mdx)", () => {
  describe("status colours use single role tokens (ADR-047)", () => {
    it("maps success to the success role token + opacity tint", async () => {
      const html = await renderCallout({ type: "success" });
      expect(html).toContain("border-success");
      expect(html).toContain("bg-success/10");
    });

    it("maps warning to the warning role token (amber, not secondary)", async () => {
      const html = await renderCallout({ type: "warning" });
      expect(html).toContain("border-warning");
      expect(html).toContain("bg-warning/10");
    });

    it("maps danger to the error role token", async () => {
      const html = await renderCallout({ type: "danger" });
      expect(html).toContain("border-error");
      expect(html).toContain("bg-error/10");
    });

    it("uses the link role token for the note accent border", async () => {
      const html = await renderCallout({ type: "note" });
      expect(html).toContain("border-link");
    });

    it("never emits a 3-step status scale class", async () => {
      const html = await renderCallout({ type: "success" });
      expect(html).not.toMatch(/(success|warning|error)-(100|600|700|800)/);
    });

    it("never emits a manual dark: status variant", async () => {
      const html = await renderCallout({ type: "warning" });
      expect(html).not.toContain("dark:bg-");
    });
  });

  describe("accessibility role", () => {
    it("uses role=alert for warning callouts", async () => {
      const html = await renderCallout({ type: "warning" });
      expect(html).toContain('role="alert"');
    });

    it("uses role=region for non-urgent callouts", async () => {
      const html = await renderCallout({ type: "note" });
      expect(html).toContain('role="region"');
    });
  });
});
