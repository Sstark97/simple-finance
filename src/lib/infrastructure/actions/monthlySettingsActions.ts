'use server';

/**
 * @file src/lib/infrastructure/actions/monthlySettingsActions.ts
 * @description Server Action para actualizar la configuración mensual.
 */

import { revalidatePath } from 'next/cache';
import { UpdateMonthlySettingsSchema } from '@/lib/application/use-cases/UpdateMonthlySettings.schema';
import { UpdateMonthlySettings } from '@/lib/application/use-cases/UpdateMonthlySettings';
import { GoogleSheetsDashboardRepository } from '@/lib/infrastructure/repositories/GoogleSheetsDashboardRepository';
import { Dashboard } from '@/lib/domain/models/Dashboard';

// Definimos el tipo para el estado del formulario, específico para la comunicación
// entre el Server Action y el componente cliente.
export type MonthlySettingsFormState = {
  errors?: {
    month?: string[];
    ingresos?: string[];
    ahorro?: string[];
    inversion?: string[];
  };
  message?: string | null;
  dashboard?: Dashboard | null;
};

// Instanciamos nuestras dependencias.
const dashboardRepository = new GoogleSheetsDashboardRepository();
const updateMonthlySettingsUseCase = new UpdateMonthlySettings(dashboardRepository);

export async function updateMonthlySettings(
  prevState: MonthlySettingsFormState,
  formData: FormData
): Promise<MonthlySettingsFormState> {
  // 1. Validar los datos del formulario con Zod
  const validatedFields = UpdateMonthlySettingsSchema.safeParse({
    month: formData.get('month'),
    ingresos: formData.get('ingresos'),
    ahorro: formData.get('ahorro'),
    inversion: formData.get('inversion'),
  });

  // 2. Si la validación falla, devolver los errores inmediatamente.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos por rellenar o hay errores. Por favor, revisa.',
    };
  }

  // 3. Si la validación es exitosa, llamar al caso de uso.
  try {
    const { month, ingresos, ahorro, inversion } = validatedFields.data;
    
    const monthDate = new Date(month + '-01'); // Convert YYYY-MM to a Date object (first day of month)

    const updatedDashboard = await updateMonthlySettingsUseCase.execute(
      monthDate,
      ingresos,
      ahorro,
      inversion
    );

    revalidatePath('/'); // Revalida la página del Dashboard

    return {
      message: 'Ajustes mensuales actualizados con éxito.',
      dashboard: updatedDashboard,
    };

  } catch (error) {
    // 5. En caso de error en la lógica de negocio, devolver un mensaje de error.
    console.error('Error al actualizar ajustes mensuales:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar la configuración mensual.',
    };
  }
}
