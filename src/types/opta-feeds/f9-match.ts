// =========================
// TYPE DEFINITIONS
// =========================

export type DateTimeString = string;
export type IdString = string;

// =========================
// ENUMS (ACCEPTED VALUES)
// =========================

export enum F9MatchType {
  Regular = "Regular",
  Cup = "Cup",
  CupGold = "Cup Gold",
  Replay = "Replay",
  CupEnglish = "Cup English",
  CupShort = "Cup Short",
  FirstLeg = "1st Leg",
  SecondLeg = "2nd Leg",
  SecondLegAwayGoal = "2nd Leg Away Goal",
  SecondLegCupShort = "2nd Leg Cup Short",
  BestOf3 = "Best of 3",
  BestOf5 = "Best of 5",
  BestOf7 = "Best of 7",
  BestOf3Long = "Best of 3 Long",
  BestOf5Long = "Best of 5 Long",
  BestOf7Long = "Best of 7 Long",
}

export enum F9Period {
  PreMatch = "PreMatch",
  FirstHalf = "FirstHalf",
  HalfTime = "HalfTime",
  SecondHalf = "SecondHalf",
  ExtraFirstHalf = "ExtraFirstHalf",
  ExtraHalfTime = "ExtraHalfTime",
  ExtraSecondHalf = "ExtraSecondHalf",
  ShootOut = "ShootOut",
  FullTime = "FullTime",
  FullTime90 = "FullTime90",
  FullTimePens = "FullTimePens",
}

export enum F9ResultType {
  NormalResult = "NormalResult",
  Aggregate = "Aggregate",
  PenaltyShootout = "PenaltyShootout",
  AfterExtraTime = "AfterExtraTime",
  GoldenGoal = "GoldenGoal",
  Abandoned = "Abandoned",
  Postponed = "Postponed",
  Void = "Void",
}

export enum F9CardType {
  Yellow = "Yellow",
  SecondYellow = "SecondYellow",
  StraightRed = "StraightRed",
}

export enum F9BookingReason {
  Foul = "Foul",
  Handball = "Handball",
  RefereeAbuseOrDissent = "Referee Abuse or Dissent",
  CrowdInteraction = "Crowd Interaction",
  ViolentConduct = "Violent Conduct",
  TimeWasting = "Time Wasting",
  Argument = "Argument",
  ExcessiveCelebration = "Excessive Celebration",
  Simulation = "Simulation",
  Other = "Other",
  EnteringField = "Entering Field",
  FoulAndAbusiveLanguage = "Foul and Abusive Language",
  EnteringRefereeReviewArea = "entering referee review area",
  ExcessiveUseOfReviewSignal = "excessive use of review signal",
  EnteringVideoOperationsRoom = "entering video operations room",
}

export enum F9SubstitutionReason {
  Injury = "Injury",
  Tactical = "Tactical",
}

export enum F9PenaltyOutcome {
  Scored = "Scored",
  Missed = "Missed",
  Saved = "Saved",
}

export enum F9VarStatus {
  VarReview = "VAR review",
}

export enum F9VarReason {
  GoalAwarded = "VAR – Goal awarded",
  GoalNotAwarded = "VAR – Goal not awarded",
  PenaltyAwarded = "VAR – Penalty awarded",
  PenaltyNotAwarded = "VAR – Penalty not awarded",
  RedCardGiven = "VAR – Red card given",
  CardUpgrade = "VAR – Card upgrade",
  MistakenIdentity = "VAR – Mistaken Identity",
}

export enum F9AssistantOfficialType {
  AssistantReferee1 = "Assistant Referee#1",
  AssistantReferee2 = "Assistant Referee#2",
  FourthOfficial = "Fourth official",
  AdditionalAssistantReferee1 = "Additional assistant referee 1",
  AdditionalAssistantReferee2 = "Additional assistant referee 2",
  VideoAssistantReferee = "Video Assistant Referee",
  AssistantVarOfficial = "Assistant VAR Official",
}

