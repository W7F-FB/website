export type F24PeriodId = 1 | 2 | 3 | 4 | 5;

export type F24OutcomeFlag = 0 | 1;

export type F24AdditionalInfo =
  | "Behind Closed Doors"
  | "Limited Audience"
  | string;

export enum F24EventType {
  Pass = 1,
  OffsidePass = 2,
  TakeOn = 3,
  Foul = 4,
  Out = 5,
  CornerAwarded = 6,
  Tackle = 7,
  Interception = 8,
  Save = 10,
  Claim = 11,
  Clearance = 12,
  Miss = 13,
  Post = 14,
  AttemptSaved = 15,
  Goal = 16,
  Card = 17,
  PlayerOff = 18,
  PlayerOn = 19,
  PlayerRetired = 20,
  PlayerReturns = 21,
  PlayerBecomesGoalkeeper = 22,
  GoalkeeperBecomesPlayer = 23,
  ConditionChange = 24,
  OfficialChange = 25,
  StartDelay = 27,
  EndDelay = 28,
  End = 30,
  Start = 32,
  TeamSetUp = 34,
  PlayerChangedJerseyNumber = 36,
  CollectionEnd = 37,
  TempGoal = 38,
  TempAttempt = 39,
  FormationChange = 40,
  Punch = 41,
  GoodSkill = 42,
  DeletedEvent = 43,
  Aerial = 44,
  Challenge = 45,
  BallRecovery = 49,
  Dispossessed = 50,
  Error = 51,
  KeeperPickUp = 52,
  CrossNotClaimed = 53,
  Smother = 54,
  OffsideProvoked = 55,
  ShieldBallOpp = 56,
  FoulThrowIn = 57,
  PenaltyFaced = 58,
  KeeperSweeper = 59,
  ChanceMissed = 60,
  BallTouch = 61,
  TempSave = 63,
  Resume = 64,
  ContentiousRefereeDecision = 65,
  FiftyFifty = 67,
  RefereeDropBall = 68,
  InjuryTimeAnnouncement = 70,
  CoachSetup = 71,
  BlockedPass = 74,
  DelayedStart = 75,
  EarlyEnd = 76,
  CoverageInterruption = 79,
  DropOfBall = 80,
  Obstacle = 81,
  Control = 82,
  AttemptedTackle = 83,
  DeletedAfterReview = 84,
}

export interface F24Games {
  timestamp: string;
  Game: F24Game | F24Game[];
}

export interface F24Game {
  id: number;
  additional_info?: F24AdditionalInfo;
  away_score: number;
  home_score: number;
  away_team_id: number;
  away_team_name: string;
  away_team_short: string;
  away_team_official?: string;
  competition_id: number;
  competition_name: string;
  game_date: string;
  game_date_local?: string;
  game_date_local_offset?: string;
  game_date_utc?: string;
  home_team_id: number;
  home_team_name: string;
  home_team_official: string;
  home_team_short: string;
  matchday: number;
  period_1_start: string;
  period_2_start: string;
  period_3_start?: string;
  period_4_start?: string;
  period_5_start?: string;
  season_id: number;
  season_name: string;
  Event: F24Event[];
}

export interface F24Event {
  id: number;
  event_id: number;
  type_id: number;
  period_id: F24PeriodId;
  version: number;
  min: number;
  sec: number;
  team_id: number;
  player_id?: number;
  outcome: F24OutcomeFlag;
  assist?: 1;
  keypass?: number;
  x: number;
  y: number;
  timestamp: string;
  timestamp_utc: string;
  last_modified: string;
  Q?: F24Qualifier | F24Qualifier[];
}

export interface F24Qualifier {
  id: number;
  qualifier_id: number;
  value?: string | number;
}

export interface F24EventDetailsFeed {
  Games: F24Games;
}
