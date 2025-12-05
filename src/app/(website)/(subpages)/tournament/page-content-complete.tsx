import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument, BlogDocument, TournamentDocumentDataAwardsItem, BroadcastPartnersDocument } from "../../../../../prismicio-types"
import type * as prismic from "@prismicio/client"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CaretRightIcon } from "@/components/website-base/icons"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { getPlayerByName } from "@/types/opta-feeds/f30-season-stats"
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { getSemiFinalMatches, getThirdPlaceMatch, getFinalMatch } from "./utils"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { Separator } from "@/components/ui/separator"
import { PostBanner } from "@/components/blocks/posts/post"
import { isFilled } from "@prismicio/client"
import { VideoBanner } from "@/components/blocks/video-banner/video-banner"
import { PlayerAwardCard } from "@/components/blocks/players/player-award-card"
import { StatSheetTabs } from "@/components/blocks/tournament/stat-sheet/stat-sheet-tabs"
import { GroupStageSection } from "@/components/blocks/tournament/group-stage-section"
import { KnockoutStageSection } from "@/components/blocks/tournament/knockout-stage-section"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    prismicTeams: TeamDocument[]
    matchSlugMap?: Map<string, string>
    awards: NonNullable<AwardData>[]
    compact?: boolean
    dazn?: BroadcastPartnersDocument | null
}

export default function TournamentPagePast({ tournament, tournamentBlogs, f3StandingsData, f1FixturesData, f30TeamStats, prismicTeams, matchSlugMap, awards, compact = false, dazn }: Props) {
    const semiFinalMatches = getSemiFinalMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)

    return (
        <div>
            <PaddingGlobal>
            <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>{tournament.data.nickname || "Results"}</Subtitle>
                    <H1 className="uppercase">{tournament.data.title}</H1>
                    <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
                    {isFilled.number(tournament.data.prize_pool) && (
                        <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
                    )}
                    <div className="mt-8 flex justify-start">
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild size="skew_lg" className="clip-chop-sm">
                                <Link href="#results"><span>Results</span></Link>
                            </Button>
                            <Button asChild size="skew_lg" variant="outline">
                                <Link href="#stat-sheet"><span>Stat Sheet</span></Link>
                            </Button>
                        </div>
                    </div>
                </SubpageHeroContent>
                {tournament.data.hero_image && (
                    <SubpageHeroMedia>
                        <PrismicNextImage
                            field={tournament.data.hero_image}
                            fill
                            className="object-cover"
                        />
                        <SubpageHeroMediaBanner>
                            <P noSpace><span>Event #2 is coming to Fort Lauderdale, FL</span>
                                <br />
                                <span>Dec 5-7, 2025
                                    <Button asChild variant="link" size="sm" className=" ml-3 p-0 h-auto !px-0">
                                        <Link href="/tournament/fort-lauderdale">
                                            Learn More
                                            <CaretRightIcon className="size-3 mt-px" />
                                        </Link>
                                    </Button>
                                </span></P>
                        </SubpageHeroMediaBanner>
                    </SubpageHeroMedia>
                )}
            </SubpageHero>
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 mt-8">
                {isFilled.contentRelationship(tournament.data.recap) && tournament.data.recap.data && (
                    <div className="col-span-1 md:col-span-2">
                        <PostBanner blog={{
                            slug: tournament.data.recap.uid ?? "",
                            title: tournament.data.recap.data.title ?? "Untitled",
                            excerpt: tournament.data.recap.data.excerpt ?? null,
                            image: tournament.data.recap.data.image?.url ?? undefined,
                            category: tournament.data.recap.data.category ?? null,
                            author: tournament.data.recap.data.author ?? null,
                            date: tournament.data.recap.data.date ?? null,
                        }} />
                    </div>
                )}
                {tournament.data.highlight_reel_link && typeof tournament.data.highlight_reel_link === 'string' && (
                    <div className="col-span-1 md:h-full">
                        <VideoBanner
                            thumbnail="/images/static-media/video-banner.avif"
                            videoUrl={tournament.data.highlight_reel_link}
                            label="Recap the action"
                            className="md:h-full"
                            size="sm"
                        />
                    </div>
                )}
            </div>

            <Container maxWidth="lg">
                {awards.length > 0 && (
                    <Section padding="md">
                        <SectionHeading className="pb-8">
                            <SectionHeadingHeading variant="h2">
                                Standouts
                            </SectionHeadingHeading>
                        </SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {awards.map((award, index) => {
                                const teamId = isFilled.contentRelationship(award.player_team) ? award.player_team.data?.opta_id : undefined;
                                const teamStats = teamId ? f30TeamStats.get(teamId) : undefined;
                                const player = teamStats && award.player_name
                                    ? getPlayerByName(teamStats, award.player_name)
                                    : undefined;

                                const teams = f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [];
                                const optaTeam = teamId
                                    ? teams.find(t => t.uID === `t${teamId}`)
                                    : undefined;

                                return (
                                    <PlayerAwardCard
                                        key={index}
                                        award={award}
                                        player={player}
                                        optaTeam={optaTeam}
                                    />
                                );
                            })}
                        </div>
                    </Section>
                )}
                <GroupStageSection
                    f3StandingsData={f3StandingsData}
                    f1FixturesData={f1FixturesData}
                    prismicTeams={prismicTeams}
                    tournamentSlug={tournament.uid}
                    matchSlugMap={matchSlugMap}
                    compact={compact}
                    streamingLink={dazn?.data.streaming_link}
                />
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
                />
                <Section padding="md" id="stat-sheet">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">
                            Stat Sheet
                        </SectionHeadingHeading>
                    </SectionHeading>
                    
                    <StatSheetTabs prismicTeams={prismicTeams} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} f3StandingsData={f3StandingsData} tournamentStatus={tournament.data.status ?? undefined} isKnockoutStage={true} />
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
