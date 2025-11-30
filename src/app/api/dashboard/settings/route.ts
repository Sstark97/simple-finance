/**
 * @file src/app/api/dashboard/settings/route.ts
 * @description Endpoint para actualizar la configuración mensual del dashboard.
 */
import { NextResponse } from 'next/server';
import { UpdateMonthlySettings } from '../../../application/use-cases/UpdateMonthlySettings';
import { GoogleSheetsDashboardRepository } from '../../../infrastructure/repositories/GoogleSheetsDashboardRepository';

export async function PUT(request: Request) {
  try {
    const { month, ingresos, ahorro, inversion } = await request.json();

    // Validar los datos de entrada
    if (!month || typeof ingresos !== 'number' || typeof ahorro !== 'number' || typeof inversion !== 'number') {
      return NextResponse.json({ message: 'Missing or invalid monthly settings data' }, { status: 400 });
    }

    const dashboardRepository = new GoogleSheetsDashboardRepository();
    const updateMonthlySettingsUseCase = new UpdateMonthlySettings(dashboardRepository);

    // month debe ser una cadena de fecha que se pueda convertir a Date
    const monthDate = new Date(month);

    const updatedDashboard = await updateMonthlySettingsUseCase.execute(
      monthDate,
      ingresos,
      ahorro,
      inversion
    );

    return NextResponse.json(updatedDashboard, { status: 200 });
  } catch (error) {
    console.error('Error updating monthly settings:', error);
    return NextResponse.json({ message: 'Error updating monthly settings', error: error.message }, { status: 500 });
  }
}
