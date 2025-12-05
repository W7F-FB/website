
import type { Metadata } from "next";

import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { getTournamentByUid, getLiveTournament } from "@/cms/queries/tournaments";
import { getSocialBlogsByCategory } from "@/cms/queries/blog";
import { getBroadcastPartnerByUid } from "@/cms/queries/broadcast-partners";
import { getTeamsByTournament } from "@/cms/queries/team";
import { getF1Fixtures } from "@/app/api/opta/feeds";
import { groupMatchesByDate } from "@/app/(website)/(subpages)/tournament/utils";
import { buildMatchSlugMap } from "@/lib/match-url";
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures";
import { dev } from "@/lib/dev";
import HomePageContent from "./page-content";

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
    const tournament = await getTournamentByUid("fort-lauderdale");
    const estorilTournament = await getTournamentByUid("estoril-portugal");
    const liveTournament = await getLiveTournament();

    const tournamentRecapBlogs = await getSocialBlogsByCategory("Tournament Recap");
    const featuredRecapBlog = tournamentRecapBlogs.length > 0 ? tournamentRecapBlogs[0] : null;

    const [dazn, tnt, truTV, hboMax, univision, espn, disneyPlus] = await Promise.all([
        getBroadcastPartnerByUid("dazn"),
        getBroadcastPartnerByUid("tnt"),
        getBroadcastPartnerByUid("tru-tv"),
        getBroadcastPartnerByUid("hbo-max"),
        getBroadcastPartnerByUid("univision"),
        getBroadcastPartnerByUid("espn"),
        getBroadcastPartnerByUid("disney-plus"),
    ]);

    let groupedFixtures: Map<string, F1MatchData[]> = new Map();
    let prismicTeams: Awaited<ReturnType<typeof getTeamsByTournament>> = [];
    let optaTeams: F1TeamData[] = [];
    let matchSlugMap: Map<string, string> | undefined;

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

    return (
        <>
            <NavMain
                groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
                prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
                optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
                tournament={liveTournament || undefined}
                matchSlugMap={matchSlugMap}
            />
            <main className="flex-grow min-h-[30rem]">
                <div>
                    <HomePageContent
                        tournament={tournament}
                        estorilTournament={estorilTournament}
                        featuredRecapBlog={featuredRecapBlog}
                        dazn={dazn}
                        tnt={tnt}
                        truTV={truTV}
                        hboMax={hboMax}
                        univision={univision}
                        espn={espn}
                        disneyPlus={disneyPlus}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
