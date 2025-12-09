import type { F9MatchResponse, F9TeamData, F9MatchPlayer } from "@/types/opta-feeds/f9-match"
import { getTeamStatsFromF9 } from "./team-stats-from-f9"
import { getRecordsFromF9 } from "./records-from-f9"

export type TeamStatSheet = {
  optaNormalizedTeamId: string
  gamesPlayed: number
  wins: number
  losses: number
  shots: number
  goals: number
  goalsAllowed: number
  assists: number
  fouls: number
  yellowCards: number
  redCards: number
}

function getPlayerLineupArray(playerLineup?: F9TeamData['PlayerLineUp']): F9MatchPlayer[] {
  if (!playerLineup) return []
  const players = playerLineup.MatchPlayer
  return Array.isArray(players) ? players : [players]
}

function getPlayerStatValue(player: F9MatchPlayer, statType: string): number {
  if (!player.Stat) return 0
  
  const statArray = Array.isArray(player.Stat) ? player.Stat : [player.Stat]
  const stat = statArray.find(s => s.Type === statType)
  
  if (!stat) return 0
  
  const value = typeof stat.value === 'number' ? stat.value : parseInt(String(stat.value), 10)
  return isNaN(value) ? 0 : value
}

function aggregatePlayerStatsFromFeeds(feeds: F9MatchResponse[]): Map<string, { shots: number; assists: number; fouls: number }> {
  const statsMap = new Map<string, { shots: number; assists: number; fouls: number }>()

  for (const feed of feeds) {
    const doc = feed.SoccerFeed?.SoccerDocument
    if (!doc) continue
    const soccerDoc = Array.isArray(doc) ? doc[0] : doc
    if (!soccerDoc) continue

    const matchInfo = soccerDoc.MatchData?.MatchInfo
    if (!matchInfo || matchInfo.Period !== "FullTime") continue

    const teamDataRaw = soccerDoc.MatchData?.TeamData
    if (!teamDataRaw) continue
    const teamData = Array.isArray(teamDataRaw) ? teamDataRaw : [teamDataRaw]

    for (const team of teamData) {
      const teamId = team.TeamRef.replace(/^t/, "")
      const players = getPlayerLineupArray(team.PlayerLineUp)
      
      if (!statsMap.has(teamId)) {
        statsMap.set(teamId, { shots: 0, assists: 0, fouls: 0 })
      }

      const stats = statsMap.get(teamId)!
      
      for (const player of players) {
        stats.shots += getPlayerStatValue(player, 'total_scoring_att')
        stats.assists += getPlayerStatValue(player, 'goal_assist')
        stats.fouls += getPlayerStatValue(player, 'fouls')
      }
    }
  }

  return statsMap
}

function countCardsFromFeeds(feeds: F9MatchResponse[]): Map<string, { yellowCards: number; redCards: number }> {
  const cardsMap = new Map<string, { yellowCards: number; redCards: number }>()

  for (const feed of feeds) {
    const doc = feed.SoccerFeed?.SoccerDocument
    if (!doc) continue
    const soccerDoc = Array.isArray(doc) ? doc[0] : doc
    if (!soccerDoc) continue

    const matchInfo = soccerDoc.MatchData?.MatchInfo
    if (!matchInfo || matchInfo.Period !== "FullTime") continue

    const teamDataRaw = soccerDoc.MatchData?.TeamData
    if (!teamDataRaw) continue
    const teamData = Array.isArray(teamDataRaw) ? teamDataRaw : [teamDataRaw]

    for (const team of teamData) {
      const teamId = team.TeamRef.replace(/^t/, "")
      
      if (!cardsMap.has(teamId)) {
        cardsMap.set(teamId, { yellowCards: 0, redCards: 0 })
      }

      const cards = cardsMap.get(teamId)!
      
      if (!team.Booking) continue
      
      const bookings = Array.isArray(team.Booking) ? team.Booking : [team.Booking]
      
      for (const booking of bookings) {
        if (booking.Card === 'Yellow') {
          cards.yellowCards++
        } else if (booking.Card === 'Red' || booking.CardType === 'StraightRed' || booking.CardType === 'SecondYellow') {
          cards.redCards++
        }
      }
    }
  }

  return cardsMap
}

export function getTeamStatSheetFromF9(feeds: F9MatchResponse[]): TeamStatSheet[] {
  const baseStats = getTeamStatsFromF9(feeds)
  const records = getRecordsFromF9(feeds)
  const playerStats = aggregatePlayerStatsFromFeeds(feeds)
  const cardStats = countCardsFromFeeds(feeds)

  const statsMap = new Map<string, TeamStatSheet>()

  for (const stat of baseStats) {
    const teamId = stat.optaNormalizedTeamId
    const record = records.find(r => r.optaNormalizedTeamId === teamId)
    const pStats = playerStats.get(teamId) || { shots: 0, assists: 0, fouls: 0 }
    const cStats = cardStats.get(teamId) || { yellowCards: 0, redCards: 0 }

    statsMap.set(teamId, {
      optaNormalizedTeamId: teamId,
      gamesPlayed: stat.gamesPlayed,
      wins: record?.wins ?? 0,
      losses: record?.losses ?? 0,
      shots: pStats.shots,
      goals: stat.goalsFor,
      goalsAllowed: stat.goalsAgainst,
      assists: pStats.assists,
      fouls: pStats.fouls,
      yellowCards: cStats.yellowCards,
      redCards: cStats.redCards
    })
  }

  return Array.from(statsMap.values())
}

