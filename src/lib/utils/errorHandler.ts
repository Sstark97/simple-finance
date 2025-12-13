export type ErrorResponse = {
  code: number
  message: string
}

export function handleGoogleSheetsError(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return {
        code: 403,
        message: 'No tienes permisos para acceder a esta hoja de cálculo. Verifica las credenciales y los permisos de la cuenta de servicio.',
      };
    }

    if (errorMessage.includes('not found') || errorMessage.includes('file not found')) {
      return {
        code: 404,
        message: 'No se encontró la hoja de cálculo. Verifica que el SPREADSHEET_ID sea correcto.',
      };
    }

    if (errorMessage.includes('invalid_grant') || errorMessage.includes('authentication')) {
      return {
        code: 401,
        message: 'Error de autenticación. Las credenciales de Google Sheets pueden haber expirado o ser inválidas.',
      };
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return {
        code: 429,
        message: 'Se ha excedido el límite de solicitudes de la API de Google Sheets. Intenta de nuevo más tarde.',
      };
    }

    return {
      code: 500,
      message: `Error de Google Sheets: ${error.message}`,
    };
  }

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

  return {
    code: 500,
    message: 'Error desconocido al acceder a Google Sheets.',
  };
}
