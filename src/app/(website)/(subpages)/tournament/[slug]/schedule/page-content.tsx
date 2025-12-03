import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, BlogDocument, MatchDocument, TeamDocument } from "../../../../../../../prismicio-types"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero"
import { Button } from "@/components/ui/button"
import { PalmtreeIcon, WhistleIcon } from "@/components/website-base/icons"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { Badge } from "@/components/ui/badge"
import { MatchCard } from "@/components/blocks/match/match-card"
import { formatMatchDayDate, getGroupStageMatchesPrismic, getSemiFinalMatchesPrismic, getThirdPlaceMatchPrismic, getFinalMatchPrismic, groupMatchesByDatePrismic, sortMatchesByNumber } from "../../utils"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { Separator } from "@/components/ui/separator"
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link"
import { PostBanner } from "@/components/blocks/posts/post"
import { isFilled } from "@prismicio/client"
import { VideoBanner } from "@/components/blocks/video-banner/video-banner"
import { cn } from "@/lib/utils"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { FastBanner } from "@/components/blocks/fast-banners"
import { Background } from "@/components/ui/background"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupListPrismic } from "@/components/blocks/tournament/group-list-prismic"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
    prismicTeams: TeamDocument[]
    compact?: boolean
}



export default function TournamentSchedulePageContent({ tournament, tournamentBlogs, prismicTeams, compact = true }: Props) {
    const prismicMatches = tournament.data.matches
        .map(item => item.match)
        .filter(match => isFilled.contentRelationship(match) && match.data)
        .map(match => match as unknown as MatchDocument)

    const groupStageMatches = sortMatchesByNumber(getGroupStageMatchesPrismic(prismicMatches))
    const matchesByDay = groupMatchesByDatePrismic(groupStageMatches)
    const totalMatches = groupStageMatches.length

    const semiFinalMatches = sortMatchesByNumber(getSemiFinalMatchesPrismic(prismicMatches))
    const thirdPlaceMatches = sortMatchesByNumber(getThirdPlaceMatchPrismic(prismicMatches))
    const finalMatches = sortMatchesByNumber(getFinalMatchPrismic(prismicMatches))

    const knockoutMatches = semiFinalMatches.length + thirdPlaceMatches.length + finalMatches.length

    const knockoutDateRaw = (semiFinalMatches[0] as MatchDocument)?.data?.start_time
        || (thirdPlaceMatches[0] as MatchDocument)?.data?.start_time
        || (finalMatches[0] as MatchDocument)?.data?.start_time

    const knockoutDate = knockoutDateRaw ? (() => {
        const date = new Date(knockoutDateRaw)
        const etDateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'America/New_York'
        })
        const [month, day, year] = etDateStr.split('/')
        return `${year}-${month}-${day}`
    })() : null

    return (
        <>
            <NavMain showBreadcrumbs customBreadcrumbs={[
                { label: "Home", href: "/" },
                { label: tournament.data.title, href: `/tournament/${tournament.uid}` },
                { label: "Schedule", href: `/tournament/${tournament.uid}/schedule` }
            ]} />
            <PaddingGlobal>
                <div>
                    <SubpageHeroSecondary className="max-w-none w-full">
                        <Background className="flex items-start justify-between">
                            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
                            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
                        </Background>
                        <div className="relative max-w-3xl mx-auto">
                            <Subtitle className="text-primary">{tournament.data.title}</Subtitle>
                            <H1 className="uppercase">Schedule</H1>
                            <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
                            {isFilled.number(tournament.data.prize_pool) && (
                                <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
                            )}
                            {tournament.data.tickets_available && (
                                <div className="mt-8 flex justify-center">
                                    <Button asChild size="skew_lg">
                                        <Link href="/checkout"><span>Purchase Tickets</span></Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SubpageHeroSecondary>
                    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 md:gap-8 mt-8">
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
                        <Section padding="md" id="results">
                            <SectionHeading variant="split">
                                <SectionHeadingHeading>
                                    Group Stage
                                </SectionHeadingHeading>
                                <SectionHeadingText variant="lg" className="ml-auto mt-auto">
                                    {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'}
                                </SectionHeadingText>
                            </SectionHeading>
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-12">
                                {prismicTeams.length > 0 && (
                                    <Card banner className="col-span-1 md:col-span-2 self-start md:sticky md:top-32">
                                        <CardHeader>
                                            <CardTitle>Group 1</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <GroupListPrismic
                                                prismicTeams={prismicTeams}
                                                groupName="Group 1"
                                            />
                                        </CardContent>
                                        <CardHeader>
                                            <CardTitle>Group 2</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <GroupListPrismic
                                                prismicTeams={prismicTeams}
                                                groupName="Group 2"
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                                <div className={cn(prismicTeams.length > 0 ? "col-span-1 md:col-span-5" : "col-span-1 md:col-span-7", "space-y-18")}>
                                    {(() => {
                                        const matchDaysArray = Array.from(matchesByDay.entries() as IterableIterator<[string, MatchDocument[]]>)
                                        const columns = compact ? 3 : 2

                                        const renderSession = (sessionLabel: string, matches: MatchDocument[], nextHref: string, timeInfo: string) => {
                                            const filledCellsInLastRow = matches.length % columns
                                            const emptyCells = filledCellsInLastRow === 0 ? 0 : columns - filledCellsInLastRow

                                            return (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                                            <WhistleIcon className="w-4 h-4 -mt-1.5" />
                                                            <h3 className="text-lg font-semibold">{sessionLabel}</h3>
                                                        </div>
                                                        <div className="flex-grow border-t border-dotted border-border/75" />
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">{timeInfo}</span>
                                                    </div>
                                                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", compact && "md:grid-cols-3")}>
                                                        {matches.map((match) => (
                                                            <MatchCard
                                                                key={match.id}
                                                                prismicMatch={match}
                                                                compact={compact}
                                                                optaEnabled={false}
                                                            />
                                                        ))}
                                                        {emptyCells > 0 && (
                                                            <GridCellScrollLink
                                                                href={nextHref}
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
                                        }

                                        return (
                                            <>
                                                {matchDaysArray[0] && (() => {
                                                    const [date, matches] = matchDaysArray[0]
                                                    return (
                                                        <div key={date} id="match-day-1" className="space-y-8">
                                                            <div className="flex justify-start gap-0.5 pr-3">
                                                                <div className="flex-grow">
                                                                    <Badge fast variant="muted" origin="bottom-left" size="lg" className="text-2xl">
                                                                        Match day 1
                                                                    </Badge>
                                                                </div>
                                                                <Badge variant="muted" origin="bottom-left" size="lg" className="text-sm md:text-base relative">
                                                                    <span className="relative z-10">{formatMatchDayDate(date)}</span>
                                                                </Badge>
                                                            </div>
                                                            {renderSession("Session 1", matches, matchDaysArray[1] ? "#match-day-2" : "#knockout", "Doors open at 3:30 PM EST")}
                                                        </div>
                                                    )
                                                })()}

                                                {matchDaysArray[1] && (() => {
                                                    const [date, matches] = matchDaysArray[1]
                                                    const session2Matches = matches.slice(0, 4)
                                                    const session3Matches = matches.slice(4)

                                                    return (
                                                        <div key={date} id="match-day-2" className="space-y-8">
                                                            <div className="flex justify-start gap-0.5 pr-3">
                                                                <div className="flex-grow">
                                                                    <Badge fast variant="muted" origin="bottom-left" size="lg" className="text-2xl">
                                                                        Match day 2
                                                                    </Badge>
                                                                </div>
                                                                <Badge variant="muted" origin="bottom-left" size="lg" className="text-sm md:text-base relative">
                                                                    <span className="relative z-10">{formatMatchDayDate(date)}</span>
                                                                </Badge>
                                                            </div>
                                                            {renderSession("Session 2", session2Matches, session3Matches.length > 0 ? "#session-3" : (matchDaysArray[2] ? "#match-day-3" : "#knockout"), "Doors open at 9:30 AM EST")}
                                                            {session3Matches.length > 0 && (
                                                                <div id="session-3">
                                                                    {renderSession("Session 3", session3Matches, matchDaysArray[2] ? "#match-day-3" : "#knockout", "3:30 - 4:30 PM EST Intersession Break")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })()}

                                                {matchDaysArray.slice(2).map(([date, matches], index) => {
                                                    const matchDayNumber = index + 3
                                                    const filledCellsInLastRow = matches.length % columns
                                                    const emptyCells = filledCellsInLastRow === 0 ? 0 : columns - filledCellsInLastRow
                                                    const isLastMatchDay = index === matchDaysArray.length - 3
                                                    const nextMatchDayHref = isLastMatchDay ? "#knockout" : `#match-day-${matchDayNumber + 1}`

                                                    return (
                                                        <div key={date} id={`match-day-${matchDayNumber}`} className="space-y-8">
                                                            <div className="flex justify-start gap-0.5 pr-3">
                                                                <div className="flex-grow">
                                                                    <Badge fast variant="muted" origin="bottom-left" size="lg" className="text-2xl">
                                                                        Match day {matchDayNumber}
                                                                    </Badge>
                                                                </div>
                                                                <Badge variant="muted" origin="bottom-left" size="lg" className="text-sm md:text-base relative">
                                                                    <span className="relative z-10">{formatMatchDayDate(date)}</span>
                                                                </Badge>
                                                            </div>
                                                            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", compact && "md:grid-cols-3")}>
                                                                {matches.map((match) => (
                                                                    <MatchCard
                                                                        key={match.id}
                                                                        prismicMatch={match}
                                                                        compact={compact}
                                                                        optaEnabled={false}
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
                                            </>
                                        )
                                    })()}
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
                                    <Badge fast variant="muted" origin="bottom-left" size="lg" className="text-2xl">
                                        Match day 3
                                    </Badge>
                                </div>
                                {knockoutDate && (
                                    <Badge variant="muted" origin="bottom-left" size="lg" className="text-base">
                                        {formatMatchDayDate(knockoutDate.split(' ')[0])}
                                    </Badge>
                                )}
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <WhistleIcon className="w-4 h-4 -mt-1.5" />
                                        <h3 className="text-lg font-semibold">Session 4</h3>
                                    </div>
                                    <div className="flex-grow border-t border-dotted border-border/75" />
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">Doors open at 9:30 AM EST</span>
                                </div>
                            </div>
                            <div className="flex justify-center items-start gap-4 md:gap-8">
                                <FastBanner text="FAST." position="left" strokeWidth="1px" uppercase className="hidden md:block" />
                                <div className="max-w-3xl w-full space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {semiFinalMatches[0] && (
                                            <MatchCard
                                                prismicMatch={semiFinalMatches[0]}
                                                compact={compact}
                                                banner="Semi Final 1"
                                                optaEnabled={false}
                                            />
                                        )}
                                        {semiFinalMatches[1] && (
                                            <MatchCard
                                                prismicMatch={semiFinalMatches[1]}
                                                compact={compact}
                                                banner="Semi Final 2"
                                                optaEnabled={false}
                                            />
                                        )}
                                    </div>
                                    {thirdPlaceMatches.map((match) => (
                                        <MatchCard
                                            key={match.id}
                                            prismicMatch={match}
                                            compact={compact}
                                            banner="Third Place Match"
                                            optaEnabled={false}
                                        />
                                    ))}
                                    <Separator variant="gradient" className="my-12" />
                                    {finalMatches.map((match) => (
                                        <MatchCard
                                            key={match.id}
                                            prismicMatch={match}
                                            compact={compact}
                                            banner="The Final"
                                            optaEnabled={false}
                                        />
                                    ))}
                                </div>
                                <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden md:block" />
                            </div>
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

