import { expect, test } from "@playwright/test";

test.describe("Contact Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/contact/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/Contact/);
	});

	test("should display hero section", async ({ page }) => {
		const heading = page.getByRole("heading", {
			name: "Let's Start a Conversation",
		});
		await expect(heading).toBeVisible();

		// Check for badges
		const badges = page.locator("section").first().getByText(/Available/);
		await expect(badges).toBeVisible();
	});

	test("should display contact form", async ({ page }) => {
		const formHeading = page.getByRole("heading", {
			name: "Send us a message",
		});
		await expect(formHeading).toBeVisible();

		// Check for form element
		const form = page.locator("form");
		await expect(form).toBeVisible();
	});

	test("should have alternative contact methods", async ({ page }) => {
		const altHeading = page.getByRole("heading", {
			name: "Other ways to reach us",
		});
		await expect(altHeading).toBeVisible();

		// Check for email contact
		const emailCard = page.locator("text=Email").first();
		await expect(emailCard).toBeVisible();

		// Check for email link
		const emailLink = page.locator('a[href^="mailto:"]');
		await expect(emailLink).toBeVisible();
	});

	test("should display phone contact option", async ({ page }) => {
		const phoneCard = page.getByText("Phone");
		await expect(phoneCard).toBeVisible();

		// Check for phone link
		const phoneLink = page.locator('a[href^="tel:"]');
		await expect(phoneLink).toBeVisible();
	});

	test("does not advertise a live chat that does not exist", async ({ page }) => {
		// The template ships no chat integration; a "Live Chat — Online now"
		// card was a fake affordance adopters would ship by accident.
		await expect(page.getByText("Live Chat")).toHaveCount(0);
		await expect(page.getByText("Online now")).toHaveCount(0);
	});

	test("should have social media links", async ({ page }) => {
		const socialHeading = page.getByRole("heading", {
			name: "Follow us on social media",
		});
		await expect(socialHeading).toBeVisible();

		// Check for at least one external social link
		const githubLink = page.getByRole("link", { name: /GitHub profile/ });
		await expect(githubLink).toBeVisible();
	});

	test("should display location and availability info", async ({ page }) => {
		const locationHeading = page.getByRole("heading", {
			name: "Location & Availability",
		});
		await expect(locationHeading).toBeVisible();

		// Check for location details
		const location = page.getByText(/San Francisco|Remote-friendly/).first();
		await expect(location).toBeVisible();
	});

	test("should display response expectations section", async ({ page }) => {
		const expectationsHeading = page.getByRole("heading", {
			name: "What to expect after reaching out",
		});
		await expect(expectationsHeading).toBeVisible();

		// Check for expectation cards
		await expect(page.getByRole("heading", { name: "Quick Response" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Detailed Follow-up" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Next Steps" })).toBeVisible();
	});

	test("should have privacy policy notice", async ({ page }) => {
		const privacyNotice = page.getByText(/privacy policy/i);
		await expect(privacyNotice).toBeVisible();
	});

	test("@a11y should have proper semantic structure", async ({ page }) => {
		// Check for main landmark
		const main = page.locator("main");
		await expect(main).toBeVisible();

		// Check for proper heading hierarchy
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);

		// Check for sections
		const sections = page.locator("section");
		const count = await sections.count();
		expect(count).toBeGreaterThan(2);
	});

	test("should have accessible form labels", async ({ page }) => {
		// The page always mounts ContactForm, so the form and its fields are
		// asserted unconditionally (ADR-037 Rule 3): every visible input or
		// textarea must be reachable through a <label> — either by wrapping or
		// via for/id — so assistive tech can name it.
		const form = page.locator("form");
		await expect(form).toBeVisible();

		const fields = form.locator(
			"input:not([type='hidden']):not([name='bot-field']), textarea",
		);
		const count = await fields.count();
		expect(count).toBeGreaterThan(0);

		const unlabelled = await fields.evaluateAll((nodes) =>
			nodes
				.filter((n) => {
					const el = n as HTMLInputElement | HTMLTextAreaElement;
					return el.labels === null || el.labels.length === 0;
				})
				.map((n) => (n as HTMLElement).getAttribute("name") ?? n.tagName),
		);
		expect(unlabelled, `fields without a <label>: ${unlabelled}`).toEqual([]);
	});

	test("should have proper link attributes for external links", async ({
		page,
	}) => {
		// The contact page ships three social links (GitHub, LinkedIn, Twitter)
		// that open in a new tab, so external links are guaranteed present.
		// Every http(s) link must carry the noopener/noreferrer pairing — the
		// security attribute this test's name has always promised to check.
		const externalLinks = page.locator('a[href^="http"]');
		const count = await externalLinks.count();
		expect(count).toBeGreaterThan(0);

		const offenders = await externalLinks.evaluateAll((nodes) =>
			nodes
				.filter((n) => {
					const rel = (n.getAttribute("rel") ?? "").split(/\s+/);
					return (
						n.getAttribute("target") === "_blank" &&
						!(rel.includes("noopener") && rel.includes("noreferrer"))
					);
				})
				.map((n) => n.getAttribute("href")),
		);
		expect(offenders, `target=_blank links missing rel: ${offenders}`).toEqual(
			[],
		);
	});

	test("shows the success message after a successful submission", async ({
		page,
	}) => {
		// Regression: the status region shipped with `invisible`
		// (visibility: hidden) and the enhancement script only toggled
		// `hidden`, so this message could never be seen and the role="status"
		// live region never announced. The old suite asserted the POST and the
		// form reset, both of which happened, which is why the gap survived.
		await page.route("**/contact", async (route) => {
			if (route.request().method() === "POST") {
				await route.fulfill({ status: 200, body: "ok" });
				return;
			}
			await route.continue();
		});

		await page.getByLabel(/name/i).first().fill("Pulci Nella");
		await page.getByLabel(/email/i).first().fill("pulci@example.com");
		await page
			.getByLabel(/message/i)
			.first()
			.fill("A message comfortably past the minlength constraint.");
		await page.getByRole("button", { name: /send message/i }).click();

		const status = page.locator(".contact-form__status");
		const success = page.locator(".contact-form__success");
		await expect(success).toBeVisible();
		// toBeVisible() already rejects visibility:hidden; assert the computed
		// value too so a regression names the actual cause.
		await expect(status).toHaveCSS("visibility", "visible");
	});

	test("should display contact cards with proper structure", async ({
		page,
	}) => {
		// Exactly two contact-method cards ship: Email and Phone. The former
		// third card (Live Chat) was removed as a fake affordance.
		const cards = page.locator(".p-6").filter({
			has: page.locator("h3"),
		});
		const count = await cards.count();
		expect(count).toBe(2);
	});
});
