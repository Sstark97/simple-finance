import * as React from "react"
import { cn } from "@/app/components/tailwind-functions";

import { cva, type VariantProps } from "class-variance-authority"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-[#D1FAE5] text-[#065F46]",
        warning: "bg-[#FEF3C7] text-[#92400E]",
        error: "bg-[#FEE2E2] text-[#991B1B]",
        info: "bg-[#DBEAFE] text-[#1E40AF]",
        neutral: "bg-[#E5E7EB] text-[#374151]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean
}

const dotColors = {
  success: "bg-[#10B981]",
  warning: "bg-[#F59E0B]",
  error: "bg-[#EF4444]",
  info: "bg-[#3B82F6]",
  neutral: "bg-[#6B7280]",
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => (
    <span ref={ref} className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant || "neutral"])} />}
      {children}
    </span>
  ),
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
