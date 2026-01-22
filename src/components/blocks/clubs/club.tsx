import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import ReactCountryFlag from "react-country-flag"
import type { TeamDocument } from "../../../../prismicio-types"

import { cn } from "@/lib/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { Separator } from "@/components/ui/separator"
import { H3 } from "@/components/website-base/typography"
import { QuestionMarkIcon } from "@/components/website-base/icons"
import type { Record } from "@/types/stats"
import { GradientBg } from "@/components/ui/gradient-bg"

interface ClubBasicProps extends React.ComponentProps<"div"> {
  team: TeamDocument
  comingSoon?: number
  placement?: number
  variant?: "default" | "small"
  noSkew?: boolean
}

function ClubBasic({ team, comingSoon, placement, variant = "default", noSkew = false, className, ...props }: ClubBasicProps) {
  const logoUrl = comingSoon ? null : getImageUrl(team.data.logo)
  const logoAlt = comingSoon ? null : getImageAlt(team.data.logo)
  const isSmall = variant === "small"

  const containerClassName = cn(
    "relative overflow-hidden border border-border/50",
    !noSkew && "-skew-x-[calc(var(--skew-btn)/5)] origin-center",
    !comingSoon && "hover:scale-98 transition-transform"
  )

  const content = (
    <>
      <GradientBg
        className="w-[300%] aspect-square absolute bottom-0 right-0"
        overlayColor="oklch(0.1949 0.0274 260.031)"
        accentColor={team.data?.color_primary || "#0c224a"}
        shadowColor="oklch(0.1949 0.0274 260.031)"
        accentOpacity={0.4}
      />
      <div
        className={cn("relative h-full", !noSkew && "skew-x-[calc(var(--skew-btn)/5)] origin-center", className)}
        {...props}
      >
        <div className={cn(
          "flex flex-col items-center justify-start h-full",
          isSmall ? "space-y-1.5 py-3 px-2" : "space-y-3 py-6 px-3",
          comingSoon && !isSmall && "pt-3"
        )}>

          {comingSoon ? (

            <div className={cn(
              "overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted/10 w-full origin-bottom-left",
              !noSkew && "-skew-x-[calc(var(--skew-btn)/5)]",
              isSmall ? "py-1.5" : "py-3"
            )}>
              <div className={cn("flex items-center justify-center", isSmall ? "w-8 h-8" : "w-13 h-13")}>
                <QuestionMarkIcon className={cn("text-muted-foreground/20", !noSkew && "skew-x-[calc(var(--skew-btn)/5)]", isSmall ? "w-6 h-6" : "w-10 h-10")} />
              </div>
            </div>
          ) : logoUrl ? (
            <div className={cn("relative flex-shrink-0", isSmall ? "w-8 h-8" : "w-16 h-16")}>
              <Image
                src={logoUrl}
                alt={logoAlt || team.data?.name || "Team logo"}
                fill
                className="object-contain"
                sizes="1000px"
              />
            </div>
          ) : null}

          <H3 className={cn("font-bold text-center py-1", isSmall ? "text-[10px] lg:text-[10px]" : "lg:text-xs text-xs")}>
            {comingSoon ? `Team #${comingSoon}` : team.data?.name}
          </H3>
          <div className={cn("flex-grow w-full flex flex-col items-center justify-end", isSmall ? "space-y-1" : "space-y-2")}>
            <Separator className="mr-2 bg-muted" />
            <span className={cn("font-headers text-muted-foreground font-medium text-center", isSmall ? "text-[10px]" : "text-xs")}>
              {comingSoon ? "Coming soon" : team.data?.country}
            </span>
          </div>
        </div>

      </div>
      {placement && placement < 4 && (
        <div className={cn("absolute inset-x-0 bottom-0 h-1",
          placement === 1 && "bg-gold-gradient",
          placement === 2 && "bg-silver-gradient",
          placement === 3 && "bg-bronze-gradient",
        )}>

        </div>
      )}
    </>
  )

  if (comingSoon || !team.uid) {
    return (
      <div className={containerClassName}>
        {content}
      </div>
    )
  }

  return (
    <Link href={`/club/${team.uid}`} className={containerClassName}>
      {content}
    </Link>
  )
}

