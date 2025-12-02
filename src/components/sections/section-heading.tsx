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
        "pb-16 grid group grid-cols-1",
        variant !== "default" && "md:grid-cols-2",
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
      className={cn("col-span-1 md:col-span-2", className)}
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
        "col-span-1 md:col-span-2 group-[.split-variant]:md:col-span-1 max-w-lg",
        className
      )}
      {...props}
    />
  )
}

const sectionHeadingTextVariants = cva(
  "col-span-1 md:col-span-2 group-[.split-variant]:md:col-span-1 group-[.split-variant]:md:max-w-md group-[.split-variant]:md:justify-self-end",
  {
    variants: {
      variant: {
        default: "text-lg text-muted-foreground",
        lg: "text-xl leading-7.5 mt-2 group-[.split-variant]:md:max-w-lg",
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

function SectionHeadingContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-heading-content"
      className={cn(
        "col-span-1 md:col-span-2 group-[.split-variant]:md:col-span-1 flex flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

function SectionHeadingLeft({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-heading-left"
      className={cn(
        "col-span-1 md:col-span-2 group-[.split-variant]:md:col-span-1 flex flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

function SectionHeadingRight({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-heading-right"
      className={cn(
        "col-span-1 md:col-span-2 group-[.split-variant]:md:col-span-1 flex flex-col gap-4 group-[.split-variant]:md:justify-self-end group-[.split-variant]:md:items-end",
        className
      )}
      {...props}
    />
  )
}

export {
  SectionHeading,
  SectionHeadingSubtitle,
  SectionHeadingHeading,
  SectionHeadingText,
  SectionHeadingContent,
  SectionHeadingLeft,
  SectionHeadingRight,
}
