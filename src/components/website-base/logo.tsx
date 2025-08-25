import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg"
  alt?: string
  link?: boolean
  color?: "white" | "brand"
  variant?: "primary" | "2-lines"
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ size = "md", className, alt = "World Sevens Football Logo", link = false, color = "brand", variant = "primary", ...props }, ref) => {
    const getLogoSrc = (color: "white" | "brand", variant: "primary" | "2-lines") => {
      if (color === "white" && variant === "2-lines") {
        return "/images/company-logos/logo-horizontal-2lines-white.svg"
      }
      if (color === "brand" && variant === "2-lines") {
        return "/images/company-logos/logo-horizontal-2lines.svg"
      }
      if (color === "white" && variant === "primary") {
        return "/images/company-logos/logo-horizontal-primary-white.svg"
      }
      if (color === "brand" && variant === "primary") {
        return "/images/company-logos/logo-horizontal-primary.svg"
      }
      return "/images/company-logos/logo-horizontal-primary.svg"
    }

    const logoSrc = getLogoSrc(color, variant)

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