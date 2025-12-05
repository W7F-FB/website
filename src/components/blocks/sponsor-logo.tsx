import * as React from "react"
import { PrismicNextImage } from "@prismicio/next"
import type { SponsorDocument } from "@/../prismicio-types"
import { isFilled } from "@prismicio/client"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SponsorLogoProps {
  sponsor: SponsorDocument
  className?: string
}

export function SponsorLogo({
  sponsor,
  className,
}: SponsorLogoProps) {
  const websiteUrl = sponsor.data.website_link || ""
  const logo = sponsor.data.logo

  if (!logo || !isFilled.image(logo)) {
    return null
  }

  const logoField = logo.alt
    ? logo
    : ({ ...logo, alt: sponsor.data.name || "Sponsor logo" } as typeof logo)

  const logoElement = (
    <PrismicNextImage
      field={logoField}
      className="h-6 lg:h-8 w-auto object-contain"
    />
  )

  if (websiteUrl) {
    return (
      <Link
        href={websiteUrl}
        className={cn(
          "flex items-center justify-center opacity-100 hover:opacity-90 transition-opacity",
          className
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        {logoElement}
      </Link>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center opacity-100",
        className
      )}
    >
      {logoElement}
    </div>
  )
}

