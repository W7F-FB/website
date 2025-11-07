import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientAsideProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const GradientAside = React.forwardRef<HTMLDivElement, GradientAsideProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-sm p-3 px-4 bg-gradient-to-r from-background/50 to-background/0 overflow-hidden relative",
          className
        )}
        {...props}
      >
        <div className="absolute h-full top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-foreground/50 to-foreground/0"></div>
        {children}
      </div>
    )
  }
)
GradientAside.displayName = "GradientAside"

export { GradientAside }

