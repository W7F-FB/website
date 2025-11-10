import Image from "next/image";
import { TeamDocument } from "../../../../../prismicio-types";
import { formatMatchStatus, formatScore } from "@/lib/opta/formatters";

interface TournamentNavFeedItemProps {
  team1: TeamDocument | null;
  team1Score: number | null;
  team2: TeamDocument | null;
  team2Score: number | null;
  status: string;
}

export default function TournamentNavFeedItem({
  team1,
  team1Score,
  team2,
  team2Score,
  status,
}: TournamentNavFeedItemProps) {
  const displayStatus = formatMatchStatus(status);
  const formattedTeam1Score = formatScore(team1Score, status);
  const formattedTeam2Score = formatScore(team2Score, status);

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex items-center gap-3">
        {team1?.data?.logo?.url && (
          <div className="relative size-6">
            <Image
              src={team1.data.logo.url}
              alt={team1.data.name || "Team 1"}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex h-6 min-w-7 items-center p-1 pt-2 border border-border/20 bg-muted/20 rounded-sm justify-center leading-none text-lg font-semibold ">
        {formattedTeam1Score}
      </div>

      <div className="flex items-center justify-center rounded px-4 py-2 text-sm font-medium text-muted-foreground/50">
        {displayStatus}
      </div>

      <div className="flex h-6 min-w-7 items-center p-1 pt-2 border border-border/20 bg-muted/20 rounded-sm justify-center leading-none text-lg font-semibold ">
        {formattedTeam2Score}
      </div>

      <div className="flex items-center gap-3">
        {team2?.data?.logo?.url && (
          <div className="relative size-6">
            <Image
              src={team2.data.logo.url}
              alt={team2.data.name || "Team 2"}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

