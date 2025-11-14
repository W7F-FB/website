import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";
import MatchHero from "@/components/blocks/match/match-hero";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import type { TeamDocument, TournamentDocument } from "../../../../../prismicio-types";

type Props = {
  matchData: F1MatchData;
  homeTeam: F1TeamData | undefined;
  awayTeam: F1TeamData | undefined;
  homeTeamPrismic: TeamDocument | null;
  awayTeamPrismic: TeamDocument | null;
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
      <Container>
        <Section padding="md">
          <PlayByPlay matchId={matchId} competitionId={competitionId} seasonId={seasonId} />
        </Section>
      </Container>
    </PaddingGlobal>
  );
}

