import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-white/20 bg-white/10 text-white",
        secondary:
          "border-white/10 bg-white/5 text-white/70",
        destructive:
          "border-white/20 bg-white/10 text-white",
        outline:
          "border-white/20 text-white/70",
        success:
          "border-white/20 bg-white/10 text-white",
        warning:
          "border-white/20 bg-white/10 text-white",
        pending:
          "border-white/15 bg-white/5 text-white/60",
        active:
          "border-white/25 bg-white/15 text-white",
        completed:
          "border-white/20 bg-white/10 text-white/80",
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
