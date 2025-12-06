import { getF9MatchDetails } from "@/app/api/opta/feeds"
import { normalizeOptaId } from "@/lib/opta/utils"
import { dev } from "@/lib/dev"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { TeamDocument } from "../../../prismicio-types"
import { getF9GameCardData, getF1GameCardData, type GameCardData } from "@/components/blocks/match/utils"

export async function fetchF9FeedsForMatches(
  matchIds: string[]
): Promise<Map<string, F9MatchResponse>> {
  const f9FeedsMap: Map<string, F9MatchResponse> = new Map()

  const f9Promises = matchIds.map(async (matchId) => {
    const normalizedId = normalizeOptaId(matchId)
    try {
      const f9Data = await getF9MatchDetails(normalizedId)
      dev.log('F9Data', f9Data)
      return { matchId: normalizedId, f9Data }
    } catch (error) {
      //dev.log(`Error fetching F9 for match ${normalizedId}:`, error)
      return null
    }
  })

  const f9Results = await Promise.allSettled(f9Promises)

  f9Results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      const { matchId, f9Data } = result.value
      f9FeedsMap.set(matchId, f9Data)
    }
  })

  return f9FeedsMap
}

export async function fetchF9ForMatch(
  matchId: string
): Promise<F9MatchResponse | null> {
  const normalizedId = normalizeOptaId(matchId)

  try {
    const f9Data = await getF9MatchDetails(normalizedId)
    return f9Data
  } catch (error) {
    dev.log(`Error fetching F9 for match ${normalizedId}:`, error)
    return null
  }
}

export async function getMatchCardData(
  matchId: string,
  fixture: F1MatchData,
  prismicTeams: TeamDocument[],
  optaTeams: F1TeamData[]
): Promise<GameCardData> {
  const f9Feed = await fetchF9ForMatch(matchId)

  if (f9Feed) {
    const f9Data = getF9GameCardData(f9Feed, prismicTeams, optaTeams)
    if (f9Data) return f9Data
  }

  return getF1GameCardData(fixture, prismicTeams, optaTeams)
}

export function extractMatchIdsFromFixtures(matchData: F1MatchData[]): string[] {
  return matchData.map(match => normalizeOptaId(match.uID))
}
