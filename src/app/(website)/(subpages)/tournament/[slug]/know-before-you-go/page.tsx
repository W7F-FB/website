import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import TournamentKnowBeforeYouGoPageContent from "./page-content"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"

type Props = {
  params: Promise<{ slug: string }>
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

