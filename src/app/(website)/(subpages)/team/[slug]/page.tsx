import { notFound } from "next/navigation"
import { getTeamByUid, getTeamsByOptaIds } from "@/cms/queries/team"
import { getF40Squads, getF3Standings, getF1Fixtures } from "@/app/api/opta/feeds"
import { getNavigationTournaments } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { isFilled } from "@prismicio/client"
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
  
  const [squadsData, f3StandingsData, f1FixturesData, tournaments] = await Promise.all([
    getF40Squads(competitionId, seasonId),
    getF3Standings(competitionId, seasonId).catch(() => null),
    getF1Fixtures(competitionId, seasonId).catch(() => null),
    getNavigationTournaments().catch(() => [])
  ])

  const allTeamRefs = f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData
    ?.flatMap(match => match.TeamData.map(teamData => teamData.TeamRef)) || []
  const uniqueOptaIds = [...new Set(allTeamRefs.map(ref => ref.replace('t', '')))]
  const prismicTeams = await getTeamsByOptaIds(uniqueOptaIds).catch(() => [])

  const currentTournament = tournaments.length > 0 ? tournaments[0] : null

  const teamOptaId = team.data.opta_id

  const teamOptaIdWithPrefix = teamOptaId?.toString().startsWith('t')
    ? teamOptaId
    : `t${teamOptaId}`

  const teamSquad = squadsData.SoccerFeed.SoccerDocument.Team?.find(
    t => t.uID === teamOptaIdWithPrefix
  )

  const tournamentIds = team.data.tournaments
    ?.filter(item => isFilled.contentRelationship(item.tournament))
    .map(item => {
      if (isFilled.contentRelationship(item.tournament)) {
        return item.tournament.id
      }
      return null
    })
    .filter((id): id is string => id !== null) || []
  
  const blogsPromises = tournamentIds.map(tournamentId => 
    getBlogsByTournament(tournamentId).catch(() => [])
  )
  const blogsResults = await Promise.all(blogsPromises)
  const teamBlogs = blogsResults.flat()

  return (
    <TeamPageContent
      team={team}
      teamSquad={teamSquad}
      standings={f3StandingsData}
      fixtures={f1FixturesData}
      currentTournament={currentTournament}
      prismicTeams={prismicTeams}
      teamBlogs={teamBlogs}
    />
  )
}
