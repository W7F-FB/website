"use client";

import React, { useMemo } from "react";
import { Section } from "@/components/website-base/padding-containers";
import MatchHero from "@/components/blocks/match/match-hero";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import type { F9MatchData, F9TeamData, F9Team } from "@/types/opta-feeds/f9-match";
import type { F40Team, F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed";
import type { TeamDocument, TournamentDocument, BroadcastPartnersDocument } from "../../../../../../../../prismicio-types";
import type { F13CommentaryResponse } from "@/types/opta-feeds/f13-commentary";
import type { F24EventDetailsFeed } from "@/types/opta-feeds/f24-match-events";
import type { F1FixturesResponse, F1MatchData } from "@/types/opta-feeds/f1-fixtures";
import type { F2MatchPreviewsResponse, F2EntityTeam } from "@/types/opta-feeds/f2-match-preview";
import { normalizeOptaId } from "@/lib/opta/utils";
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchLineups } from "@/components/blocks/match/match-lineups";
import { MatchRosters } from "@/components/blocks/match/match-rosters";
import { BroadcastPartnerLink } from "@/components/blocks/broadcast-partner";
import { Separator } from "@/components/ui/separator";
import { PlayerLeaderCard } from "@/components/blocks/players/player-leader-card";
import { calculateMatchStandouts } from "@/lib/opta/calculate-match-standouts";
import { H3 } from "@/components/website-base/typography";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { ClubStandingsTable } from "@/components/blocks/tournament/club-standings-table";
import { FastBanner } from "@/components/blocks/fast-banners";
import { TeamSnapshot } from "@/components/blocks/team/team-snapshot";
import { calculateTeamRecordsFromMatches } from "@/app/(website)/(subpages)/tournament/utils";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@/components/website-base/icons";
import { StreamingAvailabilityDialog } from "@/components/blocks/streaming-availability-dialog";

