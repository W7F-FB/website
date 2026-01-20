
import type { Metadata } from "next";

import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { getTournaments, getLiveTournament } from "@/cms/queries/tournaments";
import { getSocialBlogsByCategory, getAllBlogs } from "@/cms/queries/blog";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import { getTeamsByTournament } from "@/cms/queries/team";
import { getF1Fixtures } from "@/app/api/opta/feeds";
import { groupMatchesByDate } from "@/app/(website)/(subpages)/tournament/utils";
import { buildMatchSlugMap } from "@/lib/match-url";
import { fetchF9FeedsForMatches, extractMatchIdsFromFixtures } from "@/lib/opta/match-data";
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match";
import type { TeamDocument } from "../../../../prismicio-types";
import { normalizeOptaId } from "@/lib/opta/utils";
import { dev } from "@/lib/dev";
import HomePageContent from "./page-content";
import type { ClubListData } from "@/components/blocks/clubs/club-list-client";
import type { TournamentDocument } from "../../../../prismicio-types";

async function fetchClubListData(tournament: TournamentDocument): Promise<ClubListData> {
    const teams = await getTeamsByTournament(tournament.uid);
    const sortedTeams = [...teams].sort((a, b) => {
        const aSort = (a.data.alphabetical_sort_string || "").toLowerCase();
        const bSort = (b.data.alphabetical_sort_string || "").toLowerCase();
        return aSort.localeCompare(bSort);
    });
    const numberOfTeams = tournament.data.number_of_teams || sortedTeams.length;

    const placementMap: Record<string, number> = {};

    if (tournament.data.status === "Complete" && tournament.data.opta_competition_id && tournament.data.opta_season_id) {
        try {
            const fixtures = await getF1Fixtures(tournament.data.opta_competition_id, tournament.data.opta_season_id);
            const matches = fixtures?.SoccerFeed?.SoccerDocument?.MatchData || [];

            const finalMatch = matches.find(m => m.MatchInfo?.RoundType === 'Final');
            const thirdPlaceMatch = matches.find(m => m.MatchInfo?.RoundType === '3rd and 4th Place');

            if (finalMatch) {
                const winner = finalMatch.MatchInfo?.MatchWinner ? normalizeOptaId(finalMatch.MatchInfo.MatchWinner) : undefined;
                const loser = finalMatch.TeamData?.find(td => td.TeamRef !== finalMatch.MatchInfo?.MatchWinner)?.TeamRef;
                const normalizedLoser = loser ? normalizeOptaId(loser) : undefined;

                if (winner) placementMap[winner] = 1;
                if (normalizedLoser) placementMap[normalizedLoser] = 2;
            }

            if (thirdPlaceMatch) {
                const winner = thirdPlaceMatch.MatchInfo?.MatchWinner ? normalizeOptaId(thirdPlaceMatch.MatchInfo.MatchWinner) : undefined;
                const loser = thirdPlaceMatch.TeamData?.find(td => td.TeamRef !== thirdPlaceMatch.MatchInfo?.MatchWinner)?.TeamRef;
                const normalizedLoser = loser ? normalizeOptaId(loser) : undefined;

                if (winner) placementMap[winner] = 3;
                if (normalizedLoser) placementMap[normalizedLoser] = 4;
            }
        } catch (error) {
            dev.log('Failed to fetch fixtures for completed tournament:', error);
        }
    }

    return {
        teams: sortedTeams,
        numberOfTeams,
        placementMap,
        tournamentUid: tournament.uid || '',
    };
}

export const metadata: Metadata = {
    title: "World Sevens Football - The Future of 7v7 Soccer",
    description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
    keywords: ["7v7 football", "soccer", "World Sevens", "elite football", "tournament", "professional soccer"],
    authors: [{ name: "World Sevens Football" }],
    creator: "World Sevens Football",
    publisher: "World Sevens Football",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "World Sevens Football - The Future of 7v7 Soccer",
        description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
        url: "https://worldsevensfootball.com",
        siteName: "World Sevens Football",
        type: "website",
        locale: "en_US",
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
        title: "World Sevens Football - The Future of 7v7 Soccer",
        description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
        creator: "@worldsevens",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    }
};

