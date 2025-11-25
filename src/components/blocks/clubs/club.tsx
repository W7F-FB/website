import * as React from "react"
import Image from "next/image"
import ReactCountryFlag from "react-country-flag"
import type { TeamDocument } from "../../../../prismicio-types"
import { PrismicLink } from "@prismicio/react"
import { isFilled } from "@prismicio/client"

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

  const hasOptaTournament = (() => {
    if (!team.data.tournaments || comingSoon) return false
    
    return team.data.tournaments.some((item) => {
      if (!isFilled.contentRelationship(item.tournament)) return false
      
      const tournamentData = item.tournament.data
      return tournamentData?.opta_enabled === true
    })
  })()

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

          <H3 className="font-bold text-center text-xs py-1">
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

  if (hasOptaTournament) {
    return (
      <PrismicLink href={`/team/${team.uid}`} className={containerClassName}>
        {content}
      </PrismicLink>
    )
  }

  return (
    <div className={containerClassName}>
      {content}
    </div>
  )
}

interface ClubHorizontalProps extends React.ComponentProps<"div"> {
  team: TeamDocument
  index?: number
  record?: Record
}

function ClubHorizontal({ team, index, record, className, ...props }: ClubHorizontalProps) {
  const logoUrl = getImageUrl(team.data.logo)
  const logoAlt = getImageAlt(team.data.logo)

  return (
    <div
      className={cn(
        "relative flex items-center py-2.5",
        className
      )}
      {...props}
    >
      {index !== undefined && (
        <div className="text-white/60 font-headers text-base font-medium min-w-[1.5rem] mr-2">
          {index}
        </div>
      )}

      {logoUrl && (
        <div className="relative w-8 h-8 flex-shrink-0 mr-3.5">
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
            <span className=" relative top-px font-semibold  ">
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
          <div className="text-foreground font-headers text-sm font-medium whitespace-nowrap">
            {record.wins} - {record.losses}
          </div>
        )}
      </div>
    </div>
  )
}

export { ClubBasic, ClubHorizontal }
