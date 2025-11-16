````markdown
## 1) OVERVIEW — ESSENTIAL CONCEPTS

The F9 feed represents live & final **football match data**, including:

- competition metadata  
- match lifecycle phases  
- team statistics (cumulative + segmented by period)  
- individual player statistics  
- events (goals, cards, substitutions, penalties, shootout)

F9 updates are triggered by game events and conclude when `SoccerDocument.Type = "Result"`.

---

## 2) ENUMERATIONS (ACCEPTED VALUES)

### 2.1 MATCH TYPE (`MatchType`, `PreviousMatch.MatchType`)

- `Regular`
- `Cup`
- `Cup Gold`
- `Replay`
- `Cup English`
- `Cup Short`
- `1st Leg`
- `2nd Leg`
- `2nd Leg Away Goal`
- `2nd Leg Cup Short`
- `Best of 3`
- `Best of 5`
- `Best of 7`
- `Best of 3 Long`
- `Best of 5 Long`
- `Best of 7 Long`

### 2.2 PERIOD (MATCH STATE) (`MatchInfo.Period`)

- `PreMatch`
- `FirstHalf`
- `HalfTime`
- `SecondHalf`
- `ExtraFirstHalf`
- `ExtraHalfTime`
- `ExtraSecondHalf`
- `ShootOut`
- `FullTime`
- `FullTime90`
- `FullTimePens`

### 2.3 RESULT TYPE (`Result.Type`)

- `NormalResult`
- `Aggregate`
- `PenaltyShootout`
- `AfterExtraTime`
- `GoldenGoal`
- `Abandoned`
- `Postponed`
- `Void`

### 2.4 CARD TYPE (`Booking.CardType`)

- `Yellow`
- `SecondYellow`
- `StraightRed`

### 2.5 BOOKING REASON (CONDENSED ENUM) (`Booking.Reason`)

- `Foul`
- `Handball`
- `Referee Abuse or Dissent`
- `Crowd Interaction`
- `Violent Conduct`
- `Time Wasting`
- `Argument`
- `Excessive Celebration`
- `Simulation`
- `Other`
- `Entering Field`
- `Foul and Abusive Language`
- `entering referee review area`
- `excessive use of review signal`
- `entering video operations room`

### 2.6 SUBSTITUTION REASON (`Substitution.Reason`)

- `Injury`
- `Tactical`

### 2.7 PENALTY OUTCOME (`ShootOut.PenaltyShot.Outcome`)

- `Scored`
- `Missed`
- `Saved`

### 2.8 VAR FIELDS (`MatchInfo.VAR`)

- `VAR.Status`:
  - `VAR review`
- `VAR.VAR_Reason`:
  - `VAR – Goal awarded`
  - `VAR – Goal not awarded`
  - `VAR – Penalty awarded`
  - `VAR – Penalty not awarded`
  - `VAR – Red card given`
  - `VAR – Card upgrade`
  - `VAR – Mistaken Identity`

### 2.9 POST-MATCH FLAG (`MatchInfo.PostMatch`)

- Boolean / flag:
  - `"1"` = all live quality checks are complete  
  - (absent or `0` = not all checks complete)

### 2.10 ADDITIONAL INFO (`MatchInfo.AdditionalInfo`)

- `Behind Closed Doors`
- `Limited Audience`
- `Away`

### 2.11 ASSISTANT OFFICIAL TYPE (`AssistantOfficial.Type`)

- `Assistant Referee#1`
- `Assistant Referee#2`
- `Fourth official`
- `Additional assistant referee 1`
- `Additional assistant referee 2`
- `Video Assistant Referee`
- `Assistant VAR Official`

> `OfficialRef.Type` exists but is effectively the main referee role only; values are not enumerated beyond that in the spec (treated as dynamic/N/A).

### 2.12 TEAM SIDE (`TeamData.Side`)

- `Home`
- `Away`

### 2.13 SUBSTITUTION POSITION (`Substitution.SubstitutePosition`)

