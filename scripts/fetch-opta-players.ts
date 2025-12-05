import "dotenv/config"
import { XMLParser } from "fast-xml-parser"
import * as fs from "fs"
import * as path from "path"

const OPTA_BASE_URL = "https://omo.akamai.opta.net"

interface F40PlayerStat {
  Type: string
  value?: string | number
}

interface F40Player {
  uID: string
  Name: string
  Position: string
  Stat?: F40PlayerStat | F40PlayerStat[]
}

interface F40Team {
  uID: string
  Name: string
  Player?: F40Player | F40Player[]
}

interface F40Response {
  SoccerFeed: {
    SoccerDocument: {
      Team?: F40Team | F40Team[]
    }
  }
}

interface OutputPlayer {
  firstName: string
  lastName: string
  playerId: string
  teamId: string
}

function getPlayerStat(player: F40Player, statType: string): string | undefined {
  if (!player.Stat) return undefined
  const stats = Array.isArray(player.Stat) ? player.Stat : [player.Stat]
  const stat = stats.find(s => s.Type === statType)
  return stat?.value?.toString()
}

function normalizeId(id: string): string {
  if (id.startsWith('t') || id.startsWith('p')) {
    return id.slice(1)
  }
  return id
}

async function fetchF40Squads(competitionId: string, seasonId: string): Promise<F40Response> {
  const username = process.env.OPTA_USERNAME
  const password = process.env.OPTA_PASSWORD

  if (!username || !password) {
    throw new Error("OPTA_USERNAME and OPTA_PASSWORD environment variables are required")
  }

  const params = new URLSearchParams({
    user: username,
    psw: password,
    feed_type: "f40",
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

  return parser.parse(xmlText) as F40Response
}

async function main() {
  const competitionId = process.argv[2]
  const seasonId = process.argv[3]

  if (!competitionId || !seasonId) {
    console.error("Usage: npx tsx scripts/fetch-opta-players.ts <competitionId> <seasonId>")
    console.error("Example: npx tsx scripts/fetch-opta-players.ts 1234 2024")
    process.exit(1)
  }

  console.log(`Fetching F40 squads for competition ${competitionId}, season ${seasonId}...`)
  
  const data = await fetchF40Squads(competitionId, seasonId)
  
  const teams = data.SoccerFeed?.SoccerDocument?.Team
  if (!teams) {
    console.error("No teams found in response")
    process.exit(1)
  }

  const teamsArray = Array.isArray(teams) ? teams : [teams]
  const players: OutputPlayer[] = []

  for (const team of teamsArray) {
    const teamId = normalizeId(team.uID)
    const teamPlayers = team.Player
    
    if (!teamPlayers) continue
    
    const playersArray = Array.isArray(teamPlayers) ? teamPlayers : [teamPlayers]
    
    for (const player of playersArray) {
      const firstName = getPlayerStat(player, "first_name") || ""
      const lastName = getPlayerStat(player, "last_name") || ""
      const playerId = normalizeId(player.uID)
      
      players.push({
        firstName,
        lastName,
        playerId,
        teamId,
      })
    }
  }

  console.log(`Found ${players.length} players across ${teamsArray.length} teams`)

  const outputPath = path.join(process.cwd(), "scripts", "data", "opta-players.json")
  fs.writeFileSync(outputPath, JSON.stringify(players, null, 2))
  
  console.log(`Written to ${outputPath}`)
}

main().catch(console.error)

