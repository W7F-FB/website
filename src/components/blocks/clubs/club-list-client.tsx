"use client"

import * as React from "react"
import type { TeamDocument } from "../../../../prismicio-types"
import { ClubBasic } from "./club"

export type ClubListData = {
  teams: TeamDocument[]
  numberOfTeams: number
  placementMap: Record<string, number>
  tournamentUid: string
}

interface ClubListClientProps extends React.ComponentProps<"div"> {
  data: ClubListData
  variant?: "default" | "small"
  noSkew?: boolean
}

export function ClubListClient({ data, variant = "default", noSkew = false, className, ...props }: ClubListClientProps) {
  const { teams, numberOfTeams, placementMap, tournamentUid } = data

  if (numberOfTeams === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No teams found for this tournament.</p>
      </div>
    )
  }

  const allItems: Array<{ type: 'team'; team: TeamDocument } | { type: 'comingSoon'; number: number }> = []

  for (let i = 0; i < teams.length; i++) {
    allItems.push({ type: 'team', team: teams[i] })
  }

  for (let i = teams.length; i < numberOfTeams; i++) {
    allItems.push({ type: 'comingSoon', number: i + 1 })
  }

  const columnsPerRow = variant === "small" ? Math.ceil(numberOfTeams / 2) : numberOfTeams

  const gridId = `club-list-${tournamentUid}-${variant}`

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: variant === "small"
          ? `
            .club-list-grid-${gridId} {
              grid-template-columns: repeat(${columnsPerRow}, 1fr);
            }
          `
          : `
            .club-list-grid-${gridId} {
              grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 1024px) {
              .club-list-grid-${gridId} {
                grid-template-columns: repeat(${columnsPerRow}, 1fr);
              }
            }
          `
      }} />
      <div
        className={`grid club-list-grid-${gridId} ${variant === "small" ? "gap-2" : "gap-3"} ${className || ""}`}
        {...props}
      >
      {allItems.map((item) => {
        if (item.type === 'team') {
          const optaId = item.team.data.opta_id
          const placement = optaId ? placementMap[optaId] : undefined

          return (
            <ClubBasic
              key={item.team.id}
              team={item.team}
              placement={placement}
              variant={variant}
              noSkew={noSkew}
            />
          )
        } else {
          return (
            <ClubBasic
              key={`coming-soon-${item.number}`}
              team={{} as TeamDocument}
              comingSoon={item.number}
              variant={variant}
              noSkew={noSkew}
            />
          )
        }
      })}
      </div>
    </>
  )
}
