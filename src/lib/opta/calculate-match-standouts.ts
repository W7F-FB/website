/*
 * IMPORTANT: When making improvements to this algorithm, update this documentation!
 *
 * Match Standout Selection Algorithm
 * ===================================
 *
 * This function identifies three standout players from a match based on F9 feed data.
 *
 * SCORING LEADER (Most Offensive Impact)
 * - Primary: Most Goals
 * - Tiebreaker 1: Most Assists
 * - Tiebreaker 2: Most Shots (total_scoring_att)
 * - Tiebreaker 3: Random
 *
 * DEFENSIVE LEADER (Most Defensive Impact)
 * - Primary: Most Tackles (total_tackle)
 * - Tiebreaker 1: Most Blocked Shots (blocked_scoring_att)
 * - Tiebreaker 2: Most Interceptions
 * - Tiebreaker 3: Random
 *
 * GOALKEEPER LEADER (Best Goalkeeper Performance)
 * - Primary: Most Saves
 * - Tiebreaker 1: On Winning Team (if match has a winner)
 * - Tiebreaker 2: Random
 *
 * Notes:
 * - All stats are extracted from player Stat arrays in F9 feed
 * - Returns player IDs (PlayerRef) or null if no players found
 * - Deterministic tiebreakers (player ID) ensure a consistent selection when players are tied
 */

import type { F9MatchResponse, F9MatchPlayer, F9TeamData, F9Team } from "@/types/opta-feeds/f9-match"
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed"
import type { PlayerLeaderCard } from "@/types/components"
import type { TeamDocument } from "../../../prismicio-types"

type StandoutPlayers = {
  scoringLeader: PlayerLeaderCard | null
  defensiveLeader: PlayerLeaderCard | null
  gkLeader: PlayerLeaderCard | null
}

type TeamLookup = {
  homeTeamData: F9TeamData
  awayTeamData: F9TeamData
  homeTeam?: F9Team
  awayTeam?: F9Team
  homeSquadTeam?: F40Team
  awaySquadTeam?: F40Team
  homeTeamPrismic: TeamDocument | null
  awayTeamPrismic: TeamDocument | null
}

type PlayerStats = {
  playerId: string
  teamId: string
  goals: number
  assists: number
  shots: number
  tackles: number
  blockedShots: number
  interceptions: number
  saves: number
}

export function calculateMatchStandouts(f9Feed: F9MatchResponse, teamLookup: TeamLookup): StandoutPlayers {
  const soccerDoc = Array.isArray(f9Feed.SoccerFeed.SoccerDocument)
    ? f9Feed.SoccerFeed.SoccerDocument[0]
    : f9Feed.SoccerFeed.SoccerDocument

  if (!soccerDoc?.MatchData?.TeamData) {
    return { scoringLeader: null, defensiveLeader: null, gkLeader: null }
  }

  const teamDataArray = Array.isArray(soccerDoc.MatchData.TeamData)
    ? soccerDoc.MatchData.TeamData
    : [soccerDoc.MatchData.TeamData]

  const winningTeamId = getWinningTeamId(teamDataArray)
  const allPlayerStats = extractAllPlayerStats(teamDataArray)

  const scoringLeaderId = findScoringLeader(allPlayerStats)
  const defensiveLeaderId = findDefensiveLeader(allPlayerStats)
  const gkLeaderId = findGkLeader(allPlayerStats, winningTeamId)

  return {
    scoringLeader: scoringLeaderId ? buildPlayerLeaderCard(scoringLeaderId, teamLookup, 'offensive') : null,
    defensiveLeader: defensiveLeaderId ? buildPlayerLeaderCard(defensiveLeaderId, teamLookup, 'defensive') : null,
    gkLeader: gkLeaderId ? buildPlayerLeaderCard(gkLeaderId, teamLookup, 'goalkeeper') : null,
  }
}

function buildPlayerLeaderCard(
  playerId: string,
  teamLookup: TeamLookup,
  leaderType: 'offensive' | 'defensive' | 'goalkeeper'
): PlayerLeaderCard {
  const player = findPlayer(playerId, teamLookup)
  const { prismic, opta, squad } = getTeamForPlayer(playerId, teamLookup)
  
  const enrichedPlayer = player && squad
    ? enrichPlayerWithName(player, squad)
    : player

  const f40Player = squad?.Player 
    ? (Array.isArray(squad.Player) ? squad.Player : [squad.Player]).find(p => p.uID === playerId)
    : undefined

  return {
    player: enrichedPlayer,
    prismicTeam: prismic || undefined,
    optaTeam: opta,
    leaderType,
    f40Position: f40Player?.Position,
  }
}

function enrichPlayerWithName(f9Player: F9MatchPlayer, squadTeam: F40Team): F9MatchPlayer & { name?: string } {
  if (!squadTeam.Player) {
    return { ...f9Player }
  }

  const players = Array.isArray(squadTeam.Player) ? squadTeam.Player : [squadTeam.Player]
  const f40Player = players.find(p => p.uID === f9Player.PlayerRef)

  return {
    ...f9Player,
    name: f40Player?.Name,
  }
}

