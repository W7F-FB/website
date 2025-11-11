import { notFound } from "next/navigation"
import { getTournamentByUid, getTournaments } from "@/cms/queries/tournaments"
import TournamentPageUpcoming from "../page-content-upcoming"
import TournamentPagePast from "../page-content-complete"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tournaments = await getTournaments()
  
  return tournaments
    .filter(tournament => tournament.uid)
    .map((tournament) => ({
      slug: tournament.uid!,
    }))
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.status === "Upcoming") {
    return <TournamentPageUpcoming tournament={tournament} />
  }

  if (tournament.data.status === "Complete") {
    return <TournamentPagePast tournament={tournament} />
  }

  return null
}
