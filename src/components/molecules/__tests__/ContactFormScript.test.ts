import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initContactForm } from "../ContactFormScript";

// Minimal mirror of ContactForm.astro's structure — the classes, ids, and
// constraint attributes the enhancement script queries against.
function mountForm() {
  document.body.innerHTML = `
    <form class="contact-form" action="/contact" method="POST" name="contact">
      <input name="bot-field" type="text" tabindex="-1" />
      <div class="contact-form__field">
        <label for="contact-name">Name <span aria-hidden="true">*</span></label>
        <input type="text" id="contact-name" name="name" required minlength="2" aria-describedby="name-error" />
        <div id="name-error" class="contact-form__error" role="alert" aria-live="polite"></div>
      </div>
      <div class="contact-form__field">
        <label for="contact-email">Email <span aria-hidden="true">*</span></label>
        <input type="email" id="contact-email" name="email" required aria-describedby="email-error" />
        <div id="email-error" class="contact-form__error" role="alert" aria-live="polite"></div>
      </div>
      <div class="contact-form__field">
        <label for="contact-subject">Subject</label>
        <input type="text" id="contact-subject" name="subject" aria-describedby="subject-error" />
        <div id="subject-error" class="contact-form__error" role="alert" aria-live="polite"></div>
      </div>
      <div class="contact-form__field">
        <label for="contact-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" required minlength="10" aria-describedby="message-error"></textarea>
        <div id="message-error" class="contact-form__error" role="alert" aria-live="polite"></div>
      </div>
      <button type="submit" class="contact-form__submit">
        <span class="contact-form__submit-text">Send Message</span>
        <span class="contact-form__submit-loading hidden" aria-hidden="true"></span>
      </button>
      <div class="contact-form__status invisible" role="status" tabindex="-1">
        <div class="contact-form__success hidden"></div>
        <div class="contact-form__error-message hidden"></div>
      </div>
    </form>
  `;
  return document.querySelector(".contact-form") as HTMLFormElement;
}

function submit(form: HTMLFormElement) {
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

function fillValid(form: HTMLFormElement) {
  (form.querySelector('[name="name"]') as HTMLInputElement).value = "Pulci Nella";
  (form.querySelector('[name="email"]') as HTMLInputElement).value = "pulci@example.com";
  (form.querySelector('[name="message"]') as HTMLTextAreaElement).value =
    "A message long enough to pass the minlength constraint.";
}

describe("ContactFormScript", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("opts out of native validation only at enhancement time", () => {
    const form = mountForm();
    expect(form.hasAttribute("novalidate")).toBe(false);
    initContactForm();
    expect(form.hasAttribute("novalidate")).toBe(true);
  });

  it("blocks submission and shows every field error when the form is invalid", () => {
    const form = mountForm();
    initContactForm();

    submit(form);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.getElementById("name-error")?.textContent).toBe("Name is required");
    expect(document.getElementById("email-error")?.textContent).toBe("Email is required");
    expect(document.getElementById("message-error")?.textContent).toBe("Message is required");
    expect(form.querySelector('[name="name"]')?.getAttribute("aria-invalid")).toBe("true");
  });

  it("moves focus to the first invalid field on a blocked submit", () => {
    const form = mountForm();
    initContactForm();

    submit(form);

    expect(document.activeElement).toBe(form.querySelector('[name="name"]'));
  });

  it("re-validates on submit after a blur error was fixed", () => {
    const form = mountForm();
    initContactForm();
    fillValid(form);
    const email = form.querySelector('[name="email"]') as HTMLInputElement;
    email.value = "not-an-email";

    submit(form);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.getElementById("email-error")?.textContent).toBe(
      "Please enter a valid email address",
    );
  });

  it("submits via fetch when all fields are valid", async () => {
    const form = mountForm();
    initContactForm();
    fillValid(form);

    submit(form);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    expect(fetchMock.mock.calls[0][0]).toContain("/contact");
    await vi.waitFor(() =>
      expect(form.querySelector(".contact-form__success")?.classList.contains("hidden")).toBe(
        false,
      ),
    );
  });
});
