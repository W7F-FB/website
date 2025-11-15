"use client"

import { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument, TournamentDocument } from "@/../prismicio-types";
import { Card, CardHeader } from "@/components/ui/card";
import { formatGameDate } from "@/lib/utils";
import { CaretFilledIcon } from "@/components/website-base/icons";

interface MatchHeroProps {
  matchData: F1MatchData;
  homeTeam?: F1TeamData;
  awayTeam?: F1TeamData;
  homeTeamPrismic?: TeamDocument | null;
  awayTeamPrismic?: TeamDocument | null;
  tournament?: TournamentDocument | null;
}

export default function MatchHero({ matchData, homeTeam, awayTeam, homeTeamPrismic, awayTeamPrismic, tournament }: MatchHeroProps) {
  const homeTeamColor = homeTeamPrismic?.data.color_primary || undefined;
  const awayTeamColor = awayTeamPrismic?.data.color_primary || undefined;

  const gameDate = formatGameDate(matchData.MatchInfo.Date)
  const stadium = tournament?.data.stadium_name || matchData.MatchInfo.Venue || ""

  const homeTeamData = matchData.TeamData.find(team => team.Side === "Home");
  const awayTeamData = matchData.TeamData.find(team => team.Side === "Away");
  const homeScore = homeTeamData?.Score ?? 0;
  const awayScore = awayTeamData?.Score ?? 0;

  const isFinal = matchData.MatchInfo.Period === "FullTime" || matchData.MatchInfo.Period === "PostMatch";
  const winnerRef = matchData.MatchInfo.GameWinner || matchData.MatchInfo.MatchWinner;
  const homeIsWinning = isFinal && winnerRef === homeTeamData?.TeamRef;
  const awayIsWinning = isFinal && winnerRef === awayTeamData?.TeamRef;
  const homeIsLosing = isFinal && winnerRef !== undefined && !homeIsWinning;
  const awayIsLosing = isFinal && winnerRef !== undefined && !awayIsWinning;

  const getMatchStatus = () => {
    const period = matchData.MatchInfo.Period;
    if (period === "FullTime" || period === "PostMatch") return "FT";
    if (period === "FirstHalf") return "HT";
    if (period === "SecondHalf") return "LIVE";
    return "";
  };

  return (
    <Card className="p-0 gap-0 bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="px-6 py-3 !pb-3 flex items-center justify-between bg-muted/30 border-b text-sm text-muted-foreground/75">
        <div>
          {gameDate.time ? `${gameDate.month} ${gameDate.day}, ${gameDate.time} ET` : ""}
        </div>
        <div>
          {stadium}
        </div>
      </CardHeader>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="relative p-8">
          <div
            className="absolute top-0 -left-48 w-80 -skew-x-[var(--skew-btn)] h-full"
            style={homeTeamColor ? { backgroundImage: `linear-gradient(to right, ${homeTeamColor}, transparent)` } : undefined}
          />
          <div className="flex relative  items-center gap-4">
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
                <CaretFilledIcon className="size-3 -mt-0.5 absolute -left-6 top-1/2 -translate-y-1/2" />
              )}
              {homeScore}
            </div>
            {getMatchStatus() && (
              <div className="text-lg font-normal text-muted-foreground">{getMatchStatus()}</div>
            )}
            <div className={`relative ${awayIsLosing ? "text-foreground/60" : "text-foreground"}`}>
              {awayIsWinning && (
                <CaretFilledIcon className="size-3 -mt-0.5 absolute -right-6 top-1/2 -translate-y-1/2 scale-x-[-1]" />
              )}
              {awayScore}
            </div>
          </div>
        </div>
        <div className="relative p-8 flex items-center gap-4 justify-end">
          <div
            className="absolute top-0 -right-48 w-80 skew-x-[var(--skew-btn)] h-full"
            style={awayTeamColor ? { backgroundImage: `linear-gradient(to left, ${awayTeamColor}, transparent)` } : undefined}
          />
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
      </div>
    </Card>
  );
}