// F24 Feed: Match Events
// Based on Opta Soccer Feed F24 documentation

export interface F24EventsResponse {
  SoccerFeed: F24SoccerFeed;
}

export interface F24SoccerFeed {
  SoccerDocument: F24SoccerDocument;
}

export interface F24SoccerDocument {
  Type: "MATCH_EVENTS";
  match_id: string;
  competition_id: string;
  competition_name: string;
  season_id: string;
  season_name: string;
  match_date: string; // YYYY-MM-DD
  match_time: string; // HH:MM:SS
  match_status: "Scheduled" | "Live" | "Finished" | "Postponed" | "Cancelled";
  match_period: "PreMatch" | "1stHalf" | "HalfTime" | "2ndHalf" | "FullTime" | "ExtraTime1stHalf" | "ExtraTime2ndHalf" | "Penalties" | "PostMatch";
  venue: F24Venue;
  MatchData: F24MatchData;
  Team: F24Team[];
}

export interface F24Venue {
  venue_id: string;
  venue_name: string;
  city: string;
  country: string;
}

export interface F24MatchData {
  MatchInfo: F24MatchInfo;
  TeamData: F24TeamData[];
  PlayerData: F24PlayerData[];
  Event: F24Event[];
}

export interface F24MatchInfo {
  Period: F24Period[];
  Result: F24Result;
  Status: F24Status;
}

export interface F24Period {
  PeriodId: number; // 1, 2, 3, 4, 5 (1st half, 2nd half, extra time 1st, extra time 2nd, penalties)
  Start: string; // HH:MM:SS
  End: string; // HH:MM:SS
  Length: number; // Minutes
  Type: "Regular" | "ExtraTime" | "Penalties";
}

export interface F24Result {
  HomeScore: number;
  AwayScore: number;
  HomePenaltyScore?: number;
  AwayPenaltyScore?: number;
  HomeAggregateScore?: number;
  AwayAggregateScore?: number;
}

export interface F24Status {
  StatusId: number;
  Name: string;
  ShortName: string;
  Finished: boolean;
  Live: boolean;
}

export interface F24TeamData {
  TeamRef: string; // Team ID with "t" prefix
  Side: "Home" | "Away";
  Formation: string; // e.g., "4-4-2"
  Captain: string; // Player ID
  Coach: F24Coach;
}

export interface F24Coach {
  coach_id: string;
  coach_name: string;
  nationality: string;
}

export interface F24PlayerData {
  PlayerRef: string; // Player ID with "p" prefix
  TeamRef: string; // Team ID with "t" prefix
  Position: F24Position;
  Status: "Starting" | "Substitute" | "NotInSquad";
  ShirtNumber: number;
  Captain: boolean;
}

export interface F24Position {
  position_id: string;
  position_name: string;
  position_short_name: string;
  x: number; // Position on field (0-100)
  y: number; // Position on field (0-100)
}

export interface F24Event {
  event_id: string;
  type_id: number;
  type_name: string;
  period_id: number;
  minute: number;
  second: number;
  player_id: string;
  player_name: string;
  team_id: string;
  team_name: string;
  x: number; // Position on field (0-100)
  y: number; // Position on field (0-100)
  outcome: "Successful" | "Unsuccessful" | "Neutral";
  description: string;
  qualifiers: F24Qualifier[];
  coordinates?: F24Coordinates;
  related_events?: string[]; // Array of related event IDs
}

export interface F24Qualifier {
  qualifier_id: number;
  qualifier_name: string;
  value: string | number;
}

export interface F24Coordinates {
  x: number;
  y: number;
  z?: number; // Height for aerial events
}

