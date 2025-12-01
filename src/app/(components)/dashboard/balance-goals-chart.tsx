"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import {
  FinanceCard,
  FinanceCardHeader,
  FinanceCardTitle,
  FinanceCardDescription,
  FinanceCardContent,
} from "@/components/ui/finance-card"
import { cn } from "@/lib/utils"

const BALANCE_COLOR = "#3b82f6" // Un azul más vivo
const GOALS_COLOR = "#F59E0B"

interface BalanceGoalsChartProps {
  balance: number
  savings: number
  investment: number
}

export function BalanceGoalsChart({ balance, savings, investment }: BalanceGoalsChartProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const goals = savings + investment

  const data = [
    { name: "Disponible para Objetivos", value: balance, color: BALANCE_COLOR },
    { name: "Objetivos", value: goals, color: GOALS_COLOR },
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)

  return (
    <FinanceCard
      className={cn(
        "opacity-0 translate-y-4",
        isLoaded && "opacity-100 translate-y-0 transition-all duration-500 delay-300",
      )}
    >
      <FinanceCardHeader>
        <FinanceCardTitle>Balance vs Objetivos</FinanceCardTitle>
        <FinanceCardDescription>
          Ahorro ({formatCurrency(savings)}) + Inversión ({formatCurrency(investment)})
        </FinanceCardDescription>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 14 }}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-lg">
                      <p className="text-sm font-medium">{data.name}</p>
                      <p className="text-lg font-bold" style={{ color: data.color }}>
                        {formatCurrency(data.value)}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                barSize={40}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(data) => setHoveredBar(data.name)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.color}
                    style={{
                      filter: hoveredBar === entry.name ? "brightness(1.15)" : "none",
                      transition: "filter 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison indicator */}
        <div className="mt-4 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Diferencia</span>
            <span className={cn("text-sm font-semibold", balance >= goals ? "text-[#10B981]" : "text-[#F59E0B]")}>
              {balance >= goals ? "+" : ""}
              {formatCurrency(balance - goals)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {balance >= goals ? "Estás por encima de tus objetivos" : "Te falta para alcanzar tus objetivos"}
          </p>
        </div>
      </FinanceCardContent>
    </FinanceCard>
  )
}
