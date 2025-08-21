import * as React from "react"

import { cn } from "@/lib/utils"

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance font-headers",
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
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-headers",
        className
      )}
      {...props}
    />
  )
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("scroll-m-20 text-2xl font-semibold tracking-tight font-headers", className)}
      {...props}
    />
  )
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn("scroll-m-20 text-xl font-semibold tracking-tight font-headers", className)}
      {...props}
    />
  )
}

function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
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

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
  List,
  TextProtect,
}


