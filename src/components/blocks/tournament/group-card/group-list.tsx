import { Content } from "@prismicio/client"
import { ClubHorizontal } from "@/components/blocks/clubs/club"
import { F3TeamStandings, F3Team } from "@/types/opta-feeds/f3-standings"
import { F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import { normalizeOptaId } from "@/lib/opta/utils"
import { calculateTeamRecordsFromMatches } from "@/app/(website)/(subpages)/tournament/utils"

interface GroupListProps {
  groupStandings: F3TeamStandings
  teams: F3Team[]
  prismicTeams: Content.TeamDocument[]
  matches: F1MatchData[]
}

export function GroupList({ groupStandings, teams, prismicTeams, matches }: GroupListProps) {
    const groupName = groupStandings.Round?.Name.value || 'Unknown Group'
    const groupId = groupStandings.Round?.Name.id || 0
    
    const calculatedRecords = calculateTeamRecordsFromMatches(matches, groupId)
    
    return (
   
groupStandings.TeamRecord.map((record) => {
            const normalizedTeamRef = normalizeOptaId(record.TeamRef)
            const optaTeam = teams.find(t => normalizeOptaId(t.uID) === normalizedTeamRef)
            const prismicTeam = prismicTeams.find(t => normalizeOptaId(t.data.opta_id || '') === normalizedTeamRef)
            
            const calculatedRecord = calculatedRecords.get(record.TeamRef)
            
            if (prismicTeam && optaTeam && calculatedRecord) {
              return (
                <ClubHorizontal
                  key={record.TeamRef}
                  team={prismicTeam}
                  index={record.Standing.Position}
                  record={{
                    wins: calculatedRecord.wins,
                    draws: calculatedRecord.draws,
                    losses: calculatedRecord.losses,
                    goalsFor: calculatedRecord.goalsFor,
                    goalsAgainst: calculatedRecord.goalsAgainst,
                    points: calculatedRecord.points
                  }}
                />
              )
            }
            return null
          })

    )
}

