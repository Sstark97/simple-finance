"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { History, TrendingUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  delay?: number
}

function NavigationCard({ title, description, href, icon, delay = 0 }: NavigationCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-xl border bg-card p-6 text-card-foreground",
        "shadow-[0_1px_3px_0_rgb(0_0_0/0.05),0_1px_2px_-1px_rgb(0_0_0/0.05)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_20px_25px_-5px_rgb(0_0_0/0.08),0_8px_10px_-6px_rgb(0_0_0/0.05)]",
        "hover:-translate-y-1",
        "opacity-0 translate-y-4",
        isLoaded && "opacity-100 translate-y-0",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-[#DBEAFE] p-3 transition-colors group-hover:bg-[#0A2A54]">
            <div className="text-[#0A2A54] transition-colors group-hover:text-white">{icon}</div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-[#0A2A54] group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export function NavigationCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <NavigationCard
        title="Historial de Gastos"
        description="Revisa todas tus transacciones"
        href="/gastos"
        icon={<History className="h-6 w-6" />}
        delay={400}
      />
      <NavigationCard
        title="Historial de Patrimonio"
        description="Seguimiento de tu riqueza"
        href="/patrimonio"
        icon={<TrendingUp className="h-6 w-6" />}
        delay={500}
      />
    </div>
  )
}
