import {Expense} from "@/lib/application/dtos/dtos";
import {parseDateFromSheet} from "@/lib/utils/dateParser";

export class ExpensesCalculator {
    constructor(private readonly expenses: Expense[]) {}

    get totalAmount(): number {
        return this.currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    get transactionCount(): number {
        return this.currentMonthExpenses.length;
    }

    private get currentMonthExpenses(): Expense[] {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        return this.expenses.filter((expense) => {
            const transactionDate = parseDateFromSheet(expense.date);
            return transactionDate.getUTCFullYear() === currentYear && transactionDate.getUTCMonth() === currentMonth;
        });
    }
}