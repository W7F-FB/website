'use client';

import { Fragment } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed"
import { getFinalMatch, getThirdPlaceMatch, calculateTeamRecordsFromMatches } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"
import { ClubRankCell } from "@/components/blocks/tournament/club-rank-cell"
import { normalizeOptaId } from "@/lib/opta/utils"

type ClubStandingsTableProps = {
    prismicTeams: TeamDocument[]
    f1FixturesData: F1FixturesResponse | null
    f40Squads?: F40SquadsResponse | null
}

export function ClubStandingsTable({ prismicTeams, f1FixturesData, f40Squads }: ClubStandingsTableProps) {
    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
    const teamRecords = calculateTeamRecordsFromMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const squadTeams = f40Squads?.SoccerFeed?.SoccerDocument?.Team || []
    
    const getPlacement = (teamOptaId: string | null | undefined): string => {
        if (!teamOptaId) return 'E'
        
        const teamId = `t${teamOptaId}`
        
        if (finalMatch) {
            if (finalMatch.MatchInfo?.MatchWinner === teamId) return '1st'
            if (finalMatch.TeamData?.[0]?.TeamRef === teamId || finalMatch.TeamData?.[1]?.TeamRef === teamId) return '2nd'
        }
        
        if (thirdPlaceMatch) {
            if (thirdPlaceMatch.MatchInfo?.MatchWinner === teamId) return '3rd'
            if (thirdPlaceMatch.TeamData?.[0]?.TeamRef === teamId || thirdPlaceMatch.TeamData?.[1]?.TeamRef === teamId) return '4th'
        }
        
        return 'E'
    }

    const placementOrder: Record<string, number> = {
        '1st': 1,
        '2nd': 2,
        '3rd': 3,
        '4th': 4,
        'E': 5
    }

    const tableData = prismicTeams.map(team => {
        const optaId = team.data.opta_id
        const teamId = optaId ? `t${optaId}` : null
        const record = teamId ? teamRecords.get(teamId) : null

        const wins = record?.wins ?? 0
        const losses = record?.losses ?? 0
        
        const teamIdWithPrefix = optaId?.toString().startsWith('t')
            ? optaId
            : `t${optaId}`
        
        const f40Team = squadTeams.find(t => normalizeOptaId(t.uID) === normalizeOptaId(teamIdWithPrefix))
        const displayName = f40Team?.short_club_name || team.data.name || ''

        return {
            team,
            name: displayName,
            placement: getPlacement(optaId),
            record: `${wins}-${losses}`
        }
    }).sort((a, b) => {
        return placementOrder[a.placement] - placementOrder[b.placement]
    })

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <th className="sr-only">Standings</th>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((row) => (
                    <Fragment key={row.team.id}>
                        <TableRow>
                            <ClubRankCell
                                placement={row.placement}
                                logo={row.team.data.logo}
                                name={row.name}
                                record={row.record}
                                className="pr-2"
                            />
                        </TableRow>
                        {row.placement === '4th' && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell className="p-0 h-4">
                                    <LinePattern className="h-full w-full" patternSize={7} />
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    )
}

