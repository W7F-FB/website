// F40 Feed: Squads Feed
// Based on Opta Soccer Feed F40 documentation

export interface F40SquadsResponse {
  SoccerFeed: F40SoccerFeed;
}

export interface F40SoccerFeed {
  timestamp: string; // YYYY-MM-DDTHH:mm:ss+HH:mm
  SoccerDocument: F40SoccerDocument;
}

export interface F40SoccerDocument {
  Type: "SQUADS Latest";
  competition_code: string;
  competition_id: number;
  competition_name: string;
  season_id: number;
  season_name: string;
  Team?: F40Team[];
  PlayerChanges?: F40PlayerChanges;
}

export interface F40Team {
  uID: string; // Team ID with "t" prefix
  country?: string;
  country_id?: number;
  country_iso?: string; // Two letter ISO country code
  official_club_name?: string;
  region_id?: number;
  region_name?: string;
  short_club_name?: string;
  city?: string;
  postal_code?: string;
  web_address?: string;
  street?: string;
  Country?: string;
  Founded?: number;
  Name: string;
  Region?: string;
  SYMID?: string;
  Player?: F40Player[];
  Stadium?: F40Stadium;
  TeamKits?: F40TeamKits;
  TeamOfficial?: F40TeamOfficial[];
}

export interface F40Player {
  uID: string; // Player ID with "p" prefix
  loan?: number; // 1 if on loan
  Name: string;
  Position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Substitute";
  Stat?: F40PlayerStat[];
}

export interface F40PlayerStat {
  Type: 
    | "first_name"
    | "last_name"
    | "known_name"
    | "birth_date"
    | "birth_place"
    | "first_nationality"
    | "weight"
    | "height"
    | "jersey_num"
    | "real_position"
    | "real_position_side"
    | "country"
    | "join_date"
    | "leave_date"
    | "new_team"
    | "preferred_foot"
    | "on_loan_from";
  value?: string | number; // The text content of the Stat element
}

export type F40RealPosition =
  | "Goalkeeper"
  | "Defender"
  | "Central Defender"
  | "Full Back"
  | "Wing Back"
  | "Midfielder"
  | "Defensive Midfielder"
  | "Central Midfielder"
  | "Attacking Midfielder"
  | "Forward"
  | "Winger"
  | "Striker"
  | "Unknown";

export type F40RealPositionSide =
  | "Left"
  | "Centre"
  | "Right"
  | "Unknown";

export type F40PreferredFoot =
  | "Left"
  | "Right"
  | "Both"
  | "Mostly Left"
  | "Mostly Right";

export interface F40Stadium {
  uID: number;
  Capacity?: number;
  Name: string;
}

export interface F40TeamKits {
  Kit?: F40Kit[];
}

export interface F40Kit {
  id: number;
  colour1?: string; // Hex color
  colour2?: string; // Hex color
  colour3?: string; // Hex color
  colour4?: string; // Hex color
  type: "home" | "away" | "third" | "goalkeeper";
}

export interface F40TeamOfficial {
  Type: 
    | "Manager"
    | "Assistant Manager"
    | "Chairman"
    | "President"
    | "Physio"
    | "Scout"
    | "Director";
  country?: string;
  uID: string;
  PersonName: F40PersonName;
}

export interface F40PersonName {
  BirthDate?: string; // YYYY-MM-DD
  First?: string;
  Last?: string;
  known_name?: string;
  join_date?: string; // YYYY-MM-DD
}

export interface F40PlayerChanges {
  Team?: F40PlayerChangesTeam[];
}

export interface F40PlayerChangesTeam {
  uID: string; // Team ID with "t" prefix
  Name: string;
  Player?: F40PlayerChange[];
}

export interface F40PlayerChange {
  uID: string; // Player ID with "p" prefix
  Name: string;
  Position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Substitute";
  Stat?: F40PlayerStat[];
}

