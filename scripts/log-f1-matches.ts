import "dotenv/config"
import * as prismic from "@prismicio/client"
import { XMLParser } from "fast-xml-parser"

const REPOSITORY_NAME = "world-sevens-football"
const OPTA_BASE_URL = "https://omo.akamai.opta.net"

interface F1TeamMatchData {
  TeamRef: string
  Side: string
}

interface F1TeamData {
  uID: string
  Name?: string
  name?: string
  ShortName?: string
}

interface F1MatchData {
  uID: string
  TeamData: F1TeamMatchData[]
}

interface F1FixturesResponse {
  SoccerFeed: {
    SoccerDocument: {
      MatchData?: F1MatchData[]
      Team?: F1TeamData[]
      TeamData?: F1TeamData[]
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
  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all tournaments...")
  const tournaments = await client.getAllByType("tournament")
  
  const tournamentsWithOpta = tournaments.filter(
    t => t.data.opta_competition_id && t.data.opta_season_id
  )

  for (const tournament of tournamentsWithOpta) {
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Tournament: ${tournament.data.title}`)
    console.log(`Competition: ${tournament.data.opta_competition_id}, Season: ${tournament.data.opta_season_id}`)
    console.log("=".repeat(60))
    
    try {
      const f1Data = await fetchF1Fixtures(
        tournament.data.opta_competition_id!,
        tournament.data.opta_season_id!
      )
      
      const matches = f1Data.SoccerFeed?.SoccerDocument?.MatchData || []
      const teams = f1Data.SoccerFeed?.SoccerDocument?.Team || 
                    f1Data.SoccerFeed?.SoccerDocument?.TeamData || []
      
      const teamMap = new Map<string, string>()
      for (const team of teams) {
        const id = normalizeOptaId(team.uID)
        const name = team.Name || team.name || team.ShortName || "Unknown"
        teamMap.set(id, name)
      }
      
      console.log(`\nTeams (${teams.length}):`)
      for (const team of teams) {
        const id = normalizeOptaId(team.uID)
        const name = team.Name || team.name || "Unknown"
        console.log(`  ${id}: ${name}`)
      }
      
      console.log(`\nMatches (${matches.length}):`)
      for (const match of matches) {
        const matchId = normalizeOptaId(match.uID)
        const homeTeamData = match.TeamData.find(t => t.Side === "Home")
        const awayTeamData = match.TeamData.find(t => t.Side === "Away")
        
        const homeId = homeTeamData ? normalizeOptaId(homeTeamData.TeamRef) : "?"
        const awayId = awayTeamData ? normalizeOptaId(awayTeamData.TeamRef) : "?"
        
        const homeName = teamMap.get(homeId) || "Unknown"
        const awayName = teamMap.get(awayId) || "Unknown"
        
        console.log(`  Match ${matchId}: ${homeName} (${homeId}) vs ${awayName} (${awayId})`)
      }
      
    } catch (error) {
      console.error(`  Error: ${error}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

main().catch(console.error)

