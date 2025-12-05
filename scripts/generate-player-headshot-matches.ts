import * as fs from "fs"
import * as path from "path"

interface OptaPlayer {
  firstName: string
  lastName: string
  playerId: string
  teamId: string
}

interface HeadshotInfo {
  path: string
  extractedFirstName: string
  extractedLastName: string
  teamFolder: string
}

interface PlayerMatch {
  player: OptaPlayer
  headshot: string | null
  extractedName: string | null
  confidence: number
  allCandidates: { path: string; score: number }[]
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
}

function extractNameFromPath(filePath: string): HeadshotInfo {
  const parts = filePath.split("/")
  const headshotsIndex = parts.findIndex(p => p === "PlayerProfileHeadshots")
  const teamFolder = parts[headshotsIndex + 1] || ""
  const afterTeam = parts.slice(headshotsIndex + 2)
  
  let extractedFirstName = ""
  let extractedLastName = ""
  
  const filename = parts[parts.length - 1]
  const filenameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "")
  
  const teamPrefixes = [
    "SanDiegoWaveFC_", "Tigres_", "ClubAmérica_", "ClubAmerica_", 
    "AFCToronto_", "KCCurrent_", "Nacional_", "DeportivoCali_", "Flamengo_",
    "Photo_"
  ]
  
  let hasTeamPrefix = false
  let nameFromFilename = filenameWithoutExt
  for (const prefix of teamPrefixes) {
    if (filenameWithoutExt.startsWith(prefix)) {
      nameFromFilename = filenameWithoutExt.slice(prefix.length)
      hasTeamPrefix = true
      break
    }
  }
  
  if (hasTeamPrefix) {
    if (filenameWithoutExt.startsWith("Photo_")) {
      const nameParts = nameFromFilename.split(/\s+/)
      extractedFirstName = nameParts[0] || ""
      extractedLastName = nameParts.slice(1).join(" ")
    } else {
      const nameParts = nameFromFilename.split("_")
      if (nameParts.length >= 2) {
        extractedLastName = nameParts[0]
        extractedFirstName = nameParts[1]
      }
    }
  } else if (afterTeam.length >= 2) {
    const folderName = afterTeam[0]
    if (folderName) {
      const folderNameClean = folderName.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim()
      
      let folderHasPrefix = false
      let nameFromFolder = folderNameClean
      for (const prefix of teamPrefixes) {
        if (folderNameClean.startsWith(prefix)) {
          nameFromFolder = folderNameClean.slice(prefix.length)
          folderHasPrefix = true
          break
        }
      }
      
      if (folderHasPrefix || folderNameClean.includes("_")) {
        const parts = nameFromFolder.split("_")
        if (parts.length >= 2) {
          extractedLastName = parts[0] || ""
          extractedFirstName = parts[1] || ""
        } else {
          extractedFirstName = parts[0] || ""
        }
      } else {
        const nameParts = folderNameClean.split(/\s+/)
        extractedFirstName = nameParts[0] || ""
        extractedLastName = nameParts.slice(1).join(" ")
      }
    }
  } else {
    const nameParts = filenameWithoutExt.split(/[_\s]+/)
    if (nameParts.length >= 2) {
      extractedLastName = nameParts[0]
      extractedFirstName = nameParts[1]
    } else {
      extractedFirstName = filenameWithoutExt
    }
  }
  
  return {
    path: filePath,
    extractedFirstName: extractedFirstName.trim(),
    extractedLastName: extractedLastName.trim(),
    teamFolder
  }
}

function calculateMatchScore(player: OptaPlayer, headshot: HeadshotInfo): number {
  const playerFirst = normalizeString(player.firstName)
  const playerLast = normalizeString(player.lastName)
  const headshotFirst = normalizeString(headshot.extractedFirstName)
  const headshotLast = normalizeString(headshot.extractedLastName)
  
  const scoreNormal = calculateDirectionalScore(playerFirst, playerLast, headshotFirst, headshotLast)
  const scoreSwapped = calculateDirectionalScore(playerFirst, playerLast, headshotLast, headshotFirst)
  
  return Math.max(scoreNormal, scoreSwapped)
}

function calculateDirectionalScore(playerFirst: string, playerLast: string, headshotFirst: string, headshotLast: string): number {
  let score = 0
  
  if (playerLast && headshotLast) {
    if (playerLast === headshotLast) {
      score += 50
    } else if (playerLast.includes(headshotLast) || headshotLast.includes(playerLast)) {
      score += 35
    } else if (levenshteinDistance(playerLast, headshotLast) <= 2) {
      score += 25
    }
  }
  
  if (playerFirst && headshotFirst) {
    if (playerFirst === headshotFirst) {
      score += 50
    } else if (playerFirst.includes(headshotFirst) || headshotFirst.includes(playerFirst)) {
      score += 35
    } else if (levenshteinDistance(playerFirst, headshotFirst) <= 2) {
      score += 25
    }
  }
  
  const playerFullNorm = `${playerFirst} ${playerLast}`.trim()
  const headshotFullNorm = `${headshotFirst} ${headshotLast}`.trim()
  
  if (playerFullNorm === headshotFullNorm) {
    score = 100
  }
  
  const playerWords = playerFullNorm.split(/\s+/).filter(Boolean)
  const headshotWords = headshotFullNorm.split(/\s+/).filter(Boolean)
  
  for (const pw of playerWords) {
    for (const hw of headshotWords) {
      if (pw.length > 2 && hw.length > 2 && pw === hw) {
        score += 10
      }
    }
  }
  
  return Math.min(score, 100)
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[b.length][a.length]
}

