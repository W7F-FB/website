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
