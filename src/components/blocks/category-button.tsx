import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CaretRightIcon } from "../website-base/icons"

interface CategoryButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
  VariantProps<typeof buttonVariants> {
  href: string
  children?: React.ReactNode
  external?: boolean
}

export function CategoryButton({
  href,
  children,
  className,
  variant = "ghost",
  size,
  external = false,
  ...props
}: CategoryButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-3 border-muted h-auto px-2 w-full flex items-center justify-between gap-3 py-3.5", className)}
      asChild
      {...props}
    >
      <Link 
        href={href} 
        target={external ? "_blank" : undefined} 
        rel={external ? "noopener noreferrer" : undefined}
      >
        <div className="text-sm font-medium">{children}</div>
        <CaretRightIcon className="size-3" />
      </Link>
    </Button>
  )
}

