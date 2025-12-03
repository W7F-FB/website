import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { getTeamsByTournament } from "@/cms/queries/team"
import { getF3Standings, getF1Fixtures, getF30SeasonStats } from "@/app/api/opta/feeds"
import TournamentPageUpcoming from "../page-content-upcoming"
import TournamentPageLive from "../page-content-live"
import TournamentPagePast from "../page-content-complete"
import type { TeamDocument, TournamentDocumentDataAwardsItem } from "../../../../../../prismicio-types"
import { isFilled } from "@prismicio/client"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import type * as prismic from "@prismicio/client"
import { dev } from "@/lib/dev"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) {
    return {
      title: "Tournament - World Sevens Football",
      description: "Elite 7v7 football tournament featuring the world's best clubs competing for a $5M prize pool.",
    }
  }

  const title = `${tournament.data.title} - World Sevens Football`
  let description = `${tournament.data.title} tournament`

  if (tournament.data.status === "Upcoming") {
    description = `${tournament.data.title} is coming soon. Elite clubs compete in 7v7 format for a $5M prize pool. Get ready for high-stakes matches and world-class football action.`
  } else if (tournament.data.status === "Live") {
    description = `${tournament.data.title} is live now. Follow the action as elite clubs compete in 7v7 format for a $5M prize pool. View live standings, fixtures, and match results.`
  } else if (tournament.data.status === "Complete") {
    description = `${tournament.data.title} results and highlights. View final standings, match results, awards, and relive the excitement from this elite 7v7 tournament.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/tournament/${slug}`,
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

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  const tournamentBlogs = await getBlogsByTournament(tournament.id)

  if (tournament.data.status === "Upcoming") {
    return (
      <>
        <NavMain showBreadcrumbs customBreadcrumbs={[
          { label: "Home", href: "/" }
        ]} />
        <main className="flex-grow min-h-[30rem]">
          <TournamentPageUpcoming tournament={tournament} tournamentBlogs={tournamentBlogs} />
        </main>
        <Footer />
      </>
    )
  }

  if (tournament.data.status === "Live") {
    const competitionId = tournament.data.opta_competition_id
    const seasonId = tournament.data.opta_season_id

    let f1FixturesData = null
    let prismicTeams: TeamDocument[] = []
    const f30TeamStats: Map<string, F30SeasonStatsResponse> = new Map()

    if (competitionId && seasonId && tournament.uid) {
      try {
        const [fixtures, teams] = await Promise.all([
          getF1Fixtures(competitionId, seasonId),
          getTeamsByTournament(tournament.uid)
        ])
        f1FixturesData = fixtures
        prismicTeams = teams

        const uniqueTeamIds = prismicTeams
          .map(team => team.data.opta_id)
          .filter((id): id is string => !!id)

        const teamStatsPromises = uniqueTeamIds.map(async (teamId) => {
          try {
            const stats = await getF30SeasonStats(competitionId, seasonId, teamId)
            return { teamId, stats }
          } catch (error) {
            dev.log(`Error fetching F30 stats for team ${teamId}:`, error)
            return null
          }
        })

        const teamStatsResults = await Promise.all(teamStatsPromises)
        teamStatsResults.forEach(result => {
          if (result) {
            f30TeamStats.set(result.teamId, result.stats)
          }
        })
        
      } catch (error) {
        dev.log('Error fetching tournament data:', error)
      }
    }

    return (
      <>
        <NavMain showBreadcrumbs />
        <main className="flex-grow min-h-[30rem]">
          <TournamentPageLive
            tournament={tournament}
            tournamentBlogs={tournamentBlogs}
            f1FixturesData={f1FixturesData}
            prismicTeams={prismicTeams}
          />
        </main>
        <Footer />
      </>
    )
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
        const [standings, fixtures, teams] = await Promise.all([
          getF3Standings(competitionId, seasonId),
          getF1Fixtures(competitionId, seasonId),
          getTeamsByTournament(tournament.uid)
        ])
        f3StandingsData = standings
        f1FixturesData = fixtures
        prismicTeams = teams


        const uniqueTeamIds = prismicTeams
          .map(team => team.data.opta_id)
          .filter((id): id is string => !!id)

        const teamStatsPromises = uniqueTeamIds.map(async (teamId) => {
          try {
            const stats = await getF30SeasonStats(competitionId, seasonId, teamId)
            return { teamId, stats }
          } catch (error) {
            dev.log(`Error fetching F30 stats for team ${teamId}:`, error)
            return null
          }
        })

        const teamStatsResults = await Promise.all(teamStatsPromises)
        teamStatsResults.forEach(result => {
          if (result) {
            f30TeamStats.set(result.teamId, result.stats)
          }
        })
        
      } catch (error) {
        dev.log('Error fetching tournament data:', error)
      }
    }

    const awards = tournament.data.awards
      ?.map(item => item.awards)
      .filter(award => isFilled.contentRelationship(award))
      .map(award => award.data)
      .filter((award): award is NonNullable<AwardData> => !!award) || []

    return (
      <>
        <NavMain showBreadcrumbs customBreadcrumbs={[
          { label: "Home", href: "/" },
          { label: tournament.data.title, href: `/tournament/${tournament.uid}` }
        ]} />
        <main className="flex-grow min-h-[30rem]">
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
        </main>
        <Footer />
      </>
    )
  }

  return null
}
