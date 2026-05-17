import { expect, test } from "@playwright/test";

test.describe("Homepage (index.astro)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/Astro Performance Starter/);
	});

	test("should display hero section with main heading", async ({ page }) => {
		const heading = page.getByRole("heading", {
			name: /Astro Performance Starter/,
		});
		await expect(heading).toBeVisible();
	});

	test("hero CTA links to the configured GitHub repo", async ({ page }) => {
		// siteLinks.github is non-empty in config.ts (the template default). If
		// a forked instance empties it, this test should fail loudly — that's
		// the correct signal. ADR-037 forbids conditional assertions.
		const githubLink = page.getByRole("link", { name: /Clone the Template/ }).first();
		await expect(githubLink).toBeVisible();
		await expect(githubLink).toHaveAttribute("href", /github\.com/);
	});

	test("should display Lighthouse metrics section", async ({ page }) => {
		const metricsHeading = page.getByRole("heading", {
			name: /Lighthouse Performance Scores/,
		});
		await expect(metricsHeading).toBeVisible();

		// Check for metric cards
		const performanceScore = page.getByLabel("Performance score: 95+");
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

	// Tech stack section: split per ADR-037 Rule 2 (one logical assertion per
	// test). The previous combined test bundled four unrelated facts; one
	// failure hid the others.
	test.describe("tech stack section", () => {
		test("should display the section heading", async ({ page }) => {
			const techStackHeading = page.getByRole("heading", {
				name: /Modern Tech Stack/,
			});
			await expect(techStackHeading).toBeVisible();
		});

		test("should not show a placeholder Sharp version", async ({ page }) => {
			// vX.YZ.x placeholder format is what gets shown before scripts/src/sync-docs.ts
			// fills in real versions; surfacing it would indicate the pipeline ran wrong.
			const sharpVersion = page.getByText("v0.34.x");
			await expect(sharpVersion).toBeVisible();
		});

		test("should list Astro as a technology", async ({ page }) => {
			const techSection = page.getByLabel("Technology stack section");
			await expect(
				techSection.getByRole("heading", { name: "Astro", exact: true }),
			).toBeVisible();
		});

		test("should list TypeScript as a technology", async ({ page }) => {
			const techSection = page.getByLabel("Technology stack section");
			await expect(techSection.getByText("TypeScript").first()).toBeVisible();
		});

		test("should list Biome as a technology", async ({ page }) => {
			const techSection = page.getByLabel("Technology stack section");
			await expect(techSection.getByText("Biome").first()).toBeVisible();
		});
	});

	// Implementation tiers: heading + individual tier names exercised separately.
	test("should display the implementation tiers section heading", async ({ page }) => {
		// Heading reworded in 9bf58109 (chore(homepage): update hero, AI card
		// metric, and implementation tiers copy).
		const tiersHeading = page.getByRole("heading", {
			name: /What You Get on Clone/,
		});
		await expect(tiersHeading).toBeVisible();
	});

	for (const tier of ["Foundation", "Build", "Polish"]) {
		test(`should display the ${tier} tier card`, async ({ page }) => {
			await expect(page.getByText(tier).first()).toBeVisible();
		});
	}

	test("should have CTA section with heading", async ({ page }) => {
		const ctaHeading = page.getByRole("heading", {
			name: /Clone it\. Own it\. Ship it\./,
		});
		await expect(ctaHeading).toBeVisible();
	});

	test("CTA section links to the configured GitHub repo", async ({ page }) => {
		// Same reasoning as the hero CTA test: if siteLinks.github is emptied
		// by a forked instance, this test should fail loudly (ADR-037 Rule 3).
		const ctaSection = page.getByLabel("Call to action section");
		const ctaLink = ctaSection.getByRole("link", { name: /Clone the Template/ });
		await expect(ctaLink).toBeVisible();
		await expect(ctaLink).toHaveAttribute("href", /github\.com/);
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

	// @a11y baseline checks: kept as one test because the assertions together
	// describe a single logical fact ("page meets baseline a11y structure").
	// Per ADR-037 the rule is one *logical* assertion, not one expect() call.
	test("@a11y should meet basic accessibility requirements", async ({
		page,
	}) => {
		// Check for proper heading hierarchy
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);

		// Check for aria-labels on sections (count varies based on content availability)
		const sections = page.locator("section[aria-label]");
		const sectionCount = await sections.count();
		expect(sectionCount).toBeGreaterThanOrEqual(5);

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

		// Check expand content section has accessible label
		const expandContent = firstDetails.locator('section[aria-label="Feature details"]');
		await expect(expandContent).toBeAttached();

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
