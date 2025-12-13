'use server';

import { revalidatePath } from 'next/cache';
import { UpdateMonthlySettingsSchema } from '@/lib/application/use-cases/UpdateMonthlySettings.schema';
import { UpdateMonthlySettings } from '@/lib/application/use-cases/UpdateMonthlySettings';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import { Dashboard } from '@/lib/domain/models/Dashboard';

export type MonthlySettingsFormState = {
  errors?: {
    month?: string[];
    income?: string[];
    saving?: string[];
    investment?: string[];
  };
  message?: string | null;
  dashboard?: Dashboard | null;
};

const dashboardRepository = new GoogleSheetsDashboardRepository();
const updateMonthlySettingsUseCase = new UpdateMonthlySettings(dashboardRepository);

export async function updateMonthlySettings(
  prevState: MonthlySettingsFormState,
  formData: FormData
): Promise<MonthlySettingsFormState> {
  const validatedFields = UpdateMonthlySettingsSchema.safeParse({
    month: formData.get('month'),
    income: formData.get('income'),
    saving: formData.get('saving'),
    investment: formData.get('investment'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos por rellenar o hay errores. Por favor, revisa.',
    };
  }

  try {
    const { month, ingresos, ahorro, inversion } = validatedFields.data;
    
    const monthDate = new Date(month + '-01');

    const updatedDashboard = await updateMonthlySettingsUseCase.execute(
      monthDate,
      ingresos,
      ahorro,
      inversion
    );

    revalidatePath('/');

    return {
      message: 'Ajustes mensuales actualizados con éxito.',
      dashboard: updatedDashboard,
    };

  } catch (error) {
    console.error('Error al actualizar ajustes mensuales:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar la configuración mensual.',
    };
  }
}
