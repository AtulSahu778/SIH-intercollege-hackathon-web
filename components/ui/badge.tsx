import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-navy-primary/10 text-navy-primary",
        secondary: "bg-slate-100 text-text-muted",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-orange-100 text-accent-orange border border-orange-200",
        error: "bg-red-100 text-error border border-red-200",
        outline: "border border-slate-200 text-text-muted",
        orange: "bg-accent-orange text-white",
        cyan: "bg-accent-cyan text-white",
        pending: "bg-amber-100 text-amber-700 border border-amber-200",
        approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        rejected: "bg-red-100 text-red-700 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
