import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { getTeamsByTournament } from "@/cms/queries/team"
import { getF3Standings, getF1Fixtures, getF30SeasonStats, getF13Commentary, getF42ComprehensiveTournament } from "@/app/api/opta/feeds"
import TournamentPageUpcoming from "../page-content-upcoming"
import TournamentPagePast from "../page-content-complete"
import type { TeamDocument, TournamentDocumentDataAwardsItem } from "../../../../../../prismicio-types"
import { isFilled } from "@prismicio/client"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import type * as prismic from "@prismicio/client"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  const tournamentBlogs = await getBlogsByTournament(tournament.id)

  if (tournament.data.status === "Upcoming") {
    return <TournamentPageUpcoming tournament={tournament} tournamentBlogs={tournamentBlogs} />
  }

  if (tournament.data.status === "Complete") {
    const competitionId = tournament.data.opta_competition_id
    const seasonId = tournament.data.opta_season_id

    let f3StandingsData = null
    let f1FixturesData = null
    let prismicTeams: TeamDocument[] = []
    const f30TeamStats: Map<string, F30SeasonStatsResponse> = new Map()

    if (competitionId && seasonId && tournament.uid) {
      try {
        const [standings, fixtures, teams, f42Data] = await Promise.all([
          getF3Standings(competitionId, seasonId),
          getF1Fixtures(competitionId, seasonId),
          getTeamsByTournament(tournament.uid),
          getF42ComprehensiveTournament(competitionId, seasonId)
        ])
        f3StandingsData = standings
        f1FixturesData = fixtures
        prismicTeams = teams

        console.log('=== F42 COMPREHENSIVE TOURNAMENT FEED ===')
        console.log('Competition ID:', competitionId)
        console.log('Season ID:', seasonId)
        console.log('F42 Data:', f42Data)

        const uniqueTeamIds = prismicTeams
          .map(team => team.data.opta_id)
          .filter((id): id is string => !!id)

        const teamStatsPromises = uniqueTeamIds.map(async (teamId) => {
          try {
            const stats = await getF30SeasonStats(competitionId, seasonId, teamId)
            return { teamId, stats }
          } catch (error) {
            console.error(`Error fetching F30 stats for team ${teamId}:`, error)
            return null
          }
        })

        const teamStatsResults = await Promise.all(teamStatsPromises)
        teamStatsResults.forEach(result => {
          if (result) {
            f30TeamStats.set(result.teamId, result.stats)
          }
        })

        if (f1FixturesData?.SoccerFeed?.SoccerDocument?.MatchData) {
          const matches = f1FixturesData.SoccerFeed.SoccerDocument.MatchData
          if (matches.length > 0) {
            const randomMatch = matches[Math.floor(Math.random() * matches.length)]
            console.log('=== F13 COMMENTARY FEED - RANDOM MATCH ===')
            console.log('Match ID:', randomMatch.uID)
            console.log('Competition ID:', competitionId)
            console.log('Season ID:', seasonId)
            try {
              const f13Data = await getF13Commentary(randomMatch.uID, competitionId, seasonId)
              console.log('F13 Commentary Data:', f13Data)
            } catch (error) {
              console.error('Error fetching F13 commentary:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error)
      }
    }

    const awards = tournament.data.awards
      ?.map(item => item.awards)
      .filter(award => isFilled.contentRelationship(award))
      .map(award => award.data)
      .filter((award): award is NonNullable<AwardData> => !!award) || []

    return (
      <TournamentPagePast 
        compact 
        tournament={tournament}
        tournamentBlogs={tournamentBlogs}
        f3StandingsData={f3StandingsData}
        f1FixturesData={f1FixturesData}
        f30TeamStats={f30TeamStats}
        prismicTeams={prismicTeams}
        awards={awards}
      />
    )
  }

  return null
}
