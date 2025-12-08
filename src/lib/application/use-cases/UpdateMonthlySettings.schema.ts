import { z } from 'zod';

/**
 * @file src/lib/application/use-cases/UpdateMonthlySettings.schema.ts
 * @description Define el esquema de validación para los datos de entrada al actualizar la configuración mensual.
 */
export const UpdateMonthlySettingsSchema = z.object({
  month: z.string().min(1, { message: 'Por favor, selecciona un mes.' }),
  ingresos: z.coerce
    .number({ invalid_type_error: 'Los ingresos deben ser un número.' })
    .min(0, { message: 'Los ingresos no pueden ser negativos.' }),
  ahorro: z.coerce
    .number({ invalid_type_error: 'El ahorro debe ser un número.' })
    .min(0, { message: 'El ahorro no puede ser negativo.' }),
  inversion: z.coerce
    .number({ invalid_type_error: 'La inversión debe ser un número.' })
    .min(0, { message: 'La inversión no puede ser negativa.' }),
});

export type UpdateMonthlySettingsInput = z.infer<typeof UpdateMonthlySettingsSchema>;
