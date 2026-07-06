// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "../../__tests__/_helpers/container";
import ContactForm from "../ContactForm.astro";

describe("ContactForm (molecule)", () => {
  describe("progressive enhancement baseline (ADR-021)", () => {
    it("does not ship novalidate in the static markup — native validation must protect no-JS submissions", async () => {
      const html = await render(ContactForm);
      expect(html).not.toMatch(/<form[^>]*\bnovalidate\b/);
    });

    it("keeps native constraint attributes on required fields", async () => {
      const html = await render(ContactForm);
      expect(html).toMatch(/name="name"[^>]*/);
      expect(html).toMatch(/<input[^>]*name="name"[^>]*\brequired\b|\brequired\b[^>]*name="name"/);
      expect(html).toMatch(
        /<input[^>]*name="email"[^>]*\brequired\b|\brequired\b[^>]*name="email"/,
      );
      expect(html).toMatch(
        /<textarea[^>]*name="message"[^>]*\brequired\b|\brequired\b[^>]*name="message"/,
      );
    });
  });
});
