import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface PaddingGlobalProps extends React.HTMLAttributes<HTMLDivElement> {}

const PaddingGlobal = React.forwardRef<HTMLDivElement, PaddingGlobalProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6", className)}
        {...props}
      />
    )
  }
)

PaddingGlobal.displayName = "PaddingGlobal"

const sectionVariants = cva("", {
  variants: {
    padding: {
      xs: "py-4",
      sm: "py-8",
      md: "py-16",
      lg: "py-24",
      xl: "py-32",
    },
  },
  defaultVariants: {
    padding: "md",
  },
})

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: "xs" | "sm" | "md" | "lg" | "xl"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ padding }), className)}
        {...props}
      />
    )
  }
)

Section.displayName = "Section"

export { PaddingGlobal, Section }
