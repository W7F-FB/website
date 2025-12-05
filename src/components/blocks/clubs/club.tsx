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
}

function ClubBasic({ team, comingSoon, placement, className, ...props }: ClubBasicProps) {
  const logoUrl = comingSoon ? null : getImageUrl(team.data.logo)
  const logoAlt = comingSoon ? null : getImageAlt(team.data.logo)

  const containerClassName = cn(
    "relative -skew-x-[calc(var(--skew-btn)/5)] origin-center overflow-hidden border border-border/50 ",
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
        className={cn("skew-x-[calc(var(--skew-btn)/5)] relative origin-center h-full", className)}
        {...props}
      >
        <div className={cn(
          "flex flex-col items-center justify-start space-y-3 py-6 px-3 h-full",
          comingSoon && "pt-3"
        )}>

          {comingSoon ? (

            <div className="py-3 overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted/10 -skew-x-[calc(var(--skew-btn)/5)] w-full origin-bottom-left">
              <div className="w-13 h-13 flex items-center justify-center">
                <QuestionMarkIcon className="w-10 h-10 text-muted-foreground/20 skew-x-[calc(var(--skew-btn)/5)]" />
              </div>
            </div>
          ) : logoUrl ? (
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={logoUrl}
                alt={logoAlt || team.data?.name || "Team logo"}
                fill
                className="object-contain"
                sizes="1000px"
              />
            </div>
          ) : null}

          <H3 className="font-bold text-center lg:text-xs text-xs py-1">
            {comingSoon ? `Team #${comingSoon}` : team.data?.name}
          </H3>
          <div className="flex-grow w-full flex flex-col items-center justify-end space-y-2">
            <Separator className="mr-2 bg-muted" />
            <span className="font-headers text-muted-foreground text-xs font-medium text-center">
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

export { ClubBasic, ClubHorizontal }
