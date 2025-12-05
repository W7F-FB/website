import { Section } from "@/components/website-base/padding-containers"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse, F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { MatchDayBadge } from "@/components/blocks/tournament/match-day-badge"
import { getMatchTeams } from "@/lib/opta/utils"
import { Separator } from "@/components/ui/separator"
import { FastBanner } from "@/components/blocks/fast-banners"
import { ChampionsCard } from "@/components/blocks/tournament/champions-card"

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
    streamingLink
}: KnockoutStageSectionProps) {
    const knockoutMatches = semiFinalMatches.length + thirdPlaceMatches.length + finalMatches.length
    const knockoutDate = semiFinalMatches[0]?.MatchInfo?.Date
        || thirdPlaceMatches[0]?.MatchInfo?.Date
        || finalMatches[0]?.MatchInfo?.Date

    const allMatchesFullTime = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData?.every(match => 
        match.MatchInfo.Period === 'FullTime'
    )

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
                        {semiFinalMatches[0] && (
                            <MatchCard
                                fixture={semiFinalMatches[0]}
                                prismicTeams={prismicTeams}
                                optaTeams={getMatchTeams(semiFinalMatches[0], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                tournamentSlug={tournamentSlug}
                                matchSlugMap={matchSlugMap}
                                compact={compact}
                                banner="Semi Final 1"
                                allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                f3StandingsData={f3StandingsData}
                                streamingLink={streamingLink}
                            />
                        )}
                        {semiFinalMatches[1] && (
                            <MatchCard
                                fixture={semiFinalMatches[1]}
                                prismicTeams={prismicTeams}
                                optaTeams={getMatchTeams(semiFinalMatches[1], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                tournamentSlug={tournamentSlug}
                                matchSlugMap={matchSlugMap}
                                compact={compact}
                                banner="Semi Final 2"
                                allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                f3StandingsData={f3StandingsData}
                                streamingLink={streamingLink}
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
                            allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                            f3StandingsData={f3StandingsData}
                            streamingLink={streamingLink}
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
                            allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                            f3StandingsData={f3StandingsData}
                            streamingLink={streamingLink}
                        />
                    ))}
                    {allMatchesFullTime && (
                        <ChampionsCard
                            finalMatches={finalMatches}
                            f1FixturesData={f1FixturesData}
                            prismicTeams={prismicTeams}
                        />
                    )}
                </div>
                <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden md:block" />
            </div>
        </Section>
    )
}

