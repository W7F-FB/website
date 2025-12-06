import type { F9MatchResponse, F9SoccerDocument, F9TeamData } from "@/types/opta-feeds/f9-match"

export type TeamStats = {
  optaNormalizedTeamId: string
  gamesPlayed: number
  goalsFor: number
  goalsAgainst: number
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

export function getTeamStatsFromF9(feeds: F9MatchResponse[]): TeamStats[] {
  const statsMap = new Map<string, { gamesPlayed: number; goalsFor: number; goalsAgainst: number }>()

  for (const feed of feeds) {
    const doc = getSoccerDocument(feed)
    if (!doc) continue

    const matchInfo = doc.MatchData?.MatchInfo
    const teamData = getTeamDataArray(doc.MatchData?.TeamData)

    if (!matchInfo || teamData.length < 2) continue
    if (matchInfo.Period !== "FullTime") continue

    for (const team of teamData) {
      const teamId = normalizeTeamId(team.TeamRef)
      const opponent = teamData.find((t) => t.TeamRef !== team.TeamRef)

      if (!opponent) continue

      const goalsFor = team.Score ?? 0
      const goalsAgainst = opponent.Score ?? 0

      if (!statsMap.has(teamId)) {
        statsMap.set(teamId, { gamesPlayed: 0, goalsFor: 0, goalsAgainst: 0 })
      }

      const stats = statsMap.get(teamId)!
      stats.gamesPlayed++
      stats.goalsFor += goalsFor
      stats.goalsAgainst += goalsAgainst
    }
  }

  return Array.from(statsMap.entries()).map(([id, stats]) => ({
    optaNormalizedTeamId: id,
    gamesPlayed: stats.gamesPlayed,
    goalsFor: stats.goalsFor,
    goalsAgainst: stats.goalsAgainst,
  }))
}

