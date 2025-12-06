import type { F9MatchResponse, F9SoccerDocument, F9TeamData } from "@/types/opta-feeds/f9-match"

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
    if (matchInfo.Period !== "FullTime") continue
    if (!matchInfo.Result?.Winner) continue

    const winnerRef = matchInfo.Result.Winner
    const loserRef = teamData.find((t) => t.TeamRef !== winnerRef)?.TeamRef

    if (!loserRef) continue

    const winnerId = normalizeTeamId(winnerRef)
    const loserId = normalizeTeamId(loserRef)

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

