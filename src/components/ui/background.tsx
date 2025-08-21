import * as React from "react"

import { cn } from "@/lib/utils"

const Background = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="background"
      className={cn("absolute inset-0", className)}
      {...props}
    />
  )
})

Background.displayName = "Background"

export { Background }
