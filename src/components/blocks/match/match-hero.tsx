import { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument } from "@/../prismicio-types";

interface MatchHeroProps {
  matchData: F1MatchData;
  homeTeam?: F1TeamData;
  awayTeam?: F1TeamData;
  homeTeamPrismic?: TeamDocument | null;
  awayTeamPrismic?: TeamDocument | null;
  venueName?: string;
}

export default function MatchHero({ matchData, homeTeam, awayTeam, homeTeamPrismic, awayTeamPrismic, venueName }: MatchHeroProps) {
  const matchInfo = matchData.MatchInfo ?? {};
  const homeTeamData = matchData.TeamData.find(t => t.Side === "Home");
  const awayTeamData = matchData.TeamData.find(t => t.Side === "Away");

  const homeScore = homeTeamData?.Score ?? 0;
  const awayScore = awayTeamData?.Score ?? 0;


  const dateUtc: string | undefined = (matchInfo as unknown as { DateUtc?: string }).DateUtc;
  const rawUtc = dateUtc ? dateUtc.replace(' ', 'T') : undefined;
  const rawLocal = matchInfo.Date ? matchInfo.Date.replace(' ', 'T') : undefined;
  const parsedDate = rawUtc ? new Date(`${rawUtc}Z`) : (rawLocal ? new Date(rawLocal) : new Date());

  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Lisbon',
  });
  const lisbonTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Lisbon',
  }).format(parsedDate);
  const formattedTime = `${lisbonTime} WEST`;


  return (
    <div className="p-4 border bg-card">

      <div className="flex flex-row overflow-hidden relative w-full items-center">
        <div className="flex flex-1 flex-row items-center">
          <div className="flex w-full items-center z-10 justify-center">
            <div className="w-18 h-18 relative">
              {homeTeamPrismic?.data.logo && (
                <PrismicNextImage
                  field={homeTeamPrismic.data.logo}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex flex-1 gap-6 items-center">
              <div className="flex-1 text-right">
                {homeTeamPrismic?.data.name || homeTeam?.Name || 'Home Team'}
              </div>
              <div className="flex-shrink text-[3rem] font-bold flex items-center justify-center gap-10 leading-none">
                <div>0</div>
                <div className="text-lg">FT</div>
                <div>0</div>
              </div>
              <div className="flex-1">
                {awayTeamPrismic?.data.name || awayTeam?.Name || 'Away Team'}
              </div>
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
        <div>
        </div>
      </div>
    </div>
  );
}