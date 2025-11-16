import * as React from "react"
import type { TeamDocument } from "../../prismicio-types"
import type { F1MatchData, F1TeamData } from "./opta-feeds/f1-fixtures"
import type { F9MatchPlayer, F9Team } from "./opta-feeds/f9-match"
import type { F24Event } from "./opta-feeds/f24-match-events"
import type { LeaderType } from "./game-leaders"

export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Substitute"

export interface RosterPlayer {
  id: string
  name: string
  position: PlayerPosition
  jerseyNumber?: string | number
  birthDate?: string
  height?: number
  weight?: number
  nationality?: string
  country?: string
}

export interface RosterTeam {
  id: string
  name: string
  country?: string
  countryIso?: string
  players?: RosterPlayer[]
}

export type MatchLineupPlayer = F9MatchPlayer & {
  name?: string
  nationality?: string
  country?: string
  events?: F24Event[]
}

export type PlayerLeaderCard = {
  prismicTeam?: TeamDocument
  playerHeadshotUrl?: string
  player?: F9MatchPlayer
  optaTeam?: F9Team
  leaderType: LeaderType
  f40Position?: string
}

export type PlayerStatDisplay = {
  label: string
  value: string | number
}

export interface GameCardTeam {
  team: TeamDocument | null
  logoUrl: string | null
  logoAlt: string
  score: number | null
  teamLabel: string
  teamShortName: string
  compact?: boolean
  isLosing?: boolean
  isWinning?: boolean
  linkToTeam?: boolean
  scoreClassName?: string
  logoClassName?: string
  teamsClassName?: string
  teamNamesClassName?: string
  indicatorClassName?: string
}

export interface GameCard extends React.HTMLAttributes<HTMLDivElement> {
  fixture: F1MatchData
  prismicTeams: TeamDocument[]
  optaTeams: F1TeamData[]
  compact?: boolean
  banner?: React.ReactNode
  variant?: "default" | "mini"
}

