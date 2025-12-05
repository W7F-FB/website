import "dotenv/config"
import * as prismic from "@prismicio/client"
import { XMLParser } from "fast-xml-parser"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"
const OPTA_BASE_URL = "https://omo.akamai.opta.net"

interface F1MatchData {
  uID: string
  TeamData: Array<{ TeamRef: string; Side: string }>
}

interface F1FixturesResponse {
  SoccerFeed: {
    SoccerDocument: {
      MatchData?: F1MatchData[]
    }
  }
}

function normalizeOptaId(id: string): string {
  if (id.startsWith('t') || id.startsWith('g') || id.startsWith('p')) {
    return id.slice(1)
  }
  return id
}

async function fetchF1Fixtures(competitionId: string, seasonId: string): Promise<F1FixturesResponse> {
  const username = process.env.OPTA_USERNAME
  const password = process.env.OPTA_PASSWORD

  if (!username || !password) {
    throw new Error("OPTA_USERNAME and OPTA_PASSWORD environment variables are required")
  }

  const params = new URLSearchParams({
    user: username,
    psw: password,
    feed_type: "f1",
    competition: competitionId,
    season_id: seasonId,
  })

  const response = await fetch(`${OPTA_BASE_URL}/competition.php?${params}`)
  if (!response.ok) {
    throw new Error(`Opta API error: ${response.status}`)
  }

  const xmlText = await response.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "value",
    parseAttributeValue: true,
    parseTagValue: true,
  })

  return parser.parse(xmlText) as F1FixturesResponse
}

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all tournaments...")
  const tournaments = await client.getAllByType("tournament")
  
  const tournamentsWithOpta = tournaments.filter(
    t => t.data.opta_competition_id && t.data.opta_season_id
  )
  console.log(`Found ${tournamentsWithOpta.length} tournaments with Opta data`)

  const allF1Matches: Map<string, { optaMatchId: string; homeTeamId: string; awayTeamId: string }> = new Map()
  
  for (const tournament of tournamentsWithOpta) {
    console.log(`\nFetching F1 fixtures for ${tournament.data.title}...`)
    try {
      const f1Data = await fetchF1Fixtures(
        tournament.data.opta_competition_id!,
        tournament.data.opta_season_id!
      )
      
      const matches = f1Data.SoccerFeed?.SoccerDocument?.MatchData || []
      console.log(`  Found ${matches.length} matches`)
      
      for (const match of matches) {
        const homeTeam = match.TeamData.find(t => t.Side === "Home")
        const awayTeam = match.TeamData.find(t => t.Side === "Away")
        
        if (homeTeam && awayTeam) {
          const homeTeamId = normalizeOptaId(homeTeam.TeamRef)
          const awayTeamId = normalizeOptaId(awayTeam.TeamRef)
          const key = `${homeTeamId}-${awayTeamId}`
          
          allF1Matches.set(key, {
            optaMatchId: normalizeOptaId(match.uID),
            homeTeamId,
            awayTeamId,
          })
        }
      }
    } catch (error) {
      console.error(`  Error fetching fixtures: ${error}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\nTotal F1 matches collected: ${allF1Matches.size}`)

  console.log("\nFetching all Prismic matches with team data...")
  const prismicMatches = await client.getAllByType("match", {
    fetchLinks: ["team.opta_id", "team.name"]
  })
  console.log(`Found ${prismicMatches.length} Prismic matches`)

  let updatedCount = 0
  let notFoundCount = 0

  for (const match of prismicMatches) {
    const homeTeam = match.data.home_team
    const awayTeam = match.data.away_team
    
    let homeTeamOptaId: string | null = null
    let awayTeamOptaId: string | null = null
    
    if (prismic.isFilled.contentRelationship(homeTeam) && homeTeam.data) {
      const teamData = homeTeam.data as { opta_id?: string }
      homeTeamOptaId = teamData.opta_id || null
    }
    
    if (prismic.isFilled.contentRelationship(awayTeam) && awayTeam.data) {
      const teamData = awayTeam.data as { opta_id?: string }
      awayTeamOptaId = teamData.opta_id || null
    }

    if (!homeTeamOptaId || !awayTeamOptaId) {
      console.log(`\n⚠️  ${match.uid} - missing team opta_ids (home: ${homeTeamOptaId}, away: ${awayTeamOptaId})`)
      notFoundCount++
      continue
    }

    const key = `${homeTeamOptaId}-${awayTeamOptaId}`
    const f1Match = allF1Matches.get(key)

    if (!f1Match) {
      console.log(`\n⚠️  ${match.uid} - no F1 match found for teams ${homeTeamOptaId} vs ${awayTeamOptaId}`)
      notFoundCount++
      continue
    }

    const existingOptaId = match.data.opta_id
    console.log(`\nUpdating ${match.uid}:`)
    if (existingOptaId) {
      console.log(`  Existing opta_id: ${existingOptaId}`)
    }
    console.log(`  Setting opta_id: ${f1Match.optaMatchId}`)

    const response = await fetch(`${MIGRATION_API_URL}/${match.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken
      },
      body: JSON.stringify({
        uid: match.uid,
        type: "match",
        lang: match.lang,
        title: match.uid,
        data: {
          ...match.data,
          opta_id: f1Match.optaMatchId
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ Failed: ${response.status} - ${errorText}`)
    } else {
      console.log(`  ✅ Success`)
      updatedCount++
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Not found/missing data: ${notFoundCount}`)
}

main().catch(console.error)

