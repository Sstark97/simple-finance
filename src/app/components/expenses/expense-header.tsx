import type {ReactNode} from "react";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FinanceButton } from '@/app/components/ui/finance-button';

export function ExpenseHeader(): ReactNode {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-foreground">Historial de Gastos</h1>
        <p className="text-muted-foreground mt-1">Revisa y gestiona todos tus gastos</p>
      </div>
      <FinanceButton variant="ghost" asChild>
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
      </FinanceButton>
    </header>
  );
}
