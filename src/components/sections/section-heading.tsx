import * as React from "react"
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

function SectionHeadingHeading({ className, ...props }: React.ComponentProps<typeof H2>) {
  return (
    <H2
      data-slot="section-heading-heading"
      className={cn(
        "col-span-2 group-[.split-variant]:col-span-1",
        className
      )}
      {...props}
    />
  )
}

function SectionHeadingText({ className, ...props }: React.ComponentProps<typeof P>) {
  return (
    <P
      noSpace
      data-slot="section-heading-text"
      className={cn(
        "text-lg text-muted-foreground",
        "col-span-2 group-[.split-variant]:col-span-1 group-[.split-variant]:max-w-md group-[.split-variant]:justify-self-end",
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
}
