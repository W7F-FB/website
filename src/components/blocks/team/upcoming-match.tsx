import { MatchCard } from "@/components/blocks/match/match-card";
import type { TeamDocument } from "../../../../prismicio-types";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";

interface UpcomingMatchProps {
  team: TeamDocument;
  fixtures?: F1FixturesResponse | null;
  prismicTeams?: TeamDocument[];
  optaTeams?: F40Team[];
}

export function UpcomingMatch({ team, fixtures, prismicTeams = [], optaTeams = [] }: UpcomingMatchProps) {
  const teamOptaRef = `t${team.data.opta_id}`;
  const allMatches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || [];

  const upcomingMatches = allMatches
    .filter((match) => {
      const isTeamInMatch = match.TeamData.some((team) => team.TeamRef === teamOptaRef);
      const isUpcoming = match.MatchInfo.Period === "PreMatch";
      return isTeamInMatch && isUpcoming;
    })
    .sort((a, b) => {
      return new Date(a.MatchInfo.Date).getTime() - new Date(b.MatchInfo.Date).getTime();
    });

  const nextMatch = upcomingMatches[0];

  return (
    <Card banner className="bg-card/50 border-muted/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle>{nextMatch ? "Upcoming Match" : "Match Highlights"}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 flex flex-col">
        {nextMatch ? (
          <MatchCard
            fixture={nextMatch}
            prismicTeams={prismicTeams}
            optaTeams={optaTeams}
            className="bg-transparent border-0"
          />
        ) : (
          <VideoBanner
            thumbnail="/images/static-media/video-banner.avif"
            videoUrl="https://r2.vidzflow.com/source/a4c227f3-6918-4e29-8c72-b509a9cf3d5c.mp4"
            size="sm"
            className="h-full w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}
