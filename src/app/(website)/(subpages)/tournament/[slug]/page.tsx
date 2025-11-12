import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import TournamentPageUpcoming from "../page-content-upcoming"
import TournamentPagePast from "../page-content-complete"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.status === "Upcoming") {
    return <TournamentPageUpcoming tournament={tournament} />
  }

  if (tournament.data.status === "Complete") {
    return <TournamentPagePast compact tournament={tournament} />
  }

  return null
}
