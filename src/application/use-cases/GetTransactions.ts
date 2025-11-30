/**
 * @file src/application/use-cases/GetTransactions.ts
 * @description Caso de uso para obtener todas las transacciones.
 */
import { Transaction } from '../../domain/models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class GetTransactions {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }
}
