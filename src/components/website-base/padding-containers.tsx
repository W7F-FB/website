import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const PaddingGlobal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-12", className)}
        {...props}
      />
    )
  }
)

PaddingGlobal.displayName = "PaddingGlobal"

const sectionVariants = cva("", {
  variants: {
    padding: {
      none: "",
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
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
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

const containerVariants = cva("mx-auto", {
  variants: {
    maxWidth: {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    maxWidth: "4xl",
  },
})

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ maxWidth }), className)}
        {...props}
      />
    )
  }
)

Container.displayName = "Container"

export { PaddingGlobal, Section, Container }
