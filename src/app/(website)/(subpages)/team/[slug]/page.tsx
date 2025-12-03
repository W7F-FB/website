import { getF40Squads, getF3Standings, getF1Fixtures, getF30SeasonStats } from "@/app/api/opta/feeds";
import { getTeamByUid, getTeamsByOptaIds } from "@/cms/queries/team";
import { getNavigationTournaments, getTournamentByUid } from "@/cms/queries/tournaments";
import { getBlogsByTournament } from "@/cms/queries/blog";
import { notFound } from "next/navigation";
import { isFilled } from "@prismicio/client";
import TeamPageContent from "../page-content";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";

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

  const competitionId = "1303";
  const seasonId = "2025";
  const teamOptaId = team.data.opta_id;
  const teamOptaIdNumeric = teamOptaId?.toString().replace("t", "") || "";

  const [squadsData, f3StandingsData, f1FixturesData, tournaments, f30SeasonStats] = await Promise.all([
    getF40Squads(competitionId, seasonId),
    getF3Standings(competitionId, seasonId).catch(() => null),
    getF1Fixtures(competitionId, seasonId).catch(() => null),
    getNavigationTournaments().catch(() => []),
    teamOptaIdNumeric ? getF30SeasonStats(competitionId, seasonId, teamOptaIdNumeric).catch(() => null) : Promise.resolve(null),
  ]);

  const allTeamRefs = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData?.flatMap((match) =>
    match.TeamData.map((teamData) => teamData.TeamRef)
  ) || [];
  const uniqueOptaIds = [...new Set(allTeamRefs.map((ref) => ref.replace("t", "")))];
  const prismicTeams = await getTeamsByOptaIds(uniqueOptaIds).catch(() => []);

  const currentTournament = tournaments.length > 0 ? tournaments[0] : null;

  const teamOptaIdWithPrefix = teamOptaId?.toString().startsWith("t") ? teamOptaId : `t${teamOptaId}`;

  const teamSquad = squadsData.SoccerFeed.SoccerDocument.Team?.find((t) => t.uID === teamOptaIdWithPrefix);

  const tournamentIds =
    team.data.tournaments
      ?.filter((item) => isFilled.contentRelationship(item.tournament))
      .map((item) => {
        if (isFilled.contentRelationship(item.tournament)) {
          return item.tournament.id;
        }
        return null;
      })
      .filter((id): id is string => id !== null) || [];

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

  const [blogsResults, tournamentDocumentsResults] = await Promise.all([
    Promise.all(tournamentIds.map((tournamentId) => getBlogsByTournament(tournamentId).catch(() => []))),
    Promise.all(tournamentUids.map((uid) => getTournamentByUid(uid).catch(() => null)))
  ]);

  const teamBlogs = blogsResults.flat();
  const tournamentDocuments = tournamentDocumentsResults.filter((t): t is NonNullable<typeof t> => t !== null);

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
            />
          </PaddingGlobal>
        </div>
      </main>
      <Footer />
    </>
  );
}
