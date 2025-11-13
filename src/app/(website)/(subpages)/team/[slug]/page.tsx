import { notFound } from "next/navigation"
import { getTeamByUid } from "@/cms/queries/team"
import { getF40Squads } from "@/app/api/opta/feeds"
import TeamPageContent from "../page-content"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params
  const team = await getTeamByUid(slug)

  if (!team) return notFound()

  const competitionId = "1303"
  const seasonId = "2025"
  const squadsData = await getF40Squads(competitionId, seasonId)

  const teamOptaId = team.data.opta_id

  const teamOptaIdWithPrefix = teamOptaId?.toString().startsWith('t')
    ? teamOptaId
    : `t${teamOptaId}`

  const teamSquad = squadsData.SoccerFeed.SoccerDocument.Team?.find(
    t => t.uID === teamOptaIdWithPrefix
  )

  return (
    <TeamPageContent
      team={team}
      teamSquad={teamSquad}
    />
  )
}
