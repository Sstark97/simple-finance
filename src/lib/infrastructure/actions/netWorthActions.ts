'use server';

import { revalidatePath } from 'next/cache';
import { UpdateNetWorthSchema } from '@/lib/application/use-cases/UpdateNetWorth.schema';
import { UpdateNetWorth } from '@/lib/application/use-cases/UpdateNetWorth';
import { GoogleSheetsNetWorthRepository } from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import { NetWorth } from '@/lib/domain/models/NetWorth';

export type NetWorthFormState = {
  errors?: {
    month?: string[];
    saving?: string[];
    investment?: string[];
  };
  message?: string | null;
  netWorth?: NetWorth | null;
};

const netWorthRepository = new GoogleSheetsNetWorthRepository();
const updateNetWorthUseCase = new UpdateNetWorth(netWorthRepository);

export async function updateNetWorth(
  prevState: NetWorthFormState,
  formData: FormData
): Promise<NetWorthFormState> {
  const validatedFields = UpdateNetWorthSchema.safeParse({
    month: formData.get('month'),
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
    const { month, hucha, invertido } = validatedFields.data;
    
    const monthDate = new Date(month + '-01');

    const updatedNetWorth = await updateNetWorthUseCase.execute(
      monthDate,
      hucha,
      invertido
    );

    revalidatePath('/');
    revalidatePath('/patrimonio');

    return {
      message: 'Patrimonio neto actualizado con éxito.',
      netWorth: updatedNetWorth,
    };

  } catch (error) {
    console.error('Error al actualizar patrimonio neto:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar el patrimonio neto.',
    };
  }
}
