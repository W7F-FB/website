import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument, BlogDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { getSemiFinalMatches, getThirdPlaceMatch, getFinalMatch, calculateTournamentStatus, getEarliestMatchDate, isInKnockoutStage } from "./utils"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { Separator } from "@/components/ui/separator"
import { isFilled } from "@prismicio/client"
import { StatSheetTabs } from "@/components/blocks/tournament/stat-sheet/stat-sheet-tabs"
import { TournamentStatus } from "@/components/blocks/tournament/tournament-status"
import { TuneInBanner } from "@/components/blocks/tune-in-banner"
import { GroupStageSection } from "@/components/blocks/tournament/group-stage-section"
import { KnockoutStageSection } from "@/components/blocks/tournament/knockout-stage-section"
import { ClubStandingsTable } from "@/components/blocks/tournament/club-standings-table"
import { ClubList } from "@/components/blocks/clubs/club-list"
import type { BroadcastPartnersDocument } from "../../../../../prismicio-types"
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9"
import type { TeamStatSheet } from "@/lib/v2-utils/team-stat-sheet-from-f9"
import type { MatchHighlight } from "@/lib/supabase/queries/highlights"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    teamStatSheets: Map<string, TeamStatSheet>
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    prismicTeams: TeamDocument[]
    matchSlugMap?: Map<string, string>
    compact?: boolean
    dazn?: BroadcastPartnersDocument | null
    tnt?: BroadcastPartnersDocument | null
    truTV?: BroadcastPartnersDocument | null
    hboMax?: BroadcastPartnersDocument | null
    vix?: BroadcastPartnersDocument | null
    tudn?: BroadcastPartnersDocument | null
    espn?: BroadcastPartnersDocument | null
    disneyPlus?: BroadcastPartnersDocument | null
    f9FeedsMap?: Map<string, F9MatchResponse>
    teamRecords?: TeamRecord[]
    recapVideosMap?: Map<string, MatchHighlight>
}

