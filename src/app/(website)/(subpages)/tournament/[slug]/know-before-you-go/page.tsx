import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import TournamentKnowBeforeYouGoPageContent from "./page-content"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentKnowBeforeYouGoPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  return (
    <TournamentKnowBeforeYouGoPageContent tournament={tournament} />
  )
}

