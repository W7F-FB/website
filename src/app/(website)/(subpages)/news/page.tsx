import type { Metadata } from "next"
import { Suspense } from "react"

import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero";
import { H1, Subtitle, P } from "@/components/website-base/typography"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { getAllBlogs } from "@/cms/queries/blog"
import { mapBlogDocumentToMetadata } from "@/lib/utils"
import { NewsFilteredContent } from "../../../../components/blocks/posts/news-filter-tabs"
import {
  NEWS_CATEGORIES,
  ALL_NEWS_TAB,
  PRESS_RELEASES_TAB,
  type FilterTab,
  type NewsCategory,
} from "./categories"

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
    title: "News - World Sevens Football",
    description: "Latest news and updates from World Sevens Football. Stay informed about upcoming tournaments, match results, player transfers, and exclusive insights from the 7v7 soccer world.",
    creator: "@worldsevens",
  },
};

type Props = {
  searchParams: Promise<{ category?: string; "press-releases"?: string }>
}

function resolveActiveTab(searchParams: { category?: string; "press-releases"?: string }): FilterTab {
  if ("press-releases" in searchParams) {
    return PRESS_RELEASES_TAB
  }

  const category = searchParams.category
  if (category && NEWS_CATEGORIES.includes(category as NewsCategory)) {
    return category as NewsCategory
  }

  return ALL_NEWS_TAB
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams
  const initialTab = resolveActiveTab(params)

  const allBlogDocs = await getAllBlogs()
  const allBlogs = allBlogDocs.map(mapBlogDocumentToMetadata)

  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <div>
            <PaddingGlobal>
        <SubpageHeroSecondary className="max-w-none w-full">
          <div className="relative max-w-3xl mx-auto">
            <Subtitle className="text-primary">Stay Updated</Subtitle>
            <H1 className="uppercase">W7F NEWS</H1>
            <P className="text-lg">Stay updated with the latest news and updates from World Sevens Football.</P>
          </div>
        </SubpageHeroSecondary>
        <Container maxWidth="lg">
          <Section padding="md" className="min-h-screen">
            <Suspense fallback={null}>
              <NewsFilteredContent allBlogs={allBlogs} initialTab={initialTab} />
            </Suspense>
          </Section>
        </Container>
      </PaddingGlobal>
        </div>
      </main>
      <Footer />
    </>
  )
}
