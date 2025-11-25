import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border border-border/50 font-headers uppercase font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground/80 bg-muted/10",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        muted: "border-transparent bg-muted hover:bg-muted/80",
        extra_muted: "border-transparent bg-extra-muted hover:bg-extra-muted/80",
        backdrop_blur: "bg-secondary/10 border-secondary/20 text-foreground backdrop-blur-sm",
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
  origin?: string
  noSkew?: boolean
}

function Badge({ className, variant, size, children, fast, origin, noSkew, ...props }: BadgeProps) {
  const originClass = origin ? `origin-${origin}` : ""
  const skewClass = noSkew ? "" : "-skew-x-16"
  const innerSkewClass = noSkew ? "" : "skew-x-16"
  
  if (fast) {
    return (
      <div className="grid grid-cols-[auto_auto_auto_1fr] gap-0.5 relative">
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0", skewClass, originClass)}/>
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0", skewClass, originClass)}/>
        <div className={cn(badgeVariants({ variant, size }), "w-2 h-full p-0", skewClass, originClass)}/>
        <div className={cn(badgeVariants({ variant, size }), "relative", skewClass, originClass, className)} {...props}>
          
          <span className={innerSkewClass}>{children}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(badgeVariants({ variant, size }), skewClass, originClass, className)} {...props}>
      <span className={innerSkewClass}>{children}</span>
    </div>
  )
}

export { Badge, badgeVariants }
