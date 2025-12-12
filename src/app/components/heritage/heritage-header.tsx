import type {ReactNode} from "react";
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { FinanceButton } from '@/app/components/ui/finance-button';

export function HeritageHeader(): ReactNode {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE9FE]">
          <TrendingUp className="h-5 w-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="h2 text-foreground">Historial de Patrimonio</h1>
          <p className="text-sm text-muted-foreground">Evolución de tu patrimonio a lo largo del tiempo</p>
        </div>
      </div>
      <Link href="/">
        <FinanceButton variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </FinanceButton>
      </Link>
    </div>
  );
}
