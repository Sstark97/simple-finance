/**
 * @file src/lib/utils/dateParser.ts
 * @description Utility functions for parsing and formatting dates in Google Sheets format
 */

/**
 * Parses a month-year string in Spanish format ("enero de 2025") into a Date object
 * @param dateString - Date string in format "nombre_del_mes de YYYY" (e.g., "diciembre de 2025")
 * @returns Date object set to the first day of the month in UTC
 */
export function parseMonthYearString(dateString: string): Date {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const parts = dateString.split(' de ');
  if (parts.length !== 2) {
    throw new Error(`Invalid date format: ${dateString}. Expected "mes de año" (e.g., "diciembre de 2025")`);
  }

  const monthName = parts[0].toLowerCase();
  const year = parseInt(parts[1], 10);
  const monthIndex = monthNames.indexOf(monthName);

  if (monthIndex === -1) {
    throw new Error(`Invalid month name: ${monthName}. Must be a Spanish month name`);
  }

  if (isNaN(year)) {
    throw new Error(`Invalid year: ${parts[1]}`);
  }

  return new Date(Date.UTC(year, monthIndex, 1));
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
 * Formats a Date object into Google Sheets month format in Spanish (e.g., "diciembre de 2025")
 * @param date - Date object to format
 * @returns String in format "mes de año" (e.g., "diciembre de 2025")
 */
export function formatMonthForSheet(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric', timeZone: 'UTC' };
  return date.toLocaleDateString('es-ES', options);
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
