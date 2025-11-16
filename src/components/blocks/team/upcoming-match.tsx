import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchCard } from "@/components/blocks/match/match-card"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed"

type UpcomingMatchProps = {
    team: TeamDocument
    fixtures?: F1FixturesResponse | null
    prismicTeams?: TeamDocument[]
    optaTeams?: F40Team[]
}

export function UpcomingMatch({ team, fixtures, prismicTeams = [], optaTeams = [] }: UpcomingMatchProps) {
    const teamOptaRef = `t${team.data.opta_id}`
    const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || []

    const upcomingMatches = allMatches
        .filter(match => {
            const isTeamInMatch = match.TeamData.some(team => team.TeamRef === teamOptaRef)
            const isUpcoming = match.MatchInfo.Period === "PreMatch"
            return isTeamInMatch && isUpcoming
        })
        .sort((a, b) => {
            const dateA = new Date(a.MatchInfo.Date).getTime()
            const dateB = new Date(b.MatchInfo.Date).getTime()
            return dateA - dateB
        })

    const nextMatch = upcomingMatches[0]

    return (
        <Card banner className="bg-card/50 border-muted/50">
            <CardHeader>
                <CardTitle>Upcoming Match</CardTitle>
            </CardHeader>
            <CardContent>
                {nextMatch ? (
                    <MatchCard
                        fixture={nextMatch}
                        prismicTeams={prismicTeams}
                        optaTeams={optaTeams}
                        className="bg-transparent border-0"
                    />
                ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        No upcoming matches scheduled
                    </div>
                )}
            </CardContent>
        </Card>
    )
}