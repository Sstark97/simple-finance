/**
 * @file src/app/api/dashboard/settings/route.ts
 * @description Endpoint para actualizar la configuración mensual del dashboard.
 */
import { NextResponse } from 'next/server';
import { UpdateMonthlySettings } from '@/lib/application/use-cases/UpdateMonthlySettings';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';

export async function PUT(request: Request) {
  try {
    const { month, ingresos, ahorro, inversion } = await request.json();

    if (!month || typeof ingresos !== 'number' || typeof ahorro !== 'number' || typeof inversion !== 'number') {
      return NextResponse.json({ message: 'Missing or invalid monthly settings data' }, { status: 400 });
    }

    const dashboardRepository = new GoogleSheetsDashboardRepository();
    const updateMonthlySettingsUseCase = new UpdateMonthlySettings(dashboardRepository);

    const monthDate = new Date(month);

    const updatedDashboard = await updateMonthlySettingsUseCase.execute(
      monthDate,
      ingresos,
      ahorro,
      inversion
    );

    return NextResponse.json(updatedDashboard, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating monthly settings', error: message }, { status: 500 });
  }
}
