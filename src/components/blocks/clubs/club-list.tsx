import * as React from "react"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"

import { getTeamsByTournament } from "@/cms/queries/team"
import { ClubListItem } from "./club-list-item"

interface ClubListProps extends React.ComponentProps<"div"> {
  tournament: TournamentDocument
}

export async function ClubList({ tournament, className, ...props }: ClubListProps) {
  const teams = await getTeamsByTournament(tournament.uid)
  const numberOfTeams = tournament.data.number_of_teams || teams.length

  if (numberOfTeams === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No teams found for this tournament.</p>
      </div>
    )
  }

  // Create array of all items (teams + coming soon placeholders)
  const allItems: Array<{ type: 'team'; team: TeamDocument } | { type: 'comingSoon'; number: number }> = []
  
  // Add actual teams
  for (let i = 0; i < teams.length; i++) {
    allItems.push({ type: 'team', team: teams[i] })
  }
  
  // Add coming soon placeholders for remaining slots
  for (let i = teams.length; i < numberOfTeams; i++) {
    allItems.push({ type: 'comingSoon', number: i + 1 })
  }

  return (
    <div 
      className={`grid gap-3 ${className || ""}`}
      style={{ gridTemplateColumns: `repeat(${numberOfTeams}, 1fr)` }}
      {...props}
    >
      {allItems.map((item, index) => (
        item.type === 'team' ? (
          <ClubListItem 
            key={item.team.id} 
            team={item.team} 
            first={index === 0}
            last={index === allItems.length - 1}
          />
        ) : (
          <ClubListItem 
            key={`coming-soon-${item.number}`} 
            team={{} as TeamDocument}
            comingSoon={item.number}
            first={index === 0}
            last={index === allItems.length - 1}
          />
        )
      ))}
    </div>
  )
}
