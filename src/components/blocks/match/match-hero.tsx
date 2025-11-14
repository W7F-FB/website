"use client"

import { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument, TournamentDocument } from "@/../prismicio-types";
import { Card, CardHeader } from "@/components/ui/card";
import { formatGameDate } from "@/lib/utils";

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

  return (
    <Card className="p-0 gap-0 bg-card/50 border-border/50 overflow-hidden">
      <CardHeader className="px-6 py-3 !pb-3 flex items-center justify-between bg-muted/30 border-b text-sm text-muted-foreground/75">
        <div>
          {gameDate.time ? `${gameDate.time} ET` : ""}
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
            <div>0</div>
            <div className="text-lg font-normal text-muted-foreground">FT</div>
            <div>0</div>
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