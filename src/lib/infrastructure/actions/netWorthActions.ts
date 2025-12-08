'use server';

/**
 * @file src/lib/infrastructure/actions/netWorthActions.ts
 * @description Server Action para actualizar el patrimonio neto.
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { UpdateNetWorthSchema } from '@/lib/application/use-cases/UpdateNetWorth.schema';
import { UpdateNetWorth } from '@/lib/application/use-cases/UpdateNetWorth';
import { GoogleSheetsNetWorthRepository } from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import { NetWorth } from '@/lib/domain/models/NetWorth';

// Definimos el tipo para el estado del formulario, específico para la comunicación
// entre el Server Action y el componente cliente.
export type NetWorthFormState = {
  errors?: {
    month?: string[];
    hucha?: string[];
    invertido?: string[];
  };
  message?: string | null;
  netWorth?: NetWorth | null;
};

// Instanciamos nuestras dependencias.
const netWorthRepository = new GoogleSheetsNetWorthRepository();
const updateNetWorthUseCase = new UpdateNetWorth(netWorthRepository);

export async function updateNetWorth(
  prevState: NetWorthFormState,
  formData: FormData
): Promise<NetWorthFormState> {
  // 1. Validar los datos del formulario con Zod
  const validatedFields = UpdateNetWorthSchema.safeParse({
    month: formData.get('month'),
    hucha: formData.get('hucha'),
    invertido: formData.get('invertido'),
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
    const { month, hucha, invertido } = validatedFields.data;
    
    const monthDate = new Date(month + '-01'); // Convert YYYY-MM to a Date object (first day of month)

    const updatedNetWorth = await updateNetWorthUseCase.execute(
      monthDate,
      hucha,
      invertido
    );

    revalidatePath('/'); // Revalida la página del Dashboard
    revalidatePath('/patrimonio'); // Revalida la página de patrimonio

    return {
      message: 'Patrimonio neto actualizado con éxito.',
      netWorth: updatedNetWorth,
    };

  } catch (error) {
    // 5. En caso de error en la lógica de negocio, devolver un mensaje de error.
    console.error('Error al actualizar patrimonio neto:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar el patrimonio neto.',
    };
  }
}
