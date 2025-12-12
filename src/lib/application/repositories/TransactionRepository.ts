/**
 * @file src/application/repositories/TransactionRepository.ts
 * @description Define la interfaz para el repositorio de Transacciones.
 */
import {TransactionRaw} from "@/lib/application/dtos/dtos";

export interface TransactionRepository {
  /**
   * Añade una nueva transacción.
   * @param transaction La transacción a añadir.
   * @returns La transacción añadida.
   */
  addTransaction(transaction: Omit<TransactionRaw, 'collectionDate'> & { fechaCobro: string }): Promise<TransactionRaw>;

  /**
   * Obtiene todas las transacciones.
   * @returns Un array con todas las transacciones.
   */
  findAll(): Promise<TransactionRaw[]>;
}
