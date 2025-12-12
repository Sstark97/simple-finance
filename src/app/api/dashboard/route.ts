import { NextResponse, NextRequest } from 'next/server';
import { GetCurrentDashboard } from '@/lib/application/use-cases/GetCurrentDashboard';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import { SPREADSHEET_ID } from '@/lib/infrastructure/google/sheetsClient';
import { handleGoogleSheetsError } from '@/lib/utils/errorHandler';
import { requireAuth } from '@/lib/utils/authGuard';

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) {
    return authError;
  }

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

    return NextResponse.json(dashboardData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    });
  } catch (error: unknown) {
    console.error('Error detallado al obtener datos del dashboard:', error);

    const { code, message } = handleGoogleSheetsError(error);
    return NextResponse.json(
      { message: 'Error al obtener los datos del dashboard.', error: message },
      { status: code }
    );
  }
}
