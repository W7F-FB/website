"use client"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { P } from "@/components/website-base/typography"
import { RosterCard } from "@/components/blocks/team/roster-card"
import { HeroTeam } from "@/components/blocks/team/hero-team"
import { TeamStatsCard } from "@/components/blocks/team/team-stats-card"
import { TeamHub } from "@/components/blocks/team/team-hub";
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PrismicLink } from "@prismicio/react"
import { mapBlogDocumentToMetadata } from "@/lib/utils"
import type { TeamDocument, TournamentDocument, BlogDocument } from "../../../../../prismicio-types"
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"

type Props = {
    team: TeamDocument
    teamSquad?: F40Team
    standings?: F3StandingsResponse | null
    fixtures?: F1FixturesResponse | null
    currentTournament?: TournamentDocument | null
    prismicTeams?: TeamDocument[]
    teamBlogs?: BlogDocument[]
}

export default function TeamPageContent({ team, teamSquad, standings, fixtures, currentTournament, prismicTeams, teamBlogs = [] }: Props) {
    return (
        <>
            <NavMain showBreadcrumbs />
            <HeroTeam team={team} />
            <PaddingGlobal>
                <Container>
                    <Section padding="md">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-1">
                                <TeamStatsCard
                                    team={team}
                                    standings={standings}
                                    fixtures={fixtures}
                                    currentTournament={currentTournament}
                                    prismicTeams={prismicTeams}
                                />
                            </div>
                            <div><TeamHub /></div>
                        </div>
                    </Section>
                    {teamBlogs.length > 0 && (
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
                                <PostGrid posts={teamBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
                            </Section>
                        </>
                    )}
                </Container>
            </PaddingGlobal>
        </>
    )
}