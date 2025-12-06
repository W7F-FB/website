import { getF9MatchDetails, getF13Commentary } from "@/app/api/opta/feeds"
import { normalizeOptaId } from "@/lib/opta/utils"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import type { F13CommentaryResponse } from "@/types/opta-feeds/f13-commentary"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { TeamDocument } from "../../../prismicio-types"
import { getF9GameCardData, getF1GameCardData, LIVE_PERIODS, type GameCardData } from "@/components/blocks/match/utils"

export interface F9WithLiveMinute {
  f9: F9MatchResponse | null
  liveMinute: string | null
}

function extractLiveMinuteFromF13(f13Response: F13CommentaryResponse | null): string | null {
  if (!f13Response?.Commentary?.message?.length) return null
  const firstMessage = f13Response.Commentary.message[0]
  return firstMessage?.minute != null ? String(firstMessage.minute) : null
}

function getPeriodFromF9(f9Data: F9MatchResponse): string | null {
  const soccerDoc = f9Data?.SoccerFeed?.SoccerDocument
  if (!soccerDoc) return null
  const matchData = Array.isArray(soccerDoc) ? soccerDoc[0]?.MatchData : soccerDoc?.MatchData
  return matchData?.MatchInfo?.Period || null
}

export interface F9FeedsResult {
  f9FeedsMap: Map<string, F9MatchResponse>
  liveMinutesMap: Map<string, string>
}

export async function fetchF9FeedsForMatches(
  matchIds: string[]
): Promise<F9FeedsResult> {
  const f9FeedsMap: Map<string, F9MatchResponse> = new Map()
  const liveMinutesMap: Map<string, string> = new Map()

  const f9Promises = matchIds.map(async (matchId) => {
    const normalizedId = normalizeOptaId(matchId)
    try {
      const f9Data = await getF9MatchDetails(normalizedId)
      const period = getPeriodFromF9(f9Data)
      const isLive = period !== null && LIVE_PERIODS.includes(period as typeof LIVE_PERIODS[number])
      
      let liveMinute: string | null = null
      if (isLive) {
        try {
          const f13Data = await getF13Commentary(normalizedId)
          liveMinute = extractLiveMinuteFromF13(f13Data)
        } catch {
        }
      }
      
      return { matchId: normalizedId, f9Data, liveMinute }
    } catch {
      return null
    }
  })

  const f9Results = await Promise.allSettled(f9Promises)

  f9Results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      const { matchId, f9Data, liveMinute } = result.value
      f9FeedsMap.set(matchId, f9Data)
      if (liveMinute) {
        liveMinutesMap.set(matchId, liveMinute)
      }
    }
  })

  return { f9FeedsMap, liveMinutesMap }
}

export async function fetchF9ForMatch(
  matchId: string
): Promise<F9WithLiveMinute> {
  const normalizedId = normalizeOptaId(matchId)

  try {
    const f9Data = await getF9MatchDetails(normalizedId)
    
    const period = getPeriodFromF9(f9Data)
    const isLive = period !== null && LIVE_PERIODS.includes(period as typeof LIVE_PERIODS[number])
    
    if (isLive) {
      try {
        const f13Data = await getF13Commentary(normalizedId)
        const liveMinute = extractLiveMinuteFromF13(f13Data)
        return { f9: f9Data, liveMinute }
      } catch {
        return { f9: f9Data, liveMinute: null }
      }
    }
    
    return { f9: f9Data, liveMinute: null }
  } catch {
    return { f9: null, liveMinute: null }
  }
}

export async function getMatchCardData(
  matchId: string,
  fixture: F1MatchData,
  prismicTeams: TeamDocument[],
  optaTeams: F1TeamData[]
): Promise<GameCardData> {
  const { f9, liveMinute } = await fetchF9ForMatch(matchId)

  if (f9) {
    const f9Data = getF9GameCardData(f9, prismicTeams, optaTeams, liveMinute)
    if (f9Data) return f9Data
  }

  return getF1GameCardData(fixture, prismicTeams, optaTeams, liveMinute)
}

export function extractMatchIdsFromFixtures(matchData: F1MatchData[]): string[] {
  return matchData.map(match => normalizeOptaId(match.uID))
}
