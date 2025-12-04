import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument, BlogDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GroupList } from "@/components/blocks/tournament/group-list"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { getGroupStageMatches, getSemiFinalMatches, getThirdPlaceMatch, getFinalMatch, groupMatchesByDate } from "./utils"
import { MatchDayBadge } from "@/components/blocks/tournament/match-day-badge"
import { getMatchTeams } from "@/lib/opta/utils"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { Separator } from "@/components/ui/separator"
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link"
import { isFilled } from "@prismicio/client"
import { cn } from "@/lib/utils"
import { FastBanner } from "@/components/blocks/fast-banners"
import { StatSheetTabs } from "@/components/blocks/tournament/stat-sheet/stat-sheet-tabs"
import { ChampionsCard } from "@/components/blocks/tournament/champions-card"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    f3StandingsData: F3StandingsResponse | null
    f1FixturesData: F1FixturesResponse | null
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    prismicTeams: TeamDocument[]
    compact?: boolean
}

export default function TournamentPageLive({ tournament, tournamentBlogs, f3StandingsData, f1FixturesData, f30TeamStats, prismicTeams, compact = false }: Props) {
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
                                <Link href="/checkout"><span>Purchase Tickets</span></Link>
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
                    </SubpageHeroMedia>
                )}
            </SubpageHero>

            <Container maxWidth="lg">
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
                        <Card banner className="col-span-1 md:col-span-2 self-start md:sticky md:top-32">
                            {f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.map((groupStandings) => {
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
                                        <MatchDayBadge matchDay={index + 1} date={date} />
                                        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", compact && "md:grid-cols-3")}>
                                            {matches.map((match) => (
                                                <MatchCard
                                                    key={match.uID}
                                                    fixture={match}
                                                    prismicTeams={prismicTeams}
                                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                                    compact={compact}
                                                    allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                                    f3StandingsData={f3StandingsData}
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
                                        compact={compact}
                                        banner="Semi Final 1"
                                        allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                        f3StandingsData={f3StandingsData}
                                    />
                                )}
                                {semiFinalMatches[1] && (
                                    <MatchCard
                                        fixture={semiFinalMatches[1]}
                                        prismicTeams={prismicTeams}
                                        optaTeams={getMatchTeams(semiFinalMatches[1], f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        compact={compact}
                                        banner="Semi Final 2"
                                        allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                        f3StandingsData={f3StandingsData}
                                    />
                                )}
                            </div>
                            {thirdPlaceMatches.map((match) => (
                                <MatchCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    compact={compact}
                                    banner="Third Place Match"
                                    allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                    f3StandingsData={f3StandingsData}
                                />
                            ))}
                            <Separator variant="gradient" className="my-12" />
                            {finalMatches.map((match) => (
                                <MatchCard
                                    key={match.uID}
                                    fixture={match}
                                    prismicTeams={prismicTeams}
                                    optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                    compact={compact}
                                    banner="The Final"
                                    allMatches={f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData}
                                    f3StandingsData={f3StandingsData}
                                />
                            ))}
                            <ChampionsCard
                                finalMatches={finalMatches}
                                f1FixturesData={f1FixturesData}
                                prismicTeams={prismicTeams}
                            />
                        </div>
                        <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden md:block" />
                    </div>
                </Section>
                <Section padding="md" id="stat-sheet">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">
                            Stat Sheet
                        </SectionHeadingHeading>
                    </SectionHeading>
                    
                    <StatSheetTabs prismicTeams={prismicTeams} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} tournamentStatus={tournament.data.status ?? undefined} />
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