- `1` = GK (Goalkeeper)  
- `2` = DF (Defender)  
- `3` = MF (Midfielder)  
- `4` = FW (Forward)

### 2.14 PLAYER POSITION (`PlayerLineUp.MatchPlayer.Position`)

- `Goalkeeper`
- `Defender`
- `Midfielder`
- `Striker`
- `Substitute`

### 2.15 GOAL FLAGS

- `Goal.Type`:
  - `Goal`
  - `Own`
  - `Penalty`
- `Goal.SoloRun`:
  - integer, when present always `"1"`
- `Goal.VARReviewed`:
  - `"Yes"` (only appears if reviewed)
- `Goal.OriginalDecision`:
  - `GoalAwarded`
  - `GoalNotAwarded`

### 2.16 MISSED PENALTY TYPE (`MissedPenalty.Type`)

- `saved`

### 2.17 BOOKING CARD (`Booking.Card`)

- `Yellow`
- `Red`

---

## 3) SCHEMA — FULL HIERARCHY (YAML WITH ACCEPTED VALUES)

### 3.1 ROOT

```yaml
SoccerFeed:
  TimeStamp: datetime   # YYYYMMDDThhmmss+hhmm
  SoccerDocument:
    Type: string        # "Latest" | "Result"
    uID: string         # fixture/match ID (dynamic)
    detail_id: integer  # coverage level (dynamic; see F1)
    Competition: Competition
    MatchData: MatchData
    # optional second SoccerDocument for first-leg data in 2-leg ties
````

### 3.2 COMPETITION

```yaml
Competition:
  uID: string             # competition ID (dynamic)
  Country: string         # competition country name
  Name: string            # competition name
  Round:
    RoundNumber: integer  # cup round (dynamic)
    Name: string          # round name (dynamic)
    Pool: string          # group/pool identifier (dynamic)
  Stat:
    season_id: integer    # Stat Type="season_id"
    season_name: string   # Stat Type="season_name"
    symid: string         # Stat Type="symid"
    matchday: integer     # Stat Type="matchday"
```

### 3.3 MATCH DATA

```yaml
MatchData:
  MatchInfo:
    MatchType: string         # one of MATCH TYPE enum (section 2.1)
    Period: string            # one of PERIOD enum (section 2.2)
    PostMatch: string|null    # "1" when all live QC checks complete; otherwise null/absent
    TimeFrameLengthId: integer  # time frame id (see Timeframe Length ID appendix)
    AdditionalInfo: string|null # "Behind Closed Doors" | "Limited Audience" | "Away" | null
    Attendance: integer|null    # crowd total (dynamic; may be absent)
    Date: datetime              # YYYYMMDDThhmmss+hhmm
    DateLocal: datetime         # local date/time YYYYMMDDThhmmss+
    DateUtc: datetime           # UTC date/time YYYYMMDDThhmmss+
    Weather: string|null        # dynamic free-text weather description
    Result:
      Type: string              # RESULT TYPE enum (section 2.3)
      Winner: string|null       # team ID (dynamic, e.g. "t3")
      Reason: string|null       # free-text reason for abandoned/postponed (dynamic)
      MatchWinner: string|null  # winning team ID for 2nd leg (dynamic)
    VAR:
      Status: string|null       # "VAR review" | null
      VAR_Reason: string|null   # one of VAR reason enum (section 2.8) | null
    # optional match timing stats:
    # MatchData.Stat nodes with Type:
    # - "match_time"
    # - "first_half_time"
    # - "second_half_time"
    # - "first_half_extra_time"
    # - "second_half_extra_time"
    # - "match_state"
    # - "match_state_reason"
    # - "Timestamp" (period start/stop stamps)

  MatchOfficial:
    uID: string            # unique Opta ID of the main match official
    OfficialRef:
      Type: string         # main referee role (treated as dynamic / N/A in spec)
    OfficialName:
      First: string        # first name (dynamic)
      Last: string         # last name (dynamic)
    AssistantOfficials:
      AssistantOfficial:   # array
        - uID: string      # unique Opta ID (dynamic)
          FirstName: string
          LastName: string
          Type: string     # one of AssistantOfficial.Type enum (section 2.11)

  PreviousMatch:           # only present for 2nd-leg matches
    MatchRef: string       # first-leg game ID (dynamic)
    MatchType: string      # MATCH TYPE enum (section 2.1)
    VenueRef: string       # venue ID, e.g. "v1377" (dynamic)
