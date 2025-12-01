import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { getTeamsByTournament } from "@/cms/queries/team"
import TournamentSchedulePageContent from "./page-content"
import { dev } from "@/lib/dev"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentSchedulePage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  const [tournamentBlogs, prismicTeams] = await Promise.all([
    getBlogsByTournament(tournament.id),
    getTeamsByTournament(slug)
  ])

  dev.log('tournament', tournament)
  dev.log('tournamentBlogs', tournamentBlogs)
  dev.log('prismicTeams', prismicTeams)

  return (
    <TournamentSchedulePageContent
      tournament={tournament}
      tournamentBlogs={tournamentBlogs}
      prismicTeams={prismicTeams}
    />
  )
}
