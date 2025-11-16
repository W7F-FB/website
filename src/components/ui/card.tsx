import * as React from "react"

import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  banner?: boolean
}

const bannerDescendantClasses =
  "[&_[data-slot=card-header]]:bg-muted/30 [&_[data-slot=card-header]]:py-4 [&_[data-slot=card-header]]:gap-0 [&_[data-slot=card-header]]:px-4 [&_[data-slot=card-title]]:text-xl [&_[data-slot=card-title]]:font-medium [&_[data-slot=card-title]]:font-headers [&_[data-slot=card-title]]:tracking-wider [&_[data-slot=card-title]]:uppercase [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-content]]:py-3"

function Card({ className, banner, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={banner ? "banner" : undefined}
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-none border shadow-sm",
        banner
          ? "gap-0 p-0 self-start bg-card/50 border-border/50"
          : "gap-6 py-8",
        banner && bannerDescendantClasses,
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-8", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-8 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
