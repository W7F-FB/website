import { notFound } from "next/navigation"
import type React from "react"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { getTeamsByTournament } from "@/cms/queries/team"
import { getF3Standings, getF1Fixtures, getF30SeasonStats } from "@/app/api/opta/feeds"
import { getBroadcastPartnerByUid } from "@/cms/queries/broadcast-partners"
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
import type { F1MatchData, F1TeamData, F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { groupMatchesByDate } from "../utils"
import { buildMatchSlugMap } from "@/lib/match-url"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ state?: string }>
}

type TournamentStatus = "Upcoming" | "Live" | "Complete"

function testModifyFirstMatchToLive(f1FixturesData: F1FixturesResponse | null): F1FixturesResponse | null {
  if (!f1FixturesData) return f1FixturesData
  
  const modifiedData = JSON.parse(JSON.stringify(f1FixturesData))
  const doc = modifiedData.SoccerFeed.SoccerDocument
  const matchData = doc.MatchData
  
  if (matchData && Array.isArray(matchData) && matchData.length > 0) {
    const sortedMatches = [...matchData].sort((a, b) => {
      const timeA = a.MatchInfo.TimeStamp || a.MatchInfo.DateUtc || a.MatchInfo.Date
      const timeB = b.MatchInfo.TimeStamp || b.MatchInfo.DateUtc || b.MatchInfo.Date
      return new Date(timeA).getTime() - new Date(timeB).getTime()
    })
    
    const firstMatchByTime = sortedMatches[0]
    const originalIndex = matchData.findIndex(m => m.uID === firstMatchByTime.uID)
    
    if (originalIndex >= 0) {
      const matchToModify = matchData[originalIndex]
      
      matchToModify.MatchInfo.Period = "Live"
      
      if (matchToModify.TeamData && Array.isArray(matchToModify.TeamData)) {
        matchToModify.TeamData.forEach((team: { Side: string; Score?: number }) => {
          if (team.Side === "Home") {
            team.Score = 2
          } else if (team.Side === "Away") {
            team.Score = 1
          }
        })
      }
      
      if (!matchToModify.Stat) {
        matchToModify.Stat = []
      }
      
      const existingMatchTimeIndex = matchToModify.Stat.findIndex((stat: { Type: string }) => stat.Type === "match_time")
      
      if (existingMatchTimeIndex >= 0) {
        matchToModify.Stat[existingMatchTimeIndex].value = 23
      } else {
        matchToModify.Stat.push({
          Type: "match_time",
          value: 23
        })
      }
      
    }
  }
  
  return modifiedData
}

function getStatusOverride(stateParam: string | undefined): TournamentStatus | null {
  if (process.env.NEXT_PUBLIC_DEV_MODE !== 'true' || !stateParam) return null
  
  const normalizedState = stateParam.toLowerCase()
  const statusMap: Record<string, TournamentStatus> = {
    upcoming: "Upcoming",
    live: "Live",
    complete: "Complete",
  }
  
  return statusMap[normalizedState] || null
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

export default async function TournamentPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { state } = await searchParams
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  const tournamentBlogs = await getBlogsByTournament(tournament.id)
  
  const statusOverride = getStatusOverride(state)
  const status = statusOverride ?? tournament.data.status
  
  const effectiveTournament = statusOverride 
    ? { ...tournament, data: { ...tournament.data, status: statusOverride } }
    : tournament

  const competitionId = tournament.data.opta_competition_id
  const seasonId = tournament.data.opta_season_id

  let f3StandingsData = null
  let f1FixturesData = null
  let prismicTeams: TeamDocument[] = []
  const f30TeamStats: Map<string, F30SeasonStatsResponse> = new Map()

  if (competitionId && seasonId && tournament.uid && (status === "Live" || status === "Complete")) {
    try {
      const [standings, fixtures, teams] = await Promise.all([
        getF3Standings(competitionId, seasonId),
        getF1Fixtures(competitionId, seasonId),
        getTeamsByTournament(tournament.uid)
      ])
      f3StandingsData = standings
      f1FixturesData = fixtures
      prismicTeams = teams

      dev.log('f1FixturesData', f1FixturesData)
      dev.log('f3StandingsData', f3StandingsData)
      
      f1FixturesData = testModifyFirstMatchToLive(f1FixturesData)

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

  const [dazn, tnt, truTV, hboMax, univision, espn, disneyPlus] = await Promise.all([
    getBroadcastPartnerByUid("dazn"),
    getBroadcastPartnerByUid("tnt"),
    getBroadcastPartnerByUid("tru-tv"),
    getBroadcastPartnerByUid("hbo-max"),
    getBroadcastPartnerByUid("univision"),
    getBroadcastPartnerByUid("espn"),
    getBroadcastPartnerByUid("disney-plus"),
  ])

  let groupedFixtures: Map<string, F1MatchData[]> = new Map()
  let optaTeams: F1TeamData[] = []
  const matchSlugMap = buildMatchSlugMap(tournament)
  
  if (f1FixturesData && prismicTeams.length > 0) {
    const doc = f1FixturesData.SoccerFeed.SoccerDocument
    optaTeams = doc.Team || doc.TeamData || []
    const matchData = doc.MatchData
    
    if (matchData && Array.isArray(matchData)) {
      groupedFixtures = groupMatchesByDate(matchData)
    }
  }

  let mainContent: React.ReactNode

  if (status === "Upcoming") {
    mainContent = <TournamentPageUpcoming tournament={effectiveTournament} tournamentBlogs={tournamentBlogs} />
  } else if (status === "Live") {
    mainContent = (
      <TournamentPageLive
        compact
        tournament={effectiveTournament}
        tournamentBlogs={tournamentBlogs}
        f3StandingsData={f3StandingsData}
        f1FixturesData={f1FixturesData}
        f30TeamStats={f30TeamStats}
        prismicTeams={prismicTeams}
        matchSlugMap={matchSlugMap}
        dazn={dazn}
        tnt={tnt}
        truTV={truTV}
        hboMax={hboMax}
        univision={univision}
        espn={espn}
        disneyPlus={disneyPlus}
      />
    )
  } else if (status === "Complete") {
    mainContent = (
      <TournamentPagePast 
        compact 
        tournament={effectiveTournament}
        tournamentBlogs={tournamentBlogs}
        f3StandingsData={f3StandingsData}
        f1FixturesData={f1FixturesData}
        f30TeamStats={f30TeamStats}
        prismicTeams={prismicTeams}
        matchSlugMap={matchSlugMap}
        awards={awards}
        dazn={dazn}
      />
    )
  } else {
    return null
  }

  return (
    <>
      <NavMain 
        showBreadcrumbs 
        customBreadcrumbs={[
          { label: "Home", href: "/" },
          { label: tournament.data.title, href: `/tournament/${tournament.uid}` }
        ]}
        groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
        prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
        optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
        tournament={tournament}
        matchSlugMap={matchSlugMap}
      />
      <main className="flex-grow min-h-[30rem]">
        {mainContent}
      </main>
      <Footer />
    </>
  )
}
