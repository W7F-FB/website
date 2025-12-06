"use client"

import { F9MatchData, F9TeamData, F9Team } from "@/types/opta-feeds/f9-match";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument, TournamentDocument, BroadcastPartnersDocument } from "@/../prismicio-types";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import type { F2MatchPreviewsResponse, F2EntityTeam } from "@/types/opta-feeds/f2-match-preview";
import { removeW7F } from "@/lib/opta/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { FastDash } from "@/components/ui/fast-dash";
import { formatGameDate, normalizeDateString } from "@/lib/utils";
import { CaretFilledIcon, InformationCircleIcon, StadiumIcon, StreamIcon } from "@/components/website-base/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BroadcastPartnerButton } from "../broadcast-partner";
import { useState, useEffect, useMemo } from "react";
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9";
import { Countdown } from "@/components/ui/countdown";
import { parseISO } from "date-fns";
import { Status, StatusIndicator } from "@/components/ui/status";
import { StreamingAvailabilityDialog } from "../streaming-availability-dialog";

interface MatchHeroProps {
  f9MatchData?: F9MatchData | null;
  homeTeamData?: F9TeamData | null;
  awayTeamData?: F9TeamData | null;
  homeTeam?: F9Team;
  awayTeam?: F9Team;
  homeTeamPrismic?: TeamDocument | null;
  awayTeamPrismic?: TeamDocument | null;
  homeTeamFromF2?: F2EntityTeam;
  awayTeamFromF2?: F2EntityTeam;
  f2Preview?: F2MatchPreviewsResponse | null;
  tournament?: TournamentDocument | null;
  broadcastPartners?: BroadcastPartnersDocument[];
  f1FixturesData?: F1FixturesResponse | null;
  streamingLink?: string | null;
  teamRecords?: TeamRecord[];
}

