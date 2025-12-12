'use client';

import {ReactNode, useEffect, useState} from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { FinanceCard, FinanceCardContent } from '@/app/components/ui/finance-card';
import { cn } from '@/lib/utils';
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

interface PatrimonioKPIsProps {
  currentTotal: number;
  previousTotal: number;
  growthPercentage: number;
}

function useCountUp(end: number, duration = 1000, decimals = 0): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number): void => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function: easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = easeOut * end;
      setCount(decimals > 0 ? Number.parseFloat(value.toFixed(decimals)) : Math.floor(value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, decimals]);

  return count;
}

export function PatrimonioKPIs({
  currentTotal,
  previousTotal,
  growthPercentage,
}: PatrimonioKPIsProps): ReactNode {
  const animatedTotal = useCountUp(currentTotal, 1400);
  const animatedGrowth = useCountUp(Math.abs(growthPercentage), 1200, 1);
  const isPositiveGrowth = growthPercentage >= 0;
  const formattedTotal = CurrencyFormatter.toEur(animatedTotal);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Patrimonio Actual */}
      <FinanceCard className="animate-fade-in-up">
        <FinanceCardContent className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EDE9FE]">
            <Wallet className="h-7 w-7 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Patrimonio Actual</p>
            <p className="text-3xl font-bold text-[#8B5CF6] tabular-nums">{formattedTotal}</p>
          </div>
        </FinanceCardContent>
      </FinanceCard>

      {/* Crecimiento Último Mes */}
      <FinanceCard className="animate-fade-in-up delay-100">
        <FinanceCardContent className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl',
              isPositiveGrowth ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
            )}
          >
            {isPositiveGrowth ? (
              <TrendingUp className="h-7 w-7 text-[#10B981]" />
            ) : (
              <TrendingDown className="h-7 w-7 text-[#EF4444]" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Crecimiento Último Mes</p>
            <p
              className={cn('text-3xl font-bold tabular-nums', isPositiveGrowth ? 'text-[#10B981]' : 'text-[#EF4444]')}
            >
              {isPositiveGrowth ? '+' : '-'}
              {animatedGrowth.toFixed(1)}%
            </p>
          </div>
        </FinanceCardContent>
      </FinanceCard>
    </div>
  );
}
