/**
 * @file src/domain/models/Transaction.ts
 * @description Define la estructura de una transacción de gastos.
 */
export interface Transaction {
  fechaCobro: Date;
  concepto: string;
  importe: number;
  categoria: string;
}
