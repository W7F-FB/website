"use client"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { P } from "@/components/website-base/typography"
import { RosterCard } from "@/components/blocks/roster-card"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed"

type Props = {
    team: TeamDocument
    teamSquad?: F40Team
}

export default function TeamPageContent({ team, teamSquad }: Props) {
    return (
        <>
            <NavMain showBreadcrumbs />
            <PaddingGlobal>
            <Container>
            <Section padding="md">
                <div>
                    {teamSquad && teamSquad.Player && teamSquad.Player.length > 0 ? (
                        <RosterCard
                            players={teamSquad.Player}
                            team={team}
                        />
                    ) : (
                        <div className="text-center py-12">
                            <P className="text-muted-foreground">
                                No roster information available for this team.
                            </P>
                        </div>
                    )}
                </div>
            </Section>
        </Container>
        </PaddingGlobal>
        </>
    )
}