```

### 3.4 TEAM DATA

```yaml
TeamData:
  Formation: string           # starting formation, e.g. "4411" (see Formations appendix)
  Score: integer|null         # team score at FT/AET; dynamic
  Side: string                # "Home" | "Away"
  TeamRef: string             # team ID, e.g. "t3" (dynamic)
  ShootOutScore: integer|null # penalty shoot-out score (dynamic; only when applicable)
  Stat:
    FH: string|null           # first-half-only stats (encoded)
    SH: string|null           # second-half-only stats
    EFH: string|null          # extra-time first half stats
    ESH: string|null          # extra-time second half stats
  Goal:            # array of goals scored by this team
    - Goal
  MissedPenalty:   # array of missed penalties by this team
    - MissedPenalty
  Booking:         # array of bookings for this team
    - Booking
  Substitution:    # array of substitutions for this team
    - Substitution
  ShootOut:        # optional; only present if penalties occurred
    ShootOut
  PlayerLineUp:
    PlayerLineUp
```

### 3.5 GOAL

```yaml
Goal:
  EventID: integer          # unique across Opta event DB (dynamic)
  EventNumber: integer      # unique within game; encodes half/minute/order
  Min: integer              # minute of goal (dynamic)
  Sec: integer              # seconds within minute (dynamic)
  Period: string            # "FirstHalf" | "SecondHalf" | "ExtraFirstHalf" | "ExtraSecondHalf" | "ShootOut"
  PlayerRef: string         # scoring player ID (dynamic)
  Time: string              # match time string (dynamic)
  TimeStamp: datetime       # YYYYMMDDThhmmss+hhmm (local/competition TZ)
  TimeStampUTC: datetime    # YYYYMMDDThhmmss+hhmm (UTC)
  Type: string              # "Goal" | "Own" | "Penalty"
  uID: string               # unique goal event ID within game (dynamic)
  SoloRun: integer|null     # when present, always "1"
  VARReviewed: string|null  # "Yes" if a VAR review occurred; null/absent otherwise
  OriginalDecision: string|null  # "GoalAwarded" | "GoalNotAwarded" | null
  Assist:                   # optional
    PlayerRef: string       # first assist player ID (dynamic)
  2ndAssist:                # optional
    PlayerRef: string       # second assist player ID (dynamic)
  # group_name (if present): string, group label, dynamic
```

### 3.6 MISSED PENALTY

```yaml
MissedPenalty:
  EventID: integer          # global event ID (dynamic)
  EventNumber: integer      # unique within game (dynamic)
  Period: string            # period string (4 distinct; typically like Goal.Period)
  TimeStamp: datetime       # YYYYMMDDThhmmss+hhmm
  TimeStampUTC: datetime    # YYYYMMDDThhmmss+hhmm
  PlayerRef: string         # player who missed (dynamic)
  Time: integer             # match time minute (dynamic; regular-play pens only)
  Type: string              # "saved"
  Min: integer              # minute penalty was missed (dynamic)
  uID: string               # ID of missed penalty for this team (e.g. "Mp{teamID}-{n}")
