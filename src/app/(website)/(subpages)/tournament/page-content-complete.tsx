import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument, BlogDocument, TournamentDocumentDataAwardsItem } from "../../../../../prismicio-types"
import type * as prismic from "@prismicio/client"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CaretRightIcon } from "@/components/website-base/icons"
import { GroupList } from "@/components/blocks/tournament/group-list"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { getPlayerByName } from "@/types/opta-feeds/f30-season-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { Badge } from "@/components/ui/badge"
import { GameCard } from "@/components/blocks/game/game-card"
import { getGroupStageMatches, getSemiFinalMatches, getThirdPlaceMatch, getFinalMatch, groupMatchesByDate, formatMatchDayDate } from "./utils"
import { getMatchTeams } from "@/lib/opta/utils"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { Separator } from "@/components/ui/separator"
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link"
import { PostBanner } from "@/components/blocks/posts/post"
import { isFilled } from "@prismicio/client"
import { VideoBanner } from "@/components/blocks/video-banner/video-banner"
import { cn } from "@/lib/utils"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { PlayerAwardCard } from "@/components/blocks/players/player-award-card"
import { LinePattern } from "@/components/blocks/line-pattern"
import { StatSheetTabs } from "@/components/blocks/tournament/stat-sheet/stat-sheet-tabs"
import { ChampionsCard } from "@/components/blocks/tournament/champions-card"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    prismicTeams: TeamDocument[]
    awards: NonNullable<AwardData>[]
    compact?: boolean
}

