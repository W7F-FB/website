import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import Link from "next/link"
import { PrismicNextImage } from "@prismicio/next"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table"
import { ReplayIcon } from "@/components/website-base/icons"
import { normalizeOptaId } from "@/lib/opta/utils"
import { buildMatchUrl } from "@/lib/match-url"
import { cn } from "@/lib/utils"

const MAX_RECENT_RESULTS = 5

function formatResultDate(date: string, roundType?: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
    
    if (!roundType) return formattedDate
    
    let matchType = ""
    if (roundType === "Semi-Finals") {
        matchType = "Semifinals"
    } else if (roundType === "3rd and 4th Place") {
        matchType = "Third place match"
    } else if (roundType === "Final") {
        matchType = "Final"
    }
    
    return matchType ? `${formattedDate}, ${matchType}` : formattedDate
}

type Props = {
    team: TeamDocument
    fixtures?: F1FixturesResponse | null
    currentTournament?: TournamentDocument | null
    prismicTeams?: TeamDocument[]
    matchSlugMap?: Map<string, string>
}

export function RecentResultsCard({ team, fixtures, currentTournament, prismicTeams = [], matchSlugMap }: Props) {
    const recentResults = useMemo(() => {
        if (!team.data.opta_id) return []

        const teamOptaRef = `t${team.data.opta_id}`
        const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || []

        const teamsMap = new Map(
            prismicTeams.map(t => [t.data.opta_id, t])
        )

        const completedMatches = allMatches
            .filter(match => {
                const isTeamInMatch = match.TeamData.some(team => team.TeamRef === teamOptaRef)
                const isCompleted = match.MatchInfo.Period === "FullTime"
                return isTeamInMatch && isCompleted
            })
            .sort((a, b) => {
                const dateA = new Date(a.MatchInfo.Date).getTime()
                const dateB = new Date(b.MatchInfo.Date).getTime()
                return dateB - dateA
            })
            .slice(0, MAX_RECENT_RESULTS)

        return completedMatches.map(match => {
            const teamData = match.TeamData.find(t => t.TeamRef === teamOptaRef)
            const opponentData = match.TeamData.find(t => t.TeamRef !== teamOptaRef)

            const teamScore = teamData?.Score ?? 0
            const opponentScore = opponentData?.Score ?? 0

            const gameWinner = match.MatchInfo.GameWinner || match.MatchInfo.MatchWinner
            const isWin = gameWinner === teamOptaRef
            const isLoss = gameWinner === opponentData?.TeamRef

            const opponentOptaId = opponentData?.TeamRef?.replace('t', '') || ""
            const opponentTeam = opponentOptaId ? teamsMap.get(opponentOptaId) : undefined
            const opponentName = opponentTeam?.data.name || opponentData?.TeamRef?.replace('t', 'Team ') || "Unknown"

            return {
                matchId: match.uID,
                opponentRef: opponentData?.TeamRef || "",
                opponentName,
                opponentTeam,
                teamScore,
                opponentScore,
                result: isWin ? "W" : isLoss ? "L" : "D",
                isWin,
                isLoss,
                isDraw: false,
                date: match.MatchInfo.Date,
                roundType: match.MatchInfo.RoundType
            }
        })
    }, [team.data.opta_id, fixtures, prismicTeams])

    if (recentResults.length === 0) {
        return (
            <Card banner>
                <CardHeader>
                    <CardTitle className="leading-normal">Recent Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <th className="sr-only">Recent Results</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-sm text-muted-foreground">
                                    No recent results
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card banner>
            <CardHeader>
                <CardTitle className="leading-normal">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <th className="sr-only">Result</th>
                            <th className="sr-only">Opponent</th>
                            <th className="sr-only">Score</th>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentResults.map((result) => (
                            <TableRow key={result.matchId} className="relative">
                                <div className={cn(
                                    "absolute h-full top-0 bottom-0 left-0 w-1 bg-linear-to-r to-transparent",
                                    result.isWin && "from-primary/50",
                                    result.isLoss && "from-destructive/50",
                                    !result.isWin && !result.isLoss && "from-secondary/50"
                                )} />
                                <TableCell className="w-10 md:w-12 px-2 md:px-4">
                                    <span className="font-headers font-semibold text-xs md:text-sm pl-1 md:pl-2">
                                        {result.result}
                                    </span>
                                </TableCell>
                                <TableCell className="min-w-0 px-2 md:px-4">
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <span className="text-muted-foreground text-xs md:text-sm shrink-0 hidden md:inline">vs</span>
                                        <div className="min-w-0 flex-1 md:flex-none">
                                            <H4 className="text-xs md:text-sm truncate">
                                                {result.opponentName}
                                            </H4>
                                        </div>
                                        {result.opponentTeam?.data.logo && (
                                            <div className="relative w-4 h-4 md:w-6 md:h-6 shrink-0">
                                                <PrismicNextImage field={result.opponentTeam.data.logo} fill className="object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5 truncate md:truncate-none">
                                        {formatResultDate(result.date, result.roundType)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right align-middle px-2 md:px-4">
                                    <div className="flex items-center gap-1 md:gap-2 justify-end">
                                        <div className="text-xs md:text-sm font-headers font-semibold whitespace-nowrap">
                                            {result.teamScore}-{result.opponentScore}
                                        </div>
                                        {currentTournament && (
                                            <div className="shrink-0">
                                                <Button size="sm" variant="outline" className="h-6 md:h-7 px-1 md:px-2 text-xs gap-1" asChild>
                                                    <Link href={matchSlugMap?.get(normalizeOptaId(result.matchId)) 
                                                        ? buildMatchUrl(currentTournament.uid, matchSlugMap.get(normalizeOptaId(result.matchId))!) 
                                                        : `/tournament/${currentTournament.uid}`}>
                                                        <ReplayIcon className="size-2.5 md:size-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

