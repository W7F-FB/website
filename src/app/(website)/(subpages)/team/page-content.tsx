"use client";

import React from "react";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";
import { RosterCard } from "@/components/blocks/team/roster-card";
import { HeroTeam } from "@/components/blocks/team/hero-team";
import { TeamStatsCard } from "@/components/blocks/team/team-stats-card";
import { TeamHub } from "@/components/blocks/team/team-hub";
import { UpcomingMatch } from "@/components/blocks/team/upcoming-match";
import { PostGrid } from "@/components/blocks/posts/post-grid";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PrismicLink } from "@prismicio/react";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import { getTeamLeaders } from "@/lib/opta/get-team-leaders";
import type { TeamDocument, TournamentDocument, BlogDocument } from "../../../../../prismicio-types";
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed";
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  team: TeamDocument;
  teamSquad?: F40Team;
  standings?: F3StandingsResponse | null;
  fixtures?: F1FixturesResponse | null;
  currentTournament?: TournamentDocument | null;
  prismicTeams?: TeamDocument[];
  teamBlogs?: BlogDocument[];
  seasonStats?: F30SeasonStatsResponse | null;
};

export default function TeamPageContent({
  team,
  teamSquad,
  standings,
  fixtures,
  currentTournament,
  prismicTeams,
  teamBlogs = [],
  seasonStats,
}: Props) {
  const teamLeaders = getTeamLeaders(team, seasonStats);

  return (
    <PaddingGlobal>
      <HeroTeam
        team={team}
        homeTeamColor={team.data.color_primary || undefined}
        currentTournament={currentTournament}
        standings={standings}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none">
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
          <div className="col-span-2 space-y-8">
            <TeamHub
              scorer={teamLeaders.scorer}
              playmaker={teamLeaders.playmaker}
              keeper={teamLeaders.keeper}
            />
            <UpcomingMatch
              team={team}
              fixtures={fixtures}
              prismicTeams={prismicTeams}
              optaTeams={teamSquad ? [teamSquad] : []}
            />
          </div>
          <div className="col-span-3">
            <Card banner className="bg-card/50 border-muted/50">
              <CardHeader>
                <CardTitle>Roster</CardTitle>
              </CardHeader>
              <CardContent>
                <RosterCard players={teamSquad?.Player || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
      {teamBlogs.length > 0 && (
        <>
          <Container>
            <Separator variant="gradient" className="my-16" />
            <Section padding="none">
              <SectionHeading variant="split">
                <SectionHeadingSubtitle>Latest Coverage</SectionHeadingSubtitle>
                <SectionHeadingHeading>Tournament News</SectionHeadingHeading>
                <Button asChild size="skew" variant="outline" className="ml-auto mt-auto">
                  <PrismicLink href="/news">
                    <span>All News</span>
                  </PrismicLink>
                </Button>
              </SectionHeading>
              <PostGrid posts={teamBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
            </Section>
          </Container>
        </>
      )}
    </PaddingGlobal>
  );
}