export default function TournamentPagePast({ tournament, tournamentBlogs, f3StandingsData, f1FixturesData, f30TeamStats, prismicTeams, awards, compact = false }: Props) {
    const groupStageMatches = getGroupStageMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const matchesByDay = groupMatchesByDate(groupStageMatches)
    const totalMatches = groupStageMatches.length
    const semiFinalMatches = getSemiFinalMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const thirdPlaceMatches = getThirdPlaceMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const finalMatches = getFinalMatch(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)
    const knockoutMatches = semiFinalMatches.length + thirdPlaceMatches.length + finalMatches.length

    const knockoutDate = semiFinalMatches[0]?.MatchInfo?.Date
        || thirdPlaceMatches[0]?.MatchInfo?.Date
        || finalMatches[0]?.MatchInfo?.Date

    return (
        <>
            <NavMain showBreadcrumbs />
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
            <div className="grid grid-cols-3 w-full gap-8 mt-8">
                {isFilled.contentRelationship(tournament.data.recap) && tournament.data.recap.data && (
                    <div className="col-span-2">
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
                    <div className="col-span-1 h-full">
                        <VideoBanner
                            thumbnail="/images/static-media/video-banner.avif"
                            videoUrl={tournament.data.highlight_reel_link}
                            label="Recap the action"
                            className="h-full"
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
                        <div className="grid grid-flow-col grid-cols-4 gap-6">
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
                <Section padding="md" id="results">
                    <SectionHeading variant="split">
                        <SectionHeadingHeading>
                            Group Stage
                        </SectionHeadingHeading>
                        <SectionHeadingText variant="lg" className="ml-auto mt-auto">
                            {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'}
                        </SectionHeadingText>
                    </SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-12">
                        <Card className="p-0 gap-0 col-span-1 md:col-span-2 self-start sticky top-32">
                            {f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.map((groupStandings) => {
                                const groupName = groupStandings.Round?.Name.value || 'Unknown Group'
                                return (

                                    <div key={groupStandings.Round?.Name.id || Math.random()}>
                                        <CardHeader className="bg-muted/50 gap-0 py-4 px-6">
                                            <CardTitle className="font-headers text-xl">
                                                {groupName}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="divide-y divide-muted/50 py-4 px-6">
                                            <GroupList
                                                groupStandings={groupStandings}
                                                teams={f3StandingsData?.SoccerFeed?.SoccerDocument?.Team || []}
                                                prismicTeams={prismicTeams}
                                                matches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData || []}
                                            />
                                        </CardContent>
                                    </div>

                                )
                            })}
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
                                        <div className="flex justify-start gap-0.5 pr-3">
                                            <div className="flex-grow">
                                                <Badge fast variant="backdrop_blur" origin="bottom-left" size="lg" className="text-2xl">
                                                    Match day {index + 1}
                                                </Badge>
                                            </div>
                                            <Badge variant="backdrop_blur" origin="bottom-left" size="lg" className="text-base">
                                                {formatMatchDayDate(date)}
                                            </Badge>
                                        </div>
                                        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", compact && "md:grid-cols-3")}>
                                            {matches.map((match) => (
                                                <GameCard
                                                    key={match.uID}
                                                    fixture={match}
                                                    prismicTeams={prismicTeams}
                                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                                    compact={compact}
                                                />
                                            ))}
                                            {emptyCells > 0 && (
                                                <GridCellScrollLink
                                                    href={nextMatchDayHref}
                                                    className={cn(
                                                        emptyCells === 2 && "md:col-span-2",
                                                        emptyCells === 3 && "md:col-span-3"
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
                <Section padding="md" id="knockout">
                    <SectionHeading variant="split">
                        <SectionHeadingHeading>
                            Knockout Stage
                        </SectionHeadingHeading>
                        <SectionHeadingText variant="lg" className="ml-auto mt-auto">
                            {knockoutMatches} {knockoutMatches === 1 ? 'Match' : 'Matches'}
                        </SectionHeadingText>
                    </SectionHeading>
                    <div className="flex justify-start gap-0.5 pr-3 mb-8">
                        <div className="flex-grow">
                            <Badge fast variant="backdrop_blur" origin="bottom-left" size="lg" className="text-2xl">
                                Match day 3
                            </Badge>
                        </div>
                        {knockoutDate && (
                            <Badge variant="backdrop_blur" origin="bottom-left" size="lg" className="text-base">
                                {formatMatchDayDate(knockoutDate.split(' ')[0])}
                            </Badge>
                        )}
                    </div>
                    <div className="flex justify-center items-start gap-8">
                        <LinePattern className="flex-grow self-stretch flex items-center justify-center relative">
                            <div className="absolute top-8 left-8 writing-mode-vrl text-[6vw] font-headers leading-none italic font-black whitespace-nowrap text-background text-stroke-[1px]/line-pattern select-none uppercase">
                                <span className="block">FAST.</span>
                            </div>
                        </LinePattern>
                        <div className="max-w-3xl w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {semiFinalMatches[0] && (
                                    <GameCard
                                        fixture={semiFinalMatches[0]}
                                        prismicTeams={prismicTeams}
                                        optaTeams={getMatchTeams(semiFinalMatches[0], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        compact={compact}
                                        banner="Semi Final 1"
                                    />
                                )}
                                {semiFinalMatches[1] && (
                                    <GameCard
                                        fixture={semiFinalMatches[1]}
                                        prismicTeams={prismicTeams}
                                        optaTeams={getMatchTeams(semiFinalMatches[1], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        compact={compact}
                                        banner="Semi Final 2"
                                    />
                                )}
                            </div>
                            {thirdPlaceMatches.map((match) => (
                                <GameCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    compact={compact}
                                    banner="Third Place Match"
                                />
                            ))}
                            <Separator variant="gradient" className="my-12" />
                            {finalMatches.map((match) => (
                                <GameCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    compact={compact}
                                    banner="The Final"
                                />
                            ))}
                            <ChampionsCard
                                finalMatches={finalMatches}
                                f1FixturesData={f1FixturesData}
                                prismicTeams={prismicTeams}
                            />
                        </div>
                        <LinePattern className="flex-grow self-stretch flex items-center justify-center relative">
                            <div className="absolute top-8 right-8 writing-mode-vrl text-[6vw] font-headers leading-none italic font-black whitespace-nowrap text-background text-stroke-[1.5px]/line-pattern select-none">
                                <span className="block">FORWARD.</span>
                            </div>
                        </LinePattern>
                    </div>
                </Section>
                <Section padding="md" id="stat-sheet">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">
                            Stat Sheet
                        </SectionHeadingHeading>
                    </SectionHeading>
                    
                    <StatSheetTabs prismicTeams={prismicTeams} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} />
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
                                <Button asChild size="skew" variant="outline" className="ml-auto mt-auto">
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
        </>
    )
}

