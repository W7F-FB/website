import type { F30SeasonStatsResponse, F30Player } from "@/types/opta-feeds/f30-season-stats"
import { getPlayerStat, getPlayers } from "@/types/opta-feeds/f30-season-stats"
import type { PlayerLeaderCard } from "@/types/components"
import type { TeamDocument } from "../../../prismicio-types"
import { F9Position } from "@/types/opta-feeds/f9-match"
import type { F9MatchPlayer } from "@/types/opta-feeds/f9-match"

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
  seasonStats: F30SeasonStatsResponse | null | undefined
): TeamLeaders {
  if (!seasonStats) {
    return { scorer: null, playmaker: null, keeper: null }
  }

  const players = getPlayers(seasonStats)

  return {
    scorer: findLeader(players, team, LEADER_CONFIGS.scorer),
    playmaker: findLeader(players, team, LEADER_CONFIGS.playmaker),
    keeper: findLeader(players, team, LEADER_CONFIGS.keeper),
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

