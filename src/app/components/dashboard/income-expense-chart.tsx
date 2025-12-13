"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  FinanceCard,
  FinanceCardHeader,
  FinanceCardTitle,
  FinanceCardDescription,
  FinanceCardContent,
} from "@/app/components/ui/finance-card"
import { cn } from "@/app/components/tailwind-functions";
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

const INCOME_COLOR = "#10B981"
const EXPENSE_COLOR = "#EF4444"

interface IncomeExpenseChartProps {
  income: number
  expenses: number
}

export function IncomeExpenseChart({ income, expenses }: IncomeExpenseChartProps): React.ReactNode {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const data = [
    { name: "Ingresos", value: income, color: INCOME_COLOR },
    { name: "Gastos", value: expenses, color: EXPENSE_COLOR },
  ]

  const balance = income - expenses

  return (
    <FinanceCard
      className={cn(
        "opacity-0 translate-y-4",
        isLoaded && "opacity-100 translate-y-0 transition-all duration-500 delay-200",
      )}
    >
      <FinanceCardHeader>
        <FinanceCardTitle>Ingresos vs Gastos</FinanceCardTitle>
        <FinanceCardDescription>Distribución del mes actual</FinanceCardDescription>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height={280} minHeight={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={activeIndex !== null ? 110 : 100}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index ? "brightness(1.1)" : "none",
                      transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-lg">
                      <p className="text-sm font-medium">{data.name}</p>
                      <p className="text-lg font-bold" style={{ color: data.color }}>
                        {CurrencyFormatter.toEur(data.value)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((data.value / (income + expenses)) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label now shows Balance */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Balance</p>
              <p className={cn("text-xl font-bold", balance >= 0 ? "text-success" : "text-destructive")}>
                {CurrencyFormatter.toEur(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
          ))}
        </div>
      </FinanceCardContent>
    </FinanceCard>
  )
}
