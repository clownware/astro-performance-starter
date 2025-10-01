import { expect, test } from "@playwright/test";

test.describe("Homepage (index.astro)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(
			/Astro Performance Starter.*Production-Ready Template/,
		);
	});

	test("should display hero section with main heading", async ({ page }) => {
		const heading = page.getByRole("heading", {
			name: /Astro Performance Starter/,
		});
		await expect(heading).toBeVisible();
	});

	test("should have GitHub and documentation links", async ({ page }) => {
		// GitHub link
		const githubLink = page.getByRole("link", { name: /View on GitHub/ });
		await expect(githubLink).toBeVisible();
		await expect(githubLink).toHaveAttribute(
			"href",
			"https://github.com/clownware/astro-starter-template",
		);

		// Documentation link
		const docsLink = page.getByRole("link", { name: /View Documentation/ });
		await expect(docsLink).toBeVisible();
	});

	test("should display Lighthouse metrics section", async ({ page }) => {
		const metricsHeading = page.getByRole("heading", {
			name: /Lighthouse Performance Scores/,
		});
		await expect(metricsHeading).toBeVisible();

		// Check for metric cards
		const performanceScore = page.getByText("95+");
		await expect(performanceScore).toBeVisible();
	});

	test("should display key features section with expandable cards", async ({
		page,
	}) => {
		const featuresHeading = page.getByRole("heading", {
			name: /Why Choose This Template/,
		});
		await expect(featuresHeading).toBeVisible();

		// Check for at least one feature card
		const performanceFeature = page.getByText("Performance-First Architecture");
		await expect(performanceFeature).toBeVisible();
	});

	test("should display tech stack section with accurate versions", async ({
		page,
	}) => {
		const techStackHeading = page.getByRole("heading", {
			name: /Modern Tech Stack/,
		});
		await expect(techStackHeading).toBeVisible();

		// Verify Sharp version is not placeholder
		const sharpVersion = page.getByText("v0.34.x");
		await expect(sharpVersion).toBeVisible();

		// Verify other key technologies are listed
		await expect(page.getByText("Astro")).toBeVisible();
		await expect(page.getByText("TypeScript")).toBeVisible();
		await expect(page.getByText("Biome")).toBeVisible();
	});

	test("should display implementation tracks section", async ({ page }) => {
		const tracksHeading = page.getByRole("heading", {
			name: /Choose Your Implementation Track/,
		});
		await expect(tracksHeading).toBeVisible();

		// Check for MVP and Showcase tracks
		await expect(page.getByText("MVP Track")).toBeVisible();
		await expect(page.getByText("Showcase Track")).toBeVisible();
	});

	test("should have CTA section with action buttons", async ({ page }) => {
		const ctaHeading = page.getByRole("heading", {
			name: /Ready to Build Something Amazing/,
		});
		await expect(ctaHeading).toBeVisible();

		const getStartedButton = page.getByRole("link", {
			name: /Get Started Now/,
		});
		await expect(getStartedButton).toBeVisible();
	});

	test("should have disclaimer about real-world results", async ({ page }) => {
		const disclaimer = page.getByText(
			/Real-world results may vary by deployment and content/,
		);
		await expect(disclaimer).toBeVisible();
	});

	test("should have scroll indicator in hero section", async ({ page }) => {
		const scrollIndicator = page.getByRole("link", {
			name: /Scroll to next section/,
		});
		await expect(scrollIndicator).toBeVisible();
	});

	test("@a11y should meet basic accessibility requirements", async ({
		page,
	}) => {
		// Check for proper heading hierarchy
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);

		// Check for aria-labels on sections
		const sections = page.locator("section[aria-label]");
		await expect(sections).toHaveCount(6); // Hero, Performance, Features, Tech Stack, Implementation, CTA

		// Check for lang attribute
		const html = page.locator("html");
		await expect(html).toHaveAttribute("lang", "en");

		// Check semantic lists for checkmarks
		const keyFeaturesList = page.locator('ul[aria-label="Key features"]');
		await expect(keyFeaturesList).toBeVisible();

		// Check Lighthouse metrics have proper ARIA labels
		const metricsListItems = page.locator('ul[aria-label="Lighthouse performance metrics"] li');
		await expect(metricsListItems).toHaveCount(4);
	});

	test("@a11y expandable feature cards should have proper ARIA", async ({
		page,
	}) => {
		// Check for expandable details elements
		const detailsElements = page.locator("details.feature-details");
		const count = await detailsElements.count();
		expect(count).toBeGreaterThan(0);

		// Check first expandable card has proper attributes
		const firstDetails = detailsElements.first();
		const summary = firstDetails.locator("summary");
		await expect(summary).toHaveAttribute("aria-label", "Toggle feature details");

		// Check expand content has role="region"
		const expandContent = firstDetails.locator('[role="region"]');
		await expect(expandContent).toHaveAttribute("aria-label", "Feature details");

		// Check decorative icons are hidden from screen readers
		const decorativeIcons = firstDetails.locator('svg[aria-hidden="true"]');
		await expect(decorativeIcons.first()).toBeVisible();
	});

	test("@a11y keyboard navigation should work on expandable cards", async ({
		page,
	}) => {
		// Navigate to first feature card summary
		const firstSummary = page.locator("details.feature-details summary").first();
		await firstSummary.focus();

		// Press Enter to expand
		await page.keyboard.press("Enter");

		// Check if details is open
		const firstDetails = page.locator("details.feature-details").first();
		const isOpen = await firstDetails.evaluate((el) => (el as HTMLDetailsElement).open);
		expect(isOpen).toBe(true);
	});

	test("should have proper semantic HTML structure", async ({ page }) => {
		// Check main landmark
		const main = page.locator("main");
		await expect(main).toBeVisible();

		// Check sections have proper structure
		const sections = page.locator("section");
		const sectionCount = await sections.count();
		expect(sectionCount).toBeGreaterThan(4);
	});
});
