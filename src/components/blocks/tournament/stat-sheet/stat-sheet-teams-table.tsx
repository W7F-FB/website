'use client';

import { Fragment, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import { getTeamStat } from "@/types/opta-feeds/f30-season-stats"
import { cn } from "@/lib/utils"
import { getFinalMatch, getThirdPlaceMatch, calculateTeamRecordsFromMatches, getTeamRankings, sortTeamsByRanking } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"
import { ClubRankCell } from "@/components/blocks/tournament/club-rank-cell"
import { useIsTablet } from "@/hooks/use-tablet"
import { normalizeOptaId } from "@/lib/opta/utils"

type StatSheetTeamsTableProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
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
}

export function StatSheetTeamsTable({ prismicTeams, f30TeamStats, f1FixturesData, f3StandingsData, tournamentStatus, isKnockoutStage }: StatSheetTeamsTableProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)
    const isTablet = useIsTablet()

    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
    const teamRecords = calculateTeamRecordsFromMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const optaTeams = f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || []
    
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

    const buildTeamRowData = (team: TeamDocument, groupId?: number, groupName?: string): TeamRowData => {
        const optaId = team.data.opta_id
        const stats = optaId ? f30TeamStats.get(optaId) : null
        const teamId = optaId ? `t${optaId}` : null
        const record = teamId ? teamRecords.get(teamId) : null

        const optaTeam = optaTeams.find(t => t.uID === teamId)
        const optaShortName = optaTeam?.ShortTeamName || optaTeam?.ShortName
        const displayName = optaShortName || optaTeam?.Name || team.data.name || ''
        const shortName = optaShortName || team.data.key || ''

        const gamesPlayed = stats ? getTeamStat(stats, "Games Played") ?? 0 : 0
        const wins = record?.wins ?? 0
        const losses = record?.losses ?? 0
        const shots = stats ? getTeamStat(stats, "Total Shots") ?? 0 : 0
        const goals = stats ? getTeamStat(stats, "Goals") ?? 0 : 0
        const goalsAllowed = stats ? getTeamStat(stats, "Goals Conceded") ?? 0 : 0
        const assists = stats ? getTeamStat(stats, "Goal Assists") ?? 0 : 0
        const fouls = stats ? getTeamStat(stats, "Total Fouls Conceded") ?? 0 : 0
        const yellowCards = stats ? getTeamStat(stats, "Yellow Cards") ?? 0 : 0
        const redCards = stats ? getTeamStat(stats, "Total Red Cards") ?? 0 : 0
        const totalCards = Number(yellowCards) + Number(redCards)

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
            groupName
        }
    }

    const knockoutTableData = useMemo(() => {
        if (!isKnockoutStage) return []
        
        return prismicTeams.map(team => buildTeamRowData(team)).sort((a, b) => {
            return placementOrder[a.placement] - placementOrder[b.placement]
        })
    }, [isKnockoutStage, prismicTeams, f30TeamStats, f1FixturesData, teamRecords, optaTeams])

    if (isKnockoutStage) {
        return (
            <div>
                <div className="flex gap-0">
                    <div className="border-r border-border/40">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Placement</TableHead>
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
                                            <ClubRankCell
                                                placement={row.placement}
                                                logo={row.team.data.logo}
                                                name={row.name}
                                                shortName={row.shortName}
                                                useShortName={isTablet}
                                                tournamentStatus={tournamentStatus}
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
                                                <TableCell colSpan={7} className="p-0 h-4">
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
                                <TableHead>Rank</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupData?.map((group, groupIndex) => (
                                <Fragment key={group.groupId}>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="p-0 h-8">
                                            <div className="relative h-full w-full">
                                                <LinePattern className="h-full w-full" patternSize={5} />
                                                <div className="absolute inset-0 flex items-center justify-start pl-3">
                                                    <span className="font-headers font-semibold text-xs text-muted-foreground bg-background px-2">{group.groupName}</span>
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
                                                <ClubRankCell
                                                    placement={row.placement}
                                                    logo={row.team.data.logo}
                                                    name={row.name}
                                                    shortName={row.shortName}
                                                    useShortName={isTablet}
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
                                        <TableCell colSpan={7} className="p-0 h-8">
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

