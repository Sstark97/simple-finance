import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/components/tailwind-functions";


const financeButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-medium transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[#0A2A54] text-white shadow-sm",
          "hover:bg-[#0D3A73] hover:shadow-md hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-sm",
        ],
        secondary: [
          "border-2 border-[#0A2A54] bg-transparent text-[#0A2A54]",
          "hover:bg-[#0A2A54] hover:text-white",
          "active:bg-[#0D3A73]",
        ],
        success: ["bg-[#10B981] text-white shadow-sm", "hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5"],
        destructive: ["bg-[#EF4444] text-white shadow-sm", "hover:bg-[#DC2626] hover:shadow-md hover:-translate-y-0.5"],
        warning: ["bg-[#F59E0B] text-white shadow-sm", "hover:bg-[#D97706] hover:shadow-md hover:-translate-y-0.5"],
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-[#0A2A54] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

export interface FinanceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof financeButtonVariants> {
  asChild?: boolean
}

const FinanceButton = React.forwardRef<HTMLButtonElement, FinanceButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(financeButtonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
FinanceButton.displayName = "FinanceButton"

export { FinanceButton, financeButtonVariants }
