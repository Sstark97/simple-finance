/**
 * @file src/domain/models/NetWorth.ts
 * @description Define la estructura del patrimonio neto mensual.
 */
export interface NetWorth {
  mes: Date;
  hucha: number;
  invertido: number;
  total: number; // Campo de solo lectura, calculado por la hoja de cálculo
}
