import { getF1Fixtures, getF40Squads } from "@/app/api/opta/feeds";
import { getTeamByOptaId } from "@/cms/queries/team";
import { getTournamentByOptaCompetitionId } from "@/cms/queries/tournaments";
import { notFound } from "next/navigation";
import { normalizeOptaId } from "@/lib/opta/utils";
import MatchPageContent from "../page-content";
import { NavMain } from "@/components/website-base/nav/nav-main";

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

  const [fixtures, squads] = await Promise.all([
    getF1Fixtures(competitionId, seasonId),
    getF40Squads(competitionId, seasonId),
  ]);

  const doc = fixtures.SoccerFeed.SoccerDocument;
  const normalizedOptaId = normalizeOptaId(optaId);
  const matchData = doc.MatchData?.find(
    (match) => normalizeOptaId(match.uID) === normalizedOptaId
  );

  if (!matchData) return notFound();

  const homeTeamData = matchData.TeamData.find((t) => t.Side === "Home");
  const awayTeamData = matchData.TeamData.find((t) => t.Side === "Away");

  const homeTeamId = homeTeamData?.TeamRef;
  const awayTeamId = awayTeamData?.TeamRef;

  const teams = doc.Team || doc.TeamData || [];
  const homeTeam = teams.find((t) => t.TeamRef === homeTeamId);
  const awayTeam = teams.find((t) => t.TeamRef === awayTeamId);

  const squadTeams = squads.SoccerFeed.SoccerDocument.Team || [];
  const homeSquadTeam = homeTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(homeTeamId)) : undefined;
  const awaySquadTeam = awayTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(awayTeamId)) : undefined;

  const [homeTeamPrismic, awayTeamPrismic, tournament] = await Promise.all([
    homeTeamId ? getTeamByOptaId(normalizeOptaId(homeTeamId)) : null,
    awayTeamId ? getTeamByOptaId(normalizeOptaId(awayTeamId)) : null,
    getTournamentByOptaCompetitionId(competitionId, seasonId),
  ]);

  const homeTeamName = homeSquadTeam?.short_club_name || homeSquadTeam?.Name || homeTeamPrismic?.data?.name || "TBD";
  const awayTeamName = awaySquadTeam?.short_club_name || awaySquadTeam?.Name || awayTeamPrismic?.data?.name || "TBD";

  const customBreadcrumbs = [
    { label: "Home", href: "/" },
    ...(tournament
      ? [
          {
            label: tournament.data.nickname || tournament.data.title || "Tournament",
            href: `/tournament/${tournament.uid}`,
          },
        ]
      : []),
    {
      label: (
        <>
          {homeTeamName} <span className="text-xs">{" vs "}</span>{awayTeamName}
        </>
      ),
      href: `/match/${optaId}`,
    },
  ];

  return (
    <>
      <NavMain showBreadcrumbs customBreadcrumbs={customBreadcrumbs} />
      <MatchPageContent
        matchData={matchData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamPrismic={homeTeamPrismic}
        awayTeamPrismic={awayTeamPrismic}
        matchId={optaId}
        competitionId={competitionId}
        seasonId={seasonId}
        tournament={tournament}
      />
    </>
  );
}
