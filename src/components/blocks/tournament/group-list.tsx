import { Content } from "@prismicio/client"
import { ClubHorizontal } from "@/components/blocks/clubs/club"
import { F3TeamStandings, F3Team } from "@/types/opta-feeds/f3-standings"
import { F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import { normalizeOptaId } from "@/lib/opta/utils"
import { calculateTeamRecordsFromMatches, getTeamRankingsFromStandings, sortTeamsByRankingFromStandings } from "@/app/(website)/(subpages)/tournament/utils"

interface GroupListProps {
  groupStandings: F3TeamStandings
  teams: F3Team[]
  prismicTeams: Content.TeamDocument[]
  matches: F1MatchData[]
}

export function GroupList({ groupStandings, teams, prismicTeams, matches }: GroupListProps) {
    const groupId = groupStandings.Round?.Name.id || 0
    
    const calculatedRecords = calculateTeamRecordsFromMatches(matches, groupId)
    const rankings = getTeamRankingsFromStandings(groupStandings.TeamRecord)
    const sortedTeamRecords = sortTeamsByRankingFromStandings(groupStandings.TeamRecord)
    
    return (
        <>
            {sortedTeamRecords.map((record) => {
                const normalizedTeamRef = normalizeOptaId(record.TeamRef)
                const optaTeam = teams.find(t => normalizeOptaId(t.uID) === normalizedTeamRef)
                const prismicTeam = prismicTeams.find(t => normalizeOptaId(t.data.opta_id || '') === normalizedTeamRef)
                
                const calculatedRecord = calculatedRecords.get(record.TeamRef)
                const displayPosition = rankings.get(normalizedTeamRef) ?? '-'
                
                if (prismicTeam && optaTeam && calculatedRecord) {
                    const prismicTeamWithOptaName = {
                        ...prismicTeam,
                        data: {
                            ...prismicTeam.data,
                            name: optaTeam.ShortName || optaTeam.Name || prismicTeam.data.name,
                        },
                    } as Content.TeamDocument
                    return (
                        <ClubHorizontal
                            key={record.TeamRef}
                            team={prismicTeamWithOptaName}
                            index={displayPosition}
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
            })}
        </>
    )
}

interface GroupListPrismicProps {
  teams: Content.TeamDocument[]
}

export function GroupListPrismic({ teams }: GroupListPrismicProps) {
    const zeroRecord = {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    }
    
    return (
        <>
            {teams.map((team, index) => (
                <ClubHorizontal
                    key={team.id}
                    team={team}
                    index={String(index + 1)}
                    record={zeroRecord}
                />
            ))}
        </>
    )
}

