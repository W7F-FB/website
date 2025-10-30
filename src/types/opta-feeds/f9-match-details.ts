// F9 Feed: Match Details
// Based on Opta Soccer Feed F9 documentation

export interface F9MatchResponse {
  SoccerFeed: F9SoccerFeed;
}

export interface F9SoccerFeed {
  SoccerDocument: F9SoccerDocument;
}

export interface F9SoccerDocument {
  Type: "MATCH";
  match_id: string;
  competition_id: string;
  competition_name: string;
  season_id: string;
  season_name: string;
  match_date: string; // YYYY-MM-DD
  match_time: string; // HH:MM:SS
  match_status: "Scheduled" | "Live" | "Finished" | "Postponed" | "Cancelled";
  match_period: "PreMatch" | "1stHalf" | "HalfTime" | "2ndHalf" | "FullTime" | "ExtraTime1stHalf" | "ExtraTime2ndHalf" | "Penalties" | "PostMatch";
  venue: F9Venue;
  referee: F9Referee;
  weather: F9Weather;
  attendance: number;
  capacity: number;
  MatchData: F9MatchData;
  Team: F9Team[];
}

export interface F9Venue {
  venue_id: string;
  venue_name: string;
  city: string;
  country: string;
  capacity: number;
  surface: "Grass" | "Artificial" | "Hybrid";
  covered: boolean;
}

export interface F9Referee {
  referee_id: string;
  referee_name: string;
  nationality: string;
}

export interface F9Weather {
  temperature?: number; // Celsius
  humidity?: number; // Percentage
  wind_speed?: number; // km/h
  wind_direction?: string; // N, NE, E, SE, S, SW, W, NW
  conditions?: "Clear" | "Cloudy" | "Rain" | "Snow" | "Fog" | "Storm";
}

export interface F9MatchData {
  MatchInfo: F9MatchInfo;
  MatchOfficial: F9MatchOfficial[];
  TeamData: F9TeamData[];
  PlayerData: F9PlayerData[];
  MatchStats: F9MatchStats;
}

export interface F9MatchInfo {
  Period: F9Period[];
  Result: F9Result;
  Status: F9Status;
}

export interface F9Period {
  PeriodId: number; // 1, 2, 3, 4, 5 (1st half, 2nd half, extra time 1st, extra time 2nd, penalties)
  Start: string; // HH:MM:SS
  End: string; // HH:MM:SS
  Length: number; // Minutes
  Type: "Regular" | "ExtraTime" | "Penalties";
}

export interface F9Result {
  HomeScore: number;
  AwayScore: number;
  HomePenaltyScore?: number;
  AwayPenaltyScore?: number;
  HomeAggregateScore?: number;
  AwayAggregateScore?: number;
}

export interface F9Status {
  StatusId: number;
  Name: string;
  ShortName: string;
  Finished: boolean;
  Live: boolean;
}

export interface F9MatchOfficial {
  official_id: string;
  official_name: string;
  role: "Referee" | "AssistantReferee1" | "AssistantReferee2" | "FourthOfficial" | "VAR" | "AVAR";
  nationality: string;
}

export interface F9TeamData {
  TeamRef: string; // Team ID with "t" prefix
  Side: "Home" | "Away";
  Formation: string; // e.g., "4-4-2"
  Captain: string; // Player ID
  Coach: F9Coach;
  Substitution: F9Substitution[];
}

export interface F9Coach {
  coach_id: string;
  coach_name: string;
  nationality: string;
}

export interface F9Substitution {
  substitution_id: string;
  player_off: string; // Player ID
  player_on: string; // Player ID
  minute: number;
  period: number;
  reason: "Tactical" | "Injury" | "RedCard";
}

export interface F9PlayerData {
  PlayerRef: string; // Player ID with "p" prefix
  TeamRef: string; // Team ID with "t" prefix
  Position: F9Position;
  Status: "Starting" | "Substitute" | "NotInSquad";
  ShirtNumber: number;
  Captain: boolean;
  Stats: F9PlayerStats;
}

export interface F9Position {
  position_id: string;
  position_name: string;
  position_short_name: string;
  x: number; // Position on field (0-100)
  y: number; // Position on field (0-100)
}

export interface F9PlayerStats {
  Goals: number;
  Assists: number;
  YellowCards: number;
  RedCards: number;
  OwnGoals: number;
  PenaltiesScored: number;
  PenaltiesMissed: number;
  Shots: number;
  ShotsOnTarget: number;
  Passes: number;
  PassesCompleted: number;
  PassAccuracy: number; // Percentage
  Tackles: number;
  Interceptions: number;
  Fouls: number;
  FoulsWon: number;
  Offsides: number;
  Saves?: number; // For goalkeepers
  GoalsConceded?: number; // For goalkeepers
}

export interface F9MatchStats {
  HomeTeam: F9TeamMatchStats;
  AwayTeam: F9TeamMatchStats;
}

export interface F9TeamMatchStats {
  Possession: number; // Percentage
  Shots: number;
  ShotsOnTarget: number;
  Corners: number;
  Fouls: number;
  Offsides: number;
  YellowCards: number;
  RedCards: number;
  Passes: number;
  PassesCompleted: number;
  PassAccuracy: number; // Percentage
  Tackles: number;
  Interceptions: number;
  Saves?: number; // For goalkeepers
  GoalsConceded?: number; // For goalkeepers
}

export interface F9Team {
  uID: string; // Team ID
  Name: string; // Official team name
  OfficialName: string; // Full official name
  ShortName: string; // Short name
  Abbreviation: string; // 3-letter code
  Country: string;
  Founded: number;
  Stadium: string;
  Website: string;
  Colors: F9TeamColors;
}

export interface F9TeamColors {
  Primary: string; // Hex color
  Secondary: string; // Hex color
  Text: string; // Hex color
}