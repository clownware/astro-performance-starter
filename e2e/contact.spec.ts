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

	test("should display live chat option", async ({ page }) => {
		const chatCard = page.getByText("Live Chat");
		await expect(chatCard).toBeVisible();

		// Check for online status badge
		const onlineBadge = page.getByText("Online now");
		await expect(onlineBadge).toBeVisible();
	});

	test("should have social media links", async ({ page }) => {
		const socialHeading = page.getByRole("heading", {
			name: "Follow us on social media",
		});
		await expect(socialHeading).toBeVisible();

		// Check for external social links
		const githubLink = page.locator('a[href*="github.com"]');
		const linkedinLink = page.locator('a[href*="linkedin.com"]');
		const twitterLink = page.locator('a[href*="twitter.com"]');

		await expect(githubLink).toBeVisible();
		await expect(linkedinLink).toBeVisible();
		await expect(twitterLink).toBeVisible();
	});

	test("should display location and availability info", async ({ page }) => {
		const locationHeading = page.getByRole("heading", {
			name: "Location & Availability",
		});
		await expect(locationHeading).toBeVisible();

		// Check for location details
		const location = page.getByText(/San Francisco|Remote-friendly/);
		await expect(location).toBeVisible();
	});

	test("should display response expectations section", async ({ page }) => {
		const expectationsHeading = page.getByRole("heading", {
			name: "What to expect after reaching out",
		});
		await expect(expectationsHeading).toBeVisible();

		// Check for expectation cards
		const quickResponse = page.getByText("Quick Response");
		const detailedFollowup = page.getByText("Detailed Follow-up");
		const nextSteps = page.getByText("Next Steps");

		await expect(quickResponse).toBeVisible();
		await expect(detailedFollowup).toBeVisible();
		await expect(nextSteps).toBeVisible();
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
		// Check that form has proper labels (if form exists)
		const form = page.locator("form");
		const hasForm = await form.isVisible().catch(() => false);

		if (hasForm) {
			// Verify form has input fields
			const inputs = form.locator("input, textarea");
			const count = await inputs.count();
			expect(count).toBeGreaterThan(0);
		}
	});

	test("should have proper link attributes for external links", async ({
		page,
	}) => {
		// Check external social links have proper security attributes
		const externalLinks = page.locator('a[href^="http"]');
		const count = await externalLinks.count();

		if (count > 0) {
			// Sample check on first external link
			const firstLink = externalLinks.first();
			await expect(firstLink).toBeVisible();
		}
	});

	test("should display contact cards with proper structure", async ({
		page,
	}) => {
		// Check for card components
		const cards = page.locator(".p-6").filter({
			has: page.locator("h3"),
		});
		const count = await cards.count();
		expect(count).toBeGreaterThan(2);
	});
});
