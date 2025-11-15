import { Section, PaddingGlobal } from "@/components/website-base/padding-containers";
import MatchHero from "@/components/blocks/match/match-hero";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed";
import type { TeamDocument, TournamentDocument } from "../../../../../prismicio-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchLineups } from "@/components/blocks/match/match-lineups";

type Props = {
  matchData: F1MatchData;
  homeTeam: F1TeamData | undefined;
  awayTeam: F1TeamData | undefined;
  homeTeamPrismic: TeamDocument | null;
  awayTeamPrismic: TeamDocument | null;
  homeSquadTeam?: F40Team;
  awaySquadTeam?: F40Team;
  matchId: string;
  competitionId: string;
  seasonId: string;
  tournament: TournamentDocument | null;
};

export default function MatchPageContent({
  matchData,
  homeTeam,
  awayTeam,
  homeTeamPrismic,
  awayTeamPrismic,
  homeSquadTeam,
  awaySquadTeam,
  matchId,
  competitionId,
  seasonId,
  tournament,
}: Props) {
  return (
    <PaddingGlobal>
      <MatchHero
        matchData={matchData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamPrismic={homeTeamPrismic}
        awayTeamPrismic={awayTeamPrismic}
        tournament={tournament}
      />
        <Section padding="md" className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <Card className="bg-card/50 border-border/50 p-0 self-start gap-0">
            <CardHeader className="bg-muted/30 py-4 gap-0 px-4">
              <CardTitle className="text-xl font-medium font-headers tracking-wider uppercase">Rosters</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
            <MatchLineups
              homeTeam={homeSquadTeam}
              awayTeam={awaySquadTeam}
              homeLogo={homeTeamPrismic?.data?.logo?.url || null}
              awayLogo={awayTeamPrismic?.data?.logo?.url || null}
            />
            </CardContent>
          </Card>
          <PlayByPlay className="hidden col-span-2" matchId={matchId} competitionId={competitionId} seasonId={seasonId} />
        </Section>
    </PaddingGlobal>
  );
}

