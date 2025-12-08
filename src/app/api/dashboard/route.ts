import { NextResponse, NextRequest } from 'next/server';
import { GetCurrentDashboard } from '@/lib/application/use-cases/GetCurrentDashboard';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';

export async function GET(request: NextRequest) {
  if (!SPREADSHEET_ID) {
    const errorMessage = 'SPREADSHEET_ID no está configurado en las variables de entorno.';
    console.error(errorMessage);
    return NextResponse.json({ message: errorMessage, error: errorMessage }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month'); // Formato YYYY-MM-DD

    let dateToFetch: Date;

    if (monthParam && !isNaN(new Date(monthParam).getTime())) {
      dateToFetch = new Date(monthParam);
    } else {
      const today = new Date();
      dateToFetch = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    // Asegurarnos de que usamos el primer día del mes para la búsqueda.
    dateToFetch.setDate(1);


    const dashboardRepository = new GoogleSheetsDashboardRepository();
    const getCurrentDashboard = new GetCurrentDashboard(dashboardRepository);
    const dashboardData = await getCurrentDashboard.execute(dateToFetch);

    if (!dashboardData) {
      return NextResponse.json(
        { message: `No se encontraron datos del dashboard para el mes seleccionado.`, error: `No se encontraron datos para ${dateToFetch.toLocaleDateString()}` },
        { status: 404 }
      );
    }

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error: any) {
    console.error('Error detallado al obtener datos del dashboard:', error);

    let errorMessage = 'Ocurrió un error en el servidor.';
    let statusCode = 500;

    if (error.code === 403) {
      errorMessage =
        'Error de permisos (403): La API de Google Sheets no está activada en tu proyecto de GCP o la cuenta de servicio no tiene permisos de "Editor" en la hoja de cálculo.';
      statusCode = 403;
    } else if (error.code === 404) {
      errorMessage = `No se pudo encontrar la hoja de cálculo con el ID proporcionado (404). Verifica que el SPREADSHEET_ID sea correcto.`;
      statusCode = 404;
    } else if (error.message?.includes('file not found')) {
      errorMessage = 'No se encontró el fichero `credentials.json`. Asegúrate de que está en la raíz del proyecto.';
    } else if (error.message?.includes('invalid_grant')) {
        errorMessage = 'Error de autenticación (invalid_grant). Revisa que el fichero `credentials.json` sea correcto y que la hora del sistema del servidor sea correcta.'
    }

    return NextResponse.json(
      { message: 'Error al obtener los datos del dashboard.', error: errorMessage },
      { status: statusCode }
    );
  }
}
