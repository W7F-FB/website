import * as React from "react"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"

import { getTeamsByTournament } from "@/cms/queries/team"
import { ClubBasic } from "./club-basic"
import { getF1Fixtures } from "@/app/api/opta/feeds"

interface ClubListProps extends React.ComponentProps<"div"> {
  tournament: TournamentDocument
}

export async function ClubList({ tournament, className, ...props }: ClubListProps) {
  const teams = await getTeamsByTournament(tournament.uid)
  const sortedTeams = teams.sort((a, b) => {
    const aSort = a.data.alphabetical_sort_string || ""
    const bSort = b.data.alphabetical_sort_string || ""
    return aSort.localeCompare(bSort)
  })
  const numberOfTeams = tournament.data.number_of_teams || sortedTeams.length

  let placementMap: Record<string, number> = {}

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
        const winner = finalMatch.MatchInfo?.MatchWinner?.replace('t', '')
        const loser = finalMatch.TeamData?.find(td => td.TeamRef !== finalMatch.MatchInfo?.MatchWinner)?.TeamRef?.replace('t', '')
        
        if (winner) placementMap[winner] = 1
        if (loser) placementMap[loser] = 2
      }
      
      if (thirdPlaceMatch) {
        const winner = thirdPlaceMatch.MatchInfo?.MatchWinner?.replace('t', '')
        const loser = thirdPlaceMatch.TeamData?.find(td => td.TeamRef !== thirdPlaceMatch.MatchInfo?.MatchWinner)?.TeamRef?.replace('t', '')
        
        if (winner) placementMap[winner] = 3
        if (loser) placementMap[loser] = 4
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
      {allItems.map((item, index) => {
        if (item.type === 'team') {
          const optaId = item.team.data.opta_id
          const placement = optaId ? placementMap[optaId] : undefined
          
          return (
            <ClubBasic 
              key={item.team.id} 
              team={item.team} 
              first={index === 0}
              last={index === allItems.length - 1}
              placement={placement}
            />
          )
        } else {
          return (
            <ClubBasic 
              key={`coming-soon-${item.number}`} 
              team={{} as TeamDocument}
              comingSoon={item.number}
              first={index === 0}
              last={index === allItems.length - 1}
            />
          )
        }
      })}
    </div>
  )
}
