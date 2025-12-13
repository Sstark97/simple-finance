import {Dashboard} from "@/lib/domain/models/Dashboard";

export interface HeritageRaw {
    month: string;
    total: number;
    saving: number;
    investment: number;
}

export type HeritageResult = {
    heritage: HeritageRaw[];
    error?: string;
}

export interface TransactionRaw {
    collectionDate: Date;
    concept: string;
    amount: number;
    category: string;
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

export interface DashBoardResult {
    dashboard: Dashboard;
    error?: string;
    showMessage: boolean;
}