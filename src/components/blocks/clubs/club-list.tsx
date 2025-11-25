import * as React from "react"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"

import { getTeamsByTournament } from "@/cms/queries/team"
import { ClubBasic } from "./club"
import { getF1Fixtures } from "@/app/api/opta/feeds"
import { normalizeOptaId } from "@/lib/opta/utils"

interface ClubListProps extends React.ComponentProps<"div"> {
  tournament: TournamentDocument
}

export async function ClubList({ tournament, className, ...props }: ClubListProps) {
  const teams = await getTeamsByTournament(tournament.uid)
  const sortedTeams = [...teams].sort((a, b) => {
    const aSort = (a.data.alphabetical_sort_string || "").toLowerCase()
    const bSort = (b.data.alphabetical_sort_string || "").toLowerCase()
    return aSort.localeCompare(bSort)
  })
  const numberOfTeams = tournament.data.number_of_teams || sortedTeams.length

  const placementMap: Record<string, number> = {}

  if (tournament.data.status === "Complete" && tournament.data.opta_competition_id) {
    try {
      const fixtures = await getF1Fixtures(tournament.data.opta_competition_id, 2025)
      const matches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || []
      const teamsData = fixtures?.SoccerFeed?.SoccerDocument?.Team || []
      
      const teamNameMap: Record<string, string> = {}
      teamsData.forEach((team) => {
        teamNameMap[team.uID] = team.Name || team.name || ''
      })
      
      const finalMatch = matches.find(m => m.MatchInfo?.RoundType === 'Final')
      const thirdPlaceMatch = matches.find(m => m.MatchInfo?.RoundType === '3rd and 4th Place')
      
      if (finalMatch) {
        const winner = finalMatch.MatchInfo?.MatchWinner ? normalizeOptaId(finalMatch.MatchInfo.MatchWinner) : undefined
        const loser = finalMatch.TeamData?.find(td => td.TeamRef !== finalMatch.MatchInfo?.MatchWinner)?.TeamRef
        const normalizedLoser = loser ? normalizeOptaId(loser) : undefined
        
        if (winner) placementMap[winner] = 1
        if (normalizedLoser) placementMap[normalizedLoser] = 2
      }
      
      if (thirdPlaceMatch) {
        const winner = thirdPlaceMatch.MatchInfo?.MatchWinner ? normalizeOptaId(thirdPlaceMatch.MatchInfo.MatchWinner) : undefined
        const loser = thirdPlaceMatch.TeamData?.find(td => td.TeamRef !== thirdPlaceMatch.MatchInfo?.MatchWinner)?.TeamRef
        const normalizedLoser = loser ? normalizeOptaId(loser) : undefined
        
        if (winner) placementMap[winner] = 3
        if (normalizedLoser) placementMap[normalizedLoser] = 4
      }
    } catch (error) {
      console.error('Failed to fetch fixtures for completed tournament:', error)
    }
  }

  if (numberOfTeams === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No teams found for this tournament.</p>
      </div>
    )
  }

  const allItems: Array<{ type: 'team'; team: TeamDocument } | { type: 'comingSoon'; number: number }> = []
  
  for (let i = 0; i < sortedTeams.length; i++) {
    allItems.push({ type: 'team', team: sortedTeams[i] })
  }
  
  for (let i = sortedTeams.length; i < numberOfTeams; i++) {
    allItems.push({ type: 'comingSoon', number: i + 1 })
  }

  return (
    <div 
      className={`grid gap-3 ${className || ""}`}
      style={{ gridTemplateColumns: `repeat(${numberOfTeams}, 1fr)` }}
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
            />
          )
        } else {
          return (
            <ClubBasic 
              key={`coming-soon-${item.number}`} 
              team={{} as TeamDocument}
              comingSoon={item.number}
            />
          )
        }
      })}
    </div>
  )
}
