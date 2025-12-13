import * as React from "react"
import { cn } from "@/app/components/tailwind-functions";

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MoneyDisplayProps {
  amount: number
  currency?: string
  locale?: string
  showSign?: boolean
  showTrend?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const MoneyDisplay = React.forwardRef<HTMLSpanElement, MoneyDisplayProps>(
  (
    { amount, currency = "EUR", locale = "es-ES", showSign = false, showTrend = false, size = "md", className },
    ref,
  ) => {
    const isPositive = amount > 0
    const isNegative = amount < 0

    const formattedAmount = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      signDisplay: showSign ? "always" : "auto",
    }).format(amount)

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl font-semibold",
      xl: "text-3xl font-bold",
    }

    const colorClasses = isPositive ? "text-[#10B981]" : isNegative ? "text-[#EF4444]" : "text-foreground"

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono tabular-nums",
          sizeClasses[size],
          colorClasses,
          className,
        )}
      >
        {showTrend && (
          <>
            {isPositive && <TrendingUp className="h-4 w-4" />}
            {isNegative && <TrendingDown className="h-4 w-4" />}
            {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
          </>
        )}
        {formattedAmount}
      </span>
    )
  },
)
MoneyDisplay.displayName = "MoneyDisplay"

export { MoneyDisplay }
