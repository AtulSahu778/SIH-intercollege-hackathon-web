import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
  {
    variants: {
      variant: {
        default: "bg-accent-orange text-white hover:bg-orange-500 shadow-md hover:shadow-lg active:scale-95",
        destructive: "bg-error text-white hover:bg-red-600 shadow-sm",
        outline: "border border-slate-200 bg-white hover:bg-slate-50 text-navy-primary hover:border-navy-primary/30",
        secondary: "bg-navy-secondary text-white hover:bg-navy-primary shadow-sm",
        ghost: "hover:bg-slate-100 text-text-primary",
        link: "text-accent-orange underline-offset-4 hover:underline p-0 h-auto",
        success: "bg-success text-white hover:bg-emerald-600 shadow-sm",
        "navy": "bg-navy-primary text-white hover:bg-navy-secondary shadow-md hover:shadow-lg active:scale-95",
        "glass": "glass text-white hover:bg-white/15 border-white/20",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