export enum F9Side {
  Home = "Home",
  Away = "Away",
}

export enum F9GoalType {
  Goal = "Goal",
  Own = "Own",
  Penalty = "Penalty",
}

export enum F9Position {
  Goalkeeper = "Goalkeeper",
  Defender = "Defender",
  Midfielder = "Midfielder",
  Striker = "Striker",
  Substitute = "Substitute",
}

// 1 | 2 | 3 | 4 → GK / DF / MF / FW
export type F9SubstitutePosition = 1 | 2 | 3 | 4;

// =========================
// ROOT
// =========================

export interface F9MatchResponse {
  SoccerFeed: F9SoccerFeed;
}

export interface F9SoccerFeed {
  TimeStamp: DateTimeString;
  SoccerDocument: F9SoccerDocument | F9SoccerDocument[]; // many feeds wrap a list; support both
}

export interface F9SoccerDocument {
  Type: "Latest" | "Result";
  uID: IdString;
  detail_id: number; // coverage level
  Competition: F9Competition;
  MatchData: F9MatchData;
  Team?: F9Team | F9Team[];
  Venue?: F9Venue;
  // in 2nd-leg ties, there may be another SoccerDocument entry in the feed
}

// =========================
// COMPETITION
// =========================

export interface F9Competition {
  uID: IdString;      // competition ID
  Country: string;    // competition country name
  Name: string;       // competition name
  Round?: F9CompetitionRound;
  Stat?: F9CompetitionStat;
}

export interface F9CompetitionRound {
  RoundNumber?: number;
  Name?: string;
  Pool?: string;
}

export interface F9CompetitionStat {
  season_id?: number;
  season_name?: string;
  symid?: string;
  matchday?: number;
}

// =========================
// MATCH DATA
// =========================

export interface F9MatchData {
  MatchInfo: F9MatchInfo;
  MatchOfficial?: F9MatchOfficial;
  PreviousMatch?: F9PreviousMatch; // for 2nd-leg matches
  TeamData: F9TeamData | F9TeamData[]; // usually an array of 2 teams
  Stat?: Array<{ Type: string; value: string | number }>;
  // Match-level Stat nodes (match_time, match_state, etc.) could be added here if needed
}

export interface F9MatchInfo {
  MatchType: F9MatchType | string; // spec enum, but keep string for safety
  Period: F9Period | string;
  PostMatch?: "1";               // present and "1" when all live QC completed
  TimeFrameLengthId?: number;
  AdditionalInfo?: "Behind Closed Doors" | "Limited Audience" | "Away" | string;
  Attendance?: number;
  Date: DateTimeString;
  DateLocal?: DateTimeString;
  DateUtc?: DateTimeString;
  Weather?: string;
  Result?: F9ResultInfo;
  VAR?: F9VarInfo;
}

export interface F9ResultInfo {
  Type: F9ResultType | string;
  Winner?: IdString | "Home" | "Away" | "Draw"; // often team ID; spec mentions winner
  Reason?: string;      // reason for postponed/abandoned, etc.
  MatchWinner?: IdString | "Home" | "Away" | "Draw";
}

export interface F9VarInfo {
  Status?: F9VarStatus | string;     // "VAR review"
  VAR_Reason?: F9VarReason | string; // see enum above
}

// =========================
// OFFICIALS
// =========================

export interface F9MatchOfficial {
  uID: IdString;           // main official ID
  OfficialRef?: {
    Type?: string;         // main referee role; spec treats as dynamic
  };
  OfficialName?: {
    First?: string;
    Last?: string;
  };
  AssistantOfficials?: {
    AssistantOfficial: F9AssistantOfficial | F9AssistantOfficial[];
  };
}

export interface F9AssistantOfficial {
  uID: IdString;
  FirstName?: string;
  LastName?: string;
  Type?: F9AssistantOfficialType | string;
}

// =========================
// PREVIOUS MATCH (2ND LEG)
// =========================

