'use client';

import { useEffect, useState } from 'react';
import { Receipt, CreditCard } from 'lucide-react';
import { FinanceCard, FinanceCardContent } from '@/app/components/ui/finance-card';
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

interface ExpenseSummaryProps {
  totalAmount: number;
  transactionCount: number;
}

function useCountUp(end: number, duration = 1000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number): void => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function: easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export function ExpenseSummary({ totalAmount, transactionCount }: ExpenseSummaryProps): React.ReactNode {
  const animatedTotal = useCountUp(totalAmount, 1200);
  const animatedCount = useCountUp(transactionCount, 800);

  const formattedTotal = CurrencyFormatter.toEur(animatedTotal);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FinanceCard className="animate-count-up">
        <FinanceCardContent className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive-light">
            <CreditCard className="h-6 w-6 text-[#EF4444]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Gastado este Mes</p>
            <p className="text-2xl font-bold text-[#EF4444] tabular-nums">{formattedTotal}</p>
          </div>
        </FinanceCardContent>
      </FinanceCard>

      <FinanceCard className="animate-count-up" style={{ animationDelay: '150ms' }}>
        <FinanceCardContent className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Receipt className="h-6 w-6 text-[#0A2A54]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transacciones</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">{animatedCount}</p>
          </div>
        </FinanceCardContent>
      </FinanceCard>
    </div>
  );
}
