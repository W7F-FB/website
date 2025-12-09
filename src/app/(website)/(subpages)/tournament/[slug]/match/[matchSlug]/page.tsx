import { notFound } from "next/navigation";
import { getF1Fixtures, getF2MatchPreview, getF3Standings, getF40Squads, getF13Commentary, getF24Events } from "@/app/api/opta/feeds";
import { getTeamByOptaId, getTeamsByTournament } from "@/cms/queries/team";
import { getTournamentByUid } from "@/cms/queries/tournaments";
import { getMatchBySlug } from "@/cms/queries/match";
import { getAllBroadcastPartners } from "@/cms/queries/broadcast-partners";
import { getBlogsByMatch } from "@/cms/queries/blog";
import { normalizeOptaId, removeW7F } from "@/lib/opta/utils";
import { buildMatchUrl, buildMatchSlugMap } from "@/lib/match-url";
import { fetchF9ForMatch, fetchF9FeedsForMatches, extractMatchIdsFromFixtures } from "@/lib/opta/match-data";
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match";
import MatchPageContent from "./page-content";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import type { F2EntityTeam } from "@/types/opta-feeds/f2-match-preview";
import type { F9SoccerDocument } from "@/types/opta-feeds/f9-match";
import { groupMatchesByDate, isInKnockoutStage } from "../../../utils";
import { getRecordsFromF9 } from "@/lib/v2-utils/records-from-f9";
import { getTeamStatsFromF9 } from "@/lib/v2-utils/team-stats-from-f9";
import { dev } from "@/lib/dev";
import { getHighlightsByMatchId } from "@/lib/supabase/queries/highlights";

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; matchSlug: string }> }) {
  await params;
  return {
    title: `World Sevens Football - Play-By-Play`,
    description: `Live stats, teams and play-by-play.`,
    openGraph: {
      title: `World Sevens Football - Play-By-Play`,
      description: `Live stats, teams and play-by-play.`,
      url: "https://worldsevensfootball.com",
      siteName: "World Sevens Football",
      type: "website",
      images: [
        {
          url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
          width: 1200,
          height: 630,
          alt: "World Sevens Football",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `World Sevens Football - Play-By-Play`,
      description: `Live stats, teams and play-by-play.`,
      creator: "@worldsevens",
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string; matchSlug: string }>;
}) {
  const { slug: tournamentSlug, matchSlug } = await params;

  const [tournament, match] = await Promise.all([
    getTournamentByUid(tournamentSlug),
    getMatchBySlug(matchSlug),
  ]);

  if (!tournament || !match) return notFound();

  const competitionId = tournament.data.opta_competition_id;
  const seasonId = tournament.data.opta_season_id;

  if (!competitionId || !seasonId) return notFound();

  const optaId = match.data.opta_id;
  if (!optaId) return notFound();


  const normalizedOptaId = normalizeOptaId(optaId);

  const [fixtures, standings, squads, commentary, f9FeedResult, f24Events, f2Preview, highlights] = await Promise.all([
    getF1Fixtures(competitionId, seasonId),
    getF3Standings(competitionId, seasonId),
    getF40Squads(competitionId, seasonId),
    getF13Commentary(normalizedOptaId, 'en').catch(() => null),
    fetchF9ForMatch(normalizedOptaId),
    getF24Events(normalizedOptaId).catch(() => null),
    getF2MatchPreview(normalizedOptaId).catch(() => null),
    getHighlightsByMatchId(optaId),
  ]);

  const f9Feed = f9FeedResult.f9;
  const matchLiveMinute = f9FeedResult.liveMinute;

  dev.log('F9 Feed:', f9Feed);

  

  const f9Doc: F9SoccerDocument | null = f9Feed?.SoccerFeed?.SoccerDocument
    ? (Array.isArray(f9Feed.SoccerFeed.SoccerDocument) 
      ? f9Feed.SoccerFeed.SoccerDocument[0]
      : f9Feed.SoccerFeed.SoccerDocument)
    : null;

  const f9MatchData = f9Doc?.MatchData;
  const f9TeamDataArray = f9MatchData?.TeamData
    ? (Array.isArray(f9MatchData.TeamData) ? f9MatchData.TeamData : [f9MatchData.TeamData])
    : [];

  const homeTeamData = f9TeamDataArray.find((t) => t.Side === "Home");
  const awayTeamData = f9TeamDataArray.find((t) => t.Side === "Away");

  const f2Data = f2Preview?.MatchPreviews;
  const f2Teams: F2EntityTeam[] = f2Data?.Entities?.Teams?.Team
    ? (Array.isArray(f2Data.Entities.Teams.Team) 
        ? f2Data.Entities.Teams.Team 
        : [f2Data.Entities.Teams.Team])
    : [];

  const homeTeamIdFromF9 = homeTeamData?.TeamRef;
  const awayTeamIdFromF9 = awayTeamData?.TeamRef;
  const homeTeamIdFromF2 = f2Data?.Match?.HomeId;
  const awayTeamIdFromF2 = f2Data?.Match?.AwayId;

  const homeTeamId = homeTeamIdFromF9 || homeTeamIdFromF2;
  const awayTeamId = awayTeamIdFromF9 || awayTeamIdFromF2;

  const f9Teams = f9Doc
    ? (Array.isArray(f9Doc.Team) ? f9Doc.Team : (f9Doc.Team ? [f9Doc.Team] : []))
    : [];
  const homeTeam = f9Teams.find((t) => t.uID === homeTeamId || t.TeamRef === homeTeamId);
  const awayTeam = f9Teams.find((t) => t.uID === awayTeamId || t.TeamRef === awayTeamId);

  const homeTeamFromF2 = homeTeamId ? f2Teams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(homeTeamId)) : undefined;
  const awayTeamFromF2 = awayTeamId ? f2Teams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(awayTeamId)) : undefined;

  const squadTeams = squads?.SoccerFeed?.SoccerDocument?.Team || [];
  const homeSquadTeam = homeTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(homeTeamId)) : undefined;
  const awaySquadTeam = awayTeamId ? squadTeams.find((t) => normalizeOptaId(t.uID) === normalizeOptaId(awayTeamId)) : undefined;

  const [homeTeamPrismic, awayTeamPrismic, broadcastPartners, prismicTeams, matchBlogs] = await Promise.all([
    homeTeamId ? getTeamByOptaId(normalizeOptaId(homeTeamId)) : null,
    awayTeamId ? getTeamByOptaId(normalizeOptaId(awayTeamId)) : null,
    getAllBroadcastPartners(),
    getTeamsByTournament(tournament.uid),
    getBlogsByMatch(match.id).catch(() => []),
  ]);

  const matchSlugMap = buildMatchSlugMap(tournament);

  const doc = fixtures?.SoccerFeed?.SoccerDocument;
  let groupedFixtures: Map<string, F1MatchData[]> = new Map();
  let optaTeams: F1TeamData[] = [];
  let f9FeedsMap: Map<string, F9MatchResponse> = new Map();
  let liveMinutesMap: Map<string, string> = new Map();
  
  if (doc?.MatchData) {
    optaTeams = doc.Team || doc.TeamData || [];

    const matchDataArray = Array.isArray(doc.MatchData) 
      ? doc.MatchData 
      : [doc.MatchData];
    
    const filteredMatches = matchDataArray.filter(
      (m: F1MatchData) => normalizeOptaId(m.uID) !== normalizedOptaId
    );
    groupedFixtures = groupMatchesByDate(filteredMatches);
    
    const matchIds = extractMatchIdsFromFixtures(matchDataArray);
    const fetchedResult = await fetchF9FeedsForMatches(matchIds);
    f9FeedsMap = fetchedResult.f9FeedsMap;
    liveMinutesMap = fetchedResult.liveMinutesMap;
  }

  const f9FeedsArray = f9FeedsMap.size > 0 ? Array.from(f9FeedsMap.values()) : []
  const teamRecords = getRecordsFromF9(f9FeedsArray)
  const teamStats = getTeamStatsFromF9(f9FeedsArray)

  const homeTeamShortName = homeSquadTeam?.short_club_name || null;
  const awayTeamShortName = awaySquadTeam?.short_club_name || null;

  const homeTeamName = removeW7F(
    homeTeamShortName || 
    homeTeam?.Name || 
    homeTeamPrismic?.data?.name ||
    homeTeamFromF2?.ShortName ||
    homeTeamFromF2?.value ||
    "TBD"
  );
  const awayTeamName = removeW7F(
    awayTeamShortName || 
    awayTeam?.Name || 
    awayTeamPrismic?.data?.name ||
    awayTeamFromF2?.ShortName ||
    awayTeamFromF2?.value ||
    "TBD"
  );

  const customBreadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: tournament.data.nickname || tournament.data.title || "Tournament",
      href: `/tournament/${tournament.uid}`,
    },
    {
      label: (
        <>
          {homeTeamName} <span className="text-xs">{" vs "}</span>{awayTeamName}
        </>
      ),
      href: buildMatchUrl(tournamentSlug, matchSlug),
    },
  ];

  return (
    <>
      <NavMain 
        showBreadcrumbs 
        customBreadcrumbs={customBreadcrumbs} 
        groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
        prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
        optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
        tournament={tournament}
        matchSlugMap={matchSlugMap}
        f9FeedsMap={f9FeedsMap.size > 0 ? f9FeedsMap : undefined}
        liveMinutesMap={liveMinutesMap.size > 0 ? liveMinutesMap : undefined}
      />
      <main className="flex-grow min-h-[30rem]">
        <div>
          <PaddingGlobal>
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
              homeTeamFromF2={homeTeamFromF2}
              awayTeamFromF2={awayTeamFromF2}
              f2Preview={f2Preview}
              matchId={optaId}
              competitionId={competitionId}
              tournament={tournament}
              commentary={commentary}
              f24Events={f24Events}
              broadcastPartners={broadcastPartners}
              prismicTeams={prismicTeams}
              f1FixturesData={fixtures}
              f3StandingsData={standings}
              f40Squads={squads}
              isKnockoutStage={isInKnockoutStage(fixtures?.SoccerFeed?.SoccerDocument?.MatchData)}
              matchBlogs={matchBlogs}
              teamRecords={teamRecords}
              teamStats={teamStats}
              liveMinute={matchLiveMinute}
              highlights={highlights}
              f9FeedsMap={f9FeedsMap}
            />
          </PaddingGlobal>
        </div>
      </main>
      <Footer />
    </>
  );
}

