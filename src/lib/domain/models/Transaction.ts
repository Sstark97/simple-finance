import type {Expense, TransactionRaw} from "@/lib/application/dtos/dtos";
import crypto from "crypto";

export class Transaction {
    private constructor(
        private readonly collectionDate: Date,
        private readonly concept: string,
        private readonly amount: number,
        private readonly category: string
    ) {}

    static fromRawData(transactionRawData: TransactionRaw): Transaction {
        return new Transaction(
            transactionRawData.collectionDate,
            transactionRawData.concept,
            transactionRawData.amount,
            transactionRawData.category
        );
    }

    transformTransactionToExpense(): Expense {
        return {
            id: crypto.randomUUID(),
            date: this.formatDate(),
            concept: this.concept,
            category: this.category,
            amount: this.amount,
        };
    }

    private formatDate(): string {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(this.collectionDate);
    }
}