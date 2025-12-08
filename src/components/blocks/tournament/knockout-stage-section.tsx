import { Section } from "@/components/website-base/padding-containers"
import type { TeamDocument, BroadcastPartnersDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse, F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { MatchDayBadge } from "@/components/blocks/tournament/match-day-badge"
import { getMatchTeams, normalizeOptaId } from "@/lib/opta/utils"
import { Separator } from "@/components/ui/separator"
import { FastBanner } from "@/components/blocks/fast-banners"
import { ChampionsCard } from "@/components/blocks/tournament/champions-card"
import type { MatchHighlight } from "@/lib/supabase/queries/highlights"
import { ClubStandingsTable } from "@/components/blocks/tournament/club-standings-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9"

type KnockoutStageSectionProps = {
    semiFinalMatches: F1MatchData[]
    thirdPlaceMatches: F1MatchData[]
    finalMatches: F1MatchData[]
    f1FixturesData: F1FixturesResponse | null
    f3StandingsData: F3StandingsResponse | null
    prismicTeams: TeamDocument[]
    tournamentSlug: string
    matchSlugMap?: Map<string, string>
    compact?: boolean
    streamingLink?: string | null
    broadcastPartners?: BroadcastPartnersDocument[]
    f9FeedsMap?: Map<string, F9MatchResponse>
    recapVideosMap?: Map<string, MatchHighlight>
    liveKnockoutStage?: boolean
    tournamentStatus?: string
    teamRecords?: TeamRecord[]
}

export function KnockoutStageSection({ 
    semiFinalMatches,
    thirdPlaceMatches,
    finalMatches,
    f1FixturesData,
    f3StandingsData,
    prismicTeams,
    tournamentSlug,
    matchSlugMap,
    compact = false,
    streamingLink,
    broadcastPartners,
    f9FeedsMap,
    recapVideosMap,
    liveKnockoutStage = false,
    tournamentStatus,
    teamRecords
}: KnockoutStageSectionProps) {
    const sortedSemiFinalMatches = [...semiFinalMatches].sort((a, b) => {
        const dateA = a.MatchInfo?.Date ? new Date(a.MatchInfo.Date).getTime() : 0
        const dateB = b.MatchInfo?.Date ? new Date(b.MatchInfo.Date).getTime() : 0
        return dateA - dateB
    })

    const knockoutMatches = semiFinalMatches.length + thirdPlaceMatches.length + finalMatches.length
    const knockoutDate = sortedSemiFinalMatches[0]?.MatchInfo?.Date
        || thirdPlaceMatches[0]?.MatchInfo?.Date
        || finalMatches[0]?.MatchInfo?.Date

    const allMatchesFullTime = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData?.every(match => 
        match.MatchInfo.Period === 'FullTime'
    )

    if (liveKnockoutStage) {
        return (
            <Section padding="md" id="knockout">
                <SectionHeading variant="split">
                    <SectionHeadingHeading>
                        Knockout Stage
                    </SectionHeadingHeading>
                    <SectionHeadingText variant="lg" className="ml-0 md:ml-auto mt-auto">
                        {knockoutMatches} {knockoutMatches === 1 ? 'Match' : 'Matches'}
                    </SectionHeadingText>
                </SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-12">
                    <div className="col-span-1 md:col-span-2 self-start md:sticky md:top-default-sticky-distance">
                        <ClubStandingsTable
                            prismicTeams={prismicTeams}
                            f1FixturesData={f1FixturesData}
                            f3StandingsData={f3StandingsData}
                            tournamentStatus={tournamentStatus}
                            isKnockoutStage={true}
                            teamRecords={teamRecords}
                            f9FeedsMap={f9FeedsMap}
                            button={
                                <Button asChild variant="outline" size="sm" className="text-foreground text-xxs lg:text-sm">
                                    <Link href="#stat-sheet">Stat Sheet</Link>
                                </Button>
                            }
                        />
                    </div>
                    <div className="col-span-1 md:col-span-5 space-y-8">
                        <MatchDayBadge label="Knockout Stage" date={knockoutDate ? knockoutDate.split(' ')[0] : null} />
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sortedSemiFinalMatches[0] && (
                                    <MatchCard
                                        fixture={sortedSemiFinalMatches[0]}
                                        prismicTeams={prismicTeams}
                                        optaTeams={getMatchTeams(sortedSemiFinalMatches[0], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        tournamentSlug={tournamentSlug}
                                        matchSlugMap={matchSlugMap}
                                        compact={compact}
                                        banner="Semi Final 1"
                                        f9Feed={f9FeedsMap?.get(normalizeOptaId(sortedSemiFinalMatches[0].uID))}
                                        streamingLink={streamingLink}
                                        broadcastPartners={broadcastPartners}
                                        recapVideo={recapVideosMap?.get(normalizeOptaId(sortedSemiFinalMatches[0].uID))}
                                    />
                                )}
                                {sortedSemiFinalMatches[1] && (
                                    <MatchCard
                                        fixture={sortedSemiFinalMatches[1]}
                                        prismicTeams={prismicTeams}
                                        optaTeams={getMatchTeams(sortedSemiFinalMatches[1], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        tournamentSlug={tournamentSlug}
                                        matchSlugMap={matchSlugMap}
                                        compact={compact}
                                        banner="Semi Final 2"
                                        f9Feed={f9FeedsMap?.get(normalizeOptaId(sortedSemiFinalMatches[1].uID))}
                                        streamingLink={streamingLink}
                                        broadcastPartners={broadcastPartners}
                                        recapVideo={recapVideosMap?.get(normalizeOptaId(sortedSemiFinalMatches[1].uID))}
                                    />
                                )}
                            </div>
                            {thirdPlaceMatches.map((match) => (
                                <MatchCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    tournamentSlug={tournamentSlug}
                                    matchSlugMap={matchSlugMap}
                                    compact={compact}
                                    banner="Third Place Match"
                                    f9Feed={f9FeedsMap?.get(normalizeOptaId(match.uID))}
                                    streamingLink={streamingLink}
                                    broadcastPartners={broadcastPartners}
                                    recapVideo={recapVideosMap?.get(normalizeOptaId(match.uID))}
                                />
                            ))}
                            <Separator variant="gradient" className="my-12" />
                            {finalMatches.map((match) => (
                                <MatchCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    tournamentSlug={tournamentSlug}
                                    matchSlugMap={matchSlugMap}
                                    compact={compact}
                                    banner="The Final"
                                    f9Feed={f9FeedsMap?.get(normalizeOptaId(match.uID))}
                                    streamingLink={streamingLink}
                                    broadcastPartners={broadcastPartners}
                                    recapVideo={recapVideosMap?.get(normalizeOptaId(match.uID))}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        )
    }

    return (
        <Section padding="md" id="knockout">
            <SectionHeading variant="split">
                <SectionHeadingHeading>
                    Knockout Stage
                </SectionHeadingHeading>
                <SectionHeadingText variant="lg" className="ml-0 md:ml-auto mt-auto">
                    {knockoutMatches} {knockoutMatches === 1 ? 'Match' : 'Matches'}
                </SectionHeadingText>
            </SectionHeading>
            <MatchDayBadge matchDay={3} date={knockoutDate ? knockoutDate.split(' ')[0] : null} className="mb-8" />
            <div className="flex justify-center items-start gap-8">
                <FastBanner text="FAST." position="left" strokeWidth="1px" uppercase className="hidden md:block" />
                <div className="max-w-3xl w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sortedSemiFinalMatches[0] && (
                            <MatchCard
                                fixture={sortedSemiFinalMatches[0]}
                                prismicTeams={prismicTeams}
                                optaTeams={getMatchTeams(sortedSemiFinalMatches[0], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                tournamentSlug={tournamentSlug}
                                matchSlugMap={matchSlugMap}
                                compact={compact}
                                banner="Semi Final 1"
                                f9Feed={f9FeedsMap?.get(normalizeOptaId(sortedSemiFinalMatches[0].uID))}
                                streamingLink={streamingLink}
                                broadcastPartners={broadcastPartners}
                                recapVideo={recapVideosMap?.get(normalizeOptaId(sortedSemiFinalMatches[0].uID))}
                            />
                        )}
                        {sortedSemiFinalMatches[1] && (
                            <MatchCard
                                fixture={sortedSemiFinalMatches[1]}
                                prismicTeams={prismicTeams}
                                optaTeams={getMatchTeams(sortedSemiFinalMatches[1], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                tournamentSlug={tournamentSlug}
                                matchSlugMap={matchSlugMap}
                                compact={compact}
                                banner="Semi Final 2"
                                f9Feed={f9FeedsMap?.get(normalizeOptaId(sortedSemiFinalMatches[1].uID))}
                                streamingLink={streamingLink}
                                broadcastPartners={broadcastPartners}
                                recapVideo={recapVideosMap?.get(normalizeOptaId(sortedSemiFinalMatches[1].uID))}
                            />
                        )}
                    </div>
                    {thirdPlaceMatches.map((match) => (
                        <MatchCard
                            key={match.uID}
                            fixture={match}
                            prismicTeams={prismicTeams}
                            optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                            tournamentSlug={tournamentSlug}
                            matchSlugMap={matchSlugMap}
                            compact={compact}
                            banner="Third Place Match"
                            f9Feed={f9FeedsMap?.get(normalizeOptaId(match.uID))}
                            streamingLink={streamingLink}
                            broadcastPartners={broadcastPartners}
                            recapVideo={recapVideosMap?.get(normalizeOptaId(match.uID))}
                        />
                    ))}
                    <Separator variant="gradient" className="my-12" />
                    {finalMatches.map((match) => (
                        <MatchCard
                            key={match.uID}
                            fixture={match}
                            prismicTeams={prismicTeams}
                            optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                            tournamentSlug={tournamentSlug}
                            matchSlugMap={matchSlugMap}
                            compact={compact}
                            banner="The Final"
                            f9Feed={f9FeedsMap?.get(normalizeOptaId(match.uID))}
                            streamingLink={streamingLink}
                            broadcastPartners={broadcastPartners}
                            recapVideo={recapVideosMap?.get(normalizeOptaId(match.uID))}
                        />
                    ))}
                    {allMatchesFullTime && (
                        <ChampionsCard
                            finalMatch={finalMatches[0] || null}
                            finalMatchF9={f9FeedsMap?.get(normalizeOptaId(finalMatches[0]?.uID || ''))}
                            prismicTeams={prismicTeams}
                            f1FixturesData={f1FixturesData}
                        />
                    )}
                </div>
                <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden md:block" />
            </div>
        </Section>
    )
}

