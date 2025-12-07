'use client';

import { Fragment, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed"
import { getFinalMatch, getThirdPlaceMatch, getSemiFinalMatches, getTeamRankings, sortTeamsByRanking, QUALIFIED_ALIVE } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"
import { ClubRankRow } from "@/components/blocks/tournament/club-rank-row"
import { normalizeOptaId } from "@/lib/opta/utils"
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9"

const placementOrder: Record<string, number> = {
    [QUALIFIED_ALIVE]: 1,
    '1st': 2,
    '2nd': 3,
    '3rd': 4,
    '4th': 5,
    'E': 6
}

type ClubStandingsTableProps = {
    prismicTeams: TeamDocument[]
    f1FixturesData: F1FixturesResponse | null
    f3StandingsData: F3StandingsResponse | null
    f40Squads?: F40SquadsResponse | null
    tournamentStatus?: string
    isKnockoutStage: boolean
    teamRecords?: TeamRecord[]
    button?: React.ReactNode
}

export function ClubStandingsTable({ prismicTeams, f1FixturesData, f3StandingsData, f40Squads, tournamentStatus, isKnockoutStage, teamRecords, button }: ClubStandingsTableProps) {
    const matchData = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData
    const finalMatches = getFinalMatch(matchData)
    const thirdPlaceMatches = getThirdPlaceMatch(matchData)
    const semiFinalMatches = getSemiFinalMatches(matchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
    const recordsMap = useMemo(() => {
        const map = new Map<string, { wins: number; losses: number }>()
        if (teamRecords) {
            for (const record of teamRecords) {
                map.set(record.optaNormalizedTeamId, { wins: record.wins, losses: record.losses })
            }
        }
        return map
    }, [teamRecords])
    
    const squadTeams = useMemo(() => f40Squads?.SoccerFeed?.SoccerDocument?.Team || [], [f40Squads])
    const optaTeams = useMemo(() => f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [], [f1FixturesData])
    
    const semifinalTeamIds = useMemo(() => {
        const teamIds = new Set<string>()
        for (const match of semiFinalMatches) {
            if (match.TeamData?.[0]?.TeamRef) teamIds.add(normalizeOptaId(match.TeamData[0].TeamRef))
            if (match.TeamData?.[1]?.TeamRef) teamIds.add(normalizeOptaId(match.TeamData[1].TeamRef))
        }
        return teamIds
    }, [semiFinalMatches])

    const getKnockoutPlacement = useCallback((teamOptaId: string | null | undefined): string => {
        if (!teamOptaId) return 'E'
        
        const teamId = `t${teamOptaId}`
        const normalizedTeamId = normalizeOptaId(teamId)
        
        if (finalMatch?.MatchInfo?.MatchWinner) {
            if (normalizeOptaId(finalMatch.MatchInfo.MatchWinner) === normalizedTeamId) return '1st'
            if (normalizeOptaId(finalMatch.TeamData?.[0]?.TeamRef || '') === normalizedTeamId || 
                normalizeOptaId(finalMatch.TeamData?.[1]?.TeamRef || '') === normalizedTeamId) return '2nd'
        }
        
        if (thirdPlaceMatch?.MatchInfo?.MatchWinner) {
            if (normalizeOptaId(thirdPlaceMatch.MatchInfo.MatchWinner) === normalizedTeamId) return '3rd'
            if (normalizeOptaId(thirdPlaceMatch.TeamData?.[0]?.TeamRef || '') === normalizedTeamId || 
                normalizeOptaId(thirdPlaceMatch.TeamData?.[1]?.TeamRef || '') === normalizedTeamId) return '4th'
        }
        
        if (semifinalTeamIds.has(normalizedTeamId)) {
            return QUALIFIED_ALIVE
        }
        
        return 'E'
    }, [finalMatch, thirdPlaceMatch, semifinalTeamIds])

    const getGroupPlacement = (teamOptaId: string | null | undefined, groupId: number): string => {
        if (!teamOptaId) return '-'
        
        const rankings = getTeamRankings(f3StandingsData, groupId)
        const normalizedTeamRef = normalizeOptaId(`t${teamOptaId}`)
        
        return rankings.get(normalizedTeamRef) ?? '-'
    }

    const getDisplayName = useCallback((team: TeamDocument): string => {
        const optaId = team.data.opta_id
        const teamId = optaId ? `t${optaId}` : null
        
        const optaTeam = optaTeams.find(t => t.uID === teamId)
        const optaShortName = optaTeam?.ShortTeamName || optaTeam?.ShortName
        return optaShortName || optaTeam?.Name || team.data.name || ''
    }, [optaTeams])

    const getTeamCountry = useCallback((team: TeamDocument): string | null => {
        const optaId = team.data.opta_id
        const teamIdWithPrefix = optaId?.toString().startsWith('t')
            ? optaId
            : `t${optaId}`
        
        const f40Team = squadTeams.find(t => normalizeOptaId(t.uID) === normalizeOptaId(teamIdWithPrefix))
        return f40Team?.country || f40Team?.Country || null
    }, [squadTeams])

    const getF3GroupPosition = useCallback((teamOptaId: string | null | undefined): number => {
        if (!teamOptaId) return 999
        const normalizedTeamId = normalizeOptaId(`t${teamOptaId}`)
        const teamStandings = f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings
        if (!teamStandings) return 999
        
        for (const groupStanding of teamStandings) {
            const teamRecord = groupStanding.TeamRecord?.find(
                record => normalizeOptaId(record.TeamRef) === normalizedTeamId
            )
            if (teamRecord) {
                return teamRecord.Standing.Position
            }
        }
        return 999
    }, [f3StandingsData])

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
            const normalizedId = optaId ? normalizeOptaId(`t${optaId}`) : null
            const record = normalizedId ? recordsMap.get(normalizedId) : null
            const wins = record?.wins ?? 0
            const losses = record?.losses ?? 0

            return {
                team,
                name: getDisplayName(team),
                placement: getKnockoutPlacement(optaId),
                record: `${wins}-${losses}`,
                country: getTeamCountry(team),
                f3Position: getF3GroupPosition(optaId)
            }
        }).sort((a, b) => {
            const placementDiff = placementOrder[a.placement] - placementOrder[b.placement]
            if (placementDiff !== 0) return placementDiff
            return a.f3Position - b.f3Position
        })
    }, [isKnockoutStage, prismicTeams, recordsMap, getDisplayName, getKnockoutPlacement, getTeamCountry, getF3GroupPosition])

    if (isKnockoutStage) {
        const firstEliminatedIndex = knockoutTableData.findIndex(row => row.placement === 'E')
        
        return (
            <Card banner className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Standings</CardTitle>
                        {button}
                    </div>
                </CardHeader>
                <CardContent className="!p-0 lg:!p-0">
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
                                            <TableCell colSpan={3} className="p-0 h-4">
                                                <LinePattern className="h-full w-full" patternSize={7} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                    <ClubRankRow
                                                placement={row.placement}
                                                logo={row.team.data.logo}
                                                name={row.name}
                                                record={row.record}
                                                className="pr-2"
                                                tournamentStatus={tournamentStatus}
                                                href={row.team.uid ? `/club/${row.team.uid}` : undefined}
                                                country={row.country}
                                            />
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card banner className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Standings</CardTitle>
                    {button}
                </div>
            </CardHeader>
            <CardContent className="!p-0 lg:!p-0">
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
                                    <TableCell className="p-0 px-4 h-8">
                                        <div className="relative h-full w-full">
                                            <LinePattern className="h-full w-full" patternSize={7} />
                                            <div className="absolute inset-0 flex items-center justify-start">
                                                <span className="font-headers font-medium text-sm uppercase ">{group.groupName}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {group.teams.map((team) => {
                                    const optaId = team.data.opta_id
                                    const normalizedId = optaId ? normalizeOptaId(`t${optaId}`) : null
                                    const record = normalizedId ? recordsMap.get(normalizedId) : null
                                    const wins = record?.wins ?? 0
                                    const losses = record?.losses ?? 0
                                    
                                    return (
                                        <TableRow key={team.id}>
                                            <ClubRankRow
                                                placement={getGroupPlacement(optaId, group.groupId)}
                                                logo={team.data.logo}
                                                name={getDisplayName(team)}
                                                record={`${wins}-${losses}`}
                                                href={team.uid ? `/club/${team.uid}` : undefined}
                                                country={getTeamCountry(team)}
                                            />
                                        </TableRow>
                                    )
                                })}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

