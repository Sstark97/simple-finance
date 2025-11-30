'use client';

import { useEffect, useState } from 'react';
import type { NetWorth } from '../../domain/models/NetWorth';
import Link from 'next/link';

export default function PatrimonioPage() {
  const [history, setHistory] = useState<NetWorth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetWorthHistory() {
      try {
        setLoading(true);
        const res = await fetch('/api/networth');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || errorData.message || 'Failed to fetch net worth history');
        }
        const data: NetWorth[] = await res.json();
        setHistory(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNetWorthHistory();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Historial de Patrimonio</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Volver al Dashboard
          </Link>
        </div>

        {loading && <div className="text-center p-4 text-blue-600">Cargando historial de patrimonio...</div>}
        {error && <div className="text-center p-4 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hucha (€)
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invertido (€)
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (€)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(item.mes).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {item.hucha.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {item.invertido.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-semibold">
                      {item.total.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
