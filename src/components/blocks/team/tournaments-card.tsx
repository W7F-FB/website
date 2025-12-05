import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isFilled } from "@prismicio/client"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { Table, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { MatchResultItem } from "./match-result-item"

type Props = {
    team: TeamDocument
    tournamentDocuments?: TournamentDocument[]
    fixtures?: F1FixturesResponse | null
    prismicTeams?: TeamDocument[]
    matchSlugMap?: Map<string, string>
}

export function TournamentsCard({ team, tournamentDocuments = [], fixtures, prismicTeams = [], matchSlugMap }: Props) {
    const teamsMap = useMemo(() => 
        new Map(prismicTeams.map(t => [t.data.opta_id, t])),
        [prismicTeams]
    )

    const tournaments = useMemo(() => {
        if (tournamentDocuments.length > 0) {
            return tournamentDocuments.map(tournament => ({
                tournament,
                title: tournament.data?.title || "Untitled Tournament",
                year: tournament.data?.start_date
                    ? new Date(tournament.data.start_date).getFullYear()
                    : null
            }))
        }
        
        return team.data.tournaments
            ?.filter(item => isFilled.contentRelationship(item.tournament))
            .map(item => {
                if (!isFilled.contentRelationship(item.tournament)) return null
                return {
                    tournament: null,
                    title: item.tournament.data?.title || "Untitled Tournament",
                    year: item.tournament.data?.start_date
                        ? new Date(item.tournament.data.start_date).getFullYear()
                        : null
                }
            })
            .filter((t): t is NonNullable<typeof t> => t !== null) || []
    }, [team.data.tournaments, tournamentDocuments])

    const teamMatches = useMemo(() => {
        if (!team.data.opta_id) return []

        const teamOptaRef = `t${team.data.opta_id}`
        const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || []

        return allMatches
            .filter(match => match.TeamData.some(t => t.TeamRef === teamOptaRef))
            .sort((a, b) => {
                const dateA = new Date(a.MatchInfo.Date).getTime()
                const dateB = new Date(b.MatchInfo.Date).getTime()
                return dateA - dateB
            })
    }, [team.data.opta_id, fixtures])

    if (tournaments.length === 0) {
        return (
            <Card banner>
                <CardHeader>
                    <CardTitle className="leading-normal">Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-center py-4 text-sm text-muted-foreground">
                                    No tournament participation
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    const teamOptaRef = team.data.opta_id ? `t${team.data.opta_id}` : ""

    return (
        <Card banner className="w-full">
            <CardHeader>
                <CardTitle className="leading-normal">Tournaments</CardTitle>
            </CardHeader>
            <CardContent className="!p-0">
                <Accordion
                    type="single"
                    collapsible
                    defaultValue={tournaments[0]?.title || "tournament-0"}
                    className="w-full"
                >
                    <Separator variant="gradient" gradientDirection="toRight" />
                    {tournaments.map((t, index) => (
                        <AccordionItem key={t.title || index} value={t.title || `tournament-${index}`}>
                            <AccordionTrigger bgLines plusMinus iconClass="size-3" className="text-sm py-2.5 px-2 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-headers text-sm">{t.title}</span>
                                    <span className="text-muted-foreground text-xxs mt-0.5 font-body">
                                        ({teamMatches.length})
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="!p-0 !px-0">
                                {teamMatches.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <th className="sr-only">Status</th>
                                                <th className="sr-only">Opponent</th>
                                                <th className="sr-only">Score</th>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {teamMatches.map(match => {
                                                const opponentData = match.TeamData.find(t => t.TeamRef !== teamOptaRef)
                                                const opponentOptaId = opponentData?.TeamRef?.replace('t', '') || ""
                                                const opponentTeam = opponentOptaId ? teamsMap.get(opponentOptaId) : undefined
                                                const opponentName = opponentTeam?.data.name || opponentData?.TeamRef?.replace('t', 'Team ') || "Unknown"

                                                    return (
                                                        <MatchResultItem
                                                            key={match.uID}
                                                            match={match}
                                                            teamOptaRef={teamOptaRef}
                                                            opponentTeam={opponentTeam}
                                                            opponentName={opponentName}
                                                            currentTournament={t.tournament}
                                                            matchSlugMap={matchSlugMap}
                                                        />
                                                    )
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-4 text-sm text-muted-foreground">
                                                    No matches available
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
