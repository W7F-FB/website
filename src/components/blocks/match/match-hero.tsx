"use client"

import { F9MatchData, F9TeamData, F9Team } from "@/types/opta-feeds/f9-match";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument, TournamentDocument, BroadcastPartnersDocument } from "@/../prismicio-types";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import { Card, CardHeader } from "@/components/ui/card";
import { FastDash } from "@/components/ui/fast-dash";
import { formatGameDate, normalizeDateString } from "@/lib/utils";
import { CaretFilledIcon, StadiumIcon } from "@/components/website-base/icons";
import { BroadcastPartnerButton } from "../broadcast-partner";
import { useState, useEffect, useMemo } from "react";

interface MatchHeroProps {
  f9MatchData: F9MatchData;
  homeTeamData: F9TeamData;
  awayTeamData: F9TeamData;
  homeTeam?: F9Team;
  awayTeam?: F9Team;
  homeTeamPrismic?: TeamDocument | null;
  awayTeamPrismic?: TeamDocument | null;
  tournament?: TournamentDocument | null;
  broadcastPartners?: BroadcastPartnersDocument[];
  f1FixturesData?: F1FixturesResponse | null;
}

export default function MatchHero({ f9MatchData, homeTeamData, awayTeamData, homeTeam, awayTeam, homeTeamPrismic, awayTeamPrismic, tournament, broadcastPartners, f1FixturesData }: MatchHeroProps) {
  const homeTeamColor = homeTeamPrismic?.data.color_primary || undefined;
  const awayTeamColor = awayTeamPrismic?.data.color_primary || undefined;

  const [displayPartners, setDisplayPartners] = useState<BroadcastPartnersDocument[]>(broadcastPartners?.slice(0, 2) || []);

  useEffect(() => {
    if (broadcastPartners && broadcastPartners.length > 0) {
      const shuffled = [...broadcastPartners].sort(() => Math.random() - 0.5).slice(0, 2);
      setDisplayPartners(shuffled);
    }
  }, [broadcastPartners]);

  const matchDay = useMemo(() => {
    if (!f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData) return null;
    
    const allMatches = f1FixturesData.SoccerFeed.SoccerDocument.MatchData;
    const groupStageMatches = allMatches.filter(match => match.MatchInfo.RoundType === "Round");
    const currentMatchDate = normalizeDateString(f9MatchData.MatchInfo.Date);
    const sortedDates = [...new Set(groupStageMatches.map(m => normalizeDateString(m.MatchInfo.Date)))].sort();
    const matchDayIndex = sortedDates.indexOf(currentMatchDate);
    
    return matchDayIndex !== -1 ? matchDayIndex + 1 : null;
  }, [f1FixturesData, f9MatchData.MatchInfo.Date]);

  const gameDate = formatGameDate(f9MatchData.MatchInfo.Date)
  const stadium = tournament?.data.stadium_name || ""

  const homeScore = homeTeamData.Score ?? 0;
  const awayScore = awayTeamData.Score ?? 0;

  const isFinal = f9MatchData.MatchInfo.Period === "FullTime" || f9MatchData.MatchInfo.Period === "FullTime90" || f9MatchData.MatchInfo.PostMatch === "1";
  const winnerRef = f9MatchData.MatchInfo.Result?.Winner || f9MatchData.MatchInfo.Result?.MatchWinner;
  const homeIsWinning = isFinal && (winnerRef === homeTeamData.TeamRef || winnerRef === "Home");
  const awayIsWinning = isFinal && (winnerRef === awayTeamData.TeamRef || winnerRef === "Away");
  const homeIsLosing = isFinal && winnerRef !== undefined && winnerRef !== "Draw" && !homeIsWinning;
  const awayIsLosing = isFinal && winnerRef !== undefined && winnerRef !== "Draw" && !awayIsWinning;

  const getMatchStatus = () => {
    const period = f9MatchData.MatchInfo.Period;
    if (period === "FullTime" || period === "FullTime90" || f9MatchData.MatchInfo.PostMatch === "1") return "FT";
    if (period === "HalfTime") return "HT";
    if (period === "FirstHalf" || period === "SecondHalf") return "LIVE";
    return "";
  };

  return (
    <Card className="p-0 gap-0 bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="px-6 py-3 !pb-3 flex items-center justify-between bg-muted/30 border-b text-sm text-muted-foreground/75">
        {stadium && (
          <div className="font-headers flex items-center gap-2">
            <StadiumIcon size={16} />
            {stadium}
          </div>
        )}
        <div className="flex items-center gap-2 font-headers font-medium uppercase">
          {matchDay && `Match Day ${matchDay}`}
          <FastDash />
          {gameDate.time ? `${gameDate.month} ${gameDate.day}, ${gameDate.time} ET` : ""}
        </div>
      </CardHeader>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center relative p-8 gap-6">
        <div
          className="absolute top-0 -left-48 w-80 -skew-x-[var(--skew-btn)] h-full pointer-events-none"
          style={homeTeamColor ? { backgroundImage: `linear-gradient(to right, ${homeTeamColor}, transparent)` } : undefined}
        />
        <div
          className="absolute top-0 -right-48 w-80 skew-x-[var(--skew-btn)] h-full pointer-events-none"
          style={awayTeamColor ? { backgroundImage: `linear-gradient(to left, ${awayTeamColor}, transparent)` } : undefined}
        />
        <div className="relative">
          <div className="flex relative z-2 items-center gap-4">
            <div className="w-18 h-18 relative">
              {homeTeamPrismic?.data.logo && (
                <PrismicNextImage
                  field={homeTeamPrismic.data.logo}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="font-headers text-xl font-medium">
              {homeTeamPrismic?.data.name || homeTeam?.Name || 'Home Team'}
            </div>
          </div>
        </div>
        <div className="flex flex-1 gap-6 items-center">
          <div className="flex-shrink text-6xl font-semibold flex items-center justify-center gap-10 leading-none">
            <div className={`relative ${homeIsLosing ? "text-foreground/60" : "text-foreground"}`}>
              {homeIsWinning && (
                <CaretFilledIcon className="size-3  absolute -left-6 top-1/2 -translate-y-1/2" />
              )}
              <div className="max-h-[0.8em]">
                {homeScore}
              </div>
            </div>
            {getMatchStatus() && (
              <div className="text-lg font-normal text-muted-foreground max-h-[1em]">{getMatchStatus()}</div>
            )}
            <div className={`relative ${awayIsLosing ? "text-foreground/60" : "text-foreground"}`}>
              {awayIsWinning && (
                <CaretFilledIcon className="size-3 -mt-0.5 absolute -right-6 top-1/2 -translate-y-1/2 scale-x-[-1]" />
              )}
              <div className="max-h-[0.8em]">
                {awayScore}
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center gap-4 justify-end">
          <div className="font-headers text-xl font-medium">
            {awayTeamPrismic?.data.name || awayTeam?.Name || 'Away Team'}
          </div>
          <div className="w-18 h-18 relative">
            {awayTeamPrismic?.data.logo && (
              <PrismicNextImage
                field={awayTeamPrismic.data.logo}
                fill
                className="object-contain"
              />
            )}
          </div>
        </div>
        {displayPartners.length > 0 && (
          <div className="col-span-full px-6 text-center text-xs flex flex-col gap-2 items-center">
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