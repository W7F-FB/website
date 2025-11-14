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

