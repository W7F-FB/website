import type { F9MatchResponse, F9SoccerDocument, F9TeamData } from "@/types/opta-feeds/f9-match"
import { getWinnerTeamRef } from "@/components/blocks/match/utils"
import { dev } from "@/lib/dev"

export type TeamRecord = {
  optaNormalizedTeamId: string
  wins: number
  losses: number
}

function normalizeTeamId(teamRef: string): string {
  return teamRef.replace(/^t/, "")
}

function getSoccerDocument(feed: F9MatchResponse): F9SoccerDocument | null {
  const doc = feed.SoccerFeed?.SoccerDocument
  if (!doc) return null
  return Array.isArray(doc) ? doc[0] : doc
}

function getTeamDataArray(teamData: F9TeamData | F9TeamData[]): F9TeamData[] {
  return Array.isArray(teamData) ? teamData : [teamData]
}

export function getRecordsFromF9(feeds: F9MatchResponse[]): TeamRecord[] {
  const recordsMap = new Map<string, { wins: number; losses: number }>()

  for (const feed of feeds) {
    const doc = getSoccerDocument(feed)
    if (!doc) continue

    const matchInfo = doc.MatchData?.MatchInfo
    const teamData = getTeamDataArray(doc.MatchData?.TeamData)

    if (!matchInfo || teamData.length < 2) continue
    
    const roundType = doc.Competition?.Round?.Name || 'Unknown'
    const period = matchInfo.Period
    
    if (matchInfo.Period !== "FullTime") {
      dev.log(`[RECORDS] ${roundType} - Period: ${period} - SKIPPED`)
      continue
    }

    const homeTeamData = teamData.find((t) => t.Side === "Home")
    const awayTeamData = teamData.find((t) => t.Side === "Away")
    if (!homeTeamData || !awayTeamData) continue

    const winnerRef = getWinnerTeamRef(
      homeTeamData.Score ?? null,
      awayTeamData.Score ?? null,
      homeTeamData.TeamRef,
      awayTeamData.TeamRef,
      matchInfo.Result?.Winner
    )

    if (!winnerRef) {
      dev.log(`[RECORDS] ${roundType} - Period: ${period} - NO WINNER`)
      continue
    }

    const loserRef = teamData.find((t) => t.TeamRef !== winnerRef)?.TeamRef
    if (!loserRef) continue

    const winnerId = normalizeTeamId(winnerRef)
    const loserId = normalizeTeamId(loserRef)
    
    dev.log(`[RECORDS] ${roundType} - Period: ${period} - Winner: ${winnerId}, Loser: ${loserId}`)

    if (!recordsMap.has(winnerId)) {
      recordsMap.set(winnerId, { wins: 0, losses: 0 })
    }
    if (!recordsMap.has(loserId)) {
      recordsMap.set(loserId, { wins: 0, losses: 0 })
    }

    recordsMap.get(winnerId)!.wins++
    recordsMap.get(loserId)!.losses++
  }

  return Array.from(recordsMap.entries()).map(([id, record]) => ({
    optaNormalizedTeamId: id,
    wins: record.wins,
    losses: record.losses,
  }))
}

