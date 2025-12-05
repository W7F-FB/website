import { MatchCard } from "@/components/blocks/match/match-card";
import type { TeamDocument } from "../../../../prismicio-types";
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures";
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyMessage } from "@/components/ui/empty-message";
import { ReplayIcon } from "@/components/website-base/icons";

interface UpcomingMatchProps {
  team: TeamDocument;
  fixtures?: F1FixturesResponse | null;
  prismicTeams?: TeamDocument[];
  optaTeams?: F40Team[];
  tournamentSlug: string;
  matchSlugMap?: Map<string, string>;
}

export function UpcomingMatch({ team, fixtures, prismicTeams = [], optaTeams = [], tournamentSlug, matchSlugMap }: UpcomingMatchProps) {
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
    <Card banner className="bg-card/50 border-muted/50">
      <CardHeader>
        <CardTitle>{nextMatch ? "Upcoming Match" : "Highlights"}</CardTitle>
      </CardHeader>

      <CardContent>
        {nextMatch ? (
          <MatchCard
            fixture={nextMatch}
            prismicTeams={prismicTeams}
            optaTeams={optaTeams}
            tournamentSlug={tournamentSlug}
            matchSlugMap={matchSlugMap}
            className="bg-transparent border-0"
          />
        ) : (
          <EmptyMessage className="py-24">
            <ReplayIcon className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            Check back soon for match highlights
          </EmptyMessage>
        )}
      </CardContent>
    </Card>
  );
}