```

### 3.7 BOOKING

```yaml
Booking:
  Card: string              # "Yellow" | "Red"
  CardType: string          # "Yellow" | "SecondYellow" | "StraightRed"
  EventID: integer          # global event ID (dynamic)
  EventNumber: integer      # unique within game (dynamic)
  Min: integer              # minute of booking (dynamic)
  Sec: integer              # seconds within minute (dynamic)
  Period: string            # period string (as per MatchInfo.Period)
  Reason: string|null       # booking reason (Booking Reason enum in 2.5) | null
  Time: integer             # match time minute (dynamic)
  uID: string               # unique booking ID within game (dynamic)
  PlayerRef: string|null    # booked player ID (dynamic)
  ManagerRef: string|null   # booked manager ID (when applicable; dynamic)
  TimeStamp: datetime       # YYYYMMDDThhmmss+hhmm
  TimeStampUTC: datetime    # YYYYMMDDThhmmss+hhmm
```

### 3.8 SUBSTITUTION

```yaml
Substitution:
  EventID: integer          # global event ID (dynamic)
  EventNumber: integer      # unique within game (dynamic)
  Min: integer              # minute of substitution (dynamic)
  Sec: integer              # seconds within minute (dynamic)
  Period: string            # period string (as per MatchInfo.Period)
  SubOff: string            # player ID leaving the field (dynamic)
  SubOn: string             # player ID entering (dynamic)
  SubstitutePosition: integer  # 1 | 2 | 3 | 4  (GK/DF/MF/FW)
  uID: string               # unique substitution ID (dynamic)
  Retired: boolean|null     # true-like flag when player retires; representation is feed-specific
  TimeStamp: datetime       # YYYYMMDDThhmmss+hhmm
  TimeStampUTC: datetime    # YYYYMMDDThhmmss+hhmm
  Time: integer             # match time minute (dynamic)
  Reason: string|null       # "Injury" | "Tactical" | null
```

### 3.9 SHOOTOUT

```yaml
ShootOut:
  FirstPenalty: integer     # 1 or 0; indicates which team took first penalty (home/away mapping is implementation-specific)
  PenaltyShot:
    - EventID: integer      # global event ID (dynamic)
      Outcome: string       # "Scored" | "Missed" | "Saved"
      EventNumber: integer  # event number (dynamic)
      PlayerRef: string     # penalty taker ID (dynamic)
      uID: string           # unique penalty-shot ID (dynamic)
      TimeStamp: datetime   # YYYYMMDDThhmmss+hhmm
      Time: integer         # match time minute (dynamic)
```

### 3.10 PLAYER LINEUP

```yaml
PlayerLineUp:
  MatchPlayer:
    - PlayerRef: string         # player ID (dynamic)
      Position: string          # "Goalkeeper" | "Defender" | "Midfielder" | "Striker" | "Substitute"
      ShirtNumber: integer      # squad number (dynamic)
      Status: string            # player status (dynamic: e.g. starter/substitution-specific flags depending on feed)
      Stat:                     # per-player stats map (all keys from STAT APPENDIX)
        # Example:
        # goals: integer
        # total_pass: integer
        # ...etc (see section 4)
