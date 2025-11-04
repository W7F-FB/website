export interface F1FixturesResponse {
    SoccerFeed: F1SoccerFeed;
}

export interface F1SoccerFeed {
    SoccerDocument: F1SoccerDocument;
}

export interface F1SoccerDocument {
    Type: "FIXTURES";
    competition_id: number;
    competition_name: string;
    Season_id: number;
    season_name: string;
    timestamp: string;
    MatchData: F1MatchData[];
}

export interface F1MatchData {
    MatchInfo: F1MatchInfo;
    MatchDate: string;
    MatchStatus: "Scheduled" | "Played" | "Postponed" | "In Progress";
    MatchID: string;
    TeamData: F1TeamData[];
    Stat?: F1MatchStat[];
}

export interface F1MatchInfo {
    Round: F1Round;
    Venue?: F1Venue;
    attendance?: number;
}

export interface F1Round {
    RoundNumber: number;
    RoundName?: string;
}

export interface F1Venue {
    VenueName: string;
    CityName?: string;
}

export interface F1TeamData {
    TeamRef: string;
    Side: "Home" | "Away";
    Score?: number;
}

export interface F1MatchStat {
    Type: string;
    Value: string | number;
}
// F1 Feed: Fixtures and Results
// Calendar of matches for a competition

export interface F1FixturesResponse {
  SoccerFeed: F1SoccerFeed;
}

export interface F1SoccerFeed {
  SoccerDocument: F1SoccerDocument;
}

export interface F1SoccerDocument {
  Type: "Fixtures and Results";
  uID: string; // Unique document ID
  competition_code: string;
  competition_id: number;
  competition_name: string;
  season_id: number;
  season_name: string;
  timestamp: string; // YYYY-MM-DD hh:mm:ss
  MatchData?: F1MatchData[];
  TeamData?: F1TeamData[];
}

export interface F1MatchData {
  uID: string; // Unique match ID (e.g., "g2468039")
  MatchInfo: F1MatchInfo;
  MatchOfficials?: F1MatchOfficials;
  Stat?: F1MatchStat[];
  TeamData: [F1TeamMatchData, F1TeamMatchData]; // Always two teams
}

export interface F1MatchInfo {
  Date: string; // YYYY-MM-DD
  TZ: string; // Timezone (e.g., "+00:00")
  Time?: string; // hh:mm:ss (may not be present for all matches)
  TimeStamp?: string; // YYYY-MM-DD hh:mm:ss
  MatchType: string; // e.g., "Regular Season", "Knockout", "Group Stage"
  Period: "FullTime" | "FirstHalf" | "SecondHalf" | "PreMatch" | "PostMatch";
  MatchDay?: number;
  Week?: number;
  Round?: number;
  Venue_id?: number;
  Venue?: string; // Venue name
  Result?: F1Result;
  Weather?: F1Weather;
  Attendance?: number;
  Duration?: string; // e.g., "Regular"
}

export interface F1Result {
  Type: "First Half" | "Second Half" | "Full Time" | "Extra Time First Half" | 
        "Extra Time Second Half" | "Extra Time" | "Penalties";
  Side: "Home" | "Away" | "Draw";
}

export interface F1Weather {
  Type: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Windy";
  Temperature?: number;
  Humidity?: number;
  WindSpeed?: number;
  Condition?: string;
}

export interface F1MatchOfficials {
  Type: "Referee" | "Assistant 1" | "Assistant 2" | "Fourth Official" | "VAR";
  FirstName?: string;
  LastName?: string;
  OfficialRef?: string; // Official ID reference
}

export interface F1MatchStat {
  Type: string; // Type of statistic (e.g., "possession", "shots", "corners")
  value?: number | string;
  FH?: number; // First half value
  SH?: number; // Second half value
}

export interface F1TeamMatchData {
  TeamRef: string; // Team ID with "t" prefix
  Side: "Home" | "Away";
  Score?: number;
  HalfScore?: number;
  Formation?: F1Formation;
  PlayerLineUp?: F1Player[];
  Substitution?: F1Substitution[];
  Booking?: F1Booking[];
  Goal?: F1Goal[];
}

export interface F1Formation {
  Formation: string; // e.g., "4-4-2", "4-3-3"
  FormationUsed?: string;
}

export interface F1Player {
  PlayerRef: string; // Player ID with "p" prefix
  Position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Substitute";
  ShirtNumber: number;
  Captain?: boolean;
  Status: "Start" | "Sub";
}

export interface F1Substitution {
  SubOn: string; // Player coming on (ID reference)
  SubOff: string; // Player going off (ID reference)
  Time: number; // Minute of substitution
  Period: "FirstHalf" | "SecondHalf" | "ExtraTimeFirstHalf" | "ExtraTimeSecondHalf";
  Reason?: "Tactical" | "Injury";
}

export interface F1Booking {
  PlayerRef: string; // Player ID reference
  Time: number; // Minute of booking
  Period: "FirstHalf" | "SecondHalf" | "ExtraTimeFirstHalf" | "ExtraTimeSecondHalf";
  CardType: "Yellow" | "Red" | "YellowRed";
  Reason?: string;
}

export interface F1Goal {
  PlayerRef: string; // Scorer player ID
  Time: number; // Minute of goal
  Period: "FirstHalf" | "SecondHalf" | "ExtraTimeFirstHalf" | "ExtraTimeSecondHalf";
  Type: "Goal" | "Own Goal" | "Penalty";
  AssistPlayerRef?: string; // Assist player ID (if any)
}

export interface F1TeamData {
  TeamRef: string; // Team ID with "t" prefix (e.g., "t1")
  Name: string;
  ShortName?: string;
  OfficialName?: string;
  Formation?: string; // Default formation
}

