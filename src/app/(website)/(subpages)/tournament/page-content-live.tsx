import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { TournamentDocument, BlogDocument } from "../../../../../prismicio-types"
import type { TeamDocument } from "../../../../../prismicio-types"
import { getGroupStageMatches} from "./utils"
import { getMatchTeams } from "@/lib/opta/utils"
import { formatDateRange } from "@/lib/utils"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PrismicNextImage } from "@prismicio/next"
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { MatchCard } from "@/components/blocks/match/match-card"
import { Separator } from "@/components/ui/separator"
import { ClubList } from "@/components/blocks/clubs/club-list"
import { ScheduleTabs } from "@/components/blocks/tournament/schedule/schedule-tabs"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { mapBlogDocumentToMetadata } from "@/lib/utils"
import { PrismicLink } from "@prismicio/react"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    f1FixturesData: F1FixturesResponse | null
    prismicTeams: TeamDocument[]
}

export default function TournamentPageLive({ tournament, tournamentBlogs, f1FixturesData, prismicTeams }: Props) {

    const groupStageMatches = getGroupStageMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData)


    const liveMatches = groupStageMatches.filter(match => {
        const period = match.MatchInfo?.Period
        return period === "FirstHalf" || period === "SecondHalf"
    })

    const upcomingTodayMatches = groupStageMatches.filter(match => {
        const period = match.MatchInfo?.Period
        const matchDate = match.MatchInfo?.Date?.split(' ')[0]
        const today = new Date().toISOString().split('T')[0]
        return period === "PreMatch" && matchDate === today
    })

    return (
        <>
            <NavMain showBreadcrumbs />
            <main className="flex-grow min-h-[30rem]">
                <PaddingGlobal>
                <div>
                    <SubpageHero>
                        <SubpageHeroContent>
                            <Subtitle>{tournament.data.title}</Subtitle>
                            <H1 className="uppercase">Live Now</H1>
                            <P className="text-lg">
                                {formatDateRange(tournament.data.start_date, tournament.data.end_date)}
                                <br />
                                {tournament.data.stadium_name}
                            </P>
                            {liveMatches.length > 0 && (
                                <Badge fast variant="default" size="lg" className="mt-4">
                                    {liveMatches.length} {liveMatches.length === 1 ? 'Match' : 'Matches'} Live
                                </Badge>
                            )}
                            <div className="mt-8 flex justify-start">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button asChild size="skew_lg">
                                        <Link href="#live-matches"><span>Watch Live</span></Link>
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
                                    <P noSpace>
                                        Follow the action in real-time
                                    </P>
                                </SubpageHeroMediaBanner>
                            </SubpageHeroMedia>
                        )}
                    </SubpageHero>
                    <Container maxWidth="lg">
                        {liveMatches.length > 0 && (
                            <Section padding="md" id="live-matches">
                                <SectionHeading className="pb-8">
                                    <SectionHeadingHeading variant="h2">
                                        Live Matches
                                    </SectionHeadingHeading>
                                    <Badge fast variant="default" size="lg">
                                        LIVE
                                    </Badge>
                                </SectionHeading>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {liveMatches.map((match) => (
                                        <MatchCard
                                            key={match.uID}
                                            fixture={match}
                                            prismicTeams={prismicTeams}
                                            optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}
                        {upcomingTodayMatches.length > 0 && (
                            <>
                                {liveMatches.length > 0 && <Separator variant="gradient" />}
                                <Section padding="md">
                                    <SectionHeading className="pb-8">
                                        <SectionHeadingHeading variant="h2">
                                            Upcoming Today
                                        </SectionHeadingHeading>
                                    </SectionHeading>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {upcomingTodayMatches.map((match) => (
                                            <MatchCard
                                                key={match.uID}
                                                fixture={match}
                                                prismicTeams={prismicTeams}
                                                optaTeams={getMatchTeams(match, f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || [])}
                                            />
                                        ))}
                                    </div>
                                </Section>
                            </>
                        )}
                        <Separator variant="gradient" />
                        <Section padding="md">
                            <SectionHeading className="pb-8">
                                <SectionHeadingHeading variant="h2">Participating Clubs</SectionHeadingHeading>
                            </SectionHeading>
                            <ClubList tournament={tournament} />
                        </Section>

                        <Separator variant="gradient" />
                        <Section padding="md">
                            <SectionHeading className="pb-8">
                                <SectionHeadingHeading variant="h2">Schedule</SectionHeadingHeading>
                                <P noSpace>All times are subject to change</P>
                            </SectionHeading>
                            <ScheduleTabs tournamentSlug={tournament.uid} />
                        </Section>

                        {tournamentBlogs.length > 0 && (
                            <>
                                <Separator variant="gradient" />
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
            </main>
            <Footer />
        </>
    )
}