// Helper functions to extract player stats
export function getPlayerStat(
  player: F40Player | F40PlayerChange,
  statType: F40PlayerStat["Type"]
): string | number | undefined {
  const stat = player.Stat?.find(s => s.Type === statType);
  return stat?.value;
}

export function getPlayerFirstName(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "first_name") as string | undefined;
}

export function getPlayerLastName(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "last_name") as string | undefined;
}

export function getPlayerKnownName(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "known_name") as string | undefined;
}

export function getPlayerBirthDate(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "birth_date") as string | undefined;
}

export function getPlayerBirthPlace(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "birth_place") as string | undefined;
}

export function getPlayerNationality(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "first_nationality") as string | undefined;
}

export function getPlayerCountry(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "country") as string | undefined;
}

export function getPlayerHeight(player: F40Player | F40PlayerChange): number | undefined {
  const height = getPlayerStat(player, "height");
  if (typeof height === "string") {
    const parsed = parseInt(height, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return height as number | undefined;
}

export function getPlayerWeight(player: F40Player | F40PlayerChange): number | undefined {
  const weight = getPlayerStat(player, "weight");
  if (typeof weight === "string") {
    const parsed = parseInt(weight, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return weight as number | undefined;
}

export function getPlayerJerseyNumber(player: F40Player | F40PlayerChange): number | string | undefined {
  return getPlayerStat(player, "jersey_num");
}

export function getPlayerRealPosition(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "real_position") as string | undefined;
}

export function getPlayerRealPositionSide(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "real_position_side") as string | undefined;
}

export function getPlayerPreferredFoot(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "preferred_foot") as string | undefined;
}

export function getPlayerJoinDate(player: F40Player | F40PlayerChange): string | undefined {
  return getPlayerStat(player, "join_date") as string | undefined;
}

export function getPlayerLeaveDate(player: F40PlayerChange): string | undefined {
  return getPlayerStat(player, "leave_date") as string | undefined;
}

export function getPlayerNewTeam(player: F40PlayerChange): string | undefined {
  return getPlayerStat(player, "new_team") as string | undefined;
}

export function getPlayerOnLoanFrom(player: F40Player): string | undefined {
  return getPlayerStat(player, "on_loan_from") as string | undefined;
}

export function isPlayerOnLoan(player: F40Player): boolean {
  return player.loan === 1;
}

// Get full name (known name if available, otherwise first + last)
export function getPlayerFullName(player: F40Player | F40PlayerChange): string {
  const knownName = getPlayerKnownName(player);
  if (knownName) return knownName;
  
  const firstName = getPlayerFirstName(player);
  const lastName = getPlayerLastName(player);
  
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  
  return player.Name;
}

// Filter players by position
export function filterPlayersByPosition(
  team: F40Team,
  position: F40Player["Position"]
): F40Player[] {
  return team.Player?.filter(p => p.Position === position) || [];
}

export function getGoalkeepers(team: F40Team): F40Player[] {
  return filterPlayersByPosition(team, "Goalkeeper");
}

export function getDefenders(team: F40Team): F40Player[] {
  return filterPlayersByPosition(team, "Defender");
}

export function getMidfielders(team: F40Team): F40Player[] {
  return filterPlayersByPosition(team, "Midfielder");
}

export function getForwards(team: F40Team): F40Player[] {
  return filterPlayersByPosition(team, "Forward");
}

// Get players on loan
export function getPlayersOnLoan(team: F40Team): F40Player[] {
  return team.Player?.filter(p => isPlayerOnLoan(p)) || [];
}

// Get players who left the team
export function getPlayersWhoLeft(
  playerChanges: F40PlayerChanges,
  teamId: string
): F40PlayerChange[] {
  const teamChanges = playerChanges.Team?.find(t => t.uID === teamId);
  return teamChanges?.Player?.filter(p => getPlayerLeaveDate(p) !== undefined) || [];
}

