import { Section, Container } from "@/components/website-base/padding-containers";
import { getF1Fixtures, getF24MatchEvents } from "@/app/api/opta/feeds";
import MatchHero from "@/components/blocks/match/match-hero";
import { getTeamByOptaId } from "@/cms/queries/team";
import PlayByPlay from "@/components/blocks/match/play-by-play";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ optaId: string }> }) {
  await params;
  return {
    title: `World Sevens Football - Play-By-Play`,
    description: `Live stats, teams and play-by-play.`,
  };
}

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ optaId: string }>;
  searchParams: Promise<{ competition?: string; season?: string }>;
}) {
  const { optaId } = await params;
  const { competition, season } = await searchParams;

  const competitionId = competition || "1303";
  const seasonId = season || "2025";

  const fixtures = await getF1Fixtures(competitionId, seasonId);
  const matchEvents = await getF24MatchEvents(optaId, competitionId, seasonId);

  const doc = fixtures.SoccerFeed.SoccerDocument;
  const matchData = doc.MatchData?.find(
    (match) => match.uID === `g${optaId}` || match.uID === optaId
  );

  if (!matchData) return notFound();

  const venueStat = matchData.Stat?.find((stat) => stat.Type === "Venue");
  const venueName = venueStat?.value ? String(venueStat.value) : undefined;

  const homeTeamData = matchData.TeamData.find((t) => t.Side === "Home");
  const awayTeamData = matchData.TeamData.find((t) => t.Side === "Away");

  const homeTeamId = homeTeamData?.TeamRef;
  const awayTeamId = awayTeamData?.TeamRef;

  const homeTeam = doc.TeamData?.find((t) => t.TeamRef === homeTeamId);
  const awayTeam = doc.TeamData?.find((t) => t.TeamRef === awayTeamId);

  const homeTeamPrismic = homeTeamId ? await getTeamByOptaId(homeTeamId) : null;
  const awayTeamPrismic = awayTeamId ? await getTeamByOptaId(awayTeamId) : null;

  return (
    <Container>
      <Section padding="md">
        <MatchHero
          matchData={matchData}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeTeamPrismic={homeTeamPrismic}
          awayTeamPrismic={awayTeamPrismic}
          venueName={venueName}
        />
      </Section>
    </Container>
  );
}
