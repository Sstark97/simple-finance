import type { Transaction } from '@/lib/domain/models/Transaction';

export interface Expense {
  id: string;
  date: string;
  concept: string;
  category: string;
  amount: number;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function generateExpenseId(transaction: Transaction, index: number): string {
  const dateStr = transaction.fechaCobro.toISOString().split('T')[0];
  const conceptHash = transaction.concepto.substring(0, 3).toLowerCase();
  return `${dateStr}-${conceptHash}-${index}`;
}

export function transformTransactionToExpense(transaction: Transaction, index: number): Expense {
  return {
    id: generateExpenseId(transaction, index),
    date: formatDate(transaction.fechaCobro),
    concept: transaction.concepto,
    category: transaction.categoria,
    amount: transaction.importe,
  };
}
