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
  showName?: boolean
  watch?: boolean
  noLink?: boolean
  logoSize?: string
}

export function BroadcastPartnerLink({
  partner,
  className,
  variant = "ghost",
  size,
  branded = false,
  showName = false,
  watch = false,
  noLink = false,
  logoSize,
  ...props
}: BroadcastPartnerLinkProps) {
  const logo = branded ? partner.data.logo_on_primary : partner.data.logo_white
  const isSmall = size === "sm"
  const isLarge = size === "lg"

  const _brandedStyles = branded && partner.data.color_primary
    ? {
      "--brand-color": partner.data.color_primary,
      "--brand-text-color": partner.data.color_secondary,
    } as React.CSSProperties
    : undefined

  const brandedClass = branded ? "bg-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:opacity-90 text-[var(--brand-text-color)] hover:text-[var(--brand-text-color)]" : ""

  const defaultLogoSize = isSmall ? "size-6" : isLarge ? "lg:size-10 size-8" : "lg:size-8 size-7"
  const paddingClass = isLarge ? "py-4 px-3" : "py-2.5 px-2"
  const textSizeClass = isSmall ? "text-xs" : isLarge ? "text-lg" : "text-sm"

  const content = (
    <>
      <div className="flex items-center gap-3">
        {logo?.url && (
          <div className={cn(
            "relative shrink-0 pointer-events-none",
            logoSize ?? defaultLogoSize
          )}>
            <PrismicNextImage
              field={logo?.alt ? logo : { ...logo, alt: partner.data.name || "Broadcast partner logo" }}
              fill
              className="object-contain object-left"
            />
          </div>
        )}
        {showName && partner.data.name && (
          <span className="font-medium font-headers whitespace-nowrap">{partner.data.name}</span>
        )}
      </div>
      {!noLink && (
        <div className="text-xs font-medium flex items-center gap-1">
          {watch && <div className="group-hover/broadcast-partner:underline">Watch</div>}
          <CaretRightIcon className={cn(
            isSmall ? "size-2.5" : isLarge ? "size-4" : "size-3"
          )} />
        </div>
      )}
    </>
  )

  if (noLink) {
    return (
      <div
        className={cn(
          "gap-3 border-muted h-auto w-full flex items-center justify-between cursor-default",
          paddingClass,
          textSizeClass,
          className
        )}
        style={_brandedStyles}
      >
        {content}
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group/broadcast-partner gap-3 border-muted h-auto w-full flex items-center justify-between",
        paddingClass,
        textSizeClass,
        className,
        brandedClass
      )}
      style={_brandedStyles}
      asChild
      {...props}
    >
      <Link href={partner.data.streaming_link || ""} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    </Button>
  )
}
