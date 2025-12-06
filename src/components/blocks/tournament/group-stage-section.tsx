import { Section } from "@/components/website-base/padding-containers"
import type { TeamDocument, BroadcastPartnersDocument } from "../../../../prismicio-types"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import type { F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { getGroupStageMatches, groupMatchesByDate } from "@/app/(website)/(subpages)/tournament/utils"
import { MatchDayBadge } from "@/components/blocks/tournament/match-day-badge"
import { getMatchTeams, normalizeOptaId } from "@/lib/opta/utils"
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link"
import { cn } from "@/lib/utils"
import { ClubStandingsTable } from "@/components/blocks/tournament/club-standings-table"
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { MatchHighlight } from "@/lib/supabase/queries/highlights"

type GroupStageSectionProps = {
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    prismicTeams: TeamDocument[]
    tournamentSlug: string
    matchSlugMap?: Map<string, string>
    compact?: boolean
    streamingLink?: string | null
    broadcastPartners?: BroadcastPartnersDocument[]
    f9FeedsMap?: Map<string, F9MatchResponse>
    f40Squads?: F40SquadsResponse | null
    tournamentStatus?: string
    teamRecords?: TeamRecord[]
    isKnockoutStage?: boolean
    recapVideosMap?: Map<string, MatchHighlight>
}

export function GroupStageSection({ 
    f3StandingsData, 
    f1FixturesData, 
    prismicTeams,
    tournamentSlug,
    matchSlugMap,
    compact = false,
    streamingLink,
    broadcastPartners,
    f9FeedsMap,
    f40Squads,
    tournamentStatus,
    teamRecords,
    isKnockoutStage = false,
    recapVideosMap
}: GroupStageSectionProps) {
    const groupStageMatches = getGroupStageMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const matchesByDay = groupMatchesByDate(groupStageMatches)
    const totalMatches = groupStageMatches.length

    if (totalMatches === 0) {
        return null
    }

    return (
        <Section padding="md" id="group-stage">
            <SectionHeading variant="split">
                <SectionHeadingHeading>
                    Group Stage
                </SectionHeadingHeading>
                <SectionHeadingText variant="lg" className="ml-0 md:ml-auto mt-auto">
                    {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'}
                </SectionHeadingText>
            </SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-12">
                <div className="col-span-1 md:col-span-2 self-start md:sticky md:top-default-sticky-distance">
                    <ClubStandingsTable
                        prismicTeams={prismicTeams}
                        f1FixturesData={f1FixturesData}
                        f3StandingsData={f3StandingsData}
                        f40Squads={f40Squads}
                        tournamentStatus={tournamentStatus}
                        isKnockoutStage={isKnockoutStage}
                        teamRecords={teamRecords}
                        button={
                            <Button asChild variant="outline" size="sm" className="text-foreground text-xxs lg:text-sm">
                                <Link href="#stat-sheet">Stat Sheet</Link>
                            </Button>
                        }
                    />
                </div>
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
                                            f9Feed={f9FeedsMap?.get(normalizeOptaId(match.uID))}
                                            streamingLink={streamingLink}
                                            broadcastPartners={broadcastPartners}
                                            recapVideo={recapVideosMap?.get(normalizeOptaId(match.uID))}
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

