// Contact form progressive enhancement
// This script adds client-side validation and enhanced UX
// Form works without JavaScript (native constraint validation + native submission)

type FormField = HTMLInputElement | HTMLTextAreaElement;

export function initContactForm() {
  const form = document.querySelector(".contact-form") as HTMLFormElement;
  if (!form) {
    return;
  }

  // Take over from native validation only once the enhanced handlers are
  // attached — without JS the browser's required/minlength checks still run.
  form.setAttribute("novalidate", "");

  const submitButton = form.querySelector(".contact-form__submit") as HTMLButtonElement;
  const submitText = form.querySelector(".contact-form__submit-text") as HTMLElement;
  const submitLoading = form.querySelector(".contact-form__submit-loading") as HTMLElement;
  const statusContainer = form.querySelector(".contact-form__status") as HTMLElement;
  const successMessage = form.querySelector(".contact-form__success") as HTMLElement;
  const errorMessage = form.querySelector(".contact-form__error-message") as HTMLElement;

  const fields = Array.from(form.querySelectorAll<FormField>("input, textarea"));

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate everything before sending; blur validation only covers
    // fields the user has visited.
    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return;
    }

    // Clear previous status. The container itself is never hidden — it is a
    // live region and has to stay in the accessibility tree for the success
    // and error announcements to fire reliably.
    successMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");

    // Show loading state
    submitButton.disabled = true;
    submitText.textContent = "Sending...";
    submitLoading.classList.remove("hidden");

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Success
        successMessage.classList.remove("hidden");
        form.reset();
        statusContainer.focus();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (_error) {
      // Error
      errorMessage.classList.remove("hidden");
      statusContainer.focus();
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitText.textContent = "Send Message";
      submitLoading.classList.add("hidden");
    }
  });

  // Real-time validation
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => clearFieldError(field));
  });

  // Returns true when the field is valid; renders or clears its error message.
  function validateField(field: FormField): boolean {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (!errorElement) {
      // Fields without an error slot (e.g. the honeypot) are not validated.
      return true;
    }

    let errorMessage = "";

    if (field.hasAttribute("required") && !field.value.trim()) {
      errorMessage = `${field.labels?.[0]?.textContent?.replace("*", "").trim()} is required`;
    } else if (field.type === "email" && field.value && !isValidEmail(field.value)) {
      errorMessage = "Please enter a valid email address";
    } else if (
      field.hasAttribute("minlength") &&
      field.value.length < Number.parseInt(field.getAttribute("minlength") || "0", 10)
    ) {
      errorMessage = `Minimum ${field.getAttribute("minlength")} characters required`;
    }

    if (errorMessage) {
      errorElement.textContent = errorMessage;
      field.setAttribute("aria-invalid", "true");
      field.classList.add(
        "border-secondary-500",
        "focus:border-secondary-500",
        "focus:ring-secondary-500",
      );
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function clearFieldError(field: FormField) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (!errorElement) {
      return;
    }

    errorElement.textContent = "";
    field.removeAttribute("aria-invalid");
    field.classList.remove(
      "border-secondary-500",
      "focus:border-secondary-500",
      "focus:ring-secondary-500",
    );
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Auto-initialize when module is imported
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
  } else {
    initContactForm();
  }
}
