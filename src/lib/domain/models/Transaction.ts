import type {Expense, TransactionRawData} from "@/lib/application/dtos/dtos";

export class Transaction {
  constructor(private readonly transactionRaw: TransactionRawData) {}

  transformTransactionToExpense(): Expense {
    return {
      id: this.generateExpenseId(),
      date: this.formatDate(),
      concept: this.transactionRaw.concepto,
      category: this.transactionRaw.categoria,
      amount: this.transactionRaw.importe,
    };
  }

  private generateExpenseId() {
    const dateStr = this.transactionRaw.fechaCobro.toISOString().split('T')[0];
    const conceptHash = this.transactionRaw.concepto.substring(0, 3).toLowerCase();
    return `${dateStr}-${conceptHash}-${this.transactionRaw.id}`;
  }

  private formatDate(): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(this.transactionRaw.fechaCobro);
  }
}