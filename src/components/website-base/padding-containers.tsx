import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const PaddingGlobal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-4 md:px-12", className)}
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

const containerVariants = cva("mx-auto px-6 lg:px-2", {
  variants: {
    maxWidth: {
      sm: "max-w-3xl",
      md: "max-w-5xl", 
      lg: "max-w-[90rem]",
    },
  },
  defaultVariants: {
    maxWidth: "lg",
  },
})

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg"
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
