/**
 * @file src/application/use-cases/GetTransactions.ts
 * @description Caso de uso para obtener todas las transacciones.
 */
import { Transaction } from '@/lib/domain/models/Transaction';
import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';

export class GetTransactions {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }
}
