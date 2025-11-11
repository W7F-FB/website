import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, TeamDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CaretRightIcon } from "@/components/website-base/icons"
import { GroupList } from "@/components/blocks/tournament/group-card/group-list"
import { getF3Standings } from "@/app/api/opta/feeds"
import { getTeamsByTournament } from "@/cms/queries/team"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    tournament: TournamentDocument
}

export default async function TournamentPagePast({ tournament }: Props) {
    const competitionId = tournament.data.opta_competition_id
    const seasonId = tournament.data.opta_season_id

    let f3Data: F3StandingsResponse | null = null
    let prismicTeams: TeamDocument[] = []

    if (competitionId && seasonId && tournament.uid) {
        try {
            const [f3Feed, teams] = await Promise.all([
                getF3Standings(competitionId, seasonId),
                getTeamsByTournament(tournament.uid)
            ])
            f3Data = f3Feed
            prismicTeams = teams

            console.log('=== F3 API Response ===')
            console.log(f3Data)
            console.log('=== Prismic Teams ===')
            console.log(prismicTeams.map(t => ({ id: t.id, name: t.data.name, opta_id: t.data.opta_id })))
        } catch (error) {
            console.error('Error fetching tournament data:', error)
        }
    }

    const startDate = tournament.data.start_date ? new Date(tournament.data.start_date) : null
    const endDate = tournament.data.end_date ? new Date(tournament.data.end_date) : null

    const formatDateRange = () => {
        if (!startDate || !endDate) return ''

        const month = startDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase()
        const startDay = startDate.getUTCDate()
        const endDay = endDate.getUTCDate()
        const year = startDate.getUTCFullYear()

        return `${month} ${startDay}-${endDay} ${year}`
    }

    return (
        <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>Results</Subtitle>
                    <H1 className="uppercase">{tournament.data.title}</H1>
                    <P className="text-lg">{formatDateRange()}<br />{tournament.data.stadium_name}</P>
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
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                        <Card className="p-0 gap-0 col-span-1 md:col-span-2">
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
                    </div>
                </Section>
            </Container>
        </div>
    )
}

