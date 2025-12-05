export interface F2MatchPreviewsResponse {
  MatchPreviews: {
    Match: F2Match;
    Entities: F2Entities;
  };
}

export interface F2Match {
  MatchdayId: string;
  AwayId: string;
  HomeId: string;
  Id: string;
  Rankings?: F2Rankings;
  MatchData: F2MatchData;
  PreviousMeetingsOtherComps?: F2PreviousMeetings;
  PreviousMeetings?: F2PreviousMeetings;
  Averages?: F2Averages;
  Form?: F2Form;
  Totals?: F2Totals;
}

export interface F2Rankings {
  Team: F2RankingsTeam | F2RankingsTeam[];
}

export interface F2RankingsTeam {
  uID: string;
  Home?: F2RankingLocation;
  Overall?: F2RankingLocation;
  Away?: F2RankingLocation;
}

export interface F2RankingLocation {
  Stat: F2RankingStat | F2RankingStat[];
}

export interface F2RankingStat {
  Type: "last_goal_scored" | "goals_scored" | "first_goal_scored";
  Rank: F2Rank | F2Rank[];
}

export interface F2Rank {
  Level: number;
  Total: number;
  Player: string | string[];
}

export interface F2MatchData {
  SeasonId: string;
  CompetitionId: string;
  MatchInfo: F2MatchInfo;
}

export interface F2MatchInfo {
  Venue?: F2Venue;
  Date: string;
}

export interface F2Venue {
  uID: string;
  value: string;
  Neutral?: string;
}

export interface F2PreviousMeetings {
  MatchData: F2PreviousMatchData | F2PreviousMatchData[];
}

export interface F2PreviousMatchData {
  SeasonId: string;
  Id: string;
  CompetitionId: string;
  MatchInfo: F2PreviousMatchInfo;
  TeamData: F2TeamData | [F2TeamData, F2TeamData];
}

export interface F2PreviousMatchInfo {
  Date: string;
  Venue?: F2Venue;
}

export interface F2TeamData {
  Score: number;
  TeamRef: string;
  Side: "Home" | "Away";
  Goal?: F2Goal | F2Goal[];
}

export interface F2Goal {
  PlayerRef: string;
  Minute: number;
  Type: "Goal" | "Own" | "Penalty";
}

export interface F2Averages {
  Team: F2AveragesTeam | F2AveragesTeam[];
}

export interface F2AveragesTeam {
  uID: string;
  Home?: F2StatLocation;
  Overall?: F2StatLocation;
  Away?: F2StatLocation;
}

export interface F2StatLocation {
  Stat: F2Stat | F2Stat[];
}

export interface F2Stat {
  Type: string;
  value: string | number;
}

export interface F2Form {
  Team: F2FormTeam | F2FormTeam[];
}

export interface F2FormTeam {
  uID: string;
  FormText: string;
  MatchData: F2FormMatchData | F2FormMatchData[];
}

export interface F2FormMatchData {
  Id: string;
  SeasonId: string;
  CompetitionId: string;
  MatchInfo: F2FormMatchInfo;
  TeamData: F2TeamData | [F2TeamData, F2TeamData];
}

export interface F2FormMatchInfo {
  Date: string;
  Venue?: F2Venue;
}

export interface F2Totals {
  Team: F2TotalsTeam | F2TotalsTeam[];
}

export interface F2TotalsTeam {
  uID: string;
  Stat: F2Stat | F2Stat[];
}

export interface F2Entities {
  Teams: F2EntitiesTeams;
  Competitions?: F2EntitiesCompetitions;
  Players?: F2EntitiesPlayers;
}

export interface F2EntitiesTeams {
  Team: F2EntityTeam | F2EntityTeam[];
}

export interface F2EntityTeam {
  uID: string;
  value: string;
  ShortName?: string;
  OfficialName?: string;
}

export interface F2EntitiesCompetitions {
  Competition: F2EntityCompetition | F2EntityCompetition[];
}

export interface F2EntityCompetition {
  uID: string;
  value: string;
}

export interface F2EntitiesPlayers {
  Player: F2EntityPlayer | F2EntityPlayer[];
}

export interface F2EntityPlayer {
  uID: string;
  value: string;
}

