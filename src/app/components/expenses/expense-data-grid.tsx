import type {ReactNode} from "react";
import type {Expense} from "@/lib/application/dtos/dtos";
import { cn } from '@/lib/utils';
import { Calendar, Tag, FileText } from 'lucide-react';
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

interface ExpenseDataGridProps {
  expenses: Expense[];
}

export function ExpenseDataGrid({ expenses }: ExpenseDataGridProps): ReactNode {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No hay gastos</h3>
          <p className="text-sm text-muted-foreground">No se encontraron gastos con los filtros aplicados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Table Header */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-4 bg-muted/50 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Fecha
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="h-4 w-4" />
          Concepto
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Tag className="h-4 w-4" />
          Categoría
        </div>
        <div className="text-sm font-medium text-muted-foreground text-right">Importe</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className={cn(
              'grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_1fr] gap-2 sm:gap-4 px-6 py-4',
              'animate-row-in',
              'hover:bg-accent/50',
              index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Mobile Layout */}
            <div className="sm:hidden flex justify-between items-start">
              <div>
                <p className="font-medium text-foreground">{expense.concept}</p>
                <p className="text-sm text-muted-foreground">{expense.date}</p>
              </div>
              <p className="text-lg font-semibold text-[#EF4444] tabular-nums">{CurrencyFormatter.toEur(expense.amount)}</p>
            </div>
            <div className="sm:hidden">
              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                {expense.category}
              </span>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <p className="text-sm text-foreground tabular-nums">{expense.date}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground truncate">{expense.concept}</p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                {expense.category}
              </span>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#EF4444] tabular-nums">{CurrencyFormatter.toEur(expense.amount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
