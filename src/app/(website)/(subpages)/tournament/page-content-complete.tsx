import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CaretRightIcon } from "@/components/website-base/icons"
import { GroupList } from "@/components/blocks/tournament/group-card/group-list"
import { getF3Standings, getF1Fixtures, getF13Commentary } from "@/app/api/opta/feeds"
import { getTeamsByTournament } from "@/cms/queries/team"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading, SectionHeadingHeading, SectionHeadingText } from "@/components/sections/section-heading"
import { Badge } from "@/components/ui/badge"
import { GameCard } from "@/components/blocks/game/game-card"
import { getGroupStageMatches, groupMatchesByDate, formatMatchDayDate } from "./utils"
import { formatDateRange } from "@/lib/utils"

type Props = {
    tournament: TournamentDocument
}

export default async function TournamentPagePast({ tournament }: Props) {
    const competitionId = tournament.data.opta_competition_id
    const seasonId = tournament.data.opta_season_id

    let f3Data: F3StandingsResponse | null = null
    let f1Data: F1FixturesResponse | null = null
    let prismicTeams: TeamDocument[] = []

    if (competitionId && seasonId && tournament.uid) {
        try {
            const [f3Feed, f1Feed, teams] = await Promise.all([
                getF3Standings(competitionId, seasonId),
                getF1Fixtures(competitionId, seasonId),
                getTeamsByTournament(tournament.uid)
            ])
            f3Data = f3Feed
            f1Data = f1Feed
            prismicTeams = teams

            console.log('=== F3 API Response ===')
            console.log(f3Data)
            console.log('=== F1 API Response ===')
            console.log(f1Data)
            console.log('=== Prismic Teams ===')
            console.log(prismicTeams.map(t => ({ id: t.id, name: t.data.name, opta_id: t.data.opta_id })))
        } catch (error) {
            console.error('Error fetching tournament data:', error)
        }
    }


    const groupStageMatches = getGroupStageMatches(f1Data?.SoccerFeed?.SoccerDocument?.MatchData)
    const matchesByDay = groupMatchesByDate(groupStageMatches)
    const totalMatches = groupStageMatches.length

    if (groupStageMatches.length > 0 && competitionId && seasonId) {
        try {
            const randomMatch = groupStageMatches[Math.floor(Math.random() * groupStageMatches.length)]
            const matchId = randomMatch.uID.startsWith('g') ? randomMatch.uID.slice(1) : randomMatch.uID
            console.log('=== Fetching F13 Feed for Random Game ===')
            console.log('Match ID:', matchId)
            console.log('Competition ID:', competitionId)
            console.log('Season ID:', seasonId)
            console.log('Language: en')
            const f13Data = await getF13Commentary(matchId, competitionId, seasonId, 'en')
            console.log('=== F13 API Response ===')
            console.log('lang_id in response:', f13Data?.Commentary?.lang_id)
            console.log(f13Data)
        } catch (error) {
            console.error('Error fetching F13 commentary:', error)
        }
    }

    return (
        <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>Results</Subtitle>
                    <H1 className="uppercase">{tournament.data.title}</H1>
                    <P className="text-lg">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}<br />{tournament.data.stadium_name}</P>
                    <div className="mt-8 flex justify-start">
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild size="skew_lg">
                                <Link href="#highlights"><span>View Highlights</span></Link>
                            </Button>
                            <Button asChild size="skew_lg" variant="outline">
                                <Link href="#results"><span>Final Results</span></Link>
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
                                        <Link href="/tournament">
                                            Learn More
                                            <CaretRightIcon className="size-3 mt-px" />
                                        </Link>
                                    </Button>
                                </span></P>
                        </SubpageHeroMediaBanner>
                    </SubpageHeroMedia>
                )}
            </SubpageHero>
            <Container maxWidth="lg">
                <Section padding="md">
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
                            {f3Data?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.map((groupStandings) => {
                                const groupName = groupStandings.Round?.Name.value || 'Unknown Group'
                                console.log('Rendering GroupList with:', {
                                    groupName,
                                    teamRecords: groupStandings.TeamRecord.length,
                                    optaTeams: f3Data.SoccerFeed.SoccerDocument.Team.length,
                                    prismicTeams: prismicTeams.length
                                })
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
                                                teams={f3Data.SoccerFeed.SoccerDocument.Team}
                                                prismicTeams={prismicTeams}
                                            />
                                        </CardContent>
                                    </div>

                                )
                            })}
                        </Card>
                        <div className="col-span-1 md:col-span-5 space-y-18">
                            {Array.from(matchesByDay.entries()).map(([date, matches], index) => {
                                return (
                                    <div key={date} className="space-y-8">
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {matches.map((match) => (
                                                <GameCard
                                                    key={match.uID}
                                                    fixture={match}
                                                    prismicTeams={prismicTeams}
                                                    timeOnly
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Section>
            </Container>
        </div>
    )
}

