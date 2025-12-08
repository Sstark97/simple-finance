import { z } from 'zod';

/**
 * @file src/lib/application/use-cases/UpdateNetWorth.schema.ts
 * @description Define el esquema de validación para los datos de entrada al actualizar el patrimonio neto.
 */
export const UpdateNetWorthSchema = z.object({
  month: z.string().min(1, { message: 'Por favor, selecciona un mes.' }),
  hucha: z.coerce
    .number({ invalid_type_error: 'La hucha debe ser un número.' })
    .min(0, { message: 'La hucha no puede ser negativa.' }),
  invertido: z.coerce
    .number({ invalid_type_error: 'La inversión debe ser un número.' })
    .min(0, { message: 'La inversión no puede ser negativa.' }),
});

export type UpdateNetWorthInput = z.infer<typeof UpdateNetWorthSchema>;