interface ClubHorizontalProps extends React.ComponentProps<"div"> {
  team: TeamDocument
  index?: number | string
  record?: Record
}

function ClubHorizontal({ team, index, record, className, ...props }: ClubHorizontalProps) {
  const logoUrl = getImageUrl(team.data.logo)
  const logoAlt = getImageAlt(team.data.logo)

  const containerClassName = cn(
    "relative flex items-center py-2.5 group",
    className
  )

  const content = (
    <>
      {index !== undefined && record !== undefined && (
        <div className="text-muted-foreground font-headers text-xxs lg:text-xs font-medium lg:w-8 w-6">
          {index}
        </div>
      )}

      {logoUrl && (
        <div className="relative lg:size-7 size-5 flex-shrink-0 mr-3">
          <Image
            src={logoUrl}
            alt={logoAlt || team.data?.name || "Team logo"}
            fill
            className="object-contain"
            sizes="100px"
          />
        </div>
      )}
      <div className="flex items-center justify-between flex-grow flex-wrap gap-x-2">
        <div className="flex flex-col justify-center">
          <span>
            <span className="relative top-px text-xs lg:text-sm font-headers font-medium group-hover:underline">
              {team.data?.name}
            </span>
            {team.data?.country_code && (
              <span className="inline-block ml-2.5 top-px relative">
                <ReactCountryFlag
                  countryCode={team.data.country_code}
                  svg
                  className="rounded-xs"
                  style={{
                    width: '0.9rem',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </span>
            )}
          </span>
          {!team.data?.country_code && (
            <span className="font-headers text-foreground/60 text-xs font-medium uppercase tracking-wide">
              {team.data?.country}
            </span>
          )}
        </div>

        {record !== undefined && (
          <div className="text-foreground font-headers text-xs lg:text-sm font-medium whitespace-nowrap min-w-10 text-right">
            {record.wins} - {record.losses}
          </div>
        )}
      </div>
    </>
  )

  if (!team.uid) {
    return (
      <div className={containerClassName} {...props}>
        {content}
      </div>
    )
  }

  return (
    <Link href={`/club/${team.uid}`} className={containerClassName}>
      {content}
    </Link>
  )
}

interface ClubBadgeProps extends React.ComponentProps<"div"> {
  team: TeamDocument
}

function ClubBadge({ team, className, ...props }: ClubBadgeProps) {
  const logoUrl = getImageUrl(team.data.logo)
  const logoAlt = getImageAlt(team.data.logo)

  return (
    <div
      className={cn(
        "relative -skew-x-[calc(var(--skew-btn)/3)] origin-center overflow-hidden border border-border/50",
        className
      )}
      {...props}
    >
      <GradientBg
        className="w-[150%] h-[200%] aspect-square absolute top-0  -left-[20%]  rotate-y-180 opacity-100"
        overlayColor="oklch(0.1949 0.0274 260.031)"
        accentColor={team.data?.color_primary || "#0c224a"}
        shadowColor="oklch(0.1949 0.0274 260.031)"
        accentOpacity={0.5}
      />
      <div className="skew-x-[calc(var(--skew-btn)/3)] relative origin-center flex items-center gap-2 py-1.5 px-3">
        {logoUrl && (
          <div className="relative size-5 flex-shrink-0">
            <Image
              src={logoUrl}
              alt={logoAlt || team.data?.name || "Team logo"}
              fill
              className="object-contain"
              sizes="100px"
            />
          </div>
        )}
        <span className="font-headers text-sm font-semibold">
          {team.data?.name}
        </span>
      </div>
    </div>
  )
}

export { ClubBasic, ClubHorizontal, ClubBadge }
