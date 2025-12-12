'use client';

import type {Expense} from "@/lib/application/dtos/dtos";
import { ReactNode, useState } from 'react';
import { ExpenseDataGrid } from '@/app/components/expenses/expense-data-grid';
import {ExpenseFilters} from "@/app/components/expenses/expense-filters";

interface ExpensesFilteredViewProps {
  expenses: Expense[];
}

export function ExpensesFilteredView({ expenses }: ExpensesFilteredViewProps): ReactNode {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(expenses.map((expense) => expense.category))).sort();

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <ExpenseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <ExpenseDataGrid expenses={filteredExpenses} />
    </div>
  );
}
