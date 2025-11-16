import type { F9MatchPlayer } from "./opta-feeds/f9-match"

export type LeaderType = 'offensive' | 'defensive' | 'goalkeeper'

export const LEADER_OFFENSIVE = ['goals', 'goal_assist', 'total_scoring_att'] as const

export const LEADER_DEFENSIVE = ['total_tackle', 'blocked_scoring_att', 'interception'] as const

export const LEADER_GOALKEEPER = ['saves', 'punches', 'gk_smother'] as const

export type GameLeaderData = {
  player: F9MatchPlayer
  leaderType: LeaderType
}
