'use client';

import { Fragment, useState, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import { cn } from "@/lib/utils"
import { getFinalMatch, getThirdPlaceMatch, getSemiFinalMatches, getTeamRankings, sortTeamsByRanking, QUALIFIED_ALIVE } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"
import { ClubRankRow } from "@/components/blocks/tournament/club-rank-row"
import { useIsTablet } from "@/hooks/use-tablet"
import { normalizeOptaId } from "@/lib/opta/utils"
import type { TeamStatSheet } from "@/lib/v2-utils/team-stat-sheet-from-f9"

const placementOrder: Record<string, number> = {
    [QUALIFIED_ALIVE]: 1,
    '1st': 2,
    '2nd': 3,
    '3rd': 4,
    '4th': 5,
    'E': 6
}

type StatSheetTeamsTableProps = {
    prismicTeams: TeamDocument[]
    teamStatSheets: Map<string, TeamStatSheet>
    f1FixturesData: F1FixturesResponse | null
    f3StandingsData: F3StandingsResponse | null
    tournamentStatus?: string
    isKnockoutStage: boolean
}

type TeamRowData = {
    team: TeamDocument
    name: string
    shortName: string
    placement: string
    gamesPlayed: number | string
    wins: number
    losses: number
    shots: number | string
    goals: number | string
    goalsAllowed: number | string
    assists: number | string
    fouls: number | string
    cards: number
    groupId?: number
    groupName?: string
    href: string
}

export function StatSheetTeamsTable({ prismicTeams, teamStatSheets, f1FixturesData, f3StandingsData, tournamentStatus, isKnockoutStage }: StatSheetTeamsTableProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)
    const isTablet = useIsTablet()

    const matchData = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData
    const finalMatches = getFinalMatch(matchData)
    const thirdPlaceMatches = getThirdPlaceMatch(matchData)
    const semiFinalMatches = getSemiFinalMatches(matchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
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

    const getGroupPlacement = useCallback((teamOptaId: string | null | undefined, groupId: number): string => {
        if (!teamOptaId) return '-'
        
        const rankings = getTeamRankings(f3StandingsData, groupId)
        const normalizedTeamRef = normalizeOptaId(`t${teamOptaId}`)
        
        return rankings.get(normalizedTeamRef) ?? '-'
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

    const buildTeamRowData = useCallback((team: TeamDocument, groupId?: number, groupName?: string): TeamRowData => {
        const optaId = team.data.opta_id
        const stats = optaId ? teamStatSheets.get(optaId) : null
        const teamId = optaId ? `t${optaId}` : null

        const optaTeam = optaTeams.find(t => t.uID === teamId)
        const optaShortName = optaTeam?.ShortTeamName || optaTeam?.ShortName
        const displayName = optaShortName || optaTeam?.Name || team.data.name || ''
        const shortName = optaShortName || team.data.key || ''

        const gamesPlayed = stats?.gamesPlayed ?? 0
        const wins = stats?.wins ?? 0
        const losses = stats?.losses ?? 0
        const shots = stats?.shots ?? 0
        const goals = stats?.goals ?? 0
        const goalsAllowed = stats?.goalsAllowed ?? 0
        const assists = stats?.assists ?? 0
        const fouls = stats?.fouls ?? 0
        const yellowCards = stats?.yellowCards ?? 0
        const redCards = stats?.redCards ?? 0
        const totalCards = yellowCards + redCards

        const placement = isKnockoutStage 
            ? getKnockoutPlacement(optaId) 
            : getGroupPlacement(optaId, groupId ?? 0)

        return {
            team,
            name: displayName,
            shortName,
            placement,
            gamesPlayed,
            wins,
            losses,
            shots,
            goals,
            goalsAllowed,
            assists,
            fouls,
            cards: totalCards,
            groupId,
            groupName,
            href: `/club/${team.uid}`
        }
    }, [teamStatSheets, optaTeams, isKnockoutStage, getKnockoutPlacement, getGroupPlacement])

    const knockoutTableData = useMemo(() => {
        if (!isKnockoutStage) return []
        
        return prismicTeams.map(team => buildTeamRowData(team)).sort((a, b) => {
            return placementOrder[a.placement] - placementOrder[b.placement]
        })
    }, [isKnockoutStage, prismicTeams, buildTeamRowData])

    if (isKnockoutStage) {
        return (
            <div>
                <div className="flex gap-0">
                    <div className="border-r border-border/40">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={2} className="pl-3">Club</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {knockoutTableData.map((row, index) => (
                                    <Fragment key={row.team.id}>
                                        <TableRow 
                                            onMouseEnter={() => setHoveredRow(index)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            className={cn(hoveredRow === index && "bg-muted/30 hover:bg-muted/30")}
                                        >
                                            <ClubRankRow
                                                placement={row.placement}
                                                logo={row.team.data.logo}
                                                name={row.name}
                                                shortName={row.shortName}
                                                useShortName={isTablet}
                                                tournamentStatus={tournamentStatus}
                                                href={row.href}
                                                hideRecord={true}
                                            />
                                        </TableRow>
                                        {row.placement === '4th' && (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell className="p-0 h-4">
                                                    <LinePattern className="h-full w-full" patternSize={5} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="pl-6">GP</TableHead>
                                    <TableHead>Record</TableHead>
                                    <TableHead>Goals/Allowed</TableHead>
                                    <TableHead>Shots</TableHead>
                                    <TableHead>Assists</TableHead>
                                    <TableHead>Fouls</TableHead>
                                    <TableHead>Cards</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {knockoutTableData.map((row, index) => (
                                    <Fragment key={row.team.id}>
                                        <TableRow 
                                            onMouseEnter={() => setHoveredRow(index)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            className={cn("h-12 py-0 text-base hover:bg-transparent", hoveredRow === index && "bg-muted/30 hover:bg-muted/30")}
                                        >
                                            <TableCell></TableCell>
                                            <TableCell className="pl-6">{row.gamesPlayed}</TableCell>
                                            <TableCell>{row.wins}-{row.losses}</TableCell>
                                            <TableCell>{row.goals} / {row.goalsAllowed}</TableCell>
                                            <TableCell>{row.shots}</TableCell>
                                            <TableCell>{row.assists}</TableCell>
                                            <TableCell>{row.fouls}</TableCell>
                                            <TableCell>{row.cards}</TableCell>
                                        </TableRow>
                                        {row.placement === '4th' && (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={8} className="p-0 h-4">
                                                    <LinePattern className="h-full w-full" patternSize={5} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="bg-muted/50 border-t border-border font-medium h-[54px]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex gap-0">
                <div className="border-r border-border/40">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead colSpan={2} className="pl-3">Club</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupData?.map((group, groupIndex) => (
                                <Fragment key={group.groupId}>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="p-0 h-8" colSpan={2}>
                                            <div className="relative h-full w-full">
                                                <LinePattern className="absolute inset-0 h-full w-full" patternSize={5} />
                                                <div className="absolute inset-0 flex items-center justify-start pl-3">
                                                    <span className="font-headers font-medium text-sm uppercase">{group.groupName}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {group.teams.map((team, teamIndex) => {
                                        const row = buildTeamRowData(team, group.groupId, group.groupName)
                                        const globalIndex = groupIndex * 100 + teamIndex
                                        return (
                                            <TableRow 
                                                key={row.team.id}
                                                onMouseEnter={() => setHoveredRow(globalIndex)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                className={cn(hoveredRow === globalIndex && "bg-muted/30 hover:bg-muted/30")}
                                            >
                                                <ClubRankRow
                                                    placement={row.placement}
                                                    logo={row.team.data.logo}
                                                    name={row.name}
                                                    shortName={row.shortName}
                                                    useShortName={isTablet}
                                                    href={row.href}
                                                    hideRecord={true}
                                                />
                                            </TableRow>
                                        )
                                    })}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="overflow-x-auto flex-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead className="pl-6">GP</TableHead>
                                <TableHead>Record</TableHead>
                                <TableHead>Goals/Allowed</TableHead>
                                <TableHead>Shots</TableHead>
                                <TableHead>Assists</TableHead>
                                <TableHead>Fouls</TableHead>
                                <TableHead>Cards</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupData?.map((group, groupIndex) => (
                                <Fragment key={group.groupId}>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="p-0 h-8">
                                            <LinePattern className="h-full w-full" patternSize={5} />
                                        </TableCell>
                                    </TableRow>
                                    {group.teams.map((team, teamIndex) => {
                                        const row = buildTeamRowData(team, group.groupId, group.groupName)
                                        const globalIndex = groupIndex * 100 + teamIndex
                                        return (
                                            <TableRow 
                                                key={row.team.id}
                                                onMouseEnter={() => setHoveredRow(globalIndex)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                className={cn("h-12 py-0 text-base hover:bg-transparent", hoveredRow === globalIndex && "bg-muted/30 hover:bg-muted/30")}
                                            >
                                                <TableCell></TableCell>
                                                <TableCell className="pl-6">{row.gamesPlayed}</TableCell>
                                                <TableCell>{row.wins}-{row.losses}</TableCell>
                                                <TableCell>{row.goals} / {row.goalsAllowed}</TableCell>
                                                <TableCell>{row.shots}</TableCell>
                                                <TableCell>{row.assists}</TableCell>
                                                <TableCell>{row.fouls}</TableCell>
                                                <TableCell>{row.cards}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="bg-muted/50 border-t border-border font-medium h-[54px]" />
        </div>
    )
}

