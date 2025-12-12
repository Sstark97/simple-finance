import { NextResponse } from 'next/server';
import { UpdateNetWorth } from '@/lib/application/use-cases/UpdateNetWorth';
import { GetNetWorthHistory } from '@/lib/application/use-cases/GetNetWorthHistory';
import { GoogleSheetsNetWorthRepository } from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import { isGoogleSheetsError } from '@/lib/types/errors';
import { requireAuth } from '@/lib/utils/authGuard';

export async function GET() {
  const authError = await requireAuth();
  if (authError) {
    return authError;
  }

  try {
    const netWorthRepository = new GoogleSheetsNetWorthRepository();
    const getNetWorthHistoryUseCase = new GetNetWorthHistory(netWorthRepository);

    const history = await getNetWorthHistoryUseCase.execute();

    return NextResponse.json(history, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching net worth history:', error);
    let errorMessage = 'Unknown error';
    if (isGoogleSheetsError(error)) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error fetching net worth history', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authError = await requireAuth();
  if (authError) {
    return authError;
  }

  try {
    const { month, hucha, invertido } = await request.json();

    // Validar los datos de entrada
    if (!month || typeof hucha !== 'number' || typeof invertido !== 'number') {
      return NextResponse.json({ message: 'Missing or invalid net worth data' }, { status: 400 });
    }

    const netWorthRepository = new GoogleSheetsNetWorthRepository();
    const updateNetWorthUseCase = new UpdateNetWorth(netWorthRepository);

    // month debe ser una cadena de fecha que se pueda convertir a Date
    const monthDate = new Date(month);

    const updatedNetWorth = await updateNetWorthUseCase.execute(
      monthDate,
      hucha,
      invertido
    );

    return NextResponse.json(updatedNetWorth, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating net worth:', error);
    let errorMessage = 'Unknown error';
    if (isGoogleSheetsError(error)) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error updating net worth', error: errorMessage }, { status: 500 });
  }
}
