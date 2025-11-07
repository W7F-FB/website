import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center -skew-x-16 rounded-none border border-border/50 font-headers uppercase font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground/80 bg-muted/10",
        backdrop_blur: "border-transparent bg-primary/20 border-primary/10 text-foreground backdrop-blur-sm",
      },
      size: {
        default: "px-3.5 pt-1 pb-1 text-sm",
        sm: "px-2.5 pt-1 pb-0.75 text-xs",
        lg: "px-4 pt-1.5 pb-1 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  fast?: boolean
}

function Badge({ className, variant, size, children, fast, ...props }: BadgeProps) {
  if (fast) {
    return (
      <div className="grid grid-flow-col auto-cols-auto gap-0.5">
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0 -skew-x-16",)}/>
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0 -skew-x-16",)}/>
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0 -skew-x-16",)}/>
        <div className={cn(badgeVariants({ variant, size }), "-skew-x-16", className)} {...props}>
          <span className="skew-x-16">{children}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      <span className="skew-x-16">{children}</span>
    </div>
  )
}

export { Badge, badgeVariants }