const TEAM_ID_TO_FOLDER: Record<string, string[]> = {
  "23620": ["Club America", "Club América"],
  "23621": ["Cali", "DeportivoCali"],
  "23622": ["Flamengo", "FLAMENGO"],
  "23623": ["Nacional"],
  "23624": ["Tigres"],
  "23625": ["Toronto"],
  "23626": ["KCCurrent", "KC Current"],
  "23627": ["San Diego Wave", "SanDiegoWave"],
}

function getTeamFolderMatches(teamId: string): string[] {
  return TEAM_ID_TO_FOLDER[teamId] || []
}

function matchPlayerToHeadshot(player: OptaPlayer, headshots: HeadshotInfo[]): PlayerMatch {
  const teamFolders = getTeamFolderMatches(player.teamId)
  
  const teamHeadshots = headshots.filter(h => {
    const normalizedFolder = normalizeString(h.teamFolder)
    return teamFolders.some(tf => normalizeString(tf) === normalizedFolder)
  })
  
  const candidates: { path: string; score: number; info: HeadshotInfo }[] = []
  
  for (const headshot of teamHeadshots) {
    const score = calculateMatchScore(player, headshot)
    if (score > 0) {
      candidates.push({ path: headshot.path, score, info: headshot })
    }
  }
  
  candidates.sort((a, b) => b.score - a.score)
  
  const bestMatch = candidates[0]
  
  return {
    player,
    headshot: bestMatch && bestMatch.score >= 40 ? bestMatch.path : null,
    extractedName: bestMatch ? `${bestMatch.info.extractedFirstName} ${bestMatch.info.extractedLastName}` : null,
    confidence: bestMatch?.score || 0,
    allCandidates: candidates.slice(0, 5).map(c => ({ path: c.path, score: c.score }))
  }
}

async function main() {
  const playersPath = path.join(process.cwd(), "scripts", "data", "opta-players.json")
  const headshotPathsFile = path.join(process.cwd(), "scripts", "data", "headshot-paths.txt")
  
  const players: OptaPlayer[] = JSON.parse(fs.readFileSync(playersPath, "utf-8"))
  const headshotPaths = fs.readFileSync(headshotPathsFile, "utf-8")
    .split("\n")
    .filter(Boolean)
  
  console.log(`Loaded ${players.length} players`)
  console.log(`Loaded ${headshotPaths.length} headshot paths`)
  
  const headshots = headshotPaths.map(extractNameFromPath)
  
  const usedHeadshots = new Set<string>()
  const matches: PlayerMatch[] = []
  
  for (const player of players) {
    const match = matchPlayerToHeadshot(player, headshots.filter(h => !usedHeadshots.has(h.path)))
    matches.push(match)
    if (match.headshot) {
      usedHeadshots.add(match.headshot)
    }
  }
  
  const matched = matches.filter(m => m.headshot !== null)
  const unmatched = matches.filter(m => m.headshot === null)
  
  console.log(`\n=== MATCH SUMMARY ===`)
  console.log(`Matched: ${matched.length}/${players.length}`)
  console.log(`Unmatched: ${unmatched.length}/${players.length}`)
  
  console.log(`\n=== UNMATCHED PLAYERS ===`)
  for (const m of unmatched) {
    console.log(`  ${m.player.firstName} ${m.player.lastName} (Team: ${m.player.teamId})`)
    if (m.allCandidates.length > 0) {
      console.log(`    Best candidate: ${m.allCandidates[0].path.split("/").slice(-2).join("/")} (score: ${m.allCandidates[0].score})`)
    }
  }
  
  console.log(`\n=== LOW CONFIDENCE MATCHES (<70) ===`)
  for (const m of matched.filter(m => m.confidence < 70)) {
    console.log(`  ${m.player.firstName} ${m.player.lastName} -> ${m.extractedName} (confidence: ${m.confidence})`)
    console.log(`    Path: ${m.headshot?.split("/").slice(-2).join("/")}`)
  }
  
  const outputPath = path.join(process.cwd(), "scripts", "data", "player-headshot-matches.json")
  fs.writeFileSync(outputPath, JSON.stringify(matches, null, 2))
  console.log(`\nFull report written to: ${outputPath}`)
}

main().catch(console.error)

