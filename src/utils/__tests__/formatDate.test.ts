import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  estimateReadingTime,
  formatDate,
  formatDateFull,
  formatDateIso,
  formatDateRelative,
  formatDateShort,
  formatPostMetadata,
  formatReadingTime,
} from "../formatDate";

describe("formatDate utilities", () => {
  // Freeze the clock (ADR-037 Rule 3: deterministic fixtures). The relative
  // tests build inputs from Date.now() and the implementation reads new Date()
  // a moment later; without a frozen clock an exact "+24h" input floors to
  // 0 days whenever ≥1 ms elapses between the two reads — which is what made
  // the Stryker dry run fail on ~half of nightly runs (#346).
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2026-03-15T12:00:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatDateFull", () => {
    it("formats a valid date in full format", () => {
      const date = new Date("2024-03-15T10:30:00Z");
      const result = formatDateFull(date);
      expect(result).toBe("March 15, 2024");
    });

    it("returns null for invalid date", () => {
      expect(formatDateFull("invalid-date")).toBeNull();
    });

    it("returns null for null input", () => {
      expect(formatDateFull(null as any)).toBeNull();
    });

    it("handles different timezones", () => {
      const date = new Date("2024-03-15T10:30:00Z");
      const result = formatDateFull(date, { timezone: "America/New_York" });
      expect(result).toBe("March 15, 2024");
    });

    it("handles different locales", () => {
      const date = new Date("2024-03-15T10:30:00Z");
      const result = formatDateFull(date, { locale: "fr-FR" });
      expect(result).toBe("15 mars 2024");
    });
  });

  describe("formatDateShort", () => {
    it("formats a valid date in short format", () => {
      const date = new Date("2024-03-15T10:30:00Z");
      const result = formatDateShort(date);
      expect(result).toBe("Mar 15, 2024");
    });

    it("returns null for invalid date", () => {
      expect(formatDateShort("not-a-date")).toBeNull();
    });

    it("handles string input", () => {
      const result = formatDateShort("2024-03-15");
      expect(result).toBe("Mar 15, 2024");
    });

    it("handles timestamp input (milliseconds)", () => {
      const timestamp = new Date("2024-03-15").getTime();
      const result = formatDateShort(timestamp);
      expect(result).toBe("Mar 15, 2024");
    });

    it("handles timestamp input (seconds)", () => {
      const timestamp = Math.floor(new Date("2024-03-15").getTime() / 1000);
      const result = formatDateShort(timestamp);
      expect(result).toBe("Mar 15, 2024");
    });
  });

  describe("formatDateIso", () => {
    it("formats a valid date in ISO format", () => {
      const date = new Date("2024-03-15T10:30:00.000Z");
      const result = formatDateIso(date);
      expect(result).toBe("2024-03-15T10:30:00.000Z");
    });

    it("returns null for invalid date", () => {
      expect(formatDateIso("invalid")).toBeNull();
    });

    it("handles Date object", () => {
      const date = new Date("2024-12-25T00:00:00.000Z");
      const result = formatDateIso(date);
      expect(result).toBe("2024-12-25T00:00:00.000Z");
    });
  });

  describe("formatDateRelative", () => {
    it("returns 'just now' for very recent dates", () => {
      const now = new Date();
      const result = formatDateRelative(now);
      expect(result).toBe("just now");
    });

    it("returns minutes ago for recent dates", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatDateRelative(fiveMinutesAgo);
      expect(result).toBe("5 minutes ago");
    });

    it("returns hours ago for dates within a day", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatDateRelative(twoHoursAgo);
      expect(result).toBe("2 hours ago");
    });

    it("returns days ago for recent dates", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatDateRelative(threeDaysAgo);
      expect(result).toContain("ago");
    });

    it("falls back to short format for dates beyond threshold", () => {
      const longAgo = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
      const result = formatDateRelative(longAgo, { threshold: 30 });
      expect(result).toMatch(/\w+ \d+, \d{4}/); // Short format pattern
    });

    it("handles future dates", () => {
      // Freeze the clock: formatDateRelative reads its own `new Date()`, so a
      // real-clock read milliseconds after this one makes the diff 24h minus a
      // sliver, which floors to 0 days and misreports "today". (This is exactly
      // how the 2026-08-18 barback-website Stryker dry run failed — the
      // instrumented run was slow enough to cross the millisecond.)
      vi.useFakeTimers();
      try {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const result = formatDateRelative(tomorrow);
        expect(result).toBe("tomorrow");
      } finally {
        vi.useRealTimers();
      }
    });

    it("returns null for invalid date", () => {
      expect(formatDateRelative("bad-date")).toBeNull();
    });
  });

  describe("estimateReadingTime", () => {
    it("calculates reading time for normal text", () => {
      const text = "word ".repeat(200); // 200 words
      const result = estimateReadingTime(text);
      expect(result).toBe(1); // 200 words / 200 WPM = 1 minute
    });

    it("returns minimum 1 minute for short text", () => {
      const text = "Just a few words";
      const result = estimateReadingTime(text);
      expect(result).toBe(1);
    });

    it("handles empty string", () => {
      expect(estimateReadingTime("")).toBe(0);
    });

    it("handles HTML content by stripping tags", () => {
      const html = `<p>${"word ".repeat(200)}</p>`;
      const result = estimateReadingTime(html);
      expect(result).toBe(1);
    });

    it("handles custom words per minute", () => {
      const text = "word ".repeat(400); // 400 words
      const result = estimateReadingTime(text, 400);
      expect(result).toBe(1); // 400 words / 400 WPM = 1 minute
    });

    it("normalizes whitespace", () => {
      const text = "word  \n  word   word";
      const result = estimateReadingTime(text);
      expect(result).toBe(1); // Minimum 1 minute
    });

    it("returns 0 for null input", () => {
      expect(estimateReadingTime(null as any)).toBe(0);
    });
  });

  describe("formatReadingTime", () => {
    it("formats 1 minute correctly", () => {
      expect(formatReadingTime(1)).toBe("1 min read");
    });

    it("formats multiple minutes correctly", () => {
      expect(formatReadingTime(5)).toBe("5 min read");
    });

    it("formats less than 1 minute", () => {
      expect(formatReadingTime(0)).toBe("Less than 1 min read");
    });

    it("handles large numbers", () => {
      expect(formatReadingTime(45)).toBe("45 min read");
    });
  });

  describe("formatDate (main function)", () => {
    const testDate = new Date("2024-03-15T10:30:00Z");

    it("formats with 'full' format", () => {
      const result = formatDate(testDate, "full");
      expect(result).toBe("March 15, 2024");
    });

    it("formats with 'short' format", () => {
      const result = formatDate(testDate, "short");
      expect(result).toBe("Mar 15, 2024");
    });

    it("formats with 'iso' format", () => {
      const result = formatDate(testDate, "iso");
      expect(result).toBe("2024-03-15T10:30:00.000Z");
    });

    it("formats with 'relative' format", () => {
      const recent = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatDate(recent, "relative");
      expect(result).toContain("ago");
    });

    it("defaults to 'short' format", () => {
      const result = formatDate(testDate);
      expect(result).toBe("Mar 15, 2024");
    });

    it("returns null for invalid date", () => {
      expect(formatDate("invalid", "full")).toBeNull();
    });
  });

  describe("formatPostMetadata", () => {
    it("formats complete post metadata", () => {
      const publishedDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const content = "word ".repeat(400); // 400 words = 2 min read
      const result = formatPostMetadata(publishedDate, content);

      expect(result.publishedDate).toContain("ago");
      expect(result.readingTime).toBe("2 min read");
      expect(result.isRecent).toBe(true);
      expect(result.updatedDate).toBeNull();
    });

    it("includes updated date when provided", () => {
      const publishedDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const updatedDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const content = "word ".repeat(200);
      const result = formatPostMetadata(publishedDate, content, updatedDate);

      expect(result.updatedDate).toContain("ago");
    });

    it("marks post as not recent if older than 7 days", () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const content = "word ".repeat(200);
      const result = formatPostMetadata(oldDate, content);

      expect(result.isRecent).toBe(false);
    });

    it("marks post as recent if within 7 days", () => {
      const recentDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const content = "word ".repeat(200);
      const result = formatPostMetadata(recentDate, content);

      expect(result.isRecent).toBe(true);
    });

    it("handles empty content", () => {
      const publishedDate = new Date();
      const result = formatPostMetadata(publishedDate, "");

      expect(result.readingTime).toBe("Less than 1 min read");
    });

    it("handles invalid published date", () => {
      const result = formatPostMetadata("invalid-date" as any, "content");

      expect(result.publishedDate).toBeNull();
      expect(result.isRecent).toBe(false);
    });
  });

  // Targeted coverage for uncovered branches reported by v8.
  describe("edge branches", () => {
    describe("normalizeDate (via formatDateShort)", () => {
      it("returns null for non-Date/string/number input", () => {
        // Exercises the final `else { return null }` branch.
        expect(formatDateShort({} as unknown as Date)).toBeNull();
        expect(formatDateShort([] as unknown as Date)).toBeNull();
        expect(formatDateShort(true as unknown as Date)).toBeNull();
      });
    });

    describe("formatDateRelative — future date edges", () => {
      it("returns 'today' for a date less than 24h in the future", () => {
        const inOneHour = new Date(Date.now() + 60 * 60 * 1000);
        expect(formatDateRelative(inOneHour)).toBe("today");
      });

      it("returns 'tomorrow' for a date 25h+ but <48h in the future", () => {
        const in25h = new Date(Date.now() + 25 * 60 * 60 * 1000);
        expect(formatDateRelative(in25h)).toBe("tomorrow");
      });

      it("returns 'in N days' for futures within a week", () => {
        // 3.5 days ahead so timing jitter can't push us past 7.
        const nearFuture = new Date(Date.now() + 3.5 * 24 * 60 * 60 * 1000);
        expect(formatDateRelative(nearFuture)).toMatch(/^in \d+ days$/);
      });

      it("falls back to short format for far-future dates", () => {
        const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        const result = formatDateRelative(farFuture);
        expect(result).toMatch(/\w+ \d+, \d{4}/);
      });
    });

    describe("formatDateRelative — singular hour/minute units", () => {
      it("returns '1 minute ago' (singular)", () => {
        const oneMinAgo = new Date(Date.now() - 60 * 1000 - 1_000);
        expect(formatDateRelative(oneMinAgo)).toBe("1 minute ago");
      });

      it("returns '1 hour ago' (singular)", () => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000 - 1_000);
        expect(formatDateRelative(oneHourAgo)).toBe("1 hour ago");
      });
    });

    describe("formatDateRelative — year unit", () => {
      it("falls through to year unit when threshold permits", () => {
        const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
        // Bump threshold so we stay inside the relative-time branch and hit
        // the `years` unit (lines 194–195).
        const result = formatDateRelative(twoYearsAgo, { threshold: 10_000 });
        expect(result).toMatch(/year/);
      });
    });

    describe("Intl error fallbacks", () => {
      it("formatDateFull falls back to null when Intl throws", () => {
        // Invalid timezone forces Intl.DateTimeFormat to throw, exercising
        // the catch → console.warn → return null branch (lines 68–70).
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
          expect(formatDateFull(new Date(), { timezone: "Not/AZone" })).toBeNull();
          expect(warn).toHaveBeenCalled();
        } finally {
          warn.mockRestore();
        }
      });

      it("formatDateShort falls back to null when Intl throws", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
          expect(formatDateShort(new Date(), { timezone: "Not/AZone" })).toBeNull();
          expect(warn).toHaveBeenCalled();
        } finally {
          warn.mockRestore();
        }
      });
    });

    describe("estimateReadingTime — whitespace-only content", () => {
      it("returns 0 when stripping leaves no content", () => {
        // Only HTML tags + whitespace → cleanContent === "" after trim, hits
        // the `if (!cleanContent) return 0` branch (line 225).
        expect(estimateReadingTime("<div>   </div><span> </span>")).toBe(0);
      });
    });
  });
});
