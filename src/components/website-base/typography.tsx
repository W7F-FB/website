import * as React from "react"

import { cn } from "@/lib/utils"

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-5xl font-bold text-balance font-headers",
        className
      )}
      {...props}
    />
  )
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 pb-2 text-4xl font-semibold first:mt-0 font-headers leading-[1.3]",
        className
      )}
      {...props}
    />
  )
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 
      className={cn("scroll-m-20 text-2xl font-semibold font-headers", className)}
      {...props}
    />
  )
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn("scroll-m-20 text-xl font-semibold font-headers", className)}
      {...props}
    />
  )
}

function Subtitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <span className={cn("font-[450] font-headers uppercase text-accent-foreground mb-6", className)} {...props} />
  )
}

interface PProps extends React.ComponentProps<"p"> {
  noSpace?: boolean
}

function P({ className, noSpace = false, ...props }: PProps) {
  return (
    <p className={cn(
      "leading-7 text-foreground/80",
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


