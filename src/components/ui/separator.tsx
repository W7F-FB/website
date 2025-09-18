"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0",
  {
    variants: {
      variant: {
        default: "bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        skewDash: "data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-dashed-large data-[orientation=horizontal]:w-full data-[orientation=vertical]:border-l data-[orientation=vertical]:border-dashed-large-vertical data-[orientation=vertical]:h-full"
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
  variant?: "default" | "skewDash"
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "default",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator }
