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

		// Check for profile image
		const profileImage = page.locator('img[alt="Profile photo"]');
		await expect(profileImage).toBeVisible();
	});

	test("should display bio section", async ({ page }) => {
		const bioHeading = page.getByRole("heading", { name: "My Story" });
		await expect(bioHeading).toBeVisible();

		// Check for bio content
		const bioSection = page.locator("section").filter({ hasText: "My Story" });
		await expect(bioSection).toBeVisible();
	});

	test("should display skills section", async ({ page }) => {
		const skillsHeading = page.getByRole("heading", {
			name: "Skills & Technologies",
		});
		await expect(skillsHeading).toBeVisible();

		// Check for skill badges
		const skillBadges = page.locator(".rounded-full").filter({
			hasText: /TypeScript|Astro|React/,
		});
		const count = await skillBadges.count();
		expect(count).toBeGreaterThan(0);
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

		// Check for external social links
		const githubLink = page.locator('a[href*="github.com"]');
		await expect(githubLink).toBeVisible();
	});

	test("should have CTA section with contact button", async ({ page }) => {
		const ctaHeading = page.getByRole("heading", {
			name: "Ready to Work Together?",
		});
		await expect(ctaHeading).toBeVisible();

		// Check for contact button
		const contactButton = page.getByRole("link", { name: "Get In Touch" });
		await expect(contactButton).toBeVisible();
		await expect(contactButton).toHaveAttribute("href", "/contact");
	});

	test("should have resume download link", async ({ page }) => {
		const resumeLink = page.getByRole("link", { name: "Download Resume" });
		await expect(resumeLink).toBeVisible();
		await expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
		await expect(resumeLink).toHaveAttribute("target", "_blank");
		await expect(resumeLink).toHaveAttribute("rel", "noopener noreferrer");
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
		const profileImage = page.locator('img[alt="Profile photo"]');
		await expect(profileImage).toBeVisible();

		// Verify image has proper dimensions
		const box = await profileImage.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			expect(box.width).toBeGreaterThan(0);
			expect(box.height).toBeGreaterThan(0);
		}
	});

	test("should display experience timeline correctly", async ({ page }) => {
		// Check for timeline structure
		const timelineItems = page.locator("article").filter({
			has: page.locator(".absolute"),
		});
		const count = await timelineItems.count();
		expect(count).toBeGreaterThan(0);
	});
});
