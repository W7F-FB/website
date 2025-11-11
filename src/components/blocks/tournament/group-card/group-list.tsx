import { CardContent } from "@/components/ui/card"
import { Content } from "@prismicio/client"
import { ClubHorizontal } from "@/components/blocks/clubs/club"
import { F3TeamStandings, F3Team } from "@/types/opta-feeds/f3-standings"
import { normalizeOptaId } from "@/lib/opta/utils"

interface GroupListProps {
  groupStandings: F3TeamStandings
  teams: F3Team[]
  prismicTeams: Content.TeamDocument[]
}

export function GroupList({ groupStandings, teams, prismicTeams }: GroupListProps) {
    const groupName = groupStandings.Round?.Name.value || 'Unknown Group'
    
    console.log(`GroupList ${groupName}:`, {
        teamRecords: groupStandings.TeamRecord.map(r => ({ raw: r.TeamRef, normalized: normalizeOptaId(r.TeamRef) })),
        optaTeamIds: teams.map(t => ({ raw: t.uID, normalized: normalizeOptaId(t.uID) })),
        prismicTeamOptaIds: prismicTeams.map(t => ({ raw: t.data.opta_id, normalized: normalizeOptaId(t.data.opta_id || '') }))
    })
    
    return (
   
groupStandings.TeamRecord.map((record) => {
            const normalizedTeamRef = normalizeOptaId(record.TeamRef)
            const optaTeam = teams.find(t => normalizeOptaId(t.uID) === normalizedTeamRef)
            const prismicTeam = prismicTeams.find(t => normalizeOptaId(t.data.opta_id || '') === normalizedTeamRef)
            
            console.log(`Matching ${record.TeamRef}:`, {
                normalizedRef: normalizedTeamRef,
                foundOptaTeam: !!optaTeam,
                foundPrismicTeam: !!prismicTeam,
                prismicTeamName: prismicTeam?.data?.name
            })
            
            if (prismicTeam && optaTeam) {
              return (
                <ClubHorizontal
                  key={record.TeamRef}
                  team={prismicTeam}
                  index={record.Standing.Position}
                  record={{
                    wins: record.Standing.Won,
                    draws: record.Standing.Drawn,
                    losses: record.Standing.Lost,
                    goalsFor: record.Standing.For,
                    goalsAgainst: record.Standing.Against,
                    points: record.Standing.Points
                  }}
                />
              )
            }
            return null
          })

    )
}

