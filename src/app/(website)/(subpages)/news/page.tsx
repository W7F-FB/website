import { Section } from "@/components/website-base/padding-containers"
import { H1 } from "@/components/website-base/typography"
import type { Metadata } from "next"
import { PostCardHoriz, PostStandard, type BlogMetadata } from "@/components/website-base/posts/post"

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

const sampleBlog: BlogMetadata = {
    id: "1",
    title: "World Sevens Football appoints Sarah Cummins as CEO",
    excerpt: "Cummins assumes leadership with a wealth of experience spanning more than 25 years as a revenue driver, brand builder, and commercial operator across global sports, entertainment, and media.",
    author: "Admin",
    date: "Sept 18, 2025",
    category: "Tournaments",
    image: "/images/static-media/fl-hero.avif",
}

export default function NewsPage() {
  return (
    <div>
      <Section padding="none">
        <H1 className="uppercase text-2xl md:text-6xl text-center md:my-16">W7F NEWS</H1>
      </Section>

      <Section padding="md" className="min-h-screen">
        <div className="grid gap-8">
          <PostCardHoriz blog={sampleBlog} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostStandard blog={sampleBlog} />
            <PostStandard blog={sampleBlog} />
          </div>
        </div>
      </Section>
    </div>
  )
}
