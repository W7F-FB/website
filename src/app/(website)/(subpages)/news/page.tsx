import type { Metadata } from "next"

import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero";
import { H1, Subtitle, P } from "@/components/website-base/typography"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PostCardHoriz, PostCardVert } from "@/components/blocks/posts/post"
import { getAllBlogs } from "@/cms/queries/blog"
import { Separator } from "@/components/ui/separator";
import { mapBlogDocumentToMetadata } from "@/lib/utils"
import { Background } from "@/components/ui/background"
import { PalmtreeIcon } from "@/components/website-base/icons"

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
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
        <SubpageHeroSecondary className="max-w-none w-full">
          <Background className="flex items-start justify-between">
            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
          </Background>
          <div className="relative max-w-3xl mx-auto">
            <Subtitle className="text-primary">Highlights</Subtitle>
            <H1 className="uppercase">W7F NEWS</H1>
            <P className="text-lg">Stay updated with the latest news and updates from World Sevens Football.</P>
          </div>
        </SubpageHeroSecondary>
        <Container maxWidth="lg">
          <Section padding="md" className="min-h-screen">
            <BlogsShow />
          </Section>
        </Container>
      </PaddingGlobal>
      </main>
      <Footer />
    </>
  )
}