// Event Types (common ones)
export const F24_EVENT_TYPES = {
  // Goals
  GOAL: 1,
  OWN_GOAL: 2,
  PENALTY_GOAL: 3,
  
  // Cards
  YELLOW_CARD: 5,
  RED_CARD: 6,
  SECOND_YELLOW_CARD: 7,
  
  // Substitutions
  SUBSTITUTION: 19,
  
  // Match Events
  KICK_OFF: 32,
  HALF_TIME: 34,
  FULL_TIME: 35,
  EXTRA_TIME: 36,
  PENALTY_SHOOTOUT: 37,
  
  // Shots
  SHOT_ON_TARGET: 13,
  SHOT_OFF_TARGET: 14,
  SHOT_BLOCKED: 15,
  SHOT_HIT_POST: 16,
  SHOT_HIT_CROSSBAR: 17,
  
  // Saves
  SAVE: 18,
  
  // Fouls
  FOUL: 4,
  OFFSIDE: 8,
  
  // Corners
  CORNER_KICK: 9,
  
  // Free Kicks
  FREE_KICK: 10,
  DIRECT_FREE_KICK: 11,
  INDIRECT_FREE_KICK: 12,
  
  // Throw-ins
  THROW_IN: 20,
  
  // Goal Kicks
  GOAL_KICK: 21,
  
  // Penalties
  PENALTY_AWARDED: 22,
  PENALTY_SAVED: 23,
  PENALTY_MISSED: 24,
  
  // Other
  CLEARANCE: 25,
  INTERCEPTION: 26,
  TACKLE: 27,
  BLOCK: 28,
  CROSS: 29,
  PASS: 30,
  DRIBBLE: 31,
} as const;

// Helper types for filtering events
export type F24ScoringEvent = F24Event & {
  type_id: typeof F24_EVENT_TYPES.GOAL | typeof F24_EVENT_TYPES.OWN_GOAL | typeof F24_EVENT_TYPES.PENALTY_GOAL;
};

export type F24CardEvent = F24Event & {
  type_id: typeof F24_EVENT_TYPES.YELLOW_CARD | typeof F24_EVENT_TYPES.RED_CARD | typeof F24_EVENT_TYPES.SECOND_YELLOW_CARD;
};

export type F24SubstitutionEvent = F24Event & {
  type_id: typeof F24_EVENT_TYPES.SUBSTITUTION;
};

export interface F24Team {
  uID: string; // Team ID
  Name: string; // Official team name
  OfficialName: string; // Full official name
  ShortName: string; // Short name
  Abbreviation: string; // 3-letter code
  Country: string;
  Colors: F24TeamColors;
}

export interface F24TeamColors {
  Primary: string; // Hex color
  Secondary: string; // Hex color
  Text: string; // Hex color
}

// Utility functions for event filtering
export function isScoringEvent(event: F24Event): event is F24ScoringEvent {
  return event.type_id === F24_EVENT_TYPES.GOAL || 
         event.type_id === F24_EVENT_TYPES.OWN_GOAL || 
         event.type_id === F24_EVENT_TYPES.PENALTY_GOAL;
}

export function isCardEvent(event: F24Event): event is F24CardEvent {
  return event.type_id === F24_EVENT_TYPES.YELLOW_CARD || 
         event.type_id === F24_EVENT_TYPES.RED_CARD || 
         event.type_id === F24_EVENT_TYPES.SECOND_YELLOW_CARD;
}

export function isSubstitutionEvent(event: F24Event): event is F24SubstitutionEvent {
  return event.type_id === F24_EVENT_TYPES.SUBSTITUTION;
}

export function getEventTypeName(typeId: number): string {
  const typeNames: Record<number, string> = {
    1: "Goal",
    2: "Own Goal",
    3: "Penalty Goal",
    4: "Foul",
    5: "Yellow Card",
    6: "Red Card",
    7: "Second Yellow Card",
    8: "Offside",
    9: "Corner Kick",
    10: "Free Kick",
    11: "Direct Free Kick",
    12: "Indirect Free Kick",
    13: "Shot On Target",
    14: "Shot Off Target",
    15: "Shot Blocked",
    16: "Shot Hit Post",
    17: "Shot Hit Crossbar",
    18: "Save",
    19: "Substitution",
    20: "Throw In",
    21: "Goal Kick",
    22: "Penalty Awarded",
    23: "Penalty Saved",
    24: "Penalty Missed",
    25: "Clearance",
    26: "Interception",
    27: "Tackle",
    28: "Block",
    29: "Cross",
    30: "Pass",
    31: "Dribble",
    32: "Kick Off",
    34: "Half Time",
    35: "Full Time",
    36: "Extra Time",
    37: "Penalty Shootout",
  };
  
  return typeNames[typeId] || "Unknown Event";
}