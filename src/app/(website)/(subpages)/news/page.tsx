import type { Metadata } from "next"

import { Section, Container } from "@/components/website-base/padding-containers"
import { H1 } from "@/components/website-base/typography"
import { PostCardHoriz, PostCardVert } from "@/components/blocks/posts/post"
import { getAllBlogs } from "@/cms/queries/blog"
import { Separator } from "@/components/ui/separator";
import { mapBlogDocumentToMetadata } from "@/lib/utils"

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

async function BlogsShow() {
  const blogs = await getAllBlogs();
  if (!blogs?.length) return null;

  const [first, ...rest] = blogs;

  return (
    <div className="grid gap-8">
      <PostCardHoriz blog={mapBlogDocumentToMetadata(first)} />

      <Separator className="my-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {rest.map((p) => (
          <PostCardVert
            key={p.uid}
            blog={mapBlogDocumentToMetadata(p)}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}


export default function NewsPage() {

  return (
    <Container maxWidth="lg">
      <Section padding="none">
        <H1 className="uppercase text-2xl md:text-6xl text-center md:my-16">W7F NEWS</H1>
      </Section>

      <Section padding="md" className="min-h-screen">
        <BlogsShow />
      </Section>
    </Container>
  )
}
