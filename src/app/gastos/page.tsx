import type {ReactNode} from "react";
import {GetExpenses} from '@/lib/application/use-cases/GetExpenses';
import {GoogleSheetsTransactionRepository} from '@/lib/infrastructure/repositories/GoogleSheetsTransactionRepository';
import {ExpenseHeader} from '@/app/components/expenses/expense-header';
import {ExpenseSummary} from '@/app/components/expenses/expense-summary';
import {ExpensesFilteredView} from '@/app/components/expenses/expenses-filtered-view';
import {ExpensesCalculator} from "@/lib/domain/services/expenses-calculator";

export default async function ExpensesPage(): Promise<ReactNode> {
  const transactionRepository = new GoogleSheetsTransactionRepository();
  const getExpensesUseCase = new GetExpenses(transactionRepository);
  const {expenses, error} = await getExpensesUseCase.execute();
  const {totalAmount, transactionCount} = new ExpensesCalculator(expenses);

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
