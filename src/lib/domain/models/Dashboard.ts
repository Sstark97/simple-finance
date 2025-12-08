/**
 * @file src/domain/models/Dashboard.ts
 * @description Define la estructura de los datos del dashboard mensual.
 */
export interface Dashboard {
  mes: Date;
  ingresos: number;
  gastos: number; // Campo de solo lectura, calculado por la hoja de cálculo
  ahorro: number;
  inversion: number;
  dineroLibre: number; // Campo de solo lectura, calculado por la hoja de cálculo
  estado: string; // Campo de solo lectura, calculado por la hoja de cálculo
}
