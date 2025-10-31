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
      <div className="p-3 text-center">
        <span className="text-muted-foreground text-md">
          Venue: {venueName ?? "TBD"}
        </span>
      </div>
      <div className="flex flex-row overflow-hidden relative w-full items-center">
        <div className="flex flex-1 pl-6 flex-row items-center">
          <div className="flex flex-1 items-center z-10 justify-center">
            {homeTeamPrismic?.data.logo && (
              <PrismicNextImage
                field={homeTeamPrismic.data.logo}
                width={50}
                height={50}
                className="object-contain"
              />
            )}
            <div className="flex flex-row items-center justify-end w-full">
              <Button asChild variant="link">
                <Link href={`/teams/${homeTeamData?.TeamRef}`}>
                  {homeTeamPrismic?.data.name || homeTeam?.Name || 'Home Team'}
                </Link>
              </Button>
              <div className="flex flex-col items-center p-2.5">
                <span className="text-2xl font-headers">
                  {homeScore}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-2xl font-headers">-</span>
        </div>
        <div className="flex flex-1 pr-6 flex-row items-center">
          <div className="flex flex-1 flex-row-reverse items-center z-10 justify-center">
            {awayTeamPrismic?.data.logo && (
              <PrismicNextImage
                field={awayTeamPrismic.data.logo}
                width={50}
                height={50}
                className="object-contain"
              />
            )}
            <div className="flex flex-row-reverse items-center justify-end w-full">
              <Button asChild variant="link">
                <Link href={`/teams/${awayTeamData?.TeamRef}`}>
                  {awayTeamPrismic?.data.name || awayTeam?.Name || 'Away Team'}
                </Link>
              </Button>
              <div className="flex flex-col items-center p-2.5">
                <span className="text-2xl font-headers">
                  {awayScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 text-center">
        <span className="text-muted-foreground text-md">
          {formattedDate}, {formattedTime}
        </span>
      </div>
    </div>
  );
}