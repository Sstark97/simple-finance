import Link from 'next/link';
import type { NetWorth } from '@/lib/domain/models/NetWorth';
import { GetNetWorthHistory } from '@/lib/application/use-cases/GetNetWorthHistory';
import { GoogleSheetsNetWorthRepository } from '@/lib/infrastructure/repositories/GoogleSheetsNetWorthRepository';
import { NetWorthTable } from '@/app/(components)/dashboard/networth-table';

export default async function PatrimonioPage(): Promise<React.ReactNode> {
  let history: NetWorth[] = [];
  let error: string | null = null;

  try {
    const netWorthRepository = new GoogleSheetsNetWorthRepository();
    const getNetWorthHistoryUseCase = new GetNetWorthHistory(netWorthRepository);
    history = await getNetWorthHistoryUseCase.execute();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    error = message;
    console.error('Error fetching net worth history:', err);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Historial de Patrimonio</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Volver al Dashboard
          </Link>
        </div>

        {error && <div className="text-center p-4 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>}

        {!error && <NetWorthTable data={history} />}
      </div>
    </main>
  );
}
