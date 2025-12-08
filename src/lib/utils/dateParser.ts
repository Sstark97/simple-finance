/**
 * @file src/lib/utils/dateParser.ts
 * @description Utility functions for parsing and formatting dates in Google Sheets format
 */

/**
 * Parses a month-year string (MM/YYYY or MM/YY) into a Date object
 * @param dateString - Date string in format "MM/YYYY" or "MM/YY"
 * @returns Date object set to the first day of the month in UTC
 */
export function parseMonthYearString(dateString: string): Date {
  const parts = dateString.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid date format: ${dateString}. Expected MM/YYYY or MM/YY`);
  }

  const month = parseInt(parts[0], 10);
  let year = parseInt(parts[1], 10);

  // Validate month
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be between 1 and 12`);
  }

  // Handle 2-digit years (assume 2000+ if < 100)
  if (year < 100) {
    year += 2000;
  }

  return new Date(Date.UTC(year, month - 1, 1));
}

/**
 * Parses a day-month-year string (DD/MM/YYYY or DD/MM/YY) into a Date object
 * @param dateString - Date string in format "DD/MM/YYYY" or "DD/MM/YY"
 * @returns Date object in UTC
 */
export function parseDayMonthYearString(dateString: string): Date {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YYYY or DD/MM/YY`);
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  // Validate day and month
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Must be between 1 and 31`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Must be between 1 and 12`);
  }

  // Handle 2-digit years (assume 2000+ if < 100)
  if (year < 100) {
    year += 2000;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Formats a Date object into Google Sheets month format (MM/YYYY)
 * @param date - Date object to format
 * @returns String in format "MM/YYYY"
 */
export function formatMonthForSheet(date: Date): string {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month}/${year}`;
}

/**
 * Formats a Date object into Google Sheets date format (DD/MM/YYYY)
 * @param date - Date object to format
 * @returns String in format "DD/MM/YYYY"
 */
export function formatDateForSheet(date: Date): string {
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
