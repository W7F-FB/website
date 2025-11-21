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

const MAX_RECENT_RESULTS = 5
const TOP_PLACEMENT_THRESHOLD = 3

type SectionId = "team-stats" | "participation" | "recent-results"
type SectionRenderer = () => React.ReactNode

function formatResultDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}

type Props = {
    team: TeamDocument
    standings?: F3StandingsResponse | null
    fixtures?: F1FixturesResponse | null
    currentTournament?: TournamentDocument | null
    prismicTeams?: TeamDocument[]
}

export function TeamStatsCard({ team, standings, fixtures, currentTournament, prismicTeams = [] }: Props) {

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
    }, [team.data.tournaments])

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
                const isCompleted = match.MatchInfo.Period === "FullTime" || match.MatchInfo.Period === "PostMatch"
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

            const isWin = teamScore > opponentScore
            const isLoss = teamScore < opponentScore

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
                date: match.MatchInfo.Date
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
                <TableHeader>
                    <TableRow>
                        <th className="sr-only">Statistic</th>
                        <th className="sr-only">Value</th>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.label}>
                            <TableCell className="text-sm text-muted-foreground w-1/2">
                                {row.label}
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
                    <TableHeader>
                        <TableRow>
                            <th className="sr-only">Tournament Participation</th>
                        </TableRow>
                    </TableHeader>
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <th className="sr-only">Tournament</th>
                        <th className="sr-only">Year</th>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tournaments.map(t => (
                        <TableRow key={t.uid}>
                            <TableCell>
                                <Link
                                    href={`/tournament/${t.uid}`}
                                    className="font-medium hover:underline"
                                >
                                    {t.title}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground w-24">
                                {t.year ?? "—"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
                        <TableRow key={result.matchId}>
                            <TableCell className="w-8">
                                <div className="text-muted-foreground font-headers text-base font-medium">
                                    {result.result}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">vs</span>
                                    <Link href={`/team/${result.opponentTeam?.uid}`} className="hover:underline">
                                        <H4 className="text-sm">
                                            {result.opponentName}
                                        </H4>
                                    </Link>
                                    {result.opponentTeam?.data.logo && (
                                        <div className="relative w-6 h-6 shrink-0">
                                            <PrismicNextImage field={result.opponentTeam.data.logo} fill className="object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {formatResultDate(result.date)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right flex items-center gap-2 justify-end">
                                <div className="text-sm font-headers font-semibold">
                                    {result.teamScore}-{result.opponentScore}
                                </div>
                                <div>
                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                                        <Link href={`/match/${result.matchId}`}>
                                            <ReplayIcon className="size-3" />
                                        </Link>
                                    </Button>
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
        { id: "participation", title: "Tournament Participation" },
        { id: "recent-results", title: "Recent Results" },
    ]


    return (
        <Card banner>
            {sidebarSections.map((section) => (
                <div key={section.id}>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderers[section.id]()}
                    </CardContent>
                </div>
            ))}
        </Card>
    )
}
