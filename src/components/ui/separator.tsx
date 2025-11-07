"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0 opacity-50",
  {
    variants: {
      variant: {
        default: "bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        skewDash: "data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-dashed-large data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-l data-[orientation=vertical]:border-dashed-large-vertical data-[orientation=vertical]:h-full",
        gradient: "data-[orientation=horizontal]:bg-gradient-to-r data-[orientation=horizontal]:from-transparent data-[orientation=horizontal]:via-border data-[orientation=horizontal]:to-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:bg-gradient-to-b data-[orientation=vertical]:from-transparent data-[orientation=vertical]:via-border data-[orientation=vertical]:to-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
      },
      gradientDirection: {
        toLeft: "data-[orientation=horizontal]:bg-gradient-to-l data-[orientation=horizontal]:from-border data-[orientation=horizontal]:to-transparent data-[orientation=vertical]:bg-gradient-to-t data-[orientation=vertical]:from-border data-[orientation=vertical]:to-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        toRight: "data-[orientation=horizontal]:bg-gradient-to-r data-[orientation=horizontal]:from-border data-[orientation=horizontal]:to-transparent data-[orientation=vertical]:bg-gradient-to-b data-[orientation=vertical]:from-border data-[orientation=vertical]:to-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        toTop: "data-[orientation=horizontal]:bg-gradient-to-l data-[orientation=horizontal]:from-border data-[orientation=horizontal]:to-transparent data-[orientation=vertical]:bg-gradient-to-t data-[orientation=vertical]:from-border data-[orientation=vertical]:to-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        toBottom: "data-[orientation=horizontal]:bg-gradient-to-r data-[orientation=horizontal]:from-border data-[orientation=horizontal]:to-transparent data-[orientation=vertical]:bg-gradient-to-b data-[orientation=vertical]:from-border data-[orientation=vertical]:to-transparent data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface SeparatorProps 
  extends React.ComponentProps<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {
  variant?: "default" | "skewDash" | "gradient"
  gradientDirection?: "toLeft" | "toRight" | "toTop" | "toBottom"
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "default",
  gradientDirection,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant, gradientDirection }),
        className
      )}
      {...props}
    />
  )
}

export { Separator }