export default function MatchHero({ f9MatchData, homeTeamData, awayTeamData, homeTeam, awayTeam, homeTeamPrismic, awayTeamPrismic, homeTeamFromF2, awayTeamFromF2, f2Preview, tournament, broadcastPartners, f1FixturesData, streamingLink, teamRecords = [] }: MatchHeroProps) {
  const homeTeamColor = homeTeamPrismic?.data.color_primary || undefined;
  const awayTeamColor = awayTeamPrismic?.data.color_primary || undefined;

  const [displayPartners, setDisplayPartners] = useState<BroadcastPartnersDocument[]>(broadcastPartners?.slice(0, 2) || []);

  useEffect(() => {
    if (broadcastPartners && broadcastPartners.length > 0) {
      const shuffled = [...broadcastPartners].sort(() => Math.random() - 0.5).slice(0, 2);
      setDisplayPartners(shuffled);
    }
  }, [broadcastPartners]);

  // Use DateUtc if available (from F9), otherwise use Date and treat as UTC
  const rawDateString = f9MatchData?.MatchInfo.Date || f2Preview?.MatchPreviews?.Match?.MatchData?.MatchInfo?.Date;
  const matchDateString = rawDateString ? rawDateString.replace(' ', 'T') + 'Z' : null;

  const matchDay = useMemo(() => {
    if (!f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData || !matchDateString) return null;

    const allMatches = f1FixturesData.SoccerFeed.SoccerDocument.MatchData;
    const groupStageMatches = allMatches.filter(match => match.MatchInfo.RoundType === "Round");
    const currentMatchDate = normalizeDateString(matchDateString);
    const sortedDates = [...new Set(groupStageMatches.map(m => normalizeDateString(m.MatchInfo.Date)))].sort();
    const matchDayIndex = sortedDates.indexOf(currentMatchDate);

    return matchDayIndex !== -1 ? matchDayIndex + 1 : null;
  }, [f1FixturesData, matchDateString]);
  const gameDate = matchDateString ? formatGameDate(matchDateString) : { month: "", day: "", time: "" };
  const matchDate = matchDateString ? parseISO(matchDateString) : null;
  const isPreGame = !f9MatchData || f9MatchData.MatchInfo.Period === "PreMatch";
  const stadium = tournament?.data.stadium_name || ""

  const homeScore = homeTeamData?.Score ?? 0;
  const awayScore = awayTeamData?.Score ?? 0;

  const isFinal = f9MatchData?.MatchInfo.Period === "FullTime" || f9MatchData?.MatchInfo.Period === "FullTime90" || f9MatchData?.MatchInfo.PostMatch === "1";
  const winnerRef = f9MatchData?.MatchInfo.Result?.Winner || f9MatchData?.MatchInfo.Result?.MatchWinner;
  const homeIsWinning = isFinal && (winnerRef === homeTeamData?.TeamRef || winnerRef === "Home");
  const awayIsWinning = isFinal && (winnerRef === awayTeamData?.TeamRef || winnerRef === "Away");
  const homeIsLosing = isFinal && winnerRef !== undefined && winnerRef !== "Draw" && !homeIsWinning;
  const awayIsLosing = isFinal && winnerRef !== undefined && winnerRef !== "Draw" && !awayIsWinning;

  const getMatchStatus = () => {
    if (!f9MatchData) return "";
    const period = f9MatchData.MatchInfo.Period;
    if (period === "FullTime" || period === "FullTime90" || f9MatchData.MatchInfo.PostMatch === "1") return "FT";
    if (period === "HalfTime") return "HT";
    if (period === "FirstHalf" || period === "SecondHalf") return "LIVE";
    return "";
  };

  const homeTeamShortName = homeTeamPrismic?.data.key || homeTeamFromF2?.ShortName || null;
  const awayTeamShortName = awayTeamPrismic?.data.key || awayTeamFromF2?.ShortName || null;

  const homeTeamFullName = removeW7F(
    homeTeamPrismic?.data.name ||
    homeTeam?.Name ||
    homeTeamFromF2?.ShortName ||
    homeTeamFromF2?.value ||
    'Home Team'
  );
  const awayTeamFullName = removeW7F(
    awayTeamPrismic?.data.name ||
    awayTeam?.Name ||
    awayTeamFromF2?.ShortName ||
    awayTeamFromF2?.value ||
    'Away Team'
  );

  const recordsMap = useMemo(() => {
    const map = new Map<string, { wins: number; losses: number }>();
    for (const record of teamRecords) {
      map.set(record.optaNormalizedTeamId, { wins: record.wins, losses: record.losses });
    }
    return map;
  }, [teamRecords]);

  const homeTeamOptaId = homeTeamPrismic?.data.opta_id;
  const awayTeamOptaId = awayTeamPrismic?.data.opta_id;

  const homeStanding = homeTeamOptaId ? recordsMap.get(homeTeamOptaId) : null;
  const awayStanding = awayTeamOptaId ? recordsMap.get(awayTeamOptaId) : null;

  const formatRecord = (record: { wins: number; losses: number } | null | undefined) => {
    if (!record) return null;
    return `${record.wins}-${record.losses}`;
  };

  const daznPartner = broadcastPartners?.find(p => p.uid === "dazn");
  const daznStreamLink = daznPartner?.data.streaming_link || streamingLink || "#";

  return (
    <Card className="p-0 gap-0 bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="px-4 md:px-6 py-3 !pb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0 bg-muted/30 border-b text-xs md:text-sm text-muted-foreground/75">
        {stadium && (
          <div className="font-headers flex items-center gap-2">
            <StadiumIcon size={16} />
            <span className="truncate">{stadium}</span>
          </div>
        )}
        <div className="flex items-center gap-2 font-headers font-medium uppercase">
          {matchDay && `Match Day ${matchDay}`}
          <FastDash />
          {gameDate.time ? `${gameDate.month} ${gameDate.day}, ${gameDate.time} EST` : ""}
        </div>
      </CardHeader>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center relative p-4 px-3 md:p-8 md:px-8 gap-6">
        <div
          className="absolute top-0 lg:-left-48 lg:w-80 w-60 -left-42 -skew-x-[var(--skew-btn)] h-full pointer-events-none"
          style={homeTeamColor ? { backgroundImage: `linear-gradient(to right, ${homeTeamColor}, transparent)` } : undefined}
        />
        <div
          className=" absolute top-0 lg:-right-48 lg:w-80 w-60 -right-42 skew-x-[var(--skew-btn)] h-full pointer-events-none"
          style={awayTeamColor ? { backgroundImage: `linear-gradient(to left, ${awayTeamColor}, transparent)` } : undefined}
        />
        <div className="relative w-fit">
          <Link
            href={homeTeamPrismic?.uid ? `/club/${homeTeamPrismic.uid}` : "#"}
            className="flex flex-col md:flex-row relative z-2 items-center lg:gap-4 gap-1 md:gap-2.5 hover:underline"
          >
            <div className="size-8 lg:size-18 relative">
              {homeTeamPrismic?.data.logo && (
                <PrismicNextImage
                  field={homeTeamPrismic.data.logo}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="text-center md:text-left">
              <div className="font-headers lg:text-xl text-base font-medium">
                {homeTeamShortName && (
                  <span className="md:hidden">{homeTeamShortName}</span>
                )}
                <span className={homeTeamShortName ? "hidden md:inline" : ""}>{homeTeamFullName}</span>
              </div>
              {formatRecord(homeStanding) && (
                <div className="lg:text-lg text-base text-muted-foreground mt-0.5">{formatRecord(homeStanding)}</div>
              )}
            </div>
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center gap-5">
          {(getMatchStatus() === "LIVE" || getMatchStatus() === "HT") && (
            <Status className="p-0 bg-transparent border-0 gap-3">
              <StatusIndicator className="text-destructive size-3" />
              <span className="tracking-widest lg:text-base text-xs">LIVE{f9MatchData?.Stat?.find(stat => stat.Type === "match_time")?.value ? <span className="hidden text-muted-foreground font-medium ml-1"> &apos;{f9MatchData.Stat.find(stat => stat.Type === "match_time")?.value}</span> : ""}</span>
            </Status>
          )}
          {isPreGame ? (
            <div className="flex-shrink flex flex-col items-center justify-center leading-none gap-2.5">
              <div className="text-xs uppercase text-muted-foreground/70 font-headers">Starts In</div>
              {matchDate && (
                <Countdown
                  targetDate={matchDate}
                  className="lg:text-xl text-sm font-semibold font-headers"
                />
              )}
              {gameDate.time && (
                <div className="lg:text-base text-sm text-muted-foreground mt-1">{gameDate.time} EST</div>
              )}
            </div>
          ) : (
            <div className="flex-shrink lg:text-6xl text-4xl font-semibold flex items-center justify-center lg:gap-10 gap-4 leading-none">
              <div className={`relative ${homeIsLosing ? "text-foreground/60" : "text-foreground"}`}>
                {homeIsWinning && (
                  <CaretFilledIcon className="size-1.5 lg:size-3  absolute lg:-left-6 -left-3 top-1/2 -translate-y-1/2" />
                )}
                <div className="max-h-[0.8em]">
                  {homeScore}
                </div>
              </div>
              {getMatchStatus() && (
                <div className="lg:text-lg text-sm font-normal text-muted-foreground max-h-[1em]">{getMatchStatus()}</div>
              )}
              <div className={`relative ${awayIsLosing ? "text-foreground/60" : "text-foreground"}`}>
                {awayIsWinning && (
                  <CaretFilledIcon className="size-1.5 lg:size-3 -mt-0.5 absolute lg:-right-6 -right-3 top-1/2 -translate-y-1/2 scale-x-[-1]" />
                )}
                <div className="max-h-[0.8em]">
                  {awayScore}
                </div>
              </div>
            </div>
          )}
          {tournament?.data.status !== "Complete" && (
            <div className="hidden lg:flex items-center gap-2 mt-2">
              <Button asChild variant="outline" className="font-[500]">
                <Link href={daznStreamLink} target="_blank" rel="noopener noreferrer">
                  <StreamIcon className="size-3" />
                  Stream
                </Link>
              </Button>
              <StreamingAvailabilityDialog broadcastPartners={broadcastPartners || []}>
                <Button variant="outline" size="icon">
                  <InformationCircleIcon className="size-4" />
                </Button>
              </StreamingAvailabilityDialog>
            </div>
          )}
          {tournament?.data.status !== "Complete" && (
            <div className="flex lg:hidden items-center gap-2 mt-2">
              <Button asChild variant="outline" size="sm" className="text-xs font-[500]">
                <Link href={daznStreamLink} target="_blank" rel="noopener noreferrer">
                  <StreamIcon className="size-3" />
                  Stream
                </Link>
              </Button>
              <StreamingAvailabilityDialog broadcastPartners={broadcastPartners || []}>
                <Button variant="outline" size="sm" className="text-xs">
                  <InformationCircleIcon className="size-4" />
                </Button>
              </StreamingAvailabilityDialog>
            </div>
          )}
        </div>
        <div className="relative w-fit ml-auto">
          <Link
            href={awayTeamPrismic?.uid ? `/club/${awayTeamPrismic.uid}` : "#"}
            className="flex flex-col-reverse md:flex-row relative z-2 items-center lg:gap-4 gap-1 md:gap-2.5 justify-end hover:underline"
          >
            <div className="text-center md:text-right">
              <div className="font-headers lg:text-xl text-sm font-medium">
                {awayTeamShortName && (
                  <span className="md:hidden">{awayTeamShortName}</span>
                )}
                <span className={awayTeamShortName ? "hidden md:inline" : ""}>{awayTeamFullName}</span>
              </div>
              {formatRecord(awayStanding) && (
                <div className="lg:text-lg text-base text-muted-foreground mt-0.5">{formatRecord(awayStanding)}</div>
              )}
            </div>
            <div className="size-8 lg:size-18 relative">
              {awayTeamPrismic?.data.logo && (
                <PrismicNextImage
                  field={awayTeamPrismic.data.logo}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </Link>
        </div>
        {displayPartners.length < -1 && (
          <div className="col-span-full px-6 text-center text-xs flex flex-col gap-2 items-center pt-4 md:pt-0">
            <div className="font-headers text-xs uppercase font-medium text-muted-foreground">Stream Free</div>
            <div className="grid grid-flow-col gap-2" style={{ gridTemplateColumns: `repeat(${displayPartners.length}, minmax(0, 1fr))` }}>
              {displayPartners.map((partner) => (
                <BroadcastPartnerButton branded key={partner.id} partner={partner} variant="outline" size="sm" className="h-auto py-1" />
              ))}
            </div>
          </div>
        )}
      </div>

    </Card>
  );
}