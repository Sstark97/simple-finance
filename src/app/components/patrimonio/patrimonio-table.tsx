import { FinanceCard, FinanceCardHeader, FinanceCardTitle, FinanceCardContent } from '@/app/components/ui/finance-card';
import type {PatrimonioDto} from "@/lib/application/dtos/dtos";
import type {ReactNode} from "react";
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

interface PatrimonioTableProps {
  data: PatrimonioDto[];
}

export function PatrimonioTable({ data }: PatrimonioTableProps): ReactNode {
  const getChange = (index: number): number | null => {
    if (index === 0) return null;
    const current = data[index].total;
    const previous = data[index - 1].total;
    return ((current - previous) / previous) * 100;
  };

  return (
    <FinanceCard className="animate-fade-in-up delay-300">
      <FinanceCardHeader>
        <FinanceCardTitle>Detalle Mensual</FinanceCardTitle>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Mes</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-foreground">Hucha</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-foreground">Invertido</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-foreground">Total</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-foreground">Variación</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const change = getChange(index);
                return (
                  <tr
                    key={row.mes}
                    className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors animate-row-in"
                    style={{ animationDelay: `${(index + 1) * 80}ms` }}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{row.mes}</td>
                    <td className="py-3 px-4 text-right text-sm tabular-nums text-[#10B981]">
                      {CurrencyFormatter.toEur(row.hucha)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm tabular-nums text-[#3B82F6]">
                      {CurrencyFormatter.toEur(row.invertido)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold tabular-nums text-[#8B5CF6]">
                      {CurrencyFormatter.toEur(row.total)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm tabular-nums">
                      {change !== null ? (
                        <span className={change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                          {change >= 0 ? '+' : ''}
                          {change.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FinanceCardContent>
    </FinanceCard>
  );
}
