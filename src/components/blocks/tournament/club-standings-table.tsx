'use client';

import { Fragment, useMemo } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed"
import { getFinalMatch, getThirdPlaceMatch, calculateTeamRecordsFromMatches, getTeamRankings, sortTeamsByRanking } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"
import { ClubRankCell } from "@/components/blocks/tournament/club-rank-cell"
import { normalizeOptaId } from "@/lib/opta/utils"

type ClubStandingsTableProps = {
    prismicTeams: TeamDocument[]
    f1FixturesData: F1FixturesResponse | null
    f3StandingsData: F3StandingsResponse | null
    f40Squads?: F40SquadsResponse | null
    tournamentStatus?: string
    isKnockoutStage: boolean
}

export function ClubStandingsTable({ prismicTeams, f1FixturesData, f3StandingsData, f40Squads, tournamentStatus, isKnockoutStage }: ClubStandingsTableProps) {
    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
    const teamRecords = calculateTeamRecordsFromMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const squadTeams = f40Squads?.SoccerFeed?.SoccerDocument?.Team || []
    
    const getKnockoutPlacement = (teamOptaId: string | null | undefined): string => {
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

    const getGroupPlacement = (teamOptaId: string | null | undefined, groupId: number): string => {
        if (!teamOptaId) return '-'
        
        const rankings = getTeamRankings(f3StandingsData, groupId)
        const normalizedTeamRef = normalizeOptaId(`t${teamOptaId}`)
        
        return rankings.get(normalizedTeamRef) ?? '-'
    }

    const placementOrder: Record<string, number> = {
        '1st': 1,
        '2nd': 2,
        '3rd': 3,
        '4th': 4,
        'E': 5
    }

    const getDisplayName = (team: TeamDocument): string => {
        const optaId = team.data.opta_id
        const teamIdWithPrefix = optaId?.toString().startsWith('t')
            ? optaId
            : `t${optaId}`
        
        const f40Team = squadTeams.find(t => normalizeOptaId(t.uID) === normalizeOptaId(teamIdWithPrefix))
        return f40Team?.short_club_name || team.data.name || ''
    }

    const groupData = useMemo(() => {
        if (isKnockoutStage) return null
        
        const groupMap = new Map<string, TeamDocument[]>()
        
        prismicTeams.forEach(team => {
            const group = team.data.group
            if (!group) return
            
            if (!groupMap.has(group)) {
                groupMap.set(group, [])
            }
            groupMap.get(group)?.push(team)
        })
        
        const groups: { groupId: number; groupName: string; teams: TeamDocument[] }[] = []
        
        for (const [groupName, teams] of groupMap.entries()) {
            const groupId = groupName === "Group 1" ? 1 : groupName === "Group 2" ? 2 : 0
            const sortedTeams = sortTeamsByRanking(teams, f3StandingsData, groupId)
            
            groups.push({
                groupId,
                groupName,
                teams: sortedTeams
            })
        }
        
        return groups.sort((a, b) => a.groupId - b.groupId)
    }, [isKnockoutStage, prismicTeams, f3StandingsData])

    const knockoutTableData = useMemo(() => {
        if (!isKnockoutStage) return []
        
        return prismicTeams.map(team => {
            const optaId = team.data.opta_id
            const teamId = optaId ? `t${optaId}` : null
            const record = teamId ? teamRecords.get(teamId) : null
            const wins = record?.wins ?? 0
            const losses = record?.losses ?? 0

            return {
                team,
                name: getDisplayName(team),
                placement: getKnockoutPlacement(optaId),
                record: `${wins}-${losses}`
            }
        }).sort((a, b) => {
            return placementOrder[a.placement] - placementOrder[b.placement]
        })
    }, [isKnockoutStage, prismicTeams, teamRecords, squadTeams])

    if (isKnockoutStage) {
        const firstEliminatedIndex = knockoutTableData.findIndex(row => row.placement === 'E')
        
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <th className="sr-only">Standings</th>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {knockoutTableData.map((row, index) => (
                        <Fragment key={row.team.id}>
                            {index === firstEliminatedIndex && (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell className="p-0 h-4">
                                        <LinePattern className="h-full w-full" patternSize={7} />
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <ClubRankCell
                                    placement={row.placement}
                                    logo={row.team.data.logo}
                                    name={row.name}
                                    record={row.record}
                                    className="pr-2"
                                    tournamentStatus={tournamentStatus}
                                />
                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <th className="sr-only">Standings</th>
                </TableRow>
            </TableHeader>
            <TableBody>
                {groupData?.map((group) => (
                    <Fragment key={group.groupId}>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="p-0 h-8">
                                <div className="relative h-full w-full">
                                    <LinePattern className="h-full w-full" patternSize={7} />
                                    <div className="absolute inset-0 flex items-center justify-start pl-3">
                                        <span className="font-headers font-semibold text-xs uppercase text-muted-foreground">{group.groupName}</span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        {group.teams.map((team) => {
                            const optaId = team.data.opta_id
                            const teamId = optaId ? `t${optaId}` : null
                            const record = teamId ? teamRecords.get(teamId) : null
                            const wins = record?.wins ?? 0
                            const losses = record?.losses ?? 0
                            
                            return (
                                <TableRow key={team.id}>
                                    <ClubRankCell
                                        placement={getGroupPlacement(optaId, group.groupId)}
                                        logo={team.data.logo}
                                        name={getDisplayName(team)}
                                        record={`${wins}-${losses}`}
                                        className="pr-2"
                                    />
                                </TableRow>
                            )
                        })}
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    )
}