export default function TournamentPageLive({ tournament, tournamentBlogs, f3StandingsData, f1FixturesData, teamStatSheets, f30TeamStats, prismicTeams, matchSlugMap, compact = false, dazn, tnt, truTV, hboMax, vix, tudn, espn, disneyPlus, f9FeedsMap, teamRecords, recapVideosMap }: Props) {
    const semiFinalMatches = getSemiFinalMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)

    const allMatches = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData
    const tournamentStatus = calculateTournamentStatus(allMatches)
    const earliestMatchDate = getEarliestMatchDate(allMatches)
    const knockoutStage = isInKnockoutStage(allMatches)
    
    const broadcastPartners = [dazn, tnt, truTV, hboMax, vix, tudn, espn, disneyPlus].filter((p): p is BroadcastPartnersDocument => p !== null && p !== undefined)

    return (
        <div>
            <PaddingGlobal>
            <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <TournamentStatus 
                        status={tournamentStatus} 
                        targetDate={earliestMatchDate} 
                        className="text-lg mb-5 gap-3" 
                    />
                    <H1 className="uppercase">{tournament.data.title}</H1>
                    <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
                    {isFilled.number(tournament.data.prize_pool) && (
                        <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
                    )}
                    <div className="mt-8 flex justify-start">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Button asChild size="skew_lg" className="clip-chop-sm">
                                <Link href="/checkout"><span>Purchase Tickets</span></Link>
                            </Button>
                            <Button asChild size="skew_lg" variant="outline">
                                <Link href={knockoutStage ? "#knockout" : "#group-stage"}><span>Matches</span></Link>
                            </Button>
                        </div>
                    </div>
                </SubpageHeroContent>
                {tournament.data.hero_image && (
                    <SubpageHeroMedia>
                        <PrismicNextImage
                            field={tournament.data.hero_image}
                            fill
                            className="object-cover object-left"
                        />
                    </SubpageHeroMedia>
                )}
            </SubpageHero>
            <div className="mt-4" id="tune-in">
                <TuneInBanner 
                    dazn={dazn}
                    tnt={tnt}
                    truTV={truTV}
                    hboMax={hboMax}
                    vix={vix}
                    tudn={tudn}
                    espn={espn}
                    disneyPlus={disneyPlus}
                />
            </div>

            <Container maxWidth="lg">
                {knockoutStage && (
                    <KnockoutStageSection
                        semiFinalMatches={semiFinalMatches}
                        thirdPlaceMatches={thirdPlaceMatches}
                        finalMatches={finalMatches}
                        f1FixturesData={f1FixturesData}
                        f3StandingsData={f3StandingsData}
                        prismicTeams={prismicTeams}
                        tournamentSlug={tournament.uid}
                        matchSlugMap={matchSlugMap}
                        compact={compact}
                        streamingLink={dazn?.data.streaming_link}
                        broadcastPartners={broadcastPartners}
                        f9FeedsMap={f9FeedsMap}
                        recapVideosMap={recapVideosMap}
                        liveKnockoutStage={knockoutStage}
                        tournamentStatus={tournament.data.status ?? undefined}
                        teamRecords={teamRecords}
                    />
                )}
                <GroupStageSection
                    f3StandingsData={f3StandingsData}
                    f1FixturesData={f1FixturesData}
                    prismicTeams={prismicTeams}
                    tournamentSlug={tournament.uid}
                    matchSlugMap={matchSlugMap}
                    compact={compact}
                    streamingLink={dazn?.data.streaming_link}
                    broadcastPartners={broadcastPartners}
                    f9FeedsMap={f9FeedsMap}
                    tournamentStatus={tournament.data.status ?? undefined}
                    teamRecords={teamRecords}
                    isKnockoutStage={knockoutStage}
                    recapVideosMap={recapVideosMap}
                    liveKnockoutStage={knockoutStage}
                />
                {!knockoutStage && (
                    <KnockoutStageSection
                        semiFinalMatches={semiFinalMatches}
                        thirdPlaceMatches={thirdPlaceMatches}
                        finalMatches={finalMatches}
                        f1FixturesData={f1FixturesData}
                        f3StandingsData={f3StandingsData}
                        prismicTeams={prismicTeams}
                        tournamentSlug={tournament.uid}
                        matchSlugMap={matchSlugMap}
                        compact={compact}
                        streamingLink={dazn?.data.streaming_link}
                        broadcastPartners={broadcastPartners}
                        f9FeedsMap={f9FeedsMap}
                        recapVideosMap={recapVideosMap}
                    />
                )}
                <Section padding="md">
                    <ClubList tournament={tournament} />
                </Section>
                <Section padding="md" id="stat-sheet">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">
                            Stat Sheet
                        </SectionHeadingHeading>
                    </SectionHeading>
                    
                    <StatSheetTabs prismicTeams={prismicTeams} teamStatSheets={teamStatSheets} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} f3StandingsData={f3StandingsData} tournamentStatus={tournament.data.status ?? undefined} isKnockoutStage={knockoutStage} f9FeedsMap={f9FeedsMap} />
                </Section>
                {tournamentBlogs.length > 0 && (
                    <>
                        <Section padding="md">
                            <Separator variant="gradient" />
                        </Section>
                        <Section padding="md">
                            <SectionHeading variant="split">
                                <SectionHeadingSubtitle>
                                    Latest Coverage
                                </SectionHeadingSubtitle>
                                <SectionHeadingHeading>
                                    Tournament News
                                </SectionHeadingHeading>
                                <Button asChild size="skew" variant="outline" className="w-fit ml-0 md:ml-auto mt-auto">
                                    <PrismicLink href="/news"><span>All News</span></PrismicLink>
                                </Button>
                            </SectionHeading>
                            <PostGrid posts={tournamentBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
                        </Section>
                    </>
                )}
            </Container>
        </div>
        </PaddingGlobal>
        </div>
    )
}
