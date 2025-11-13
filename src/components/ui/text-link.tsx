import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TextLinkProps extends React.ComponentProps<typeof Link> {
  className?: string
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        "inline-blocktext-foreground underline-offset-2 underline",
        className
      )}
      {...props}
    />
  )
})

TextLink.displayName = "TextLink"

export { TextLink }

