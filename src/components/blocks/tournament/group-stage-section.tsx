import { Section } from "@/components/website-base/padding-containers"
import type { TeamDocument } from "../../../../prismicio-types"
import { GroupList, GroupListPrismic } from "@/components/blocks/tournament/group-list"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { getGroupStageMatches, groupMatchesByDate, buildGroupsFromPrismic } from "@/app/(website)/(subpages)/tournament/utils"
import { MatchDayBadge } from "@/components/blocks/tournament/match-day-badge"
import { getMatchTeams } from "@/lib/opta/utils"
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link"
import { cn } from "@/lib/utils"

type GroupStageSectionProps = {
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    prismicTeams: TeamDocument[]
    tournamentSlug: string
    matchSlugMap?: Map<string, string>
    compact?: boolean
    streamingLink?: string | null
}

export function GroupStageSection({ 
    f3StandingsData, 
    f1FixturesData, 
    prismicTeams,
    tournamentSlug,
    matchSlugMap,
    compact = false,
    streamingLink
}: GroupStageSectionProps) {
    const groupStageMatches = getGroupStageMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const matchesByDay = groupMatchesByDate(groupStageMatches)
    const totalMatches = groupStageMatches.length

    return (
        <Section padding="md" id="results">
            <SectionHeading variant="split">
                <SectionHeadingHeading>
                    Group Stage
                </SectionHeadingHeading>
                <SectionHeadingText variant="lg" className="ml-0 md:ml-auto mt-auto">
                    {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'}
                </SectionHeadingText>
            </SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-12">
                <Card banner className="col-span-1 md:col-span-2 self-start md:sticky md:top-default-sticky-distance">
                    {f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings ? (
                        f3StandingsData.SoccerFeed.SoccerDocument.Competition.TeamStandings.map((groupStandings) => {
                            const groupName = groupStandings.Round?.Name.value || 'Unknown Group'
                            return (
                                <div key={groupStandings.Round?.Name.id || Math.random()}>
                                    <CardHeader>
                                        <CardTitle>{groupName}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <GroupList
                                            groupStandings={groupStandings}
                                            teams={f3StandingsData?.SoccerFeed?.SoccerDocument?.Team || []}
                                            prismicTeams={prismicTeams}
                                            matches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData || []}
                                        />
                                    </CardContent>
                                </div>
                            )
                        })
                    ) : (
                        buildGroupsFromPrismic(prismicTeams).map((group) => (
                            <div key={group.groupId}>
                                <CardHeader>
                                    <CardTitle>{group.groupName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GroupListPrismic teams={group.teams} />
                                </CardContent>
                            </div>
                        ))
                    )}
                </Card>
                <div className="col-span-1 md:col-span-5 space-y-18">
                    {Array.from(matchesByDay.entries()).map(([date, matches], index) => {
                        const columns = compact ? 3 : 2
                        const filledCellsInLastRow = matches.length % columns
                        const emptyCells = filledCellsInLastRow === 0 ? 0 : columns - filledCellsInLastRow
                        const isLastMatchDay = index === matchesByDay.size - 1
                        const nextMatchDayHref = isLastMatchDay ? "#knockout" : `#match-day-${index + 2}`

                        return (
                            <div key={date} id={`match-day-${index + 1}`} className="space-y-8">
                                <MatchDayBadge matchDay={index + 1} date={date} />
                                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", compact && "md:grid-cols-3")}>
                                    {matches.map((match) => (
                                        <MatchCard
                                            key={match.uID}
                                            fixture={match}
                                            prismicTeams={prismicTeams}
                                            optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                            tournamentSlug={tournamentSlug}
                                            matchSlugMap={matchSlugMap}
                                            compact={compact}
                                            allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                            f3StandingsData={f3StandingsData}
                                            streamingLink={streamingLink}
                                        />
                                    ))}
                                    {emptyCells > 0 && (
                                        <GridCellScrollLink
                                            href={nextMatchDayHref}
                                            className={cn(
                                                "col-span-1",
                                                emptyCells === 2 && "md:col-span-2 md:col-start-auto",
                                                emptyCells === 3 && "md:col-span-3 md:col-start-auto"
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Section>
    )
}

