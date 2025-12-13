import * as React from "react"
import { cn } from "@/app/components/tailwind-functions";


interface FinanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

const FinanceCard = React.forwardRef<HTMLDivElement, FinanceCardProps>(
  ({ className, elevated = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card p-6 text-card-foreground",
        "shadow-[0_1px_3px_0_rgb(0_0_0/0.05),0_1px_2px_-1px_rgb(0_0_0/0.05)]",
        "transition-all duration-200 ease-out",
        elevated && [
          "shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.05)]",
          "hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08),0_4px_6px_-4px_rgb(0_0_0/0.05)]",
          "hover:-translate-y-0.5",
        ],
        className,
      )}
      {...props}
    />
  ),
)
FinanceCard.displayName = "FinanceCard"

const FinanceCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
  ),
)
FinanceCardHeader.displayName = "FinanceCardHeader"

const FinanceCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  ),
)
FinanceCardTitle.displayName = "FinanceCardTitle"

const FinanceCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
FinanceCardDescription.displayName = "FinanceCardDescription"

const FinanceCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
FinanceCardContent.displayName = "FinanceCardContent"

const FinanceCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center pt-4 border-t border-border", className)} {...props} />
  ),
)
FinanceCardFooter.displayName = "FinanceCardFooter"

export {
  FinanceCard,
  FinanceCardHeader,
  FinanceCardTitle,
  FinanceCardDescription,
  FinanceCardContent,
  FinanceCardFooter,
}
