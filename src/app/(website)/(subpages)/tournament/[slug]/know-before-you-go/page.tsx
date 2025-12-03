import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import TournamentKnowBeforeYouGoPageContent from "./page-content"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) {
    return {
      title: "Know Before You Go - World Sevens Football",
      description: "Essential information for attending World Sevens Football tournaments.",
    }
  }

  const title = `Know Before You Go - ${tournament.data.title} - World Sevens Football`
  const description = `Essential information for attending ${tournament.data.title}. Find details on venue access, parking, what to bring, and everything you need to know before you go.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/tournament/${slug}/know-before-you-go`,
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
  }
}

export default async function TournamentKnowBeforeYouGoPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  return (
    <>
      <NavMain showBreadcrumbs customBreadcrumbs={[
        { label: "Home", href: "/" },
        { label: tournament.data.title, href: `/tournament/${tournament.uid}` },
        { label: "Know Before You Go", href: `/tournament/${tournament.uid}/know-before-you-go` }
      ]} />
      <main className="flex-grow min-h-[30rem]">
        <TournamentKnowBeforeYouGoPageContent tournament={tournament} />
      </main>
      <Footer />
    </>
  )
}

