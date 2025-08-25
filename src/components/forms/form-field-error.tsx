"use client"

import * as React from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type FormFieldErrorProps = React.ComponentProps<"div"> & {
  message?: string
}

export function FormFieldError({ className, message, children, ...props }: FormFieldErrorProps) {
  const body = message ?? children
  if (!body) return null
  return (
    <div className={cn("flex items-start gap-2 text-destructive text-sm", className)} {...props}>
      <WarningCircleIcon className="mt-0.5 size-4" aria-hidden />
      <span>{body}</span>
    </div>
  )
}


