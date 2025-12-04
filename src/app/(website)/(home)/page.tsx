
import type { Metadata } from "next";

import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { getTournamentByUid } from "@/cms/queries/tournaments";
import { getSocialBlogsByCategory } from "@/cms/queries/blog";
import { getBroadcastPartnerByUid } from "@/cms/queries/broadcast-partners";
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
            <NavMain />
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