export interface F9PreviousMatch {
  MatchRef: IdString;       // first leg match ID
  MatchType: F9MatchType | string;
  VenueRef?: IdString;      // venue ID
}

// =========================
// TEAM DATA
// =========================

export interface F9TeamData {
  Formation?: string;           // e.g. "4411"
  Score?: number | null;
  Side: F9Side | string;          // "Home" | "Away"
  TeamRef: IdString;            // team ID, e.g. "t3"
  ShootOutScore?: number | null;

  // period-specific team stats (encoded in F9 as Stat types)
  Stat?: {
    FH?: Record<string, number | string>;   // first-half
    SH?: Record<string, number | string>;   // second-half
    EFH?: Record<string, number | string>;  // extra-time first half
    ESH?: Record<string, number | string>;  // extra-time second half
  };

  Goal?: F9Goal | F9Goal[];
  MissedPenalty?: F9MissedPenalty | F9MissedPenalty[];
  Booking?: F9Booking | F9Booking[];
  Substitution?: F9Substitution | F9Substitution[];
  ShootOut?: F9ShootOut;
  PlayerLineUp?: F9PlayerLineUp;
}

// =========================
// GOAL
// =========================

export interface F9Goal {
  EventID: number;
  EventNumber: number;
  Min: number;
  Sec: number;
  Period: F9Period | string; // 1st/2nd half, extra-time, etc.
  PlayerRef: IdString;
  Time: string;
  TimeStamp: DateTimeString;
  TimeStampUTC: DateTimeString;
  Type: F9GoalType | string;
  uID: IdString;
  SoloRun?: 1; // when present, always "1"
  VARReviewed?: "Yes";
  OriginalDecision?: "GoalAwarded" | "GoalNotAwarded";
  Assist?: {
    PlayerRef: IdString;
  };
  "2ndAssist"?: {
    PlayerRef: IdString;
  };
}

// =========================
// MISSED PENALTY
// =========================

export interface F9MissedPenalty {
  EventID: number;
  EventNumber: number;
  Period: F9Period | string;
  TimeStamp: DateTimeString;
  TimeStampUTC: DateTimeString;
  PlayerRef: IdString;
  Time?: number; // regular-play pens only
  Type: "saved";
  Min: number;
  uID: IdString;
}

// =========================
// BOOKING
// =========================

export interface F9Booking {
  Card: "Yellow" | "Red" | string;       // spec has CardType separately
  CardType?: F9CardType | string;          // Yellow | SecondYellow | StraightRed
  EventID: number;
  EventNumber: number;
  Min: number;
  Sec: number;
  Period: F9Period | string;
  Reason?: F9BookingReason | string | null;
  Time: number;
  uID: IdString;
  PlayerRef?: IdString | null;
  ManagerRef?: IdString | null;
  TimeStamp: DateTimeString;
  TimeStampUTC: DateTimeString;
}

// =========================
// SUBSTITUTION
// =========================

export interface F9Substitution {
  EventID: number;
  EventNumber: number;
  Min: number;
  Sec: number;
  Period: F9Period | string;
  SubOff: IdString;                // player ID off
  SubOn: IdString;                 // player ID on
  SubstitutePosition?: F9SubstitutePosition;
  uID: IdString;
  Retired?: boolean | string | null; // representation varies by feed
  TimeStamp: DateTimeString;
  TimeStampUTC: DateTimeString;
  Time: number;
  Reason?: F9SubstitutionReason | string | null;
}

// =========================
// SHOOTOUT
// =========================

export interface F9ShootOut {
  FirstPenalty?: 0 | 1; // which side took first; mapping to home/away is implementation-specific
  PenaltyShot?: F9PenaltyShot | F9PenaltyShot[];
}

export interface F9PenaltyShot {
  EventID: number;
  Outcome: F9PenaltyOutcome | string;
  EventNumber: number;
  PlayerRef: IdString;
  uID: IdString;
  TimeStamp: DateTimeString;
  Time: number;
}

