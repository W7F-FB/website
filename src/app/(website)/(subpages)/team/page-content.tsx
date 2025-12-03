"use client";

import React from "react";
import { Section, Container } from "@/components/website-base/padding-containers";
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

type Props = {
  team: TeamDocument;
  teamSquad?: F40Team;
  standings?: F3StandingsResponse | null;
  fixtures?: F1FixturesResponse | null;
  currentTournament?: TournamentDocument | null;
  prismicTeams?: TeamDocument[];
  teamBlogs?: BlogDocument[];
  seasonStats?: F30SeasonStatsResponse | null;
  tournamentDocuments?: TournamentDocument[];
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
  tournamentDocuments = [],
}: Props) {
  const teamLeaders = getTeamLeaders(team, seasonStats);

  return (
    <>
      <HeroTeam
        team={team}
        homeTeamColor={team.data.color_primary || undefined}
        standings={standings}
        fixtures={fixtures}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none" id="team-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 h-full">
            <TeamStatsCard
              team={team}
              standings={standings}
              fixtures={fixtures}
              currentTournament={currentTournament}
              prismicTeams={prismicTeams}
              tournamentDocuments={tournamentDocuments}
            />
          </div>
          <div className="flex flex-col gap-8 relative md:col-span-2 h-full">
            <div>
              <TeamHub
                scorer={teamLeaders.scorer}
                playmaker={teamLeaders.playmaker}
                keeper={teamLeaders.keeper}
              />
            </div>
            <div className="flex-1 min-h-0">
              <UpcomingMatch
                team={team}
                fixtures={fixtures}
                prismicTeams={prismicTeams}
                optaTeams={teamSquad ? [teamSquad] : []}
              />
            </div>
          </div>
        </div>
      </Section>
      <Section padding="sm" id="roster">
        <SectionHeading className="pb-8">
          <SectionHeadingHeading variant="h2">
            Roster
          </SectionHeadingHeading>
        </SectionHeading>
        <RosterCard
          players={teamSquad?.Player || []}
          seasonStats={seasonStats}
          prismicTeam={team}
        />
      </Section>
      {teamBlogs.length > 0 && (
        <>
          <Container>
            <Separator variant="gradient" className="my-16" />
            <Section padding="none" id="blog">
              <SectionHeading variant="split">
                <SectionHeadingSubtitle>{team.data.name}</SectionHeadingSubtitle>
                <SectionHeadingHeading>Latest Coverage</SectionHeadingHeading>
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
    </>
  );
}