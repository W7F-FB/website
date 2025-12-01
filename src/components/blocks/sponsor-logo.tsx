import * as React from "react"
import { PrismicNextImage } from "@prismicio/next"
import type { SponsorDocument } from "@/../prismicio-types"
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

  const logoElement = (
    <PrismicNextImage
      field={logo}
      className="h-8 w-auto object-contain"
      fallbackAlt={(sponsor.data.name || "Sponsor logo") as ""}
    />
  )

  if (websiteUrl) {
    return (
      <Link
        href={websiteUrl}
        className={cn(
          "flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity",
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
        "flex items-center justify-center opacity-70",
        className
      )}
    >
      {logoElement}
    </div>
  )
}