type Props = {
  f9MatchData?: F9MatchData | null;
  homeTeamData?: F9TeamData | null;
  awayTeamData?: F9TeamData | null;
  homeTeam?: F9Team;
  awayTeam?: F9Team;
  homeSquadTeam?: F40Team;
  awaySquadTeam?: F40Team;
  homeTeamPrismic: TeamDocument | null;
  awayTeamPrismic: TeamDocument | null;
  homeTeamFromF2?: F2EntityTeam;
  awayTeamFromF2?: F2EntityTeam;
  f2Preview?: F2MatchPreviewsResponse | null;
  matchId: string;
  competitionId: string;
  tournament: TournamentDocument | null;
  commentary: F13CommentaryResponse | null;
  f24Events: F24EventDetailsFeed | null;
  broadcastPartners: BroadcastPartnersDocument[];
  prismicTeams: TeamDocument[];
  f1FixturesData: F1FixturesResponse;
  f3StandingsData: F3StandingsResponse | null;
  f40Squads?: F40SquadsResponse | null;
  isKnockoutStage: boolean;
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
  homeTeamFromF2,
  awayTeamFromF2,
  f2Preview,
  matchId,
  competitionId,
  tournament,
  commentary,
  f24Events,
  broadcastPartners,
  prismicTeams,
  f1FixturesData,
  f3StandingsData,
  f40Squads,
  isKnockoutStage,
}: Props) {
  const f1Matches = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData || [];
  const currentMatchFromF1 = f1Matches.find((m: F1MatchData) => normalizeOptaId(m.uID) === normalizeOptaId(matchId));
  const isMatchComplete = currentMatchFromF1?.MatchInfo?.Period === "FullTime";
  const isPreGame = !f9MatchData || f9MatchData.MatchInfo.Period === "PreMatch";
  const hasCommentary = (commentary?.Commentary?.message?.length ?? 0) > 0;

  const standouts = f9MatchData && homeTeamData && awayTeamData ? calculateMatchStandouts(
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
  ) : {
    scoringLeader: null,
    defensiveLeader: null,
    gkLeader: null
  }

  const teamRecords = useMemo(() => {
    return calculateTeamRecordsFromMatches(f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData);
  }, [f1FixturesData]);

  const getTeamIdWithPrefix = (optaId: string | number | null | undefined) => {
    if (!optaId) return null;
    const idStr = optaId.toString();
    return idStr.startsWith('t') ? idStr : `t${idStr}`;
  };

  const formatRecord = (record: { wins: number; losses: number } | null | undefined) => {
    if (!record) return null;
    return `${record.wins}-${record.losses}`;
  };

  const homeTeamId = getTeamIdWithPrefix(homeTeamPrismic?.data.opta_id);
  const awayTeamId = getTeamIdWithPrefix(awayTeamPrismic?.data.opta_id);

  const homeStanding = homeTeamId ? teamRecords.get(homeTeamId) : null;
  const awayStanding = awayTeamId ? teamRecords.get(awayTeamId) : null;

  const f3TeamStandings = f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.[0]?.TeamRecord || [];
  const homeF3Standing = homeTeamId ? f3TeamStandings.find(t => t.TeamRef === homeTeamId) : null;
  const awayF3Standing = awayTeamId ? f3TeamStandings.find(t => t.TeamRef === awayTeamId) : null;

  return (
    <>
      <MatchHero
        f9MatchData={f9MatchData}
        homeTeamData={homeTeamData}
        awayTeamData={awayTeamData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamPrismic={homeTeamPrismic}
        awayTeamPrismic={awayTeamPrismic}
        homeTeamFromF2={homeTeamFromF2}
        awayTeamFromF2={awayTeamFromF2}
        f2Preview={f2Preview}
        tournament={tournament}
        broadcastPartners={broadcastPartners}
        f1FixturesData={f1FixturesData}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8 relative">
          <Card banner className="w-full">
            <CardHeader>
              <CardTitle>{homeTeamData && awayTeamData ? "Lineups" : "Rosters"}</CardTitle>
            </CardHeader>
            <CardContent>
              {homeTeamData && awayTeamData ? (
                <MatchLineups
                  homeTeamData={homeTeamData}
                  awayTeamData={awayTeamData}
                  homeSquadTeam={homeSquadTeam}
                  awaySquadTeam={awaySquadTeam}
                  homeLogo={homeTeamPrismic?.data?.logo?.url || null}
                  awayLogo={awayTeamPrismic?.data?.logo?.url || null}
                  f24Events={f24Events}
                />
              ) : (homeSquadTeam || awaySquadTeam) ? (
                <MatchRosters
                  homeSquadTeam={homeSquadTeam}
                  awaySquadTeam={awaySquadTeam}
                  homeLogo={homeTeamPrismic?.data?.logo?.url || null}
                  awayLogo={awayTeamPrismic?.data?.logo?.url || null}
                />
              ) : (
                <p className="text-muted-foreground text-sm">Rosters will be available soon</p>
              )}
            </CardContent>
          </Card>
          {hasCommentary && <FastBanner text="FAST." position="left" strokeWidth="1px" uppercase className="hidden lg:block" />}
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
          {isMatchComplete && (standouts.scoringLeader || standouts.defensiveLeader || standouts.gkLeader) && (
            <Card banner className="w-full">
              <CardHeader>
                <CardTitle>Standouts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Offensive</H3>
                  {standouts.scoringLeader && (
                    <PlayerLeaderCard {...standouts.scoringLeader} />
                  )}
                </div>
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Defensive</H3>
                  {standouts.defensiveLeader && (
                    <PlayerLeaderCard {...standouts.defensiveLeader} />
                  )}
                </div>
                <div>
                  <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Goalkeeper</H3>
                  {standouts.gkLeader && (
                    <PlayerLeaderCard {...standouts.gkLeader} />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          <Card banner className="w-full">
            <CardHeader>
              <CardTitle>Matchup</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <TeamSnapshot
                prismicTeam={homeTeamPrismic}
                f3Standing={homeF3Standing}
                record={formatRecord(homeStanding)}
              />
              <TeamSnapshot
                prismicTeam={awayTeamPrismic}
                f3Standing={awayF3Standing}
                record={formatRecord(awayStanding)}
              />
            </CardContent>
          </Card>
          <Card banner className="w-full">
            <CardHeader>
              <CardTitle>Play-By-Play</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayByPlay commentary={commentary} isPreGame={isPreGame} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8 relative">
          {tournament?.uid === "fort-lauderdale" && broadcastPartners.length > 0 && (
            <Card banner className="w-full">
              <CardHeader>
                <CardTitle>Stream Free</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {(() => {
                  const daznPartner = broadcastPartners.find(p => p.uid === "dazn");
                  const otherPartners = broadcastPartners.filter(p => p.uid !== "dazn");
                  return (
                    <>
                      {daznPartner && (
                        <BroadcastPartnerLink
                          key={daznPartner.id}
                          partner={daznPartner}
                          showName
                          size="lg"
                          className="border-y border-muted/50"
                        />
                      )}
                      {otherPartners.length > 0 && (
                        <div className="grid grid-cols-3 w-full gap-x-1.5">
                          {otherPartners.map((partner, index) => {
                            const totalPartners = otherPartners.length;
                            const itemsInLastRow = totalPartners % 3 || 3;
                            const lastRowStartIndex = totalPartners - itemsInLastRow;
                            const isNotOnLastRow = index < lastRowStartIndex;
                            return (
                              <BroadcastPartnerLink
                                size="sm"
                                logoSize="lg:size-6 size-4.5"
                                key={partner.id}
                                partner={partner}
                                showName
                                noLink
                                className={isNotOnLastRow ? "border-t border-border/50" : "border-y border-border/50"}
                              />
                            );
                          })}
                        </div>
                      )}
                      <StreamingAvailabilityDialog broadcastPartners={broadcastPartners}>
                        <Button variant="secondary" size="sm" className="w-full gap-2.5">
                          <InformationCircleIcon className="size-3.5" /> Streaming Availability
                        </Button>
                      </StreamingAvailabilityDialog>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
          {prismicTeams.length > 0 && (
            <Card banner className="w-full">
              <CardHeader>
                <CardTitle>Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <ClubStandingsTable
                  prismicTeams={prismicTeams}
                  f1FixturesData={f1FixturesData}
                  f3StandingsData={f3StandingsData}
                  f40Squads={f40Squads}
                  tournamentStatus={tournament?.data.status ?? undefined}
                  isKnockoutStage={isKnockoutStage}
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
          {hasCommentary && <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden lg:block" />}
        </div>
      </Section>
    </>
  );
}

