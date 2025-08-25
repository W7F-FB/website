"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type FormMessageSuccessProps = React.ComponentProps<"p"> & {
  message?: string
}

export function FormMessageSuccess({ className, message, children, ...props }: FormMessageSuccessProps) {
  const body = message ?? children
  if (!body) return null
  return (
    <p className={cn("text-emerald-600 dark:text-emerald-400 text-sm", className)} {...props}>
      {body}
    </p>
  )
}