// =========================
// PLAYER LINEUP
// =========================

export interface F9PlayerLineUp {
  MatchPlayer: F9MatchPlayer | F9MatchPlayer[];
}

export interface F9MatchPlayer {
  PlayerRef: IdString;
  Position: F9Position;
  ShirtNumber?: number;
  Captain?: number | boolean;
  Status?: "Start" | "Sub"; // e.g. starter/sub, etc.
  Stat?: Array<{ Type: string; value: number | string }>;
}

// =========================
// TEAM
// =========================

export interface F9Team {
  uID: IdString;
  Name: string;
  Country?: string;
  Type?: string;
  TeamRef?: IdString;
}

// =========================
// VENUE
// =========================

export interface F9Venue {
  uID?: IdString;
  Name?: string;
  City?: string;
  Country?: string;
}

// =========================
// STAT KEYS (APPENDIX)
// =========================

export type F9StatKey =
  | "accurate_back_zone_pass"
  | "accurate_corners_intobox"
  | "accurate_cross"
  | "accurate_cross_nocorner"
  | "accurate_flick_on"
  | "accurate_fwd_zone_pass"
  | "accurate_goal_kicks"
  | "accurate_keeper_sweeper"
  | "accurate_keeper_throws"
  | "accurate_launches"
  | "accurate_layoffs"
  | "accurate_long_balls"
  | "accurate_pass"
  | "accurate_pull_back"
  | "accurate_through_ball"
  | "accurate_throws"
  | "aerial_lost"
  | "aerial_won"
  | "att_assist_openplay"
  | "att_assist_setplay"
  | "att_bx_left"
  | "att_bx_right"
  | "att_bx_centre"
  | "att_corner"
  | "att_fastbreak"
  | "att_freekick_goal"
  | "att_freekick_miss"
  | "att_freekick_post"
  | "att_freekick_target"
  | "att_freekick_total"
  | "att_goal_high_centre"
  | "att_goal_high_left"
  | "att_goal_high_right"
  | "att_goal_low_centre"
  | "att_goal_low_left"
  | "att_goal_low_right"
  | "att_hd_goal"
  | "att_hd_miss"
  | "att_hd_post"
  | "att_hd_target"
  | "att_hd_total"
  | "att_ibox_blocked"
  | "att_ibox_goal"
  | "att_ibox_miss"
  | "att_ibox_own_goal"
  | "att_ibox_post"
  | "att_ibox_target"
  | "att_lf_goal"
  | "att_lf_target"
  | "att_lf_total"
  | "att_lg_centre"
  | "att_lg_left"
  | "att_lg_right"
  | "att_miss_high"
  | "att_miss_high_left"
  | "att_miss_high_right"
  | "att_miss_left"
  | "att_miss_right"
  | "att_obox_blocked"
  | "att_obox_goal"
  | "att_obox_miss"
  | "att_obox_own_goal"
  | "att_obox_post"
  | "att_obox_target"
  | "att_obx_left"
  | "att_obx_right"
  | "att_obx_centre"
  | "att_one_on_one"
  | "att_openplay"
  | "att_pen_goal"
  | "att_pen_miss"
  | "att_pen_post"
  | "att_pen_target"
  | "att_post_high"
  | "att_post_left"
  | "att_post_right"
  | "att_rf_goal"
  | "att_rf_target"
  | "att_rf_total"
  | "att_setpiece"
  | "att_sv_high_centre"
  | "att_sv_high_left"
  | "att_sv_high_right"
  | "att_sv_low_centre"
  | "att_sv_low_left"
  | "att_sv_low_right"
  | "attempts_conceded_ibox"
  | "attempts_conceded_obox"
  | "attempts_ibox"
  | "attempts_obox"
  | "back_pass"
  | "ball_recovery"
  | "big_chance_created"
  | "big_chance_missed"
  | "big_chance_saved"
  | "big_chance_scored"
  | "blocked_cross"
  | "blocked_pass"
  | "blocked_scoring_att"
  | "challenge_lost"
  | "clean_sheet"
  | "clearance_off_line"
  | "contentious_decision"
  | "corner_taken"
  | "cross_not_claimed"
  | "crosses_18yard"
  | "crosses_18yardplus"
  | "dangerous_play"
  | "defender_goals"
  | "dispossessed"
  | "dive_catch"
  | "dive_save"
  | "duel_lost"
  | "duel_won"
  | "effective_blocked_cross"
  | "effective_clearance"
  | "effective_head_clearance"
  | "error_lead_to_goal"
  | "error_lead_to_shot"
  | "final_third_entries"
  | "fk_foul_lost"
  | "fk_foul_won"
  | "forward_goals"
  | "fouled_final_third"
  | "fouls"
  | "game_started"
  | "gk_smother"
  | "goal_assist"
  | "goal_assist_deadball"
  | "goal_assist_intentional"
  | "goal_assist_openplay"
  | "goal_assist_setplay"
  | "goal_fastbreak"
  | "goal_kicks"
  | "goals"
  | "goals_conceded"
  | "goals_conceded_ibox"
  | "goals_conceded_obox"
  | "goals_openplay"
  | "good_high_claim"
  | "hand_ball"
  | "head_clearance"
  | "head_pass"
  | "hit_woodwork"
  | "interception"
  | "interception_won"
  | "interceptions_in_box"
  | "keeper_pick_up"
  | "keeper_throws"
  | "last_player_tackle"
  | "leftside_pass"
  | "long_pass_own_to_opp"
  | "long_pass_own_to_opp_success"
  | "lost_corners"
  | "midfielder_goals"
  | "mins_played"
  | "offside_provoked"
  | "offtarget_att_assist"
  | "ontarget_att_assist"
  | "ontarget_scoring_att"
  | "outfielder_block"
  | "overrun"
  | "own_goals"
  | "own_goals_conceded"
  | "passes_left"
  | "passes_right"
  | "penalty_conceded"
  | "penalty_faced"
  | "penalty_save"
  | "penalty_won"
  | "possession_percentage"
  | "poss_lost_all"
  | "poss_lost_ctrl"
  | "poss_won_att_3rd"
  | "poss_won_def_3rd"
  | "poss_won_mid_3rd"
  | "post_scoring_att"
  | "punches"
  | "red_card"
  | "rescinded_red_card"
  | "rightside_pass"
  | "saved_ibox"
  | "saved_obox"
  | "saves"
  | "second_goal_assist"
  | "second_yellow"
  | "shot_fastbreak"
  | "shot_off_target"
  | "six_second_violation"
  | "six_yard_block"
  | "stand_catch"
  | "stand_save"
  | "subs_goals"
  | "subs_made"
  | "successful_final_third_passes"
  | "successful_open_play_pass"
  | "successful_fifty_fifty"
  | "successful_put_through"
  | "times_tackled"
  | "touches"
  | "touches_in_final_third"
  | "touches_in_opp_box"
  | "total_att_assist"
  | "total_back_zone_pass"
  | "total_chipped_pass"
  | "total_clearance"
  | "total_contest"
  | "total_corners_intobox"
  | "total_cross"
  | "total_cross_nocorner"
  | "total_fastbreak"
  | "total_final_third_passes"
  | "total_flick_on"
  | "total_fwd_zone_pass"
  | "total_high_claim"
  | "total_launches"
  | "total_layoffs"
  | "total_long_balls"
  | "total_offside"
  | "total_pass"
  | "total_pull_back"
  | "total_red_card"
  | "total_scoring_att"
  | "total_sub_off"
  | "total_sub_on"
  | "total_tackle"
  | "total_through_ball"
  | "total_throws"
  | "total_yel_card"
  | "turnover"
  | "unsuccessful_touch"
  | "was_fouled"
  | "winning_goal"
  | "won_contest"
  | "won_corners"
  | "won_tackle"
  | "yellow_card";
