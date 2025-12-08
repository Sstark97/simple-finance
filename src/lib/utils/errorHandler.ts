/**
 * @file src/lib/utils/errorHandler.ts
 * @description Utility functions for handling errors, especially Google Sheets API errors
 */

/**
 * Standard error response type
 */
export type ErrorResponse = {
  code: number
  message: string
}

/**
 * Handles Google Sheets API errors and returns a standardized error response
 * @param error - The error object (unknown type from catch block)
 * @returns Standardized error response with HTTP code and message
 */
export function handleGoogleSheetsError(error: unknown): ErrorResponse {
  // Handle Error instances
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Permission errors (403)
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return {
        code: 403,
        message: 'No tienes permisos para acceder a esta hoja de cálculo. Verifica las credenciales y los permisos de la cuenta de servicio.',
      };
    }

    // Not found errors (404)
    if (errorMessage.includes('not found') || errorMessage.includes('file not found')) {
      return {
        code: 404,
        message: 'No se encontró la hoja de cálculo. Verifica que el SPREADSHEET_ID sea correcto.',
      };
    }

    // Authentication errors (401)
    if (errorMessage.includes('invalid_grant') || errorMessage.includes('authentication')) {
      return {
        code: 401,
        message: 'Error de autenticación. Las credenciales de Google Sheets pueden haber expirado o ser inválidas.',
      };
    }

    // Rate limit errors (429)
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return {
        code: 429,
        message: 'Se ha excedido el límite de solicitudes de la API de Google Sheets. Intenta de nuevo más tarde.',
      };
    }

    // Generic error with the original message
    return {
      code: 500,
      message: `Error de Google Sheets: ${error.message}`,
    };
  }

  // Handle objects with code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const errorCode = (error as { code: unknown }).code;

    if (errorCode === 403) {
      return {
        code: 403,
        message: 'Acceso prohibido a la hoja de cálculo.',
      };
    }

    if (errorCode === 404) {
      return {
        code: 404,
        message: 'Hoja de cálculo no encontrada.',
      };
    }
  }

  // Fallback for unknown errors
  return {
    code: 500,
    message: 'Error desconocido al acceder a Google Sheets.',
  };
}

/**
 * Logs an error with context information
 * @param context - Context where the error occurred (e.g., "GetTransactions")
 * @param error - The error object
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);

  if (error instanceof Error) {
    console.error('Error stack:', error.stack);
  }
}
