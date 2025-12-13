'use client';

import type { NetWorth } from '@/lib/domain/models/NetWorth';

interface NetWorthTableProps {
  data: NetWorth[];
}

export function NetWorthTable({ data }: NetWorthTableProps): React.ReactNode {
  return (
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
          {data.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {new Date(item.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {item.saving.toFixed(2)} €
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                {item.investment.toFixed(2)} €
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-semibold">
                {item.total.toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
