import moment from "moment";

/**
 * Global date utility functions
 * Provides consistent date formatting and parsing across the entire application
 * Used by third-party packages and internal modules
 *
 * @example
 * ```typescript
 * import { formatDateForDisplay, parseDate, DATE_FORMATS } from '@/lib/date-utils';
 *
 * // Format a date for display
 * const displayDate = formatDateForDisplay('2024-01-15T10:30:00Z'); // "Jan 15, 2024"
 *
 * // Parse various date formats
 * const momentDate = parseDate('2024-01-15');
 * const isValid = momentDate?.isValid();
 *
 * // Use format constants
 * const customFormat = momentDate?.format(DATE_FORMATS.DATETIME);
 * ```
 */

// Standard date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM D, YYYY", // Jan 15, 2024
  DISPLAY_LONG: "MMMM D, YYYY", // January 15, 2024
  DISPLAY_SHORT: "MM/DD/YYYY", // 01/15/2024
  INPUT: "YYYY-MM-DD", // 2024-01-15 (for date inputs)
  ISO: "YYYY-MM-DDTHH:mm:ssZ", // ISO format for APIs
  TIME: "h:mm A", // 2:30 PM
  DATETIME: "MMM D, YYYY h:mm A", // Jan 15, 2024 2:30 PM
} as const;

// Date input types that can be passed to functions
type DateInput = string | Date | moment.Moment | number | null | undefined;

/**
 * Parse a date value and return a moment object
 * Handles various input formats including ISO strings, Date objects, and timestamps
 */
export function parseDate(dateValue: DateInput): moment.Moment | null {
  if (!dateValue) return null;

  const momentDate = moment(dateValue);

  // Check if the date is valid
  if (!momentDate.isValid()) return null;

  return momentDate;
}

/**
 * Format a date for display in the UI
 * Uses a clean, readable format suitable for database cells
 */
export function formatDateForDisplay(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  return momentDate.format(DATE_FORMATS.DISPLAY);
}

/**
 * Format a date for long display (full month name)
 */
export function formatDateForLongDisplay(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  return momentDate.format(DATE_FORMATS.DISPLAY_LONG);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  return momentDate.format(DATE_FORMATS.INPUT);
}

/**
 * Format a date and time for display
 */
export function formatDateTimeForDisplay(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  return momentDate.format(DATE_FORMATS.DATETIME);
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTime(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  return momentDate.fromNow();
}

/**
 * Check if a date is today
 */
export function isToday(dateValue: DateInput): boolean {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return false;

  return momentDate.isSame(moment(), "day");
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(dateValue: DateInput): boolean {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return false;

  return momentDate.isSame(moment().subtract(1, "day"), "day");
}

/**
 * Check if a date is within the current week
 */
export function isThisWeek(dateValue: DateInput): boolean {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return false;

  return momentDate.isSame(moment(), "week");
}

/**
 * Get the start of day for a given date
 */
export function getStartOfDay(dateValue: DateInput): moment.Moment | null {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return null;

  return momentDate.clone().startOf("day");
}

/**
 * Get the end of day for a given date
 */
export function getEndOfDay(dateValue: DateInput): moment.Moment | null {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return null;

  return momentDate.clone().endOf("day");
}

/**
 * Convert a date to ISO string format for API calls
 */
export function toISOString(dateValue: DateInput): string | null {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return null;

  return momentDate.toISOString();
}

/**
 * Create a moment object from individual date components
 */
export function createDate(
  year: number,
  month: number,
  day: number
): moment.Moment {
  return moment({ year, month: month - 1, day }); // month is 0-indexed in moment
}

/**
 * Get current date formatted for display
 */
export function getCurrentDateFormatted(): string {
  return moment().format(DATE_FORMATS.DISPLAY);
}

/**
 * Validate if a string is a valid date
 */
export function isValidDateString(dateString: string): boolean {
  return moment(dateString).isValid();
}

/**
 * Format date for last edited time display
 * Special format for system fields like created_time and last_edited_time
 */
export function formatLastEditedTime(dateValue: DateInput): string {
  const momentDate = parseDate(dateValue);
  if (!momentDate) return "";

  // If it's today, show relative time
  if (isToday(dateValue)) {
    return `Today at ${momentDate.format("h:mm A")}`;
  }

  // If it's yesterday, show "Yesterday at ..."
  if (isYesterday(dateValue)) {
    return `Yesterday at ${momentDate.format("h:mm A")}`;
  }

  // Otherwise show the standard format
  return momentDate.format(DATE_FORMATS.DATETIME);
}
