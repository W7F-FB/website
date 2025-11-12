export interface F15RankingsResponse {
  SoccerFeed: F15SoccerFeed;
}

export interface F15SoccerFeed {
  SoccerDocument: F15SoccerDocument;
}

export interface F15SoccerDocument {
  Type: "RANKINGS Latest";
  Competition_code: string;
  Competition_id: number;
  Competition_name: string;
  game_system_id: number;
  season_id: number;
  season_name: string;
  TimeStamp: string;
  MatchData?: F15MatchData | F15MatchData[];
  Team: F15Team | F15Team[];
}

export interface F15MatchData {
  uID: string;
  Stat?: F15Stat | F15Stat[];
  TeamData?: F15TeamData | F15TeamData[];
}

export interface F15TeamData {
  Side: "Home" | "Away";
  uID: string;
}

export interface F15Team {
  uID: string;
  Name: string;
  OfficialName?: string;
  ShortName?: string;
  Stat?: F15Stat | F15Stat[];
  Player?: F15Player | F15Player[];
}

export interface F15Player {
  uID: string;
  Name: string;
  Position: "Goalkeeper" | "Defender" | "Midfielder" | "Striker" | "Substitute";
  Stat?: F15Stat | F15Stat[];
}

export interface F15Stat {
  Type: string;
  value?: number | string;
}

export function normalizeF15Array<T>(item: T | T[] | undefined): T[] {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

export function getPlayerStat(player: F15Player, statType: string): number | string | undefined {
  const stats = normalizeF15Array(player.Stat);
  const stat = stats.find(s => s.Type === statType);
  return stat?.value;
}

export function getTeamStat(team: F15Team, statType: string): number | string | undefined {
  const stats = normalizeF15Array(team.Stat);
  const stat = stats.find(s => s.Type === statType);
  return stat?.value;
}

export function getPlayerByName(data: F15RankingsResponse | F15SoccerDocument, playerName: string): F15Player | undefined {
  const soccerDoc = 'SoccerFeed' in data ? data.SoccerFeed.SoccerDocument : data;
  const teams = normalizeF15Array(soccerDoc.Team);
  
  for (const team of teams) {
    const players = normalizeF15Array(team.Player);
    const player = players.find(p => p.Name.toLowerCase() === playerName.toLowerCase());
    if (player) {
      return player;
    }
  }
  
  return undefined;
}

