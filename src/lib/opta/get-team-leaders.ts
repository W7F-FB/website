import type { F30SeasonStatsResponse, F30Player } from "@/types/opta-feeds/f30-season-stats"
import { getPlayerStat, getPlayers } from "@/types/opta-feeds/f30-season-stats"
import type { PlayerLeaderCard } from "@/types/components"
import type { TeamDocument } from "../../../prismicio-types"
import { F9Position } from "@/types/opta-feeds/f9-match"
import type { F9MatchPlayer } from "@/types/opta-feeds/f9-match"
import type { F40Team, F40Player } from "@/types/opta-feeds/f40-squads-feed"
import { getPlayerFullName, getPlayerJerseyNumber } from "@/types/opta-feeds/f40-squads-feed"

type TeamLeaders = {
  scorer: PlayerLeaderCard | null
  playmaker: PlayerLeaderCard | null
  keeper: PlayerLeaderCard | null
}

type LeaderCriteria = {
  filter: (player: F30Player) => boolean
  sortStats: string[]
  leaderType: 'offensive' | 'defensive' | 'goalkeeper'
}

const LEADER_CONFIGS: Record<keyof TeamLeaders, LeaderCriteria> = {
  scorer: {
    filter: (p) => Number(getPlayerStat(p, "Goals") ?? 0) > 0,
    sortStats: ["Goals", "Goal Assists"],
    leaderType: 'offensive',
  },
  playmaker: {
    filter: (p) => Number(getPlayerStat(p, "Goal Assists") ?? 0) > 0,
    sortStats: ["Goal Assists", "Goals"],
    leaderType: 'offensive',
  },
  keeper: {
    filter: (p) => p.position === 'Goalkeeper',
    sortStats: ["Saves Made", "Games Played"],
    leaderType: 'goalkeeper',
  },
}

export function getTeamLeaders(
  team: TeamDocument,
  seasonStats: F30SeasonStatsResponse | null | undefined,
  teamSquad?: F40Team
): TeamLeaders {
  const players = seasonStats ? getPlayers(seasonStats) : []

  const scorer = findLeader(players, team, LEADER_CONFIGS.scorer)
  const playmaker = findLeader(players, team, LEADER_CONFIGS.playmaker)
  const keeper = findLeader(players, team, LEADER_CONFIGS.keeper)

  if (scorer && playmaker && keeper) {
    return { scorer, playmaker, keeper }
  }

  const fallbackPlayers = getFallbackPlayers(teamSquad, team)

  return {
    scorer: scorer || fallbackPlayers.outfielders[0] || null,
    playmaker: playmaker || fallbackPlayers.outfielders[1] || null,
    keeper: keeper || fallbackPlayers.goalkeeper || null,
  }
}

function findLeader(
  players: F30Player[],
  team: TeamDocument,
  criteria: LeaderCriteria
): PlayerLeaderCard | null {
  const topPlayer = players
    .filter(criteria.filter)
    .sort((a, b) => comparePlayersByCriteria(a, b, criteria.sortStats))[0]

  return topPlayer ? buildPlayerLeaderCard(topPlayer, team, criteria.leaderType) : null
}

type FallbackPlayers = {
  outfielders: PlayerLeaderCard[]
  goalkeeper: PlayerLeaderCard | null
}

function getFallbackPlayers(teamSquad: F40Team | undefined, team: TeamDocument): FallbackPlayers {
  if (!teamSquad?.Player) {
    return { outfielders: [], goalkeeper: null }
  }

  const sortedPlayers = [...teamSquad.Player].sort((a, b) => {
    const nameA = getPlayerFullName(a).toLowerCase()
    const nameB = getPlayerFullName(b).toLowerCase()
    return nameA.localeCompare(nameB)
  })

  const outfielders = sortedPlayers
    .filter((p) => p.Position !== "Goalkeeper")
    .slice(0, 2)
    .map((p, index) => buildF40PlayerLeaderCard(p, team, index === 0 ? 'offensive' : 'offensive'))

  const goalkeeper = sortedPlayers.find((p) => p.Position === "Goalkeeper")
  const keeperCard = goalkeeper ? buildF40PlayerLeaderCard(goalkeeper, team, 'goalkeeper') : null

  return { outfielders, goalkeeper: keeperCard }
}

function buildF40PlayerLeaderCard(
  f40Player: F40Player,
  team: TeamDocument,
  leaderType: 'offensive' | 'defensive' | 'goalkeeper'
): PlayerLeaderCard {
  const zeroStats = leaderType === 'goalkeeper'
    ? [{ Type: 'saves', value: 0 }]
    : [{ Type: 'goals', value: 0 }, { Type: 'goal_assist', value: 0 }]

  const jerseyNumber = getPlayerJerseyNumber(f40Player)

  const f9Player: F9MatchPlayer & { name?: string } = {
    PlayerRef: f40Player.uID,
    Position: convertPosition(f40Player.Position),
    ShirtNumber: typeof jerseyNumber === 'number' ? jerseyNumber : Number(jerseyNumber) || 0,
    Status: 'Start',
    Stat: zeroStats,
    name: getPlayerFullName(f40Player),
  }

  return {
    player: f9Player,
    prismicTeam: team,
    leaderType,
    f40Position: f40Player.Position,
  }
}

function comparePlayersByCriteria(
  a: F30Player,
  b: F30Player,
  sortStats: string[]
): number {
  for (const statName of sortStats) {
    const statA = Number(getPlayerStat(a, statName) ?? 0)
    const statB = Number(getPlayerStat(b, statName) ?? 0)
    
    if (statB !== statA) {
      return statB - statA
    }
  }
  
  return a.player_id - b.player_id
}

function buildPlayerLeaderCard(
  f30Player: F30Player,
  team: TeamDocument,
  leaderType: 'offensive' | 'defensive' | 'goalkeeper'
): PlayerLeaderCard {
  const f9Player: F9MatchPlayer & { name?: string } = {
    PlayerRef: `p${f30Player.player_id}`,
    Position: convertPosition(f30Player.position),
    ShirtNumber: f30Player.shirtNumber || 0,
    Status: 'Start',
    Stat: convertStats(f30Player),
    name: getPlayerDisplayName(f30Player),
  }

  return {
    player: f9Player,
    prismicTeam: team,
    leaderType,
    f40Position: f30Player.position,
  }
}

function getPlayerDisplayName(player: F30Player): string {
  if (player.known_name) return player.known_name
  
  const firstName = player.first_name || ''
  const lastName = player.last_name || ''
  
  return `${firstName} ${lastName}`.trim() || `Player ${player.player_id}`
}

function convertPosition(position?: string): F9Position {
  switch (position) {
    case 'Goalkeeper':
      return F9Position.Goalkeeper
    case 'Defender':
      return F9Position.Defender
    case 'Midfielder':
      return F9Position.Midfielder
    case 'Forward':
      return F9Position.Striker
    default:
      return F9Position.Substitute
  }
}

const F30_TO_F9_STAT_MAPPING: Record<string, string> = {
  'Goals': 'goals',
  'Goal Assists': 'goal_assist',
  'Total Shots': 'total_scoring_att',
  'Saves Made': 'saves',
  'Total Tackles': 'total_tackle',
  'Interceptions': 'interception',
  'Blocks': 'blocked_scoring_att',
}

function convertStats(f30Player: F30Player) {
  if (!f30Player.Stat) return undefined

  const stats = Array.isArray(f30Player.Stat) ? f30Player.Stat : [f30Player.Stat]
  
  return stats.map(stat => ({
    Type: F30_TO_F9_STAT_MAPPING[stat.name] || stat.name,
    value: stat.value,
  }))
}

