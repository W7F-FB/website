import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { H4 } from "@/components/website-base/typography"
import Link from "next/link"
import { isFilled } from "@prismicio/client"
import { PrismicNextImage } from "@prismicio/next"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table"
import { ReplayIcon } from "@/components/website-base/icons"
import { normalizeOptaId } from "@/lib/opta/utils"
import { buildMatchUrl } from "@/lib/match-url"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NavigationMenuTournament } from "@/components/website-base/nav/nav-tournament-item"
import { cn } from "@/lib/utils"

const MAX_RECENT_RESULTS = 5
const TOP_PLACEMENT_THRESHOLD = 3

type SectionId = "team-stats" | "participation" | "recent-results"
type SectionRenderer = () => React.ReactNode

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
    standings?: F3StandingsResponse | null
    fixtures?: F1FixturesResponse | null
    currentTournament?: TournamentDocument | null
    prismicTeams?: TeamDocument[]
    tournamentDocuments?: TournamentDocument[]
    matchSlugMap?: Map<string, string>
}

export function TeamStatsCard({ team, standings, fixtures, currentTournament, prismicTeams = [], tournamentDocuments = [], matchSlugMap }: Props) {

    const teamStanding = team.data.opta_id
        ? standings?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings
            ?.flatMap(group => group.TeamRecord || [])
            .find(record => record.TeamRef === `t${team.data.opta_id}`)
        : undefined

    const wins = teamStanding?.Standing.Won || 0
    const losses = teamStanding?.Standing.Lost || 0
    const draws = teamStanding?.Standing.Drawn || 0
    const record = draws > 0 ? `${wins}-${losses}-${draws}` : `${wins}-${losses}`

    const goalsFor = teamStanding?.Standing.For || 0
    const goalsAgainst = teamStanding?.Standing.Against || 0
    const goalDifferential = goalsFor - goalsAgainst
    const goalDiffDisplay = goalDifferential >= 0 ? `+${goalDifferential}` : `${goalDifferential}`

    const finalPosition = teamStanding?.Standing.Position
    const isComplete = currentTournament?.data?.status === "Complete"
    const showPlacement = isComplete && finalPosition && finalPosition <= TOP_PLACEMENT_THRESHOLD

    const placementConfig = {
        1: { text: "1st Place", variant: "default" as const },
        2: { text: "2nd Place", variant: "secondary" as const },
        3: { text: "3rd Place", variant: "secondary" as const },
    }
    const placement = finalPosition && placementConfig[finalPosition as 1 | 2 | 3]

    const tournaments = useMemo(() => {
        if (tournamentDocuments.length > 0) {
            return tournamentDocuments
                .map(tournament => ({
                    tournament,
                    year: tournament.data?.start_date
                        ? new Date(tournament.data.start_date).getFullYear()
                        : null
                }))
                .filter((t): t is NonNullable<typeof t> => t.tournament !== null)
        }
        
        return team.data.tournaments
            ?.filter(item => isFilled.contentRelationship(item.tournament))
            .map(item => {
                if (!isFilled.contentRelationship(item.tournament)) return null
                return {
                    uid: item.tournament.uid || "",
                    title: item.tournament.data?.title || "Untitled Tournament",
                    year: item.tournament.data?.start_date
                        ? new Date(item.tournament.data.start_date).getFullYear()
                        : null
                }
            })
            .filter((t): t is NonNullable<typeof t> => t !== null) || []
    }, [team.data.tournaments, tournamentDocuments])

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

            const resultVariant = isWin ? "default" : isLoss ? "destructive" : "secondary"

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
                resultVariant,
                date: match.MatchInfo.Date,
                roundType: match.MatchInfo.RoundType
            }
        })
    }, [team.data.opta_id, fixtures, prismicTeams])

    const renderTeamStats = () => {
        if (!teamStanding) {
            return (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <th className="sr-only">Team Statistics</th>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-center py-4 text-sm text-muted-foreground">
                                No statistics available
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )
        }

        const rows = [
            { label: "Record", value: record },
            { label: "Goals", value: `${goalsFor} / ${goalsAgainst}` },
            { label: "Goal Differential", value: goalDiffDisplay },
        ]

        return (
            <Table>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.label}>
                            <TableCell className="text-sm text-muted-foreground w-1/2">
                                {row.label === "Record" ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="mt-0.5">{row.label}</span>
                                        <Tooltip>
                                            <TooltipTrigger className="size-3" />
                                            <TooltipContent header="Record">
                                                <p>Wins - Losses{teamStanding?.Standing.Drawn ? " - Draws" : ""}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                ) : row.label === "Goals" ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="mt-0.5">{row.label}</span>
                                        <Tooltip>
                                            <TooltipTrigger className="size-3" />
                                            <TooltipContent header="Goals">
                                                <p>Goals For / Goals Against</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                ) : row.label === "Goal Differential" ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="mt-0.5">{row.label}</span>
                                        <Tooltip>
                                            <TooltipTrigger className="size-3" />
                                            <TooltipContent header="Goal Differential">
                                                <p>Difference between goals scored and goals conceded</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                ) : (
                                    row.label
                                )}
                            </TableCell>
                            <TableCell className="text-right font-headers text-lg font-semibold">
                                {row.value}
                            </TableCell>
                        </TableRow>
                    ))}

                    {showPlacement && placement && (
                        <TableRow>
                            <TableCell className="text-sm text-muted-foreground">
                                Tournament Finish
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant={placement.variant} className="font-headers">
                                    {placement.text}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )
    }


    const renderParticipation = () => {
        if (tournaments.length === 0) {
            return (
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-center py-4 text-sm text-muted-foreground">
                                No tournament participation
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )
        }

        return (
            <div className="space-y-2">
                {tournaments.map((t, index) => {
                    const tournament = 'tournament' in t ? t.tournament : null
                    if (tournament) {
                        return (
                            <NavigationMenuTournament
                                key={tournament.id || index}
                                tournament={tournament}
                                className="min-h-24"
                            />
                        )
                    }
                    const fallbackTournament = t as { uid: string; title: string; year: number | null }
                    return (
                        <div key={fallbackTournament.uid || index} className="border border-border/50 p-3 rounded-none">
                            <Link
                                href={`/tournament/${fallbackTournament.uid}`}
                                className="font-medium hover:underline"
                            >
                                {fallbackTournament.title}
                            </Link>
                            {fallbackTournament.year && (
                                <div className="text-sm text-muted-foreground mt-1">
                                    {fallbackTournament.year}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderRecentResults = () => {
        if (recentResults.length === 0) {
            return (
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
            )
        }

        return (
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
        )
    }

    const renderers: Record<SectionId, SectionRenderer> = {
        "team-stats": renderTeamStats,
        "participation": renderParticipation,
        "recent-results": renderRecentResults,
    }

    const sidebarSections: Array<{ id: SectionId; title: string }> = [
        { id: "team-stats", title: "Team Statistics" },
        { id: "participation", title: "Tournaments" },
        { id: "recent-results", title: "Recent Results" },
    ]


    return (
        <Card banner>
            {sidebarSections.map((section) => (
                <div key={section.id}>
                    <CardHeader>
                        <CardTitle className="leading-normal">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderers[section.id]()}
                    </CardContent>
                </div>
            ))}
        </Card>
    )
}
