import type { Transaction } from '@/lib/domain/models/Transaction';
import { GetTransactions } from '@/lib/application/use-cases/GetTransactions';
import { GoogleSheetsTransactionRepository } from '@/lib/infrastructure/repositories/GoogleSheetsTransactionRepository';
import { ExpenseHeader } from '@/app/components/expenses/expense-header';
import { ExpenseSummary } from '@/app/components/expenses/expense-summary';
import { ExpensesFilteredView } from '@/app/components/expenses/expenses-filtered-view';
import { transformTransactionToExpense } from '@/app/components/expenses/utils';
import type { Expense } from '@/app/components/expenses/utils';

export default async function GastosPage(): Promise<React.ReactNode> {
  let transactions: Transaction[] = [];
  let error: string | null = null;

  try {
    const transactionRepository = new GoogleSheetsTransactionRepository();
    const getTransactionsUseCase = new GetTransactions(transactionRepository);
    transactions = await getTransactionsUseCase.execute();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    error = message;
    console.error('Error fetching transactions:', err);
  }

  // Transform transactions to expenses
  const expenses: Expense[] = transactions.map((transaction, index) =>
    transformTransactionToExpense(transaction, index)
  );

  // Calculate current month summary (filter by current month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthExpenses = transactions.filter((t) => {
    const transactionDate = t.fechaCobro;
    return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === currentMonth;
  });

  const totalAmount = currentMonthExpenses.reduce((sum, t) => sum + t.importe, 0);
  const transactionCount = currentMonthExpenses.length;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl">
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {!error && (
          <>
            <ExpenseHeader />
            <ExpenseSummary totalAmount={totalAmount} transactionCount={transactionCount} />
            <ExpensesFilteredView expenses={expenses} />
          </>
        )}
      </div>
    </main>
  );
}
