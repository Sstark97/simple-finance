/**
 * @file src/application/repositories/TransactionRepository.ts
 * @description Define la interfaz para el repositorio de Transacciones.
 */
import { TransactionRawData } from '@/lib/domain/models/TransactionRawData';

export interface TransactionRepository {
  /**
   * Añade una nueva transacción.
   * @param transaction La transacción a añadir.
   * @returns La transacción añadida.
   */
  addTransaction(transaction: Omit<TransactionRawData, 'fechaCobro'> & { fechaCobro: string }): Promise<TransactionRawData>;

  /**
   * Obtiene todas las transacciones.
   * @returns Un array con todas las transacciones.
   */
  findAll(): Promise<TransactionRawData[]>;
}
