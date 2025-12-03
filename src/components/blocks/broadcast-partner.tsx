import * as React from "react"
import { PrismicNextImage } from "@prismicio/next"
import type { BroadcastPartnersDocument } from "@/../prismicio-types"
import { Button, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CaretRightIcon } from "../website-base/icons"

interface BroadcastPartnerButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
  VariantProps<typeof buttonVariants> {
  partner: BroadcastPartnersDocument
  asChild?: boolean
  branded?: boolean
}

export function BroadcastPartnerButton({
  partner,
  className,
  variant,
  size,
  branded = false,
  ...props
}: BroadcastPartnerButtonProps) {
  const logo = branded
    ? (partner.data.icon_logo?.url ? partner.data.icon_logo : partner.data.logo_on_primary)
    : partner.data.logo_white

  const _brandedStyles = branded && partner.data.color_primary
    ? {
      "--brand-color": partner.data.color_primary,
      "--brand-text-color": partner.data.color_secondary,
    } as React.CSSProperties
    : undefined

  const brandedClass = branded ? "bg-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:opacity-90 text-[var(--brand-text-color)] hover:text-[var(--brand-text-color)]" : ""

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-3 border-muted", className, brandedClass)}
      style={_brandedStyles}
      asChild
      {...props}
    >
      <Link href={partner.data.streaming_link || ""} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
        {logo?.url && (
          <div className="relative size-4 shrink-0 pointer-events-none">
            <PrismicNextImage
              field={logo?.alt ? logo : { ...logo, alt: partner.data.name || "Broadcast partner logo" }}
              fill
              className="object-contain !max-w-full"
            />
          </div>
        )}
        {partner.data.name && (
          <span>{partner.data.name}</span>
        )}
      </Link>
    </Button>
  )
}

interface BroadcastPartnerLinkProps
  extends Omit<React.ComponentProps<"button">, "children">,
  VariantProps<typeof buttonVariants> {
  partner: BroadcastPartnersDocument
  asChild?: boolean
  branded?: boolean
}

export function BroadcastPartnerLink({
  partner,
  className,
  variant = "ghost",
  size,
  branded = false,
  ...props
}: BroadcastPartnerLinkProps) {
  const logo = branded ? partner.data.logo_on_primary : partner.data.logo_white
  const isSmall = size === "sm"

  const _brandedStyles = branded && partner.data.color_primary
    ? {
      "--brand-color": partner.data.color_primary,
      "--brand-text-color": partner.data.color_secondary,
    } as React.CSSProperties
    : undefined

  const brandedClass = branded ? "bg-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:opacity-90 text-[var(--brand-text-color)] hover:text-[var(--brand-text-color)]" : ""

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group/broadcast-partner gap-3 border-muted h-auto px-2 w-full flex items-center justify-between py-2.5",
        className,
        brandedClass
      )}
      style={_brandedStyles}
      asChild
      {...props}
    >
      <Link href={partner.data.streaming_link || ""} target="_blank" rel="noopener noreferrer">
        {logo?.url && (
          <div className={cn(
            "relative shrink-0 pointer-events-none",
            isSmall ? "w-8 h-6" : "w-12 h-9"
          )}>
            <PrismicNextImage
              field={logo?.alt ? logo : { ...logo, alt: partner.data.name || "Broadcast partner logo" }}
              fill
              className="object-contain object-left"
            />
          </div>
        )}
        <div className="text-xs font-medium flex items-center gap-1">
          {!isSmall && <div className="group-hover/broadcast-partner:underline">Watch</div>}
          <CaretRightIcon className={cn(isSmall ? "size-3" : "size-2")} />
        </div>
      </Link>
    </Button>
  )
}
