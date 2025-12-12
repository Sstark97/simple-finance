import { TransactionRepository } from '@/lib/application/repositories/TransactionRepository';
import {Expense, ExpensesResult} from "@/lib/application/dtos/dtos";
import {Transaction} from "@/lib/domain/models/Transaction";

export class GetTransactions {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(): Promise<ExpensesResult> {
    try {
      const transactionRawData = await this.transactionRepository.findAll();
      const transactions = transactionRawData.map((transactionRawData) => Transaction.fromRawData(transactionRawData));
      const expenses: Expense[] = transactions.map((transaction) => transaction.transformTransactionToExpense());
      return {expenses};
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching transactions:', err);
        return {expenses: [], error};
    }
  }
}
