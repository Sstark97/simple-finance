/**
 * @file src/application/use-cases/AddTransaction.ts
 * @description Caso de uso para añadir una nueva transacción.
 */
import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import {TransactionRawData} from "@/lib/application/dtos/dtos";

export class AddTransaction {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(transaction: Omit<TransactionRawData, 'fechaCobro'> & { fechaCobro: string }): Promise<TransactionRawData> {
    // Aquí podrías añadir lógica de negocio adicional antes de guardar,
    // como validaciones, transformación de datos, etc.
    return this.transactionRepository.addTransaction(transaction);
  }
}