function findPlayer(playerId: string, teamLookup: TeamLookup): F9MatchPlayer | undefined {
  const homePlayers = Array.isArray(teamLookup.homeTeamData.PlayerLineUp?.MatchPlayer)
    ? teamLookup.homeTeamData.PlayerLineUp.MatchPlayer
    : teamLookup.homeTeamData.PlayerLineUp?.MatchPlayer ? [teamLookup.homeTeamData.PlayerLineUp.MatchPlayer] : []

  const awayPlayers = Array.isArray(teamLookup.awayTeamData.PlayerLineUp?.MatchPlayer)
    ? teamLookup.awayTeamData.PlayerLineUp.MatchPlayer
    : teamLookup.awayTeamData.PlayerLineUp?.MatchPlayer ? [teamLookup.awayTeamData.PlayerLineUp.MatchPlayer] : []

  return [...homePlayers, ...awayPlayers].find(p => p.PlayerRef === playerId)
}

function getTeamForPlayer(playerId: string, teamLookup: TeamLookup) {
  const homePlayers = Array.isArray(teamLookup.homeTeamData.PlayerLineUp?.MatchPlayer)
    ? teamLookup.homeTeamData.PlayerLineUp.MatchPlayer
    : teamLookup.homeTeamData.PlayerLineUp?.MatchPlayer ? [teamLookup.homeTeamData.PlayerLineUp.MatchPlayer] : []

  const isHomePlayer = homePlayers.some(p => p.PlayerRef === playerId)

  return isHomePlayer
    ? { prismic: teamLookup.homeTeamPrismic, opta: teamLookup.homeTeam, squad: teamLookup.homeSquadTeam }
    : { prismic: teamLookup.awayTeamPrismic, opta: teamLookup.awayTeam, squad: teamLookup.awaySquadTeam }
}

function getWinningTeamId(teamDataArray: F9TeamData[]): string | null {
  if (teamDataArray.length !== 2) return null
  
  const [team1, team2] = teamDataArray
  const score1 = team1.Score ?? 0
  const score2 = team2.Score ?? 0

  if (score1 > score2) return team1.TeamRef
  if (score2 > score1) return team2.TeamRef
  return null
}

function extractAllPlayerStats(teamDataArray: F9TeamData[]): PlayerStats[] {
  const allStats: PlayerStats[] = []

  for (const teamData of teamDataArray) {
    if (!teamData.PlayerLineUp?.MatchPlayer) continue

    const players = Array.isArray(teamData.PlayerLineUp.MatchPlayer)
      ? teamData.PlayerLineUp.MatchPlayer
      : [teamData.PlayerLineUp.MatchPlayer]

    for (const player of players) {
      allStats.push(extractPlayerStats(player, teamData.TeamRef))
    }
  }

  return allStats
}

function extractPlayerStats(player: F9MatchPlayer, teamId: string): PlayerStats {
  const stats: PlayerStats = {
    playerId: player.PlayerRef,
    teamId,
    goals: 0,
    assists: 0,
    shots: 0,
    tackles: 0,
    blockedShots: 0,
    interceptions: 0,
    saves: 0,
  }

  if (!player.Stat) return stats

  const statArray = Array.isArray(player.Stat) ? player.Stat : [player.Stat]

  for (const stat of statArray) {
    const value = typeof stat.value === 'number' ? stat.value : parseInt(String(stat.value), 10) || 0

    switch (stat.Type) {
      case 'goals':
        stats.goals = value
        break
      case 'goal_assist':
        stats.assists = value
        break
      case 'total_scoring_att':
        stats.shots = value
        break
      case 'total_tackle':
        stats.tackles = value
        break
      case 'blocked_scoring_att':
        stats.blockedShots = value
        break
      case 'interception':
        stats.interceptions = value
        break
      case 'saves':
        stats.saves = value
        break
    }
  }

  return stats
}

function findScoringLeader(players: PlayerStats[]): string | null {
  if (players.length === 0) return null

  const sorted = [...players].sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals
    if (b.assists !== a.assists) return b.assists - a.assists
    if (b.shots !== a.shots) return b.shots - a.shots
    return a.playerId.localeCompare(b.playerId)
  })

  return sorted[0].playerId
}

function findDefensiveLeader(players: PlayerStats[]): string | null {
  if (players.length === 0) return null

  const sorted = [...players].sort((a, b) => {
    if (b.tackles !== a.tackles) return b.tackles - a.tackles
    if (b.blockedShots !== a.blockedShots) return b.blockedShots - a.blockedShots
    if (b.interceptions !== a.interceptions) return b.interceptions - a.interceptions
    return a.playerId.localeCompare(b.playerId)
  })

  return sorted[0].playerId
}

function findGkLeader(players: PlayerStats[], winningTeamId: string | null): string | null {
  if (players.length === 0) return null

  const sorted = [...players].sort((a, b) => {
    if (b.saves !== a.saves) return b.saves - a.saves
    
    if (winningTeamId) {
      const aOnWinningTeam = a.teamId === winningTeamId ? 1 : 0
      const bOnWinningTeam = b.teamId === winningTeamId ? 1 : 0
      if (bOnWinningTeam !== aOnWinningTeam) return bOnWinningTeam - aOnWinningTeam
    }
    
    return a.playerId.localeCompare(b.playerId)
  })

  return sorted[0].playerId
}
