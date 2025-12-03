"use client";

import React from "react";
import { Section, PaddingGlobal } from "@/components/website-base/padding-containers";
import MatchHero from "@/components/blocks/match/match-hero";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import type { F9MatchData, F9TeamData, F9Team } from "@/types/opta-feeds/f9-match";
import type { F40Team, F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed";
import type { TeamDocument, TournamentDocument, BroadcastPartnersDocument } from "../../../../../prismicio-types";
import type { F13CommentaryResponse } from "@/types/opta-feeds/f13-commentary";
import type { F24EventDetailsFeed } from "@/types/opta-feeds/f24-match-events";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchLineups } from "@/components/blocks/match/match-lineups";
import { BroadcastPartnerLink } from "@/components/blocks/broadcast-partner";
import { Separator } from "@/components/ui/separator";
import { PlayerLeaderCard } from "@/components/blocks/players/player-leader-card";
import { calculateMatchStandouts } from "@/lib/opta/calculate-match-standouts";
import { H3 } from "@/components/website-base/typography";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { ClubStandingsTable } from "@/components/blocks/tournament/club-standings-table";
import { FastBanner } from "@/components/blocks/fast-banners";

type Props = {
  f9MatchData: F9MatchData;
  homeTeamData: F9TeamData;
  awayTeamData: F9TeamData;
  homeTeam?: F9Team;
  awayTeam?: F9Team;
  homeSquadTeam?: F40Team;
  awaySquadTeam?: F40Team;
  homeTeamPrismic: TeamDocument | null;
  awayTeamPrismic: TeamDocument | null;
  matchId: string;
  competitionId: string;
  tournament: TournamentDocument | null;
  commentary: F13CommentaryResponse | null;
  f24Events: F24EventDetailsFeed | null;
  broadcastPartners: BroadcastPartnersDocument[];
  prismicTeams: TeamDocument[];
  f1FixturesData: F1FixturesResponse;
  f40Squads: F40SquadsResponse;
};

export default function MatchPageContent({
  f9MatchData,
  homeTeamData,
  awayTeamData,
  homeTeam,
  awayTeam,
  homeSquadTeam,
  awaySquadTeam,
  homeTeamPrismic,
  awayTeamPrismic,
  matchId,
  competitionId,
  tournament,
  commentary,
  f24Events,
  broadcastPartners,
  prismicTeams,
  f1FixturesData,
  f40Squads,
}: Props) {
  const standouts = calculateMatchStandouts(
    {
      SoccerFeed: {
        TimeStamp: new Date().toISOString(),
        SoccerDocument: {
          Type: "Result",
          uID: matchId,
          detail_id: 1,
          Competition: {
            uID: competitionId,
            Country: "",
            Name: "",
          },
          MatchData: f9MatchData,
        },
      },
    },
    {
      homeTeamData,
      awayTeamData,
      homeTeam,
      awayTeam,
      homeSquadTeam,
      awaySquadTeam,
      homeTeamPrismic,
      awayTeamPrismic,
    }
  )

  return (
    <PaddingGlobal>
      <MatchHero
        f9MatchData={f9MatchData}
        homeTeamData={homeTeamData}
        awayTeamData={awayTeamData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamPrismic={homeTeamPrismic}
        awayTeamPrismic={awayTeamPrismic}
        tournament={tournament}
        broadcastPartners={broadcastPartners}
        f1FixturesData={f1FixturesData}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none" className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-8 relative">
          <Card banner className="w-full">
            <CardHeader>
              <CardTitle>Rosters</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchLineups
                homeTeamData={homeTeamData}
                awayTeamData={awayTeamData}
                homeSquadTeam={homeSquadTeam}
                awaySquadTeam={awaySquadTeam}
                homeLogo={homeTeamPrismic?.data?.logo?.url || null}
                awayLogo={awayTeamPrismic?.data?.logo?.url || null}
                f24Events={f24Events}
              />
            </CardContent>
          </Card>
          <FastBanner text="FAST." position="left" strokeWidth="1px" uppercase className="hidden md:block" />
        </div>
        <div className="col-span-2 space-y-8">
          <Card banner>
            <CardHeader>
              <CardTitle>Standouts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <H3 className="text-xs text-muted-foreground mb-3 uppercase">Offensive</H3>
                {standouts.scoringLeader && (
                  <PlayerLeaderCard {...standouts.scoringLeader} />
                )}
              </div>
              <div>
                <H3 className="text-xs text-muted-foreground mb-3 uppercase">Defensive</H3>
                {standouts.defensiveLeader && (
                  <PlayerLeaderCard {...standouts.defensiveLeader} />
                )}
              </div>
              <div>
                <H3 className="text-xs text-muted-foreground mb-3 uppercase">Goalkeeper</H3>
                {standouts.gkLeader && (
                  <PlayerLeaderCard {...standouts.gkLeader} />
                )}
              </div>
            </CardContent>
          </Card>
          <Card banner>
            <CardHeader>
              <CardTitle>Play-By-Play</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayByPlay commentary={commentary} />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-8 relative">
          {prismicTeams.length > 0 && (
            <Card banner className="w-full">
              <CardHeader>
                <CardTitle>Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <ClubStandingsTable
                  prismicTeams={prismicTeams}
                  f1FixturesData={f1FixturesData}
                  f40Squads={f40Squads}
                  tournamentStatus={tournament?.data.status ?? undefined}
                />
              </CardContent>
            </Card>
          )}
          <Card banner className="w-full hidden">
            <CardHeader>
              <CardTitle>Match Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoBanner
                thumbnail="/images/static-media/video-banner.avif"
                videoUrl="https://r2.vidzflow.com/source/a4c227f3-6918-4e29-8c72-b509a9cf3d5c.mp4"
                size="sm"
                className="h-auto aspect-video"
              />
            </CardContent>
          </Card>
          <Card banner className="w-full hidden">
            <CardHeader>
              <CardTitle>Stream Free</CardTitle>
            </CardHeader>
            <CardContent className="grid">
              {broadcastPartners.map((partner) => (
                <React.Fragment key={partner.id}>
                  <BroadcastPartnerLink partner={partner} />
                  <Separator variant="gradient" gradientDirection="toRight" />
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
          <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden md:block" />
        </div>
      </Section>
    </PaddingGlobal>
  );
}

