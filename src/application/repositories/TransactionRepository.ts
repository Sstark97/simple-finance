/**
 * @file src/application/repositories/TransactionRepository.ts
 * @description Define la interfaz para el repositorio de Transacciones.
 */
import { Transaction } from '../../domain/models/Transaction';

export interface TransactionRepository {
  /**
   * Añade una nueva transacción.
   * @param transaction La transacción a añadir.
   * @returns La transacción añadida.
   */
  addTransaction(transaction: Omit<Transaction, 'fechaCobro'> & { fechaCobro: string }): Promise<Transaction>;

  /**
   * Obtiene todas las transacciones.
   * @returns Un array con todas las transacciones.
   */
  findAll(): Promise<Transaction[]>;
}
