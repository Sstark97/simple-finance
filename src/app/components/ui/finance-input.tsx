import * as React from "react"
import { cn } from "@/app/components/tailwind-functions";


export interface FinanceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

const FinanceInput = React.forwardRef<HTMLInputElement, FinanceInputProps>(
  ({ className, type, label, error, hint, icon, ...props }, ref) => {
    const id = React.useId()

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <input
            type={type}
            id={id}
            className={cn(
              "flex h-11 w-full rounded-lg border border-input bg-card px-4 py-2",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:border-[#0A2A54] focus:ring-[3px] focus:ring-[#0A2A54]/15",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
              className,
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-[#EF4444]">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
FinanceInput.displayName = "FinanceInput"

export { FinanceInput }
