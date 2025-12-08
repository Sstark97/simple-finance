import { z } from 'zod';

/**
 * @file lib/application/use-cases/AddTransaction.schema.ts
 * @description Define el esquema de validación para los datos de entrada de una nueva transacción.
 * Este esquema es utilizado por el Server Action para validar los datos del formulario antes de
 * invocar al caso de uso 'AddTransaction'.
 */
export const AddTransactionSchema = z.object({
  description: z.string().min(3, { message: 'La descripción debe tener al menos 3 caracteres.' }),
  amount: z.coerce
    .number({ invalid_type_error: 'El importe debe ser un número.' })
    .positive({ message: 'El importe debe ser mayor que cero.' }),
  // La fecha viene del formulario como un string 'YYYY-MM-DD'.
  date: z.string().min(1, { message: 'Por favor, selecciona una fecha.' }),
  // El tipo no lo incluimos porque nuestro formulario de ejemplo es solo para gastos.
  // Si tuviéramos un campo, sería:
  // type: z.enum(['income', 'expense'], { required_error: 'Debes seleccionar un tipo.' }),
});

// Nota: El tipo 'FormState' que es específico de la UI, se definirá en el propio
// fichero del Server Action para no acoplar la capa de aplicación a la UI.
