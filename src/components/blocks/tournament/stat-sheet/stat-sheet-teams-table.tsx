'use client';

import { Fragment, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { getTeamStat } from "@/types/opta-feeds/f30-season-stats"
import { PrismicNextImage } from "@prismicio/next"
import { cn } from "@/lib/utils"
import { getFinalMatch, getThirdPlaceMatch, calculateTeamRecordsFromMatches } from "@/app/(website)/(subpages)/tournament/utils"
import { LinePattern } from "@/components/blocks/line-pattern"

type StatSheetTeamsTableProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    f1FixturesData: F1FixturesResponse | null
}

export function StatSheetTeamsTable({ prismicTeams, f30TeamStats, f1FixturesData }: StatSheetTeamsTableProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)

    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
    const finalMatch = finalMatches[0]
    const thirdPlaceMatch = thirdPlaceMatches[0]
    
    const teamRecords = calculateTeamRecordsFromMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    
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
        const stats = optaId ? f30TeamStats.get(optaId) : null
        const teamId = optaId ? `t${optaId}` : null
        const record = teamId ? teamRecords.get(teamId) : null

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

        return {
            team,
            name: team.data.name || '',
            placement: getPlacement(optaId),
            gamesPlayed,
            wins,
            losses,
            shots,
            goals,
            goalsAllowed,
            assists,
            fouls,
            cards: totalCards
        }
    }).sort((a, b) => {
        return placementOrder[a.placement] - placementOrder[b.placement]
    })

    return (
        <div className="flex gap-0">
            <div className="border-r border-border/40">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Placement</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <Fragment key={row.team.id}>
                                <TableRow 
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={cn(hoveredRow === index && "bg-muted/30 hover:bg-muted/30")}
                                >
                                    <TableCell className="h-12 py-0 font-medium font-headers pr-10">
                                        <div className="flex items-center gap-3">
                                            <span className={cn("text-muted-foreground text-xs w-8", row.placement === 'E' && "text-muted-foreground/80")}>{row.placement}</span>
                                            {row.team.data.logo && (
                                                <div className="relative size-7 flex-shrink-0">
                                                    <PrismicNextImage
                                                        field={row.team.data.logo}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )}
                                            <span>{row.name}</span>
                                        </div>
                                    </TableCell>
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
                        {tableData.map((row, index) => (
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
                                            <LinePattern className="h-full w-full" patternSize={7} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

