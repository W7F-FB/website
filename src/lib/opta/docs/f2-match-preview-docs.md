# F2 - Match Previews Feed

## Feed Information

This feed provides match preview data and contains information about previous meetings, current form, best players, average event times and statistical data, as well as some editorial comments. All to keep consumers interested in advance of a fixture.

## Delivery Timings

Opta has an automated delivery of the Match Previews (F2) feed per game every morning. It delivers a file for each game if it is scheduled to kick off within 7 days. The feed content might change from day-to-day if a game is played in between.

## File Naming Convention

The file naming convention used for this feed is the following:

```
opta-{game_id}-matchpreview.xml
```

OMO: `http://omo.akamai.opta.net/?game_id=game_id&feed_type=F2&user=xxx&psw=yyyyy`

## Elements/Attribute/Value Descriptions

### `<MatchPreviews>`

**NESTING:** MatchPreviews

**DESCRIPTION:** Root element of the fields related to match previews

---

### `<Match>`

**NESTING:** MatchPreviews/Match

**DESCRIPTION:** Root element of the fields related to the match

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| MatchdayId | The game week number of the match | String | Dynamic |
| id | Unique ID for the fixture | String | Dynamic |
| HomeId | Unique Opta ID of the home team | String | Dynamic |
| AwayId | Unique Opta ID of the away team | String | Dynamic |

---

### `<Rankings>`

**NESTING:** MatchPreviews/Match/Rankings

**DESCRIPTION:** The root element of the rankings section for the previews

---

### `<Team>` (under Rankings)

**NESTING:** MatchPreviews/Match/Rankings/Team

**DESCRIPTION:** Root element of the fields related to the team

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta team ID | String | Dynamic |

---

### `<Home>` (under Rankings/Team)

**NESTING:** MatchPreviews/Match/Rankings/Team/Home

**DESCRIPTION:** Root of all the games the team played at home this season.

---

### `<Stat>` (under Rankings/Team/Home)

**NESTING:** MatchPreviews/Match/Rankings/Team/Home/Stat

**DESCRIPTION:** Players with the most goals scored as defined by Opta in the different types

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | See Values | String | `last_goal_scored` - The players who have most frequently scored the last goal in a game<br>`goals_scored` - The players who have scored the most goals in a game<br>`first_goal_scored` - The players who have most frequently scored the first goal in a game |

---

### `<Rank>` (under Rankings/Team/Home/Stat)

**NESTING:** MatchPreviews/Match/Rankings/Team/Home/Stat/Rank

**DESCRIPTION:** Number of goals or levels within the ranking

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Total | Is the number of goals for this rank | Integer | Dynamic |
| Level | Is the level of the player within the ranking | Integer | Dynamic |

---

### `<Player>` (under Rankings/Team/Home/Stat/Rank)

**NESTING:** MatchPreviews/Match/Rankings/Team/Home/Stat/Rank/Player

**DESCRIPTION:** Unique identity for each player

---

### `<Overall>` (under Rankings/Team)

**NESTING:** MatchPreviews/Match/Rankings/Team/Overall

**DESCRIPTION:** Element of all the games the team has played this season

---

### `<Stat>` (under Rankings/Team/Overall)

**NESTING:** MatchPreviews/Match/Rankings/Team/Overall/Stat

**DESCRIPTION:** Players with the most goals scored as defined by Opta in the different types

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | See Values | String | `last_goal_scored` - The players who have most frequently scored the last goal in a game<br>`goals_scored` - The players who have scored the most goals in a game<br>`first_goal_scored` - The players who have most frequently scored the first goal in a game |

---

### `<Rank>` (under Rankings/Team/Overall/Stat)

**NESTING:** MatchPreviews/Match/Rankings/Team/Overall/Stat/Rank

**DESCRIPTION:** Number of goals or levels within the ranking

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Total | Is the number of goals for this rank | Integer | Dynamic |
| Level | Is the level of the player within the ranking | Integer | Dynamic |

