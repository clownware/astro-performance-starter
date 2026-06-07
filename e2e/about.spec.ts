import { expect, test } from "@playwright/test";

test.describe("About Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/about/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/About/);
	});

	test("should display hero section with profile", async ({ page }) => {
		const heading = page.getByRole("heading", { name: /Hi, I'm/ });
		await expect(heading).toBeVisible();

		// Profile image is the only rounded-full avatar on the page. Locating by
		// class keeps the test stable across customisation of the alt text (which
		// describes the person, not the photo).
		const profileImage = page.locator("img.rounded-full");
		await expect(profileImage).toBeVisible();
	});

	test("should display bio section", async ({ page }) => {
		// Bio section now renders from the `bio` content collection (ADR-054).
		// The first h2 in the rendered MDX is the persona's intro heading; the
		// surrounding section is identified via the .prose container, which is
		// the conventional MDX-rendered prose wrapper.
		const bioProse = page.locator(".prose").first();
		await expect(bioProse).toBeVisible();

		const bioHeading = bioProse.getByRole("heading", { level: 2 }).first();
		await expect(bioHeading).toBeVisible();
	});

	test("should display skills section with categories", async ({ page }) => {
		const skillsHeading = page.getByRole("heading", {
			name: "Skills & Technologies",
		});
		await expect(skillsHeading).toBeVisible();

		// Check for skill category headings
		const categoryHeadings = page.locator("h3").filter({
			hasText: /Frontend|Backend|Tools/,
		});
		const count = await categoryHeadings.count();
		expect(count).toBeGreaterThan(0);

		// Check for skill badges within categories
		const skillBadges = page.getByRole("list", { name: /skills/ }).locator("li");
		const badgeCount = await skillBadges.count();
		expect(badgeCount).toBeGreaterThan(0);
	});

	test("should display experience section", async ({ page }) => {
		const experienceHeading = page.getByRole("heading", { name: "Experience" });
		await expect(experienceHeading).toBeVisible();

		// Check for experience entries
		const experienceArticles = page.locator("article");
		const count = await experienceArticles.count();
		expect(count).toBeGreaterThan(0);
	});

	test("should display social links section", async ({ page }) => {
		const socialHeading = page.getByRole("heading", { name: "Let's Connect" });
		await expect(socialHeading).toBeVisible();

		// Social links are conditionally rendered based on socialLinks config
		// When unconfigured (empty strings), no link icons appear — valid state
	});

	test("should have CTA section with contact button", async ({ page }) => {
		const ctaHeading = page.getByRole("heading", {
			name: "Ready to Work Together?",
		});
		await expect(ctaHeading).toBeVisible();

		// Check for contact button — href includes base path when configured
		const contactButton = page.getByRole("link", { name: "Get In Touch" });
		await expect(contactButton).toBeVisible();
		await expect(contactButton).toHaveAttribute("href", /\/contact\//);
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
		expect(count).toBeGreaterThan(3);
	});

	test("should have responsive profile image", async ({ page }) => {
		const profileImage = page.locator("img.rounded-full");
		await expect(profileImage).toBeVisible();

		// Verify image has proper dimensions
		const box = await profileImage.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeGreaterThan(0);
			expect(box.height).toBeGreaterThan(0);
		}
	});

	test("should display experience entries", async ({ page }) => {
		const experienceSection = page.getByRole("heading", {
			name: /Experience/,
		});
		await expect(experienceSection).toBeVisible();

		// Check for experience entries in timeline
		const experienceArticles = page.locator("article");
		const count = await experienceArticles.count();
		expect(count).toBeGreaterThan(0);
	});
});
