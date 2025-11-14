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

type TeamStatsCardProps = {
    team: TeamDocument
    standings?: F3StandingsResponse | null
    fixtures?: F1FixturesResponse | null
    currentTournament?: TournamentDocument | null
    prismicTeams?: TeamDocument[]
}

export function TeamStatsCard({ team, standings, fixtures, currentTournament, prismicTeams = [] }: TeamStatsCardProps) {

    const teamStanding = standings?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings
        ?.flatMap(group => group.TeamRecord || [])
        .find(record => record.TeamRef === `t${team.data.opta_id}`)

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
    const showPlacement = isComplete && finalPosition && finalPosition <= 3

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
        const teamOptaRef = `t${team.data.opta_id}`
        const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || []

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
            .slice(0, 5)

        return completedMatches.map(match => {
            const teamData = match.TeamData.find(t => t.TeamRef === teamOptaRef)
            const opponentData = match.TeamData.find(t => t.TeamRef !== teamOptaRef)

            const teamScore = teamData?.Score ?? 0
            const opponentScore = opponentData?.Score ?? 0

            const isWin = teamScore > opponentScore
            const isLoss = teamScore < opponentScore
            const isDraw = teamScore === opponentScore

            const opponentOptaId = opponentData?.TeamRef?.replace('t', '') || ""
            const opponentTeam = prismicTeams.find(t => t.data.opta_id === opponentOptaId)
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
                <div className="text-center py-4">
                    <span className="text-sm text-muted-foreground">No statistics available</span>
                </div>
            )
        }

        const statItems = [
            { label: "Record", value: record },
            { label: "Goals", value: `${goalsFor} / ${goalsAgainst}` },
            { label: "Goal Differential", value: goalDiffDisplay },
        ]

        return (
            <div>
                {statItems.map((item, idx) => (
                    <div
                        key={item.label}
                        className={`flex items-center justify-between py-2.5 ${idx !== 0 ? "border-t border-muted/50" : ""
                            }`}
                    >
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-headers text-lg font-semibold">{item.value}</span>
                    </div>
                ))}

                {showPlacement && placement && (
                    <>
                        <div className="border-t border-muted/50 pt-4"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tournament Finish</span>
                            <Badge variant={placement.variant} className="font-headers">
                                {placement.text}
                            </Badge>
                        </div>
                    </>
                )}
            </div>
        )
    }


    const renderParticipation = () => {
        if (tournaments.length === 0) {
            return (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    No tournament participation
                </div>
            )
        }

        return (
            <div className="space-y-1">
                {tournaments.map((t) => (
                    <Link
                        key={t.uid}
                        href={`/tournament/${t.uid}`}
                        className="block group py-2 transition-colors hover:text-foreground"
                    >
                        <div className="text-sm font-medium group-hover:underline">
                            {t.title}
                        </div>
                        {t.year && (
                            <div className="text-sm text-muted-foreground mt-0.5">
                                {t.year}
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        )
    }

    const renderRecentResults = () => {
        if (recentResults.length === 0) {
            return (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    No recent results
                </div>
            )
        }

        return (
            <div className="space-y-2">
                {recentResults.map((result) => (
                    <div
                        key={result.matchId}
                        className="flex items-center justify-between py-2 border-b border-muted/30 last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="text-white/60 font-headers text-base font-medium min-w-[1.5rem]"
                            >
                                {result.result}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>
                                        vs
                                    </span>
                                    <Link href={`/team/${result.opponentTeam?.uid}`} className="hover:underline">
                                        <H4 className="text-sm">
                                            {result.opponentName}
                                        </H4>
                                    </Link>
                                    {result.opponentTeam?.data.logo && (
                                        <div className="relative w-6 h-6">
                                            <PrismicNextImage field={result.opponentTeam.data.logo} fill className="object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(result.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm font-headers font-semibold">
                            {result.teamScore}-{result.opponentScore}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderers: Record<string, () => React.ReactNode> = {
        "team-stats": renderTeamStats,
        "participation": renderParticipation,
        "recent-results": renderRecentResults,
    }

    const sidebarSections = [
        { id: "team-stats", title: "Team Statistics" },
        { id: "participation", title: "Tournament Participation" },
        { id: "recent-results", title: "Recent Results" },
    ]


    return (
        <Card className="p-0 gap-0 divide-y divide-muted/50">
            {sidebarSections.map((section) => (
                <div key={section.id}>
                    <CardHeader className="bg-muted/50 py-4 px-6">
                        <CardTitle className="font-headers text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 px-6">
                        {renderers[section.id]()}
                    </CardContent>
                </div>
            ))}
        </Card>
    )
}
