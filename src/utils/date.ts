/**
 * Format a date to a human-readable string
 * @param date The date to format
 * @returns Formatted date string (e.g., "February 26, 2025")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Compact date for card meta rows (e.g., "Feb 26, 2025"), so author,
 * category, and date fit on one line.
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
import { siteConfig } from "@config/site";
