/**
 * @file lib/types/errors.ts
 * @description Custom error types for Google Sheets API interactions.
 */

export interface GoogleSheetsError extends Error {
  code?: number;
}

export function isGoogleSheetsError(error: unknown): error is GoogleSheetsError {
  return error instanceof Error && 'code' in error;
}