export default async function HomePage() {
    const [allTournaments, liveTournament] = await Promise.all([
        getTournaments(),
        getLiveTournament()
    ]);

    // Filter for complete tournaments and sort by navigation_order (descending so most recent first)
    const completeTournaments = allTournaments
        .filter(t => t.data.status === "Complete")
        .sort((a, b) => (b.data.navigation_order || 0) - (a.data.navigation_order || 0));

    // Fetch champion data for each complete tournament
    const heroTournamentsWithChampions = await Promise.all(
        completeTournaments.map(async (t) => {
            let champion: TeamDocument | null = null;

            if (t.data.opta_competition_id && t.data.opta_season_id && t.uid) {
                try {
                    const [fixtures, teams] = await Promise.all([
                        getF1Fixtures(t.data.opta_competition_id, t.data.opta_season_id),
                        getTeamsByTournament(t.uid)
                    ]);

                    // Find the Final match and get the winner
                    const matchData = fixtures?.SoccerFeed?.SoccerDocument?.MatchData;
                    if (matchData && Array.isArray(matchData)) {
                        const finalMatch = matchData.find(
                            match => match.MatchInfo?.RoundType === "Final" && match.MatchInfo?.Period === "FullTime"
                        );

                        if (finalMatch) {
                            const winnerRef = finalMatch.MatchInfo?.MatchWinner || finalMatch.MatchInfo?.GameWinner;
                            if (winnerRef) {
                                const winnerOptaId = normalizeOptaId(winnerRef);
                                champion = teams.find(
                                    team => normalizeOptaId(`t${team.data.opta_id}`) === winnerOptaId
                                ) || null;
                            }
                        }
                    }
                } catch (error) {
                    dev.log(`Error fetching champion data for ${t.uid}:`, error);
                }
            }

            return { tournament: t, champion };
        })
    );

    const tournamentRecapBlogs = await getSocialBlogsByCategory("Tournament Recap");
    const featuredRecapBlog = tournamentRecapBlogs.length > 0 ? tournamentRecapBlogs[0] : null;

    // Get the featured tournament (first complete one) for the rest of the page content
    const tournament = completeTournaments[0] || null;


    let groupedFixtures: Map<string, F1MatchData[]> = new Map();
    let prismicTeams: Awaited<ReturnType<typeof getTeamsByTournament>> = [];
    let optaTeams: F1TeamData[] = [];
    let matchSlugMap: Map<string, string> | undefined;
    let f9FeedsMap: Map<string, F9MatchResponse> = new Map();
    let liveMinutesMap: Map<string, string> = new Map();

    if (liveTournament) {
        const competitionId = liveTournament.data.opta_competition_id;
        const seasonId = liveTournament.data.opta_season_id;

        if (competitionId && seasonId && liveTournament.uid) {
            try {
                const [fixtures, teams] = await Promise.all([
                    getF1Fixtures(competitionId, seasonId),
                    getTeamsByTournament(liveTournament.uid)
                ]);
                prismicTeams = teams;

                if (fixtures && prismicTeams.length > 0) {
                    const doc = fixtures.SoccerFeed.SoccerDocument;
                    optaTeams = doc.Team || doc.TeamData || [];
                    const matchData = doc.MatchData;

                    if (matchData && Array.isArray(matchData)) {
                        groupedFixtures = groupMatchesByDate(matchData);
                        
                        // Fetch F9 data for all matches
                        const matchIds = extractMatchIdsFromFixtures(matchData);
                        const fetchedResult = await fetchF9FeedsForMatches(matchIds);
                        f9FeedsMap = fetchedResult.f9FeedsMap;
                        liveMinutesMap = fetchedResult.liveMinutesMap;
                    }
                }

                matchSlugMap = buildMatchSlugMap(liveTournament);
            } catch (error) {
                dev.log('Error fetching fixtures for game slider:', error);
            }
        }
    }

    if (!tournament) {
        return (
            <main className="flex-grow min-h-[30rem]">
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Tournament not found.</p>
                </div>
            </main>
        );
    }

    // Fetch club list data for the tournaments section
    const clubListDataPromises = allTournaments.slice(0, 2).map(t => fetchClubListData(t));
    const clubListDataResults = await Promise.all(clubListDataPromises);

    // Fetch recent news data - sort by user-defined date field (date only) first, then created date (with time)
    const allBlogs = await getAllBlogs();
    const sortedBlogs = [...allBlogs].sort((a, b) => {
      const dateA = a.data.date;
      const dateB = b.data.date;
      
      if (!dateA && !dateB) {
        const createdA = a.first_publication_date ? new Date(a.first_publication_date).getTime() : 0;
        const createdB = b.first_publication_date ? new Date(b.first_publication_date).getTime() : 0;
        if (createdB !== createdA) return createdB - createdA;
        return (a.uid || "").localeCompare(b.uid || "");
      }
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      const dateATime = new Date(dateA).setHours(0, 0, 0, 0);
      const dateBTime = new Date(dateB).setHours(0, 0, 0, 0);
      const dateCompare = dateBTime - dateATime;
      
      if (dateCompare !== 0) {
        return dateCompare;
      }
      
      const createdA = a.first_publication_date ? new Date(a.first_publication_date).getTime() : 0;
      const createdB = b.first_publication_date ? new Date(b.first_publication_date).getTime() : 0;
      if (createdB !== createdA) return createdB - createdA;
      return (a.uid || "").localeCompare(b.uid || "");
    });
    
    dev.log("Recent News Posts (sorted by date field, then created date):");
    sortedBlogs.slice(0, 4).forEach((blog, index) => {
      const dateField = blog.data.date || "No date";
      const createdDate = blog.first_publication_date 
        ? new Date(blog.first_publication_date).toISOString()
        : "No created date";
      const title = blog.data.title || "Untitled";
      dev.log(`${index + 1}. "${title}" - Date: ${dateField}, Created: ${createdDate}`);
    });
    
    const recentNewsPosts = sortedBlogs.slice(0, 4).map(mapBlogDocumentToMetadata);

    return (
        <>
            <NavMain
                groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
                prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
                optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
                tournament={liveTournament || undefined}
                matchSlugMap={matchSlugMap}
                f9FeedsMap={f9FeedsMap.size > 0 ? f9FeedsMap : undefined}
                liveMinutesMap={liveMinutesMap.size > 0 ? liveMinutesMap : undefined}
            />
            <main className="flex-grow min-h-[30rem]">
                <div>
                    <HomePageContent
                        heroTournamentsWithChampions={heroTournamentsWithChampions}
                        featuredRecapBlog={featuredRecapBlog}
                        allTournaments={allTournaments}
                        clubListData={clubListDataResults}
                        recentNewsPosts={recentNewsPosts}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
