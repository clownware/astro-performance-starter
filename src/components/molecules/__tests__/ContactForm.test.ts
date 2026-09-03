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

    it("renders the status region visible and in the accessibility tree", async () => {
      // Regression: the region shipped with Tailwind's `invisible`
      // (visibility: hidden) while the enhancement script only ever toggled
      // `hidden` on it. Nothing removed `invisible`, so the success and error
      // messages could never be seen and the live region never announced.
      const html = await render(ContactForm);
      const status = html.match(/<div[^>]*class="[^"]*contact-form__status[^"]*"[^>]*>/)?.[0];
      expect(status).toBeDefined();
      expect(status).not.toMatch(/\binvisible\b/);
      expect(status).not.toMatch(/\bhidden\b/);
      expect(status).not.toMatch(/\bsr-only\b/);
      expect(status).toMatch(/role="status"/);
      expect(status).toMatch(/aria-live="polite"/);
    });

    it("ships both status messages hidden until a submission resolves", async () => {
      const html = await render(ContactForm);
      const success = html.match(/<div[^>]*class="[^"]*contact-form__success[^"]*"/)?.[0];
      const error = html.match(/<div[^>]*class="[^"]*contact-form__error-message[^"]*"/)?.[0];
      expect(success).toMatch(/\bhidden\b/);
      expect(error).toMatch(/\bhidden\b/);
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