```

---

## 4) STAT APPENDIX (ALPHABETICAL, WITH CATEGORY TAG)

> Each name below is a valid `Stat` Type. Values are numeric counts, ratios or percentages as defined in the main F9 stat appendix. Categories are indicative only.

```text
accurate_back_zone_pass (Passing)
accurate_corners_intobox (Crossing)
accurate_cross (Crossing)
accurate_cross_nocorner (Crossing)
accurate_flick_on (Passing)
accurate_fwd_zone_pass (Passing)
accurate_goal_kicks (Goalkeeping Distribution)
accurate_keeper_sweeper (Goalkeeping)
accurate_keeper_throws (Goalkeeping Distribution)
accurate_launches (Passing Long)
accurate_layoffs (Passing)
accurate_long_balls (Passing Long)
accurate_pass (Passing)
accurate_pull_back (Crossing)
accurate_through_ball (Passing)
accurate_throws (Throw-ins)
aerial_lost (Duel)
aerial_won (Duel)
att_assist_openplay (Shot Assist)
att_assist_setplay (Shot Assist)
att_bx_left (Shot Location)
att_bx_right (Shot Location)
att_bx_centre (Shot Location)
att_corner (Shot Context)
att_fastbreak (Fast Break)
att_freekick_goal (Set-Piece Shot)
att_freekick_miss (Set-Piece Shot)
att_freekick_post (Set-Piece Shot)
att_freekick_target (Set-Piece Shot)
att_freekick_total (Set-Piece Shot)
att_goal_high_centre (Shot Placement)
att_goal_high_left (Shot Placement)
att_goal_high_right (Shot Placement)
att_goal_low_centre (Shot Placement)
att_goal_low_left (Shot Placement)
att_goal_low_right (Shot Placement)
att_hd_goal (Header)
att_hd_miss (Header)
att_hd_post (Header)
att_hd_target (Header)
att_hd_total (Header)
att_ibox_blocked (Shot Blocked)
att_ibox_goal (Shot Inside Box)
att_ibox_miss (Shot Inside Box)
att_ibox_own_goal (Own Goal)
att_ibox_post (Shot Inside Box)
att_ibox_target (Shot Inside Box)
att_lf_goal (Left-Foot)
att_lf_target (Left-Foot)
att_lf_total (Left-Foot)
att_lg_centre (Long Range)
att_lg_left (Long Range)
att_lg_right (Long Range)
att_miss_high (Shot Miss)
att_miss_high_left (Shot Miss)
att_miss_high_right (Shot Miss)
att_miss_left (Shot Miss)
att_miss_right (Shot Miss)
att_obox_blocked (Shot Blocked)
att_obox_goal (Shot Outside Box)
att_obox_miss (Shot Outside Box)
att_obox_own_goal (Own Goal)
att_obox_post (Shot Outside Box)
att_obox_target (Shot Outside Box)
att_obx_left (Shot Direction)
att_obx_right (Shot Direction)
att_obx_centre (Shot Direction)
att_one_on_one (Finishing)
att_openplay (Shot Context)
att_pen_goal (Penalty)
att_pen_miss (Penalty)
att_pen_post (Penalty)
att_pen_target (Penalty)
att_post_high (Woodwork)
att_post_left (Woodwork)
att_post_right (Woodwork)
att_rf_goal (Right-Foot)
att_rf_target (Right-Foot)
att_rf_total (Right-Foot)
att_setpiece (Set-Piece Shot)
att_sv_high_centre (Save Category)
att_sv_high_left (Save Category)
att_sv_high_right (Save Category)
att_sv_low_centre (Save Category)
att_sv_low_left (Save Category)
att_sv_low_right (Save Category)
attempts_conceded_ibox (Defensive Shot Allowed)
attempts_conceded_obox (Defensive Shot Allowed)
attempts_ibox (Shot Inside Box)
attempts_obox (Shot Outside Box)
back_pass (Foul)
ball_recovery (Possession)
big_chance_created (Chance)
big_chance_missed (Chance)
big_chance_saved (Goalkeeping)
big_chance_scored (Chance)
blocked_cross (Defending)
blocked_pass (Defending)
blocked_scoring_att (Shot Block)
challenge_lost (Duel)
clean_sheet (Goalkeeping)
clearance_off_line (Defending)
contentious_decision (Officials)
corner_taken (Set Piece)
cross_not_claimed (Goalkeeping)
crosses_18yard (Crossing GK Claim)
crosses_18yardplus (Crossing GK Claim)
dangerous_play (Foul)
defender_goals (Goal Stat)
dispossessed (Possession Loss)
dive_catch (Goalkeeping)
dive_save (Goalkeeping)
duel_lost (Duel)
duel_won (Duel)
effective_blocked_cross (Defending)
effective_clearance (Clearance)
effective_head_clearance (Clearance)
error_lead_to_goal (Error)
error_lead_to_shot (Error)
final_third_entries (Passing)
fk_foul_lost (Foul)
fk_foul_won (Foul Won)
forward_goals (Goal Stat)
fouled_final_third (Foul Location)
fouls (Foul)
game_started (Player)
gk_smother (Goalkeeping)
goal_assist (Assist)
goal_assist_deadball (Assist)
goal_assist_intentional (Assist)
goal_assist_openplay (Assist)
goal_assist_setplay (Assist)
goal_fastbreak (Fast Break)
goal_kicks (Goalkeeping Distribution)
goals (Goal Stat)
goals_conceded (Defending)
goals_conceded_ibox (Defending)
goals_conceded_obox (Defending)
goals_openplay (Goal Stat)
good_high_claim (Goalkeeping)
hand_ball (Foul)
head_clearance (Clearance)
head_pass (Passing)
hit_woodwork (Shot)
interception (Defending)
interception_won (Defending)
interceptions_in_box (Defending)
keeper_pick_up (Goalkeeping)
keeper_throws (Goalkeeping Distribution)
last_player_tackle (Defending)
leftside_pass (Passing)
long_pass_own_to_opp (Passing Long)
long_pass_own_to_opp_success (Passing Long)
lost_corners (Defending)
midfielder_goals (Goal Stat)
mins_played (Player)
offside_provoked (Defending)
offtarget_att_assist (Shot Assist)
ontarget_att_assist (Shot Assist)
ontarget_scoring_att (Shot)
outfielder_block (Defending)
overrun (Possession)
own_goals (Goal Stat)
own_goals_conceded (Own Goal)
passes_left (Passing)
passes_right (Passing)
penalty_conceded (Penalty)
penalty_faced (Goalkeeping)
penalty_save (Goalkeeping)
penalty_won (Penalty)
possession_percentage (Possession)
poss_lost_all (Possession Loss)
poss_lost_ctrl (Possession Loss)
poss_won_att_3rd (Possession Win)
poss_won_def_3rd (Possession Win)
poss_won_mid_3rd (Possession Win)
post_scoring_att (Shot)
punches (Goalkeeping)
red_card (Discipline)
rescinded_red_card (Discipline)
rightside_pass (Passing)
saved_ibox (Save)
saved_obox (Save)
saves (Goalkeeping)
second_goal_assist (Assist)
second_yellow (Discipline)
shot_fastbreak (Fast Break)
shot_off_target (Shot Miss)
six_second_violation (Foul)
six_yard_block (Shot Block)
stand_catch (Goalkeeping)
stand_save (Goalkeeping)
subs_goals (Goal Stat)
subs_made (Substitution Stat)
successful_final_third_passes (Passing)
successful_open_play_pass (Passing)
successful_fifty_fifty (Duel)
successful_put_through (Internal)
successful_put_through (Internal)
successful_put_through (Internal)
successful_through_ball — (Covered by accurate_through_ball)
times_tackled (Possession Loss)
touches (Possession)
touches_in_final_third (Possession)
touches_in_opp_box (Possession)
total_att_assist (Shot Assist)
total_back_zone_pass (Passing)
total_chipped_pass (Passing)
total_clearance (Clearance)
total_contest (Duel Attempt)
total_corners_intobox (Crossing)
total_cross (Crossing)
total_cross_nocorner (Crossing)
total_fastbreak (Fast Break)
total_final_third_passes (Passing)
total_flick_on (Passing)
total_fwd_zone_pass (Passing)
total_high_claim (Goalkeeping)
total_launches (Passing Long)
total_layoffs (Passing)
total_long_balls (Passing Long)
total_offside (Offside)
total_pass (Passing)
total_pull_back (Crossing)
total_red_card (Discipline)
total_scoring_att (Shot)
total_sub_off (Substitution Stat)
total_sub_on (Substitution Stat)
total_tackle (Defending)
total_through_ball (Passing)
total_throws (Throw-ins)
total_yel_card (Discipline)
turnover (Possession Loss)
unsuccessful_touch (Possession Loss)
was_fouled (Foul)
winning_goal (Goal Stat)
won_contest (Duel)
won_corners (Attacking Set Piece)
won_tackle (Defending)
yellow_card (Discipline)
```