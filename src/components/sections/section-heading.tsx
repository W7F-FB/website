import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Subtitle, H2, P } from "@/components/website-base/typography"

interface SectionHeadingProps extends React.ComponentProps<"div"> {
  variant?: "default" | "split"
}

function SectionHeading({ className, variant = "default", ...props }: SectionHeadingProps) {
  return (
    <div
      data-slot="section-heading"
      data-variant={variant}
      className={cn(
        "pb-16 grid group",
        variant === "default" ? "grid-cols-1" : "grid-cols-2",
        variant === "split" && "split-variant",
        className
      )}
      {...props}
    />
  )
}

function SectionHeadingSubtitle({ className, ...props }: React.ComponentProps<typeof Subtitle>) {
  return (
    <Subtitle
      data-slot="section-heading-subtitle"
      className={cn("col-span-2", className)}
      {...props}
    />
  )
}

function SectionHeadingHeading({ className, variant, ...props }: React.ComponentProps<typeof H2>) {
  return (
    <H2
      variant={variant}
      data-slot="section-heading-heading"
      className={cn(
        "col-span-2 group-[.split-variant]:col-span-1 max-w-lg",
        !variant && "text-5xl",
        className
      )}
      {...props}
    />
  )
}

const sectionHeadingTextVariants = cva(
  "col-span-2 group-[.split-variant]:col-span-1 group-[.split-variant]:max-w-md group-[.split-variant]:justify-self-end",
  {
    variants: {
      variant: {
        default: "text-lg text-muted-foreground",
        lg: "text-xl leading-7.5 mt-2 group-[.split-variant]:max-w-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function SectionHeadingText({ 
  className, 
  variant,
  ...props 
}: React.ComponentProps<typeof P> & VariantProps<typeof sectionHeadingTextVariants>) {
  return (
    <P
      noSpace
      data-slot="section-heading-text"
      className={cn(sectionHeadingTextVariants({ variant }), className)}
      {...props}
    />
  )
}

export {
  SectionHeading,
  SectionHeadingSubtitle,
  SectionHeadingHeading,
  SectionHeadingText,
}
