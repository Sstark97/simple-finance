export interface PatrimonioDto {
    mes: string;
    total: number;
    hucha: number;
    invertido: number;
}

export type PatrimonioResult = {
    patrimonio: PatrimonioDto[];
    error?: string;
}

export interface TransactionRawData {
    id: number;
    fechaCobro: Date;
    concepto: string;
    importe: number;
    categoria: string;
}

export interface Expense {
    id: string;
    date: string;
    concept: string;
    category: string;
    amount: number;
}

export type ExpensesResult = {
    expenses: Expense[],
    error?: string
}