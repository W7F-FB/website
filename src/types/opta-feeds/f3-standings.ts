// F3 Feed: Competition Standings
// Based on Opta Soccer Feed F3 documentation

export interface F3StandingsResponse {
  SoccerFeed: F3SoccerFeed;
}

export interface F3SoccerFeed {
  SoccerDocument: F3SoccerDocument;
}

export interface F3SoccerDocument {
  Type: "STANDINGS Latest";
  competition_code: string;
  competition_id: number;
  competition_name: string;
  game_system_id: 1 | 2 | 3 | 4 | 5;
  Season_id: number;
  season_name: string;
  status?: "Live"; // Only appears when live matches are being played
  timestamp: string; // YYYY-MM-DD hh:mm:ss
  Round?: number;
  CurrentRound?: string;
  Competition: F3Competition;
  Qualification?: F3Qualification;
  Team: F3Team[];
}

export interface F3Competition {
  TeamStandings: F3TeamStandings;
}

export interface F3TeamStandings {
  Matchday?: number;
  Round?: F3Round;
  TeamRecord: F3TeamRecord[];
}

export interface F3Round {
  Name: F3RoundName;
}

export interface F3RoundName {
  id: string;
  value: string; // The actual round name text content
}

export interface F3TeamRecord {
  TeamRef: string; // Team ID with "t" prefix
  Standing: F3Standing;
}

export interface F3Standing {
  Type: "Full";
  Against: number; // Total goals conceded
  AwayAgainst: number; // Goals conceded away
  AwayDrawn: number; // Games drawn away
  AwayFor: number; // Goals scored away
  AwayLost: number; // Games lost away
  AwayPPG: number; // Away points per game
  AwayPlayed: number; // Games played away
  AwayPoints: number; // Points from away games
  AwayPosition: number; // Away table position
  AwayWon: number; // Games won away
  Drawn: number; // Total games drawn
  For: number; // Total goals scored
  HomeAgainst: number; // Goals conceded at home
  HomeDrawn: number; // Games drawn at home
  HomeFor: number; // Goals scored at home
  HomeLost: number; // Games lost at home
  HomePPG: number; // Home points per game
  HomePlayed: number; // Games played at home
  HomePoints: number; // Points from home games
  HomePosition: number; // Home table position
  HomeWon: number; // Games won at home
  Lost: number; // Total games lost
  PPG: number; // Overall points per game
  RelegationAverage?: number; // For South American competitions
  Played: number; // Total games played
  Points: number; // Total points
  Position: number; // Overall table position
  StartDayPosition: number | "N/A"; // Position at start of matchday
  Won: number; // Total games won
}

export interface F3Qualification {
  Type: F3QualificationType[];
}

export interface F3QualificationType {
  Qualify: "Promotion" | "Relegation" | "Europa_Cup" | "Champions_League_Qualifying" | 
           "Champions_League" | "Conference_League_Qualifying" | "8th Finals" | "Play-off";
  Team: F3QualifyingTeam[];
}

export interface F3QualifyingTeam {
  Method: "League_Winners" | "League_Position" | "Cup_Winner" | "Cup_Runner_Up" | 
          "Uefa_Fair_Play" | "Title_Holder" | "Play_Off" | "Playoff_Relegation" | "Playoff_Promotion";
  team_id: number;
  team_name: string;
  Qualify: "Group" | "Q1" | "Q2" | "Q3" | "PO";
}

export interface F3Team {
  uID: string; // Unique team ID
  Name: string; // Official team name
  OfficialName: string; // Official name
  ShortName: string; // Short name
  PointsDeduction?: F3PointsDeduction[]; // May occur multiple times
}

export interface F3PointsDeduction {
  Points: number; // Total points deducted
  Reason: string; // Reason for penalty
}
