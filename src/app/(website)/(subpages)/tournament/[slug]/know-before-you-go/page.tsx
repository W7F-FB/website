import { notFound, redirect } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getTeamsByTournament } from "@/cms/queries/team"
import { getF1Fixtures } from "@/app/api/opta/feeds"
import { fetchF9FeedsForMatches, extractMatchIdsFromFixtures } from "@/lib/opta/match-data"
import TournamentKnowBeforeYouGoPageContent from "./page-content"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import type { TeamDocument } from "../../../../../../../prismicio-types"
import { groupMatchesByDate } from "../../utils"
import { dev } from "@/lib/dev"

export const revalidate = 15

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) {
    return {
      title: "Know Before You Go - World Sevens Football",
      description: "Essential information for attending World Sevens Football tournaments.",
    }
  }

  const title = `Know Before You Go - ${tournament.data.title} - World Sevens Football`
  const description = `Essential information for attending ${tournament.data.title}. Find details on venue access, parking, what to bring, and everything you need to know before you go.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/tournament/${slug}/know-before-you-go`,
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

export default async function TournamentKnowBeforeYouGoPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.status === "Complete") {
    redirect(`/tournament/${slug}`)
  }

  const competitionId = tournament.data.opta_competition_id
  const seasonId = tournament.data.opta_season_id

  let groupedFixtures: Map<string, F1MatchData[]> = new Map()
  let prismicTeams: TeamDocument[] = []
  let optaTeams: F1TeamData[] = []
  let f9FeedsMap: Map<string, F9MatchResponse> = new Map()
  
  if (competitionId && seasonId && tournament.uid) {
    try {
      const [fixtures, teams] = await Promise.all([
        getF1Fixtures(competitionId, seasonId),
        getTeamsByTournament(tournament.uid)
      ])
      prismicTeams = teams

      if (fixtures && prismicTeams.length > 0) {
        const doc = fixtures.SoccerFeed.SoccerDocument
        optaTeams = doc.Team || doc.TeamData || []
        const matchData = doc.MatchData
        
        if (matchData && Array.isArray(matchData)) {
          groupedFixtures = groupMatchesByDate(matchData)
          
          // Fetch F9 data for all matches
          const matchIds = extractMatchIdsFromFixtures(matchData)
          f9FeedsMap = await fetchF9FeedsForMatches(matchIds)
        }
      }
    } catch (error) {
      dev.log('Error fetching fixtures for game slider:', error)
    }
  }

  return (
    <>
      <NavMain 
        showBreadcrumbs 
        customBreadcrumbs={[
          { label: "Home", href: "/" },
          { label: tournament.data.title, href: `/tournament/${tournament.uid}` },
          { label: "Know Before You Go", href: `/tournament/${tournament.uid}/know-before-you-go` }
        ]}
        groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
        prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
        optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
        tournament={tournament}
        f9FeedsMap={f9FeedsMap.size > 0 ? f9FeedsMap : undefined}
      />
      <main className="flex-grow min-h-[30rem]">
        <TournamentKnowBeforeYouGoPageContent tournament={tournament} />
      </main>
      <Footer />
    </>
  )
}

