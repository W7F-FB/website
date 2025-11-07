import { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument } from "@/../prismicio-types";

interface MatchHeroProps {
  matchData: F1MatchData;
  homeTeam?: F1TeamData;
  awayTeam?: F1TeamData;
  homeTeamPrismic?: TeamDocument | null;
  awayTeamPrismic?: TeamDocument | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MatchHero({ matchData: _matchData, homeTeam, awayTeam, homeTeamPrismic, awayTeamPrismic }: MatchHeroProps) {
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