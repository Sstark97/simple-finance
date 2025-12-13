"use client"

import { useEffect, useState } from "react"
import { MoneyDisplay } from "@/app/components/ui/money-display"
import { cn } from "@/app/components/tailwind-functions";
import { Sparkles } from "lucide-react"

interface KPICardProps {
  amount: number
  label: string
  description?: string
}

export function KPICard({ amount, label, description }: KPICardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-8 text-card-foreground overflow-hidden",
        "shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)]",
        "transition-all duration-500 ease-out",
        "opacity-0 translate-y-4",
        isLoaded && "opacity-100 translate-y-0 shimmer-effect",
      )}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#10B981]/5 via-transparent to-[#0A2A54]/5" />

      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#D1FAE5] p-2">
            <Sparkles className="h-5 w-5 text-[#10B981]" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{label}</h2>
        </div>

        <div className="space-y-1">
          <MoneyDisplay amount={amount} size="xl" showTrend className="text-4xl md:text-5xl" />
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  )
}
