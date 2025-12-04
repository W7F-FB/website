"use client"

import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CaretRightIcon } from "../website-base/icons"
import { useNavigationMenuContext } from "@/components/ui/navigation-menu"

const SHEET_ANIMATION_DURATION = 300

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
  const { isTablet, setIsSheetOpen } = useNavigationMenuContext()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isTablet || external) return

    const url = new URL(href, window.location.origin)
    const isSamePage = url.pathname === window.location.pathname
    const hasHash = url.hash.length > 0

    e.preventDefault()

    if (!isSamePage) {
      router.prefetch(url.pathname)
    }

    setIsSheetOpen(false)

    setTimeout(() => {
      if (isSamePage && hasHash) {
        const element = document.querySelector(url.hash)
        element?.scrollIntoView({ behavior: "smooth" })
      } else if (hasHash) {
        router.push(url.pathname + url.hash)
      } else {
        router.push(url.pathname + url.search)
      }
    }, SHEET_ANIMATION_DURATION)
  }

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
        onClick={handleClick}
      >
        <div className="text-sm font-medium">{children}</div>
        <CaretRightIcon className="size-3" />
      </Link>
    </Button>
  )
}

