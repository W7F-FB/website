"use client";

import React from "react";
import { Section } from "@/components/website-base/padding-containers";
import MatchHero from "@/components/blocks/match/match-hero";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import type { F9MatchData, F9TeamData, F9Team, F9MatchResponse } from "@/types/opta-feeds/f9-match";
import type { F40Team, F40SquadsResponse } from "@/types/opta-feeds/f40-squads-feed";
import type { TeamDocument, TournamentDocument, BroadcastPartnersDocument, BlogDocument } from "../../../../../../../../prismicio-types";
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
import { Button } from "@/components/ui/button";
import { CaretRightIcon, InformationCircleIcon, PlayIcon } from "@/components/website-base/icons";
import { StreamingAvailabilityDialog } from "@/components/blocks/streaming-availability-dialog";
import { PostGrid } from "@/components/blocks/posts/post-grid";
import { EmptyMessage } from "@/components/ui/empty-message";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading";
import { Container } from "@/components/website-base/padding-containers";
import { PrismicLink } from "@prismicio/react";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9";
import type { TeamStats } from "@/lib/v2-utils/team-stats-from-f9";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import {
  ThumbnailCarousel,
  ThumbnailCarouselContent,
  ThumbnailCarouselItem,
  ThumbnailCarouselPrevious,
  ThumbnailCarouselNext,
} from "@/components/ui/thumbnail-carousel";
import Image from "next/image";
import type { MatchHighlight } from "@/lib/supabase/queries/highlights";
import ReactPlayer from "react-player";

function MatchHighlightsCarousel({ highlights }: { highlights: MatchHighlight[] }) {
  const [mainApi, setMainApi] = React.useState<CarouselApi>();
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!mainApi) return;
    const onSelect = () => {
      setPlayingIndex(null);
    };
    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi]);

  return (
    <div className="">
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {highlights.map((highlight, index) => (
            <CarouselItem key={highlight.id}>
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {playingIndex === index ? (
                  <ReactPlayer
                    src={highlight.video_url}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingIndex(index)}
                    className="w-full h-full cursor-pointer group"
                  >
                    <Image
                      src={highlight.thumbnail_url}
                      alt={highlight.title || "Match Highlight"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    <div className="absolute inset-0 w-full h-full bg-black/30 transition-all ease-linear group-hover:bg-black/45" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="z-10 bg-background/30 backdrop-blur-sm group-hover:backdrop-blur-lg transition-all flex items-center justify-center border border-secondary/5 w-14 h-14">
                        <PlayIcon className="size-4" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <ThumbnailCarousel mainApi={mainApi}>
        <div className="w-full">
          <ThumbnailCarouselContent className="p-3">
            {highlights.map((highlight, index) => (
              <ThumbnailCarouselItem
                key={highlight.id}
                index={index}
              >
                <Image
                  src={highlight.thumbnail_url}
                  alt={highlight.title || "Match Highlight"}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </ThumbnailCarouselItem>
            ))}
          </ThumbnailCarouselContent>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-0 border-t border-border">
            <ThumbnailCarouselPrevious asChild>
              <Button variant="outline" className="w-full h-12 border-0">
                <CaretRightIcon className="size-4 rotate-180" />
              </Button>
            </ThumbnailCarouselPrevious>
            <div className="w-px h-full bg-border"></div>
            <ThumbnailCarouselNext asChild>
              <Button variant="outline" className="w-full h-12 border-0">
                <CaretRightIcon className="size-4" />
              </Button>
            </ThumbnailCarouselNext>
          </div>
        </div>
      </ThumbnailCarousel>
    </div>
  );
}

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
  matchBlogs?: BlogDocument[];
  teamRecords?: TeamRecord[];
  teamStats?: TeamStats[];
  liveMinute?: string | null;
  highlights?: MatchHighlight[];
  f9FeedsMap?: Map<string, F9MatchResponse>;
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
  matchBlogs = [],
  teamRecords,
  teamStats,
  liveMinute,
  highlights = [],
  f9FeedsMap,
}: Props) {
  const matchData = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData;
  const f1Matches = Array.isArray(matchData) ? matchData : (matchData ? [matchData] : []);
  const currentMatchFromF1 = f1Matches.find((m: F1MatchData) => normalizeOptaId(m.uID) === normalizeOptaId(matchId));
  const postMatch = f9MatchData?.MatchInfo?.PostMatch;
  const isMatchComplete = currentMatchFromF1?.MatchInfo?.Period === "FullTime" || postMatch === 1 || postMatch === "1";
  const isPreGame = !f9MatchData || f9MatchData.MatchInfo.Period === "PreMatch";
  const hasCommentary = (commentary?.Commentary?.message?.length ?? 0) > 0;

  const standouts = f9MatchData && homeTeamData && awayTeamData ? calculateMatchStandouts(
    {
      SoccerFeed: {
        TimeStamp: "2025-01-01T00:00:00Z",
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
        teamRecords={teamRecords}
        liveMinute={liveMinute}
      />
      <Separator variant="gradient" className="my-8" />
      <Section padding="none" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8 relative">
          {highlights.length > 0 && (
            <Card banner className="w-full gap-0">
              <CardHeader>
                <CardTitle>Match Highlights</CardTitle>
              </CardHeader>
              <CardContent className="!p-0 lg:!p-0 gap-0">
                <MatchHighlightsCarousel highlights={highlights} />
              </CardContent>
            </Card>
          )}
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
                teamRecords={teamRecords}
                teamStats={teamStats}
              />
              <TeamSnapshot
                prismicTeam={awayTeamPrismic}
                teamRecords={teamRecords}
                teamStats={teamStats}
              />
            </CardContent>
          </Card>
          <Card banner className="w-full">
            <CardHeader>
              <CardTitle>Play-By-Play</CardTitle>
            </CardHeader>
            <CardContent className="!px-0 lg:!px-4">
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
            <ClubStandingsTable
              prismicTeams={prismicTeams}
              f1FixturesData={f1FixturesData}
              f3StandingsData={f3StandingsData}
              f40Squads={f40Squads}
              tournamentStatus={tournament?.data.status ?? undefined}
              isKnockoutStage={isKnockoutStage}
              teamRecords={teamRecords}
              f9FeedsMap={f9FeedsMap}
            />
          )}
          {hasCommentary && <FastBanner text="FORWARD." position="right" strokeWidth="1.5px" className="hidden lg:block" />}
        </div>
      </Section>
      <Container>
        <Separator variant="gradient" className="my-16" />
        <Section padding="none" id="coverage">
          <SectionHeading variant="split">
            <SectionHeadingSubtitle>Match</SectionHeadingSubtitle>
            <SectionHeadingHeading>Coverage</SectionHeadingHeading>
            <Button asChild size="skew" variant="outline" className="ml-auto mt-auto">
              <PrismicLink href="/news">
                <span>All News</span>
              </PrismicLink>
            </Button>
          </SectionHeading>
          {matchBlogs.length > 0 ? (
            <PostGrid posts={matchBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
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

