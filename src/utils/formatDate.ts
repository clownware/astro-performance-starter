// src/utils/formatDate.ts

/**
 * Comprehensive date formatting utilities for blog posts and project dates.
 * Handles multiple input formats, timezone-aware formatting, and relative dates.
 */

export type DateInput = Date | string | number;

export interface FormatOptions {
  timezone?: string;
  locale?: string;
}

export interface RelativeFormatOptions extends FormatOptions {
  threshold?: number; // Days threshold for switching to absolute date
}

/**
 * Validates and normalizes date input to a Date object.
 * @param input - Date input in various formats
 * @returns Valid Date object or null if invalid
 */
function normalizeDate(input: DateInput): Date | null {
  if (!input) {
    return null;
  }

  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    // Handle ISO strings, date strings, etc.
    date = new Date(input);
  } else if (typeof input === "number") {
    // Handle timestamps (both seconds and milliseconds)
    date = new Date(input < 1e12 ? input * 1000 : input);
  } else {
    return null;
  }

  // Check if date is valid
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a date in full format: "March 15, 2024"
 * @param input - Date input
 * @param options - Formatting options
 * @returns Formatted date string or null if invalid
 */
export function formatDateFull(input: DateInput, options: FormatOptions = {}): string | null {
  const date = normalizeDate(input);
  if (!date) {
    return null;
  }

  const { timezone = "UTC", locale = "en-US" } = options;

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    }).format(date);
  } catch (error) {
    console.warn("Date formatting error:", error);
    return null;
  }
}

/**
 * Formats a date in short format: "Mar 15, 2024"
 * @param input - Date input
 * @param options - Formatting options
 * @returns Formatted date string or null if invalid
 */
export function formatDateShort(input: DateInput, options: FormatOptions = {}): string | null {
  const date = normalizeDate(input);
  if (!date) {
    return null;
  }

  const { timezone = "UTC", locale = "en-US" } = options;

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: timezone,
    }).format(date);
  } catch (error) {
    console.warn("Date formatting error:", error);
    return null;
  }
}

/**
 * Formats a date in ISO format for machine reading: "2024-03-15T10:30:00.000Z"
 * @param input - Date input
 * @returns ISO string or null if invalid
 */
export function formatDateISO(input: DateInput): string | null {
  const date = normalizeDate(input);
  if (!date) {
    return null;
  }

  try {
    return date.toISOString();
  } catch (error) {
    console.warn("ISO date formatting error:", error);
    return null;
  }
}

/**
 * Formats a date in relative format: "2 days ago", "3 months ago"
 * Falls back to absolute date if beyond threshold
 * @param input - Date input
 * @param options - Formatting options with threshold
 * @returns Formatted relative date string or null if invalid
 */
export function formatDateRelative(
  input: DateInput,
  options: RelativeFormatOptions = {},
): string | null {
  const date = normalizeDate(input);
  if (!date) {
    return null;
  }

  const { timezone = "UTC", locale = "en-US", threshold = 30 } = options;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Handle future dates
  if (diffMs < 0) {
    const futureDiffDays = Math.abs(diffDays);
    if (futureDiffDays === 0) {
      return "today";
    }
    if (futureDiffDays === 1) {
      return "tomorrow";
    }
    if (futureDiffDays < 7) {
      return `in ${futureDiffDays} days`;
    }
    // Fall back to absolute date for far future dates
    return formatDateShort(input, { timezone, locale });
  }

  // Use relative formatting for recent dates
  if (diffDays <= threshold) {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          if (diffMinutes < 1) {
            return "just now";
          }
          if (diffMinutes === 1) {
            return "1 minute ago";
          }
          return `${diffMinutes} minutes ago`;
        }
        if (diffHours === 1) {
          return "1 hour ago";
        }
        return `${diffHours} hours ago`;
      }

      if (diffDays < 7) {
        return rtf.format(-diffDays, "day");
      }

      if (diffDays < 30) {
        const diffWeeks = Math.floor(diffDays / 7);
        return rtf.format(-diffWeeks, "week");
      }

      if (diffDays < 365) {
        const diffMonths = Math.floor(diffDays / 30);
        return rtf.format(-diffMonths, "month");
      }

      const diffYears = Math.floor(diffDays / 365);
      return rtf.format(-diffYears, "year");
    } catch (error) {
      console.warn("Relative date formatting error:", error);
      // Fall back to short format
      return formatDateShort(input, { timezone, locale });
    }
  }

  // Fall back to absolute date for older dates
  return formatDateShort(input, { timezone, locale });
}

/**
 * Estimates reading time based on word count
 * @param content - Text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || typeof content !== "string") {
    return 0;
  }

  // Remove HTML tags and normalize whitespace
  const cleanContent = content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  if (!cleanContent) {
    return 0;
  }

  // Count words (split by whitespace and filter empty strings)
  const wordCount = cleanContent.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate reading time (minimum 1 minute)
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readingTime;
}

/**
 * Formats reading time as human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted reading time string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return "Less than 1 min read";
  }
  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}

/**
 * Comprehensive date formatter with automatic format selection
 * @param input - Date input
 * @param format - Desired format type
 * @param options - Formatting options
 * @returns Formatted date string or null if invalid
 */
export function formatDate(
  input: DateInput,
  format: "full" | "short" | "relative" | "iso" = "short",
  options: RelativeFormatOptions = {},
): string | null {
  switch (format) {
    case "full":
      return formatDateFull(input, options);
    case "short":
      return formatDateShort(input, options);
    case "relative":
      return formatDateRelative(input, options);
    case "iso":
      return formatDateISO(input);
    default:
      return formatDateShort(input, options);
  }
}

/**
 * Utility for blog post and project date formatting
 * Combines date formatting with reading time estimation
 */
export interface PostMetadata {
  publishedDate: string | null;
  updatedDate?: string | null;
  readingTime: string;
  isRecent: boolean;
}

/**
 * Formats post metadata including dates and reading time
 * @param publishedDate - Publication date
 * @param content - Post content for reading time estimation
 * @param updatedDate - Optional update date
 * @param options - Formatting options
 * @returns Formatted post metadata
 */
export function formatPostMetadata(
  publishedDate: DateInput,
  content: string,
  updatedDate?: DateInput,
  options: RelativeFormatOptions = {},
): PostMetadata {
  const published = formatDateRelative(publishedDate, options);
  const updated = updatedDate ? formatDateRelative(updatedDate, options) : null;
  const readingMinutes = estimateReadingTime(content);
  const readingTime = formatReadingTime(readingMinutes);

  // Consider post recent if published within last 7 days
  const publishedDateObj = normalizeDate(publishedDate);
  const isRecent = publishedDateObj
    ? Date.now() - publishedDateObj.getTime() < 7 * 24 * 60 * 60 * 1000
    : false;

  return {
    publishedDate: published,
    updatedDate: updated,
    readingTime,
    isRecent,
  };
}

/**
 * Default export for common use cases
 */
export default {
  format: formatDate,
  formatFull: formatDateFull,
  formatShort: formatDateShort,
  formatRelative: formatDateRelative,
  formatISO: formatDateISO,
  estimateReadingTime,
  formatReadingTime,
  formatPostMetadata,
};
