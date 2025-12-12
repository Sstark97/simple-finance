'use client';

import type { TransactionRawData } from '@/lib/domain/models/TransactionRawData';

interface TransactionsTableProps {
  data: TransactionRawData[];
}

export function TransactionsTable({ data }: TransactionsTableProps): React.ReactNode {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Concepto
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Importe
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((transaction, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.fechaCobro).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {transaction.concepto}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.categoria}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-semibold">
                {transaction.importe.toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
