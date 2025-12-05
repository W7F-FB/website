import "dotenv/config"
import * as prismic from "@prismicio/client"
import { XMLParser } from "fast-xml-parser"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"
const OPTA_BASE_URL = "https://omo.akamai.opta.net"

interface F1TeamMatchData {
  TeamRef: string
  Side: string
}

interface F1MatchInfo {
  RoundType?: string
  Date?: string
  DateUtc?: string
  TimeStamp?: string
}

interface F1MatchData {
  uID: string
  MatchInfo: F1MatchInfo
  TeamData: F1TeamMatchData[]
}

interface F1TeamData {
  uID: string
  Name?: string
  name?: string
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

function isKnockoutMatch(match: F1MatchData): boolean {
  const roundType = match.MatchInfo?.RoundType?.toLowerCase() || ""
  return roundType.includes("semi") || roundType.includes("final") || roundType.includes("3rd")
}

function getMatchTime(match: F1MatchData): number {
  const timeStr = match.MatchInfo?.TimeStamp || match.MatchInfo?.DateUtc || match.MatchInfo?.Date || ""
  return new Date(timeStr).getTime()
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

  const knockoutMatchesByTournament = new Map<string, F1MatchData[]>()
  
  for (const tournament of tournamentsWithOpta) {
    console.log(`\nFetching F1 fixtures for ${tournament.data.title}...`)
    try {
      const f1Data = await fetchF1Fixtures(
        tournament.data.opta_competition_id!,
        tournament.data.opta_season_id!
      )
      
      const matches = f1Data.SoccerFeed?.SoccerDocument?.MatchData || []
      
      const knockoutMatches = matches
        .filter(isKnockoutMatch)
        .sort((a, b) => getMatchTime(a) - getMatchTime(b))
      
      console.log(`  Found ${knockoutMatches.length} knockout matches`)
      for (const m of knockoutMatches) {
        console.log(`    ${normalizeOptaId(m.uID)}: ${m.MatchInfo?.RoundType} @ ${m.MatchInfo?.DateUtc || m.MatchInfo?.Date}`)
      }
      
      knockoutMatchesByTournament.set(tournament.id, knockoutMatches)
    } catch (error) {
      console.error(`  Error: ${error}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const KNOCKOUT_ORDER = [
    "Group 1 Semifinal",
    "Group 2 Semifinal", 
    "Third Place Match",
    "Final"
  ]

  console.log("\nFetching Prismic knockout matches...")
  const prismicMatches = await client.getAllByType("match")
  
  const knockoutMatches = prismicMatches.filter(
    m => m.data.stage === "Knockout Stage" && !m.data.opta_id
  )
  console.log(`Found ${knockoutMatches.length} Prismic knockout matches without opta_id`)

  let updatedCount = 0

  for (const match of knockoutMatches) {
    const knockoutType = match.data.knockout_stage_match_type
    if (!knockoutType) {
      console.log(`\n⚠️  ${match.uid} - no knockout_stage_match_type set`)
      continue
    }

    const tournamentRef = match.data.tournament
    if (!prismic.isFilled.contentRelationship(tournamentRef)) {
      console.log(`\n⚠️  ${match.uid} - no tournament relationship`)
      continue
    }

    const f1Knockouts = knockoutMatchesByTournament.get(tournamentRef.id)
    if (!f1Knockouts || f1Knockouts.length === 0) {
      console.log(`\n⚠️  ${match.uid} - no F1 knockout matches for tournament`)
      continue
    }

    const orderIndex = KNOCKOUT_ORDER.indexOf(knockoutType)
    if (orderIndex === -1 || orderIndex >= f1Knockouts.length) {
      console.log(`\n⚠️  ${match.uid} - could not match ${knockoutType} (index ${orderIndex})`)
      continue
    }

    const f1Match = f1Knockouts[orderIndex]
    const optaMatchId = normalizeOptaId(f1Match.uID)

    console.log(`\nUpdating ${match.uid}:`)
    console.log(`  Type: ${knockoutType} (order index: ${orderIndex})`)
    console.log(`  Setting opta_id: ${optaMatchId}`)

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
          opta_id: optaMatchId
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

  console.log(`\n✅ Done! Updated ${updatedCount} knockout matches`)
}

main().catch(console.error)

