import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg"
  alt?: string
  link?: boolean
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ size = "md", className, alt = "World Sevens Football Logo", link = false, ...props }, ref) => {
    const logoSrc = "images/company-logos/logo-horizontal-2lines-white.svg"

    const sizeClasses = {
      sm: "h-6 w-auto",
      md: "h-8 w-auto", 
      lg: "h-10 w-auto"
    }

    const dimensions = {
      sm: { width: 120, height: 32 },
      md: { width: 160, height: 40 },
      lg: { width: 200, height: 48 }
    }

    const logoImage = (
      <Image
        ref={ref}
        src={logoSrc}
        alt={alt}
        className={cn(sizeClasses[size], className)}
        {...dimensions[size]}
        {...props}
      />
    )

    if (link) {
      return (
        <Link href="/">
          {logoImage}
        </Link>
      )
    }

    return logoImage
  }
)

Logo.displayName = "Logo"

export { Logo } 