import * as React from "react"

import { cn } from "@/lib/utils"

const headingVariants = {
  h1: "scroll-m-20 text-4xl lg:text-5xl font-semibold text-balance font-headers leading-[1.4] uppercase ",
  h2: "scroll-m-20 pb-2 text-3xl lg:text-4xl font-medium first:mt-0 font-headers !leading-[1.45] uppercase",
  h3: "scroll-m-20 text-xl lg:text-2xl font-medium font-headers !leading-[1.4]",
  h4: "scroll-m-20 text-lg lg:text-xl font-medium font-headers",
} as const

type HeadingVariant = keyof typeof headingVariants

interface H1Props extends React.ComponentProps<"h1"> {
  variant?: HeadingVariant
}

function H1({ className, variant, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        variant ? headingVariants[variant] : headingVariants.h1,
        className
      )}
      {...props}
    />
  )
}

interface H2Props extends React.ComponentProps<"h2"> {
  variant?: HeadingVariant
}

function H2({ className, variant, ...props }: H2Props) {
  return (
    <h2
      className={cn(
        variant ? headingVariants[variant] : headingVariants.h2,
        className
      )}
      {...props}
    />
  )
}

interface H3Props extends React.ComponentProps<"h3"> {
  variant?: HeadingVariant
}

function H3({ className, variant, ...props }: H3Props) {
  return (
    <h3 
      className={cn(
        variant ? headingVariants[variant] : headingVariants.h3,
        className
      )}
      {...props}
    />
  )
}

interface H4Props extends React.ComponentProps<"h4"> {
  variant?: HeadingVariant
}

function H4({ className, variant, ...props }: H4Props) {
  return (
    <h4
      className={cn(
        variant ? headingVariants[variant] : headingVariants.h4,
        className
      )}
      {...props}
    />
  )
}

function Subtitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <span className={cn("inline-block font-[450] font-headers uppercase text-accent-foreground mb-6", className)} {...props} />
  )
}

interface PProps extends React.ComponentProps<"p"> {
  noSpace?: boolean
}

function P({ className, noSpace = false, ...props }: PProps) {
  return (
    <p className={cn(
      "leading-[1.5] text-foreground/80",
      !noSpace && "[&:not(:first-child)]:mt-4",
      className
    )} {...props} />
  )
}

function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  )
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
}

function TextProtect({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-shadow-md", className)}
      {...props}
    />
  )
}

function Footnote({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mt-6 text-sm italic text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  )
}


export {
  H1,
  H2,
  H3,
  H4,
  Subtitle,
  P,
  Footnote,
  Blockquote,
  List,
  TextProtect,
}


