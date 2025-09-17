import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "News - World Sevens Football",
    description: "Latest news and updates from World Sevens Football. Stay informed about upcoming tournaments, match results, player transfers, and exclusive insights from the 7v7 soccer world.",
    keywords: ["World Sevens news", "7v7 football news", "soccer news", "tournament updates", "match results"],
    openGraph: {
        title: "News - World Sevens Football",
        description: "Latest news and updates from World Sevens Football. Stay informed about upcoming tournaments, match results, player transfers, and exclusive insights from the 7v7 soccer world.",
        url: "https://worldsevensfootball.com/news",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "News - World Sevens Football",
        description: "Latest news and updates from World Sevens Football. Stay informed about upcoming tournaments, match results, player transfers, and exclusive insights from the 7v7 soccer world.",
        creator: "@worldsevens",
    },
};

export default function NewsPage() {
  return <div></div>
}
