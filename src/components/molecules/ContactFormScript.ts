// Contact form progressive enhancement
// This script adds client-side validation and enhanced UX
// Form works without JavaScript (native submission)

export function initContactForm() {
  const form = document.querySelector(".contact-form") as HTMLFormElement;
  if (!form) {
    return;
  }

  const submitButton = form.querySelector(".contact-form__submit") as HTMLButtonElement;
  const submitText = form.querySelector(".contact-form__submit-text") as HTMLElement;
  const submitLoading = form.querySelector(".contact-form__submit-loading") as HTMLElement;
  const statusContainer = form.querySelector(".contact-form__status") as HTMLElement;
  const successMessage = form.querySelector(".contact-form__success") as HTMLElement;
  const errorMessage = form.querySelector(".contact-form__error-message") as HTMLElement;

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous status
    statusContainer.classList.add("hidden");
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
        statusContainer.classList.remove("hidden");
        successMessage.classList.remove("hidden");
        form.reset();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (_error) {
      // Error
      statusContainer.classList.remove("hidden");
      errorMessage.classList.remove("hidden");
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitText.textContent = "Send Message";
      submitLoading.classList.add("hidden");
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearFieldError);
  });

  function validateField(e: Event) {
    const field = e.target as HTMLInputElement | HTMLTextAreaElement;
    const errorElement = document.getElementById(`${field.name}-error`);
    if (!errorElement) {
      return;
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
    } else {
      clearFieldError(e);
    }
  }

  function clearFieldError(e: Event) {
    const field = e.target as HTMLInputElement | HTMLTextAreaElement;
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
