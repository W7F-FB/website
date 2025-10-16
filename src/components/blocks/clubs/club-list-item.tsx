import * as React from "react"
import Image from "next/image"
import type { TeamDocument } from "../../../../prismicio-types"

import { cn } from "@/lib/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { Separator } from "@/components/ui/separator"
import { H3 } from "@/components/website-base/typography"
import { QuestionMarkIcon } from "@/components/website-base/icons"

interface ClubListItemProps extends React.ComponentProps<"div"> {
  team: TeamDocument
  first?: boolean
  last?: boolean
  comingSoon?: number
}

function ClubListItem({ team, first, last, comingSoon, className, ...props }: ClubListItemProps) {
  const logoUrl = comingSoon ? null : getImageUrl(team.data.logo)
  const logoAlt = comingSoon ? null : getImageAlt(team.data.logo)

  return (
    <div
      className={cn(
        "relative -skew-x-[calc(var(--skew-btn)/5)] origin-center bg-extra-muted",
        !comingSoon && "hover:scale-98 transition-transform"
      )}
    >
      {first && <div className="hidden absolute top-0 left-0 w-1/2 h-full skew-x-[calc(var(--skew-btn)/5)] origin-bottom-left bg-extra-muted"></div>}
      {last && <div className="hidden absolute top-0 right-0 w-1/2 h-full skew-x-[calc(var(--skew-btn)/5)] origin-top-right bg-extra-muted"></div>}
      <div
        className={cn("skew-x-[calc(var(--skew-btn)/5)] origin-center h-full", className)}
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
            <Separator className="mr-2"/>
            <span className="font-headers text-muted-foreground text-xs font-medium text-center">
              {comingSoon ? "Coming soon" : team.data?.country}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ClubListItem }
