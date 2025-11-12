export type F30PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface F30Stat {
  name: string;
  value: string | number;
}

export interface F30Player {
  position?: F30PlayerPosition;
  first_name?: string;
  player_id: number;
  shirtNumber?: number;
  known_name?: string;
  last_name?: string;
  Stat?: F30Stat | F30Stat[];
  CurrentTeamOnly?: {
    Stat?: F30Stat | F30Stat[];
  };
}

export interface F30Team {
  name: string;
  id: number;
  Official?: string;
  Short?: string;
  Stat?: F30Stat | F30Stat[];
  Player?: F30Player | F30Player[];
}

export interface F30SeasonStatistics {
  competition_name: string;
  season_name: string;
  season_id: number;
  competition_id: number;
  Team: F30Team;
}

export interface F30SeasonStatsResponse {
  SeasonStatistics: F30SeasonStatistics;
}

export function getPlayerByName(
  response: F30SeasonStatsResponse,
  name: string
): F30Player | undefined {
  const team = response?.SeasonStatistics?.Team;
  if (!team) {
    console.error('F30 response missing Team data:', JSON.stringify(response, null, 2))
    return undefined;
  }

  const players = Array.isArray(team.Player)
    ? team.Player
    : team.Player
    ? [team.Player]
    : [];

  const searchName = name.toLowerCase().trim();

  console.log(searchName);

  return players.find((player) => {
    const knownName = String(player.known_name || '').toLowerCase();
    const firstName = String(player.first_name || '').toLowerCase();
    const lastName = String(player.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();

    
    return (
      knownName === searchName ||
      fullName === searchName ||
      firstName === searchName ||
      lastName === searchName ||
      knownName.includes(searchName) ||
      fullName.includes(searchName)
    );
  });
}

export function getPlayerById(
  response: F30SeasonStatsResponse,
  playerId: number
): F30Player | undefined {
  const team = response?.SeasonStatistics?.Team;
  if (!team) return undefined;

  const players = Array.isArray(team.Player)
    ? team.Player
    : team.Player
    ? [team.Player]
    : [];

  return players.find((player) => player.player_id === playerId);
}

export function getPlayers(response: F30SeasonStatsResponse): F30Player[] {
  const team = response?.SeasonStatistics?.Team;
  if (!team) return [];

  const players = team.Player;
  return Array.isArray(players) ? players : players ? [players] : [];
}

export function getPlayersByPosition(
  response: F30SeasonStatsResponse,
  position: F30PlayerPosition
): F30Player[] {
  return getPlayers(response).filter((player) => player.position === position);
}

export function getPlayerStat(
  player: F30Player,
  statName: string,
  useCurrentTeamOnly: boolean = false
): string | number | undefined {
  const stats = useCurrentTeamOnly && player.CurrentTeamOnly?.Stat
    ? player.CurrentTeamOnly.Stat
    : player.Stat;

  if (!stats) return undefined;

  const statArray = Array.isArray(stats) ? stats : [stats];
  const stat = statArray.find((s) => s.name === statName);
  return stat?.value;
}

export function getAllPlayerStats(
  player: F30Player,
  useCurrentTeamOnly: boolean = false
): Record<string, string | number> {
  const stats = useCurrentTeamOnly && player.CurrentTeamOnly?.Stat
    ? player.CurrentTeamOnly.Stat
    : player.Stat;

  if (!stats) return {};

  const statArray = Array.isArray(stats) ? stats : [stats];
  return statArray.reduce((acc, stat) => {
    acc[stat.name] = stat.value;
    return acc;
  }, {} as Record<string, string | number>);
}

export function getTeamStat(
  response: F30SeasonStatsResponse,
  statName: string
): string | number | undefined {
  const team = response?.SeasonStatistics?.Team;
  if (!team) return undefined;

  const stats = team.Stat;
  if (!stats) return undefined;

  const statArray = Array.isArray(stats) ? stats : [stats];
  const stat = statArray.find((s) => s.name === statName);
  return stat?.value;
}
