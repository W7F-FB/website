import * as React from "react"

import { cn } from "@/lib/utils"

const GradientBanner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="gradient-banner"
      className={cn(
        "md:p-12 p-6 bg-gradient-to-r from-muted/50 to-transparent",
        className
      )}
      {...props}
    />
  )
})

GradientBanner.displayName = "GradientBanner"

export { GradientBanner }
