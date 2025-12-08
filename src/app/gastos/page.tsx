import Link from 'next/link';
import type { Transaction } from '@/lib/domain/models/Transaction';
import { GetTransactions } from '@/lib/application/use-cases/GetTransactions';
import { GoogleSheetsTransactionRepository } from '@/lib/infrastructure/repositories/GoogleSheetsTransactionRepository';
import { TransactionsTable } from '@/app/(components)/dashboard/transactions-table';

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

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Historial de Gastos</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Volver al Dashboard
          </Link>
        </div>

        {error && <div className="text-center p-4 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>}

        {!error && <TransactionsTable data={transactions} />}
      </div>
    </main>
  );
}
