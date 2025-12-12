import type {ReactNode} from "react";
import {FinanceInput} from "@/app/components/ui/finance-input";
import {Search} from "lucide-react";

export function ExpenseFilters({
                                   searchTerm,
                                   onSearchChange,
                                   selectedCategory,
                                   onCategoryChange,
                                   categories,
                               }: {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    categories: string[];
}): ReactNode {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <FinanceInput
                    placeholder="Buscar por concepto..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    icon={<Search className="h-4 w-4"/>}
                />
            </div>
            <div className="sm:w-48">
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground transition-all duration-200 ease-out focus:outline-none focus:border-[#0A2A54] focus:ring-[3px] focus:ring-[#0A2A54]/15"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}