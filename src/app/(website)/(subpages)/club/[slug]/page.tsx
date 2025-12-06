import { getF40Squads, getF3Standings, getF1Fixtures, getF30SeasonStats } from "@/app/api/opta/feeds";
import { getTeamByUid, getTeamsByOptaIds } from "@/cms/queries/team";
import { getTournamentByUid } from "@/cms/queries/tournaments";
import { buildMatchSlugMap } from "@/lib/match-url";
import { fetchF9FeedsForMatches, extractMatchIdsFromFixtures } from "@/lib/opta/match-data";
import { getBlogsByTeam } from "@/cms/queries/blog";
import { notFound } from "next/navigation";
import { isFilled } from "@prismicio/client";
import TeamPageContent from "../page-content";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";
import { dev } from "@/lib/dev";
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const team = await getTeamByUid(slug);

  if (!team) {
    return {
      title: "Team - World Sevens Football",
      description: "Explore elite football clubs competing in World Sevens Football tournaments.",
    };
  }

  const title = `${team.data.name} - World Sevens Football`;
  const description = `Follow ${team.data.name}'s journey in World Sevens Football. View squad, match stats, fixtures, and tournament performance in the elite 7v7 competition.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/team/${slug}`,
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
      title,
      description,
      creator: "@worldsevens",
    },
  };
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = await getTeamByUid(slug);

  if (!team) return notFound();

  const tournamentUids =
    team.data.tournaments
      ?.filter((item) => isFilled.contentRelationship(item.tournament))
      .map((item) => {
        if (isFilled.contentRelationship(item.tournament)) {
          return item.tournament.uid;
        }
        return null;
      })
      .filter((uid): uid is string => uid !== null) || [];

  const firstTournamentUid = tournamentUids[0];
  const currentTournament = firstTournamentUid 
    ? await getTournamentByUid(firstTournamentUid).catch(() => null)
    : null;

  const competitionId = currentTournament?.data.opta_competition_id;
  const seasonId = currentTournament?.data.opta_season_id;
  const teamOptaId = team.data.opta_id;
  const teamOptaIdNumeric = teamOptaId?.toString().replace("t", "") || "";

  const [squadsData, f3StandingsData, f1FixturesData, f30SeasonStats] = await Promise.all([
    competitionId && seasonId ? getF40Squads(competitionId, seasonId) : Promise.resolve(null),
    competitionId && seasonId ? getF3Standings(competitionId, seasonId).catch(() => null) : Promise.resolve(null),
    competitionId && seasonId ? getF1Fixtures(competitionId, seasonId).catch(() => null) : Promise.resolve(null),
    competitionId && seasonId && teamOptaIdNumeric ? getF30SeasonStats(competitionId, seasonId, teamOptaIdNumeric).catch(() => null) : Promise.resolve(null),
  ]);

  dev.log('f40Squads', squadsData);
  dev.log('f3Standings', f3StandingsData);
  dev.log('f1Fixtures', f1FixturesData);
  dev.log('currentTournament', currentTournament);
  dev.log('f30SeasonStats', f30SeasonStats);

  const allTeamRefs = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData?.flatMap((match) =>
    match.TeamData.map((teamData) => teamData.TeamRef)
  ) || [];
  const uniqueOptaIds = [...new Set(allTeamRefs.map((ref) => ref.replace("t", "")))];
  const prismicTeams = await getTeamsByOptaIds(uniqueOptaIds).catch(() => []);

  // Fetch F9 data for all matches
  let f9FeedsMap: Map<string, F9MatchResponse> = new Map();
  const matchData = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData;
  if (matchData && Array.isArray(matchData)) {
    const matchIds = extractMatchIdsFromFixtures(matchData);
    f9FeedsMap = await fetchF9FeedsForMatches(matchIds);
  }

  const matchSlugMap = currentTournament ? buildMatchSlugMap(currentTournament) : undefined;

  const teamOptaIdWithPrefix = teamOptaId?.toString().startsWith("t") ? teamOptaId : `t${teamOptaId}`;

  const teamSquad = squadsData?.SoccerFeed?.SoccerDocument?.Team?.find((t) => t.uID === teamOptaIdWithPrefix);

  const remainingTournamentUids = tournamentUids.slice(1);

  const [teamBlogs, tournamentDocumentsResults] = await Promise.all([
    getBlogsByTeam(team.id).catch(() => []),
    Promise.all(remainingTournamentUids.map((uid) => getTournamentByUid(uid).catch(() => null)))
  ]);
  const tournamentDocuments = [
    ...(currentTournament ? [currentTournament] : []),
    ...tournamentDocumentsResults.filter((t): t is NonNullable<typeof t> => t !== null)
  ];

  return (
    <>
      <NavMain showBreadcrumbs customBreadcrumbs={[
        { label: "Home", href: "/" },
        { label: team.data.name, href: `/team/${team.uid}` }
      ]} />
      <main className="flex-grow min-h-[30rem]">
        <div>
          <PaddingGlobal>
            <TeamPageContent
              team={team}
              teamSquad={teamSquad}
              standings={f3StandingsData}
              fixtures={f1FixturesData}
              currentTournament={currentTournament}
              prismicTeams={prismicTeams}
              teamBlogs={teamBlogs}
              seasonStats={f30SeasonStats}
              tournamentDocuments={tournamentDocuments}
              matchSlugMap={matchSlugMap}
              f9FeedsMap={f9FeedsMap}
            />
          </PaddingGlobal>
        </div>
      </main>
      <Footer />
    </>
  );
}
