"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type FormMessageErrorProps = React.ComponentProps<"p"> & {
  message?: string
}

export function FormMessageError({ className, message, children, ...props }: FormMessageErrorProps) {
  const body = message ?? children
  if (!body) return null
  return (
    <p className={cn("text-destructive text-sm", className)} {...props}>
      {body}
    </p>
  )
}


