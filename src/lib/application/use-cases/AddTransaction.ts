/**
 * @file src/application/use-cases/AddTransaction.ts
 * @description Caso de uso para añadir una nueva transacción.
 */
import { Transaction } from '@/lib/domain/models/Transaction';
import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';

export class AddTransaction {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(transaction: Omit<Transaction, 'fechaCobro'> & { fechaCobro: string }): Promise<Transaction> {
    // Aquí podrías añadir lógica de negocio adicional antes de guardar,
    // como validaciones, transformación de datos, etc.
    return this.transactionRepository.addTransaction(transaction);
  }
}
