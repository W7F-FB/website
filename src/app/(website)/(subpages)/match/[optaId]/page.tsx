import { getF1Fixtures, getF40Squads, getF13Commentary, getF9MatchDetails, getF24Events } from "@/app/api/opta/feeds";
import { getTeamByOptaId, getTeamsByTournament } from "@/cms/queries/team";
import { getTournamentByOptaCompetitionId } from "@/cms/queries/tournaments";
import { getAllBroadcastPartners } from "@/cms/queries/broadcast-partners";
import { notFound } from "next/navigation";
import { normalizeOptaId, removeW7F } from "@/lib/opta/utils";
import MatchPageContent from "../page-content";
import { NavMain } from "@/components/website-base/nav/nav-main";
import type { GameCard } from "@/types/components";
import type { F1MatchData } from "@/types/opta-feeds/f1-fixtures";
import type { F9SoccerDocument } from "@/types/opta-feeds/f9-match";
import type { TeamDocument } from "../../../../../../prismicio-types";  

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

  const normalizedOptaId = normalizeOptaId(optaId);
  
  const [fixtures, squads, commentary, f9Feed, f24Events] = await Promise.all([
    getF1Fixtures(competitionId, seasonId),
    getF40Squads(competitionId, seasonId),
    getF13Commentary(normalizedOptaId, 'en').catch(() => null),
    getF9MatchDetails(normalizedOptaId).catch(() => null),
    getF24Events(normalizedOptaId).catch(() => null),
  ]);

  if (!f9Feed) return notFound();

  const f9Doc: F9SoccerDocument = Array.isArray(f9Feed.SoccerFeed.SoccerDocument) 
    ? f9Feed.SoccerFeed.SoccerDocument[0]
    : f9Feed.SoccerFeed.SoccerDocument;

  const f9MatchData = f9Doc.MatchData;
  const f9TeamDataArray = Array.isArray(f9MatchData.TeamData) ? f9MatchData.TeamData : [f9MatchData.TeamData];
  
  const homeTeamData = f9TeamDataArray.find((t) => t.Side === "Home");
  const awayTeamData = f9TeamDataArray.find((t) => t.Side === "Away");

  if (!homeTeamData || !awayTeamData) return notFound();

  const homeTeamId = homeTeamData.TeamRef;
  const awayTeamId = awayTeamData.TeamRef;

  const f9Teams = Array.isArray(f9Doc.Team) ? f9Doc.Team : (f9Doc.Team ? [f9Doc.Team] : []);
  const homeTeam = f9Teams.find((t) => t.uID === homeTeamId || t.TeamRef === homeTeamId);
  const awayTeam = f9Teams.find((t) => t.uID === awayTeamId || t.TeamRef === awayTeamId);

  const squadTeams = squads.SoccerFeed.SoccerDocument.Team || [];
  const homeSquadTeam = homeTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(homeTeamId)) : undefined;
  const awaySquadTeam = awayTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(awayTeamId)) : undefined;

  const [homeTeamPrismic, awayTeamPrismic, tournament, broadcastPartners] = await Promise.all([
    homeTeamId ? getTeamByOptaId(normalizeOptaId(homeTeamId)) : null,
    awayTeamId ? getTeamByOptaId(normalizeOptaId(awayTeamId)) : null,
    getTournamentByOptaCompetitionId(competitionId, seasonId),
    getAllBroadcastPartners(),
  ]);

  const doc = fixtures.SoccerFeed.SoccerDocument;
  let gameCards: GameCard[] = [];
  let prismicTeams: TeamDocument[] = [];
  if (tournament && doc.MatchData) {
    prismicTeams = await getTeamsByTournament(tournament.uid);
    const optaTeams = doc.Team || doc.TeamData || [];
    
    const allMatches = [...doc.MatchData].sort((a: F1MatchData, b: F1MatchData) => {
      const timeA = a.MatchInfo.TimeStamp || a.MatchInfo.Date || "";
      const timeB = b.MatchInfo.TimeStamp || b.MatchInfo.Date || "";
      return timeA.localeCompare(timeB);
    });

    gameCards = allMatches
      .filter((match: F1MatchData) => normalizeOptaId(match.uID) !== normalizedOptaId)
      .map((match: F1MatchData) => ({
        fixture: match,
        prismicTeams,
        optaTeams,
      }));
  }

  const homeTeamShortName = homeSquadTeam?.short_club_name || null;
  const awayTeamShortName = awaySquadTeam?.short_club_name || null;
  
  const homeTeamName = removeW7F(
    homeTeamShortName || 
    homeTeam?.Name || 
    homeTeamPrismic?.data?.name || 
    "TBD"
  );
  const awayTeamName = removeW7F(
    awayTeamShortName || 
    awayTeam?.Name || 
    awayTeamPrismic?.data?.name || 
    "TBD"
  );

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
      <NavMain showBreadcrumbs customBreadcrumbs={customBreadcrumbs} gameCards={gameCards} tournament={tournament ?? undefined} />
      <MatchPageContent
        f9MatchData={f9MatchData}
        homeTeamData={homeTeamData}
        awayTeamData={awayTeamData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeSquadTeam={homeSquadTeam}
        awaySquadTeam={awaySquadTeam}
        homeTeamPrismic={homeTeamPrismic}
        awayTeamPrismic={awayTeamPrismic}
        matchId={optaId}
        competitionId={competitionId}
        tournament={tournament}
        commentary={commentary}
        f24Events={f24Events}
        broadcastPartners={broadcastPartners}
        prismicTeams={prismicTeams}
        f1FixturesData={fixtures}
        f40Squads={squads}
      />
    </>
  );
}
