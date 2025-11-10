import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import TournamentPageUpcoming from "../page-content-upcoming"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.upcoming) {
    return <TournamentPageUpcoming tournament={tournament} />
  }

  return null
}
