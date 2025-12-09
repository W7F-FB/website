"use client";

import React from "react";
import { Section, Container } from "@/components/website-base/padding-containers";
import { RosterCard } from "@/components/blocks/team/roster-card";
import { HeroTeam } from "@/components/blocks/team/hero-team";
import { TeamSnapshot } from "@/components/blocks/team/team-snapshot";
import { TournamentsCard } from "@/components/blocks/team/tournaments-card";
import { PlayerLeaderCard } from "@/components/blocks/players/player-leader-card";
import { PostGrid } from "@/components/blocks/posts/post-grid";
import { H3 } from "@/components/website-base/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyMessage } from "@/components/ui/empty-message";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PrismicLink } from "@prismicio/react";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import { getTeamLeaders } from "@/lib/opta/get-team-leaders";
import { FastBannerTeam } from "@/components/blocks/fast-banner-team";
import type { TeamDocument, TournamentDocument, BlogDocument } from "../../../../../prismicio-types";
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed";
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings";
import type { F1FixturesResponse, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats";
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match";
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9";
import type { TeamStats } from "@/lib/v2-utils/team-stats-from-f9";

type Props = {
  team: TeamDocument;
  teamSquad?: F40Team;
  standings?: F3StandingsResponse | null;
  fixtures?: F1FixturesResponse | null;
  currentTournament?: TournamentDocument | null;
  prismicTeams?: TeamDocument[];
  optaTeams?: F1TeamData[];
  teamBlogs?: BlogDocument[];
  seasonStats?: F30SeasonStatsResponse | null;
  tournamentDocuments?: TournamentDocument[];
  matchSlugMap?: Map<string, string>;
  f9FeedsMap?: Map<string, F9MatchResponse>;
  teamRecords?: TeamRecord[];
  teamStats?: TeamStats[];
};

export default function TeamPageContent({
  team,
  teamSquad,
  standings: _standings,
  fixtures,
  currentTournament: _currentTournament,
  prismicTeams,
  optaTeams = [],
  teamBlogs = [],
  seasonStats,
  tournamentDocuments = [],
  matchSlugMap,
  f9FeedsMap,
  teamRecords = [],
  teamStats = [],
}: Props) {
  const teamLeaders = getTeamLeaders(team, seasonStats, teamSquad);

  return (
    <>
      <HeroTeam
        team={team}
        homeTeamColor={team.data.color_primary || undefined}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none" id="team-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-8">
            <TeamSnapshot
              prismicTeam={team}
              teamRecords={teamRecords}
              teamStats={teamStats}
              recordBased
            />
            <TournamentsCard
              team={team}
              tournamentDocuments={tournamentDocuments}
              fixtures={fixtures}
              prismicTeams={prismicTeams}
              optaTeams={optaTeams}
              matchSlugMap={matchSlugMap}
              f9FeedsMap={f9FeedsMap}
            />
            <FastBannerTeam name={teamSquad?.short_club_name || team.data.name || ""} color={team.data.color_primary || ""} className="hidden md:block" />
          </div>
          <div className="flex flex-col gap-8 md:col-span-2">
            <Card banner className="bg-card/50 border-muted/50 w-full">
              <CardHeader>
                <CardTitle>Team Leaders</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Scorer</H3>
                  {teamLeaders.scorer && <PlayerLeaderCard {...teamLeaders.scorer} />}
                </div>
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Playmaker</H3>
                  {teamLeaders.playmaker && <PlayerLeaderCard {...teamLeaders.playmaker} />}
                </div>
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Keeper</H3>
                  {teamLeaders.keeper && <PlayerLeaderCard {...teamLeaders.keeper} />}
                </div>
              </CardContent>
            </Card>
            <Card banner className="bg-card/50 border-muted/50 w-full" id="roster">
              <CardHeader>
                <CardTitle>Roster</CardTitle>
              </CardHeader>
              <CardContent className="!p-0">
                <RosterCard
                  players={teamSquad?.Player || []}
                  seasonStats={seasonStats}
                  className="border-t border-border"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
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
          {teamBlogs.length > 0 ? (
            <PostGrid posts={teamBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
          ) : (
            <EmptyMessage className="py-16">
              <span className="font-headers uppercase font-medium text-lg">No coverage available yet</span>
            </EmptyMessage>
          )}
        </Section>
      </Container>
    </>
  );
}