---

### `<Player>` (under Rankings/Team/Overall/Stat/Rank)

**NESTING:** MatchPreviews/Match/Rankings/Team/Overall/Stat/Rank/Player

**DESCRIPTION:** Unique identity for each player

---

### `<Away>` (under Rankings/Team)

**NESTING:** MatchPreviews/Match/Rankings/Team/Away

**DESCRIPTION:** Element of all the games the team has played away from home this season

---

### `<Stat>` (under Rankings/Team/Away)

**NESTING:** MatchPreviews/Match/Rankings/Team/Away/Stat

**DESCRIPTION:** Players with the most goals scored as defined by Opta in the different types

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | See Values | String | `last_goal_scored` - The players who have most frequently scored the last goal in a game<br>`goals_scored` - The players who have scored the most goals in a game<br>`first_goal_scored` - The players who have most frequently scored the first goal in a game |

---

### `<Rank>` (under Rankings/Team/Away/Stat)

**NESTING:** MatchPreviews/Match/Rankings/Team/Away/Stat/Rank

**DESCRIPTION:** Number of goals or levels within the ranking

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Total | Is the number of goals for this rank | Integer | Dynamic |
| Level | Is the level of the player within the ranking | Integer | Dynamic |

---

### `<Player>` (under Rankings/Team/Away/Stat/Rank)

**NESTING:** MatchPreviews/Match/Rankings/Team/Away/Stat/Rank/Player

**DESCRIPTION:** Unique identity for each player

---

### `<MatchData>` (under Match)

**NESTING:** MatchPreviews/Match/MatchData

**DESCRIPTION:** Element of all match data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| SeasonId | Opta season ID | String | Dynamic |
| competitionId | Unique ID of the competition | String | Dynamic |

---

### `<MatchInfo>`

**NESTING:** MatchPreviews/Match/MatchData/MatchInfo

**DESCRIPTION:** Root element of the related fields related to the match information

---

### `<Venue>` (under MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/MatchData/MatchInfo/Venue

**DESCRIPTION:** Name of the venue where the match is played. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | Unique ID of the venue | Integer | Dynamic |

---

### `<Date>` (under MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/MatchData/MatchInfo/Date

**DESCRIPTION:** The date and time of the game.

---

### `<PreviousMeetingsOtherComps>`

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps

**DESCRIPTION:** The root of the PreviousMeetingsOtherComps tree. Contains a maximum of eight matches between the two teams from across all competitions. Contains the same data as `<PreviousMeetings>`

---

### `<MatchData>` (under PreviousMeetingsOtherComps)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData

**DESCRIPTION:** Root element of all match data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| id | Unique ID of the match | String | Dynamic |
| SeasonId | Opta season ID | String | Dynamic |
| competitionId | Unique ID of the competition | String | Dynamic |

---

### `<MatchInfo>` (under PreviousMeetingsOtherComps/MatchData)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData/MatchInfo

**DESCRIPTION:** Root element of the related fields related to the match information

---

### `<Venue>` (under PreviousMeetingsOtherComps/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData/MatchInfo/Venue

**DESCRIPTION:** Name of the venue where the match is played. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | Unique ID of the venue | Integer | Dynamic |

---

### `<Date>` (under PreviousMeetingsOtherComps/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData/MatchInfo/Date

**DESCRIPTION:** The date and time of the game

---

### `<TeamData>` (under PreviousMeetingsOtherComps/MatchData)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData/TeamData

**DESCRIPTION:** Root element of the fields related to a goal event

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | Type of goal scored | String | `Goal` - Normal Goal<br>`Own` - Own Goal<br>`Penalty` - Penalty Goal |
| PlayRef | Unique Opta ID for the player | String | Dynamic |
| Minute | The minute of the goal | Integer | Dynamic |

---

### `<Goal>` (under PreviousMeetingsOtherComps/MatchData/TeamData)

**NESTING:** MatchPreviews/Match/PreviousMeetingsOtherComps/MatchData/TeamData/Goal

**DESCRIPTION:** Root element of the fields related to a goal event

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | Type of goal scored | String | `Goal` - Normal Goal<br>`Own` - Own Goal<br>`Penalty` - Penalty Goal |
| PlayRef | Unique Opta ID for the player | String | Dynamic |
| Minute | The minute of the goal | Integer | Dynamic |

---

### `<PreviousMeetings>`

**NESTING:** MatchPreviews/Match/PreviousMeetings

**DESCRIPTION:** Root element of the previous meetings

---

### `<MatchData>` (under PreviousMeetings)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData

**DESCRIPTION:** Root element of all the match data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Id | Unique ID of the match | String | Dynamic |
| SeasonId | Opta season ID | String | Dynamic |
| competitionId | Unique ID of the competition | String | Dynamic |

---

### `<MatchInfo>` (under PreviousMeetings/MatchData)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData/MatchInfo

**DESCRIPTION:** Root element of the match info

---

### `<Venue>` (under PreviousMeetings/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData/MatchInfo/Venue

**DESCRIPTION:** Name of the venue where the match is played. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | Unique ID of the venue | String | Dynamic |

---

### `<Date>` (under PreviousMeetings/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData/MatchInfo/Date

**DESCRIPTION:** The date and time of the game

---

### `<TeamData>` (under PreviousMeetings/MatchData)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData/TeamData

**DESCRIPTION:** Root element of all team data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Score | The score for the specified team. If the game was decided on penalty shoot-out this will be still set to the score that the game would have finished at after extra time. | Integer | Dynamic |
| TeamRef | This value will have the unique team ID. Opta recommends that you take the 't' off the String and use it as an integer as other feeds that Opta provide may represent this as the integer only. | String | Dynamic |
| Side | Indicates the position of the contestant as either the home or away side | String | `Home`<br>`Away` |

---

### `<Goal>` (under PreviousMeetings/MatchData/TeamData)

**NESTING:** MatchPreviews/Match/PreviousMeetings/MatchData/TeamData/Goal

**DESCRIPTION:** Root element of the fields related to a goal event

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | Type of goal scored | String | `Goal` - Normal Goal<br>`Own` - Own Goal<br>`Penalty` - Penalty Goal |
| PlayRef | Unique Opta ID of the player who scored the goal | String | Dynamic |
| Minute | The minute of the goal | Integer | Dynamic |

---

### `<Averages>`

**NESTING:** MatchPreviews/Match/Averages

**DESCRIPTION:** Root element of the averages

---

### `<Team>` (under Averages)

**NESTING:** MatchPreviews/Match/Averages/Team

**DESCRIPTION:** Root element of the fields related to the team

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta team ID | String | Dynamic |

---

### `<Home>` (under Averages/Team)

**NESTING:** MatchPreviews/Match/Averages/Team/Home

**DESCRIPTION:** Element of all the games the team played at home this season

---

### `<Overall>` (under Averages/Team)

**NESTING:** MatchPreviews/Match/Averages/Team/Overall

**DESCRIPTION:** Element of all the games played overall

---

### `<Away>` (under Averages/Team)

**NESTING:** MatchPreviews/Match/Averages/Team/Away

**DESCRIPTION:** Element of all the games the team has played away from home this season

---

### `<Stat>` (under Averages/Team/Home or Overall or Away)

**NESTING:** MatchPreviews/Match/Averages/Team/Home or Overall or Away/Stat

**DESCRIPTION:** Element of different types of stats

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | See Values | String | `second_yellow` - Average number of 2nd yellow cards received<br>`total_cross` - Average number of crosses per game<br>`duel_won` - Average duels where possession is won<br>`total_red_card` - Average red cards per game<br>`fk_foul_lost` - Freekicks conceded<br>`first_goal_conceded_time` - Average first goal conceded time<br>`accuarte_fwd_zone_pass` - Average successful passes in the attacking half<br>`accurate_pass` - Average number of successful passes<br>`duel_lost` - Average number of duels per game where possession is lost<br>`blocked_scoring_att` - Average shots blocked<br>`won_tackle` - Average tackles where possession is won<br>`won_tackle` - Average Yellow Cards per game<br>`total_pass` - Average total passes<br>`fk_foul__won` - Average freekicks won<br>`first_goal_scored_time` - Average first goal scored time<br>`lost_corners` - Average corners conceded per game<br>`accurate_fwd_zone_pass` - Successful passes in the oppositions half<br>`accurate_pass` - Total successful passes<br>`won_tackle` - Total tackles where the possession was won<br>`passing_accuracy` - % of passes successful<br>`total_pass` - Total number of passes<br>`win` - Average games won<br>`draw` - Average games drawn<br>`last_goal_scored_time` - Average last goal scored time<br>`won_corners` - Average corners won per game<br>`accurate_cross` - Average successful crosses<br>`total_fwd_zone_pass` - Average passes in the attacking half per game<br>`possession_percenatge` - Average % possession<br>`last_goal_conceded_time` - Average last goal conceded time<br>`goals_conceded` - Average goals conceded per game<br>`total_tackle` - Average tackles per game<br>`ontarget_scoring_att` - Average shots on target per game<br>`goals` - Average goals scored per game<br>`total_offside` - Average offsides per game<br>`lose` - Average games lost |

---

### `<Form>`

**NESTING:** MatchPreviews/Match/Form

**DESCRIPTION:** Form of a team. W - Win, L - Lost, D - Draw

---

### `<Team>` (under Form)

**NESTING:** MatchPreviews/Match/Form/Team

**DESCRIPTION:** Root element of the fields related to the team

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta team ID | String | Dynamic |

---

### `<Formtext>` (Note: appears as FormText in some contexts)

**NESTING:** MatchPreviews/Match/Form/Team/FormText

**DESCRIPTION:** Result of a team in the last six games, Win/lost/drawn. Data type: String (Example: LWWDWW)

---

### `<MatchData>` (under Form/Team)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData

**DESCRIPTION:** Root element of all the match data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Id | Unique ID of the match | String | Dynamic |
| SeasonId | Opta season ID | String | Dynamic |
| competitionId | Unique Opta ID of the away team | String | Dynamic |

---

### `<MatchInfo>` (under Form/Team/MatchData)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData/MatchInfo

**DESCRIPTION:** Root element of the match Information

---

### `<Venue>` (under Form/Team/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData/MatchInfo/Venue

**DESCRIPTION:** Name of the venue where the match is played. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | Unique ID of the venue | String | Dynamic |

---

### `<Date>` (under Form/Team/MatchData/MatchInfo)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData/MatchInfo/Date

**DESCRIPTION:** The date of the game

---

### `<TeamData>` (under Form/Team/MatchData)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData/TeamData

**DESCRIPTION:** Root element of all team data info

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Score | The score for the specified team. If the game was decided on penalty shoot-out this will be still set to the score that the game would have finished at after extra time. | Integer | Dynamic |
| TeamRef | This value will have the unique team ID. Opta recommends that you take the 't' off the String and use it as an integer as other feeds that Opta provide may represent this as the integer only. | String | Dynamic |
| Side | Indicates the position of the contestant as either the home or away side | String | `Home`<br>`Away` |

---

### `<Goal>` (under Form/Team/MatchData/TeamData)

**NESTING:** MatchPreviews/Match/Form/Team/MatchData/TeamData/Goal

**DESCRIPTION:** Root element of the fields related to a goal event

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | Type of goal scored | String | `Goal` - Normal Goal<br>`Own` - Own Goal<br>`Penalty` - Penalty Goal |
| PlayRef | Unique Opta ID of the player who scored the goal | String | Dynamic |
| Minute | The minute of the goal | Integer | Dynamic |

---

### `<Totals>`

**NESTING:** MatchPreviews/Match/Totals

**DESCRIPTION:** Root element of the totals for the season

---

### `<Team>` (under Totals)

**NESTING:** MatchPreviews/Match/Totals/Team

**DESCRIPTION:** Root element of the fields related to the team

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta team ID | String | Dynamic |

---

### `<Stat>` (under Totals/Team)

**NESTING:** MatchPreviews/Match/Totals/Team/Stat

**DESCRIPTION:** Root element of all types of stats

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| Type | See Values | String | `tackle_success` - Floating point value as percentage for successful tackles this season<br>`goals_conceded_per_game` - Total goals conceded while playing<br>`duel_lost` - Total duels where lost possession of the ball<br>`blocked_scoring_att` - All attempts that were blocked<br>`total_yel_card` - Excluding 2nd yellows<br>`won_tackle` - Total Tackles Won<br>`win` - Total games won<br>`accurate_cross` - Successful crosses<br>`total_fwd_zone_pass` - Total passes in the attacking half<br>`games_played` - Total appearances<br>`total_cross` - Total number of crosses<br>`second_yellow` - Total number of second yellows received<br>`shot_accuracy` - Total shots compared to shots on target<br>`duels_won` - Duels where possession of the ball is won<br>`total_red_cards` - Total red cards received<br>`fk_foul_lost` - Total freekicks conceded<br>`accurate_fwd_zone_pass` - Successful passes in the oppositions half<br>`accurate_pass` - Total successful passes<br>`won_tackle` - Total tackles where the possession was won<br>`passing_accuracy` - % of passes successful<br>`total_pass` - Total number of passes<br>`fk_foul_won` - Freekicks won<br>`goal_conversion` - % of goals from attempts<br>`lost_corners` - Corners conceded<br>`draw` - Total games drawn<br>`won_corners` - Total corners forced<br>`possession_percentage` - % possession of the ball<br>`goals_conceded` - Total goals conceded<br>`total_tackle` - Total tackles attempted<br>`lose` - Total games lost<br>`total_offside` - Total number of times caught offside<br>`goals` - Total goals scored<br>`total_scoring_att` - Total shots at goal<br>`ontarget_scoring_att` - Total shots on target |

---

### `<Entities>`

**NESTING:** MatchPreviews/Entities

**DESCRIPTION:** Root element of entities

---

### `<Teams>`

**NESTING:** MatchPreviews/Entities/Teams

**DESCRIPTION:** Root element of all teams mentioned in the feed

---

### `<Team>` (under Entities/Teams)

**NESTING:** MatchPreviews/Entities/Teams/Team

**DESCRIPTION:** Name of all the teams listed. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta team ID | String | Dynamic |
| ShortName | Short name of the team | String | Dynamic |
| OfficialName | Official name of the team | String | Dynamic |

---

### `<Competitions>`

**NESTING:** MatchPreviews/Entities/Competitions

**DESCRIPTION:** Root element of all the fields related to the competitions

---

### `<Competition>`

**NESTING:** MatchPreviews/Entities/Competitions/Competition

**DESCRIPTION:** Displays the name of the competition name. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | Unique ID of the competition | String | Dynamic |

---

### `<Players>`

**NESTING:** MatchPreviews/Entities/Players

**DESCRIPTION:** Root element containing the list of all the players

---

### `<Player>` (under Entities/Players)

**NESTING:** MatchPreviews/Entities/Players/Player

**DESCRIPTION:** Name of the players. Data type: String

**Attributes:**

| Attribute | Description | Data Type | Values |
|-----------|-------------|-----------|--------|
| uID | The unique Opta player ID | String | Dynamic |

