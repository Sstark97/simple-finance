'use server';

/**
 * @file lib/infrastructure/actions/transactionActions.ts
 * @description Server Action para gestionar las transacciones.
 */

import { revalidatePath } from 'next/cache';
import { AddTransactionSchema } from '@/lib/application/use-cases/AddTransaction.schema';
import { AddTransaction } from '@/lib/application/use-cases/AddTransaction';
import { GoogleSheetsTransactionRepository } from '@/lib/infrastructure/repositories/GoogleSheetsTransactionRepository';
import { TransactionFormState } from '@/lib/types/formState';

// Re-export for backward compatibility
export type FormState = TransactionFormState;

// Instanciamos nuestras dependencias. En una app más grande, esto se haría
// con un contenedor de Inyección de Dependencias (DI).
const transactionRepository = new GoogleSheetsTransactionRepository();
const addTransactionUseCase = new AddTransaction(transactionRepository);

export async function addTransaction(prevState: FormState, formData: FormData): Promise<TransactionFormState> {
  // 1. Validar los datos del formulario con Zod
  const validatedFields = AddTransactionSchema.safeParse({
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
  });

  // 2. Si la validación falla, devolver los errores inmediatamente.
  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;

    // Map schema field names to transaction form field names
    const mappedErrors: TransactionFormState['errors'] = {
      concepto: fieldErrors.description,
      importe: fieldErrors.amount,
      fechaCobro: fieldErrors.date,
    };

    return {
      errors: mappedErrors,
      message: 'Faltan campos por rellenar o hay errores. Por favor, revisa.',
    };
  }

  // 3. Si la validación es exitosa, llamar al caso de uso.
  try {
    const { description, amount, date } = validatedFields.data;

    // Nuestro formulario de ejemplo solo añade gastos.
    const transactionData = {
        concepto: description,
        importe: amount,
        fechaCobro: date,
        categoria: 'Gasto General', // Categoría por defecto
        type: 'expense' as const,
    };

    await addTransactionUseCase.execute(transactionData);

  } catch (error) {
    // 5. En caso de error en la lógica de negocio, devolver un mensaje de error.
    console.error('Error al añadir la transacción:', error);
    return {
      message: 'Error de base de datos: No se pudo añadir la transacción.',
    };
  }

  // 6. Si todo va bien, revalidar la caché de las páginas afectadas y devolver un mensaje de éxito.
  revalidatePath('/'); // Revalida la página del Dashboard
  revalidatePath('/gastos'); // Revalida la página del historial de gastos

  return {
    message: 'Transacción añadida con éxito.',
    success: true,
  };
}
