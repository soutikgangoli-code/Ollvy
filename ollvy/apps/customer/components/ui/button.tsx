import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20",
        secondary:
          "bg-white/10 text-white hover:bg-white/15 active:scale-[0.98]",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/30 active:scale-[0.98]",
        ghost:
          "text-white/70 hover:text-white hover:bg-white/5",
        link:
          "text-white/70 underline-offset-4 hover:text-white hover:underline",
        destructive:
          "bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-[0.98]",
        success:
          "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 active:scale-[0.98]",
        warning:
          "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-base font-semibold",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
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
