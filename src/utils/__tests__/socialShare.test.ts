// src/utils/__tests__/socialShare.test.ts
import { describe, expect, it } from "vitest";
import { generateAllShareUrls, generateShareUrl } from "../socialShare";

describe("socialShare", () => {
  const mockOptions = {
    url: "https://example.com/blog/test-post",
    title: "Test Post Title",
    description: "This is a test description",
  };

  describe("generateShareUrl", () => {
    it("generates Twitter share URL with encoded parameters", () => {
      const url = generateShareUrl("twitter", mockOptions);
      expect(url).toContain("twitter.com/intent/tweet");
      expect(url).toContain(encodeURIComponent(mockOptions.title));
      expect(url).toContain(encodeURIComponent(mockOptions.url));
    });

    it("generates LinkedIn share URL", () => {
      const url = generateShareUrl("linkedin", mockOptions);
      expect(url).toContain("linkedin.com/sharing/share-offsite");
      expect(url).toContain(encodeURIComponent(mockOptions.url));
    });

    it("generates Facebook share URL", () => {
      const url = generateShareUrl("facebook", mockOptions);
      expect(url).toContain("facebook.com/sharer/sharer.php");
      expect(url).toContain(encodeURIComponent(mockOptions.url));
    });

    it("generates Reddit share URL with title and URL", () => {
      const url = generateShareUrl("reddit", mockOptions);
      expect(url).toContain("reddit.com/submit");
      expect(url).toContain(encodeURIComponent(mockOptions.title));
      expect(url).toContain(encodeURIComponent(mockOptions.url));
    });

    it("generates email share URL with subject and body", () => {
      const url = generateShareUrl("email", mockOptions);
      expect(url).toContain("mailto:");
      expect(url).toContain(`subject=${encodeURIComponent(mockOptions.title)}`);
      expect(url).toContain(encodeURIComponent(mockOptions.description));
      expect(url).toContain(encodeURIComponent(mockOptions.url));
    });

    it("handles special characters in title", () => {
      const specialOptions = {
        url: "https://example.com/post",
        title: "Test & Special <Characters>",
        description: "Description",
      };
      const url = generateShareUrl("twitter", specialOptions);
      const encodedTitle = encodeURIComponent(specialOptions.title);
      expect(url).toContain(encodedTitle);
      // Verify special characters are encoded (not raw in the title portion)
      expect(encodedTitle).toContain("%26"); // & encoded
      expect(encodedTitle).toContain("%3C"); // < encoded
      expect(encodedTitle).toContain("%3E"); // > encoded
    });

    it("handles URLs with query parameters", () => {
      const urlWithParams = {
        url: "https://example.com/post?utm_source=test&utm_medium=social",
        title: "Test",
        description: "Description",
      };
      const shareUrl = generateShareUrl("twitter", urlWithParams);
      expect(shareUrl).toContain(encodeURIComponent(urlWithParams.url));
    });

    it("throws error for unsupported platform", () => {
      expect(() => {
        // @ts-expect-error Testing invalid platform
        generateShareUrl("invalid", mockOptions);
      }).toThrow("Unsupported share platform");
    });
  });

  describe("generateAllShareUrls", () => {
    it("generates URLs for all platforms", () => {
      const urls = generateAllShareUrls(mockOptions);

      expect(urls).toHaveProperty("twitter");
      expect(urls).toHaveProperty("linkedin");
      expect(urls).toHaveProperty("facebook");
      expect(urls).toHaveProperty("reddit");
      expect(urls).toHaveProperty("email");

      expect(urls.twitter).toContain("twitter.com");
      expect(urls.linkedin).toContain("linkedin.com");
      expect(urls.facebook).toContain("facebook.com");
      expect(urls.reddit).toContain("reddit.com");
      expect(urls.email).toContain("mailto:");
    });

    it("encodes all URLs properly", () => {
      const urls = generateAllShareUrls(mockOptions);

      Object.values(urls).forEach((url) => {
        expect(url).toContain(encodeURIComponent(mockOptions.url));
      });
    });

    it("handles missing description gracefully", () => {
      const optionsWithoutDesc = {
        url: mockOptions.url,
        title: mockOptions.title,
      };
      const urls = generateAllShareUrls(optionsWithoutDesc);

      expect(urls.twitter).toBeTruthy();
      expect(urls.email).toBeTruthy();
    });
  });
});
