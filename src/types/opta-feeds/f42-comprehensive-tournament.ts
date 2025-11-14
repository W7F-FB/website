export interface F42ComprehensiveTournamentResponse {
  SoccerFeed: F42SoccerFeed;
}

export interface F42SoccerFeed {
  SoccerDocument: F42SoccerDocument;
}

export interface F42SoccerDocument {
  Type: "RESULTS Latest";
  competition_code: string;
  competition_id: number;
  competition_name: string;
  season_id: number;
  season_name: string;
  timestamp: string;
  game_system_id: number;
  MatchData?: F42MatchData[];
  CollectionTypes?: F42CollectionTypes;
  Squads?: F42Squads;
  Standings?: F42Standings;
}

export interface F42MatchData {
  uID: string;
  detail_id: number;
  timestamp_accuracy_id: number;
  timing_id: number;
  MatchInfo: F42MatchInfo;
  Stat?: F42MatchStat[];
  TeamData: F42TeamMatchData[];
}

export interface F42MatchInfo {
  MatchDay: number;
  MatchType: F42MatchType;
  Period: F42Period;
  RoundNumber?: number;
  GroupName?: string;
  RoundType?: F42RoundType;
  TimeFrameLengthId?: number;
  GameWinner?: string;
  GameWinnerType?: "AfterExtraTime" | "ShootOut";
  VAR?: 1;
  Date: string;
  DateLocal?: F42DateLocal;
  DateUtc?: F42DateUtc;
  TZ: string;
}

export type F42MatchType =
  | "Regular"
  | "Cup"
  | "Cup Gold"
  | "Replay"
  | "Cup English"
  | "Cup Short"
  | "1st Leg"
  | "2nd Leg"
  | "2nd Leg Away Goal"
  | "2nd Leg Cup Short"
  | "Best of 3"
  | "Best of 5"
  | "Best of 7"
  | "Best of 3 Long"
  | "Best of 5 Long"
  | "Best of 7 Long";

export type F42Period =
  | "FullTime"
  | "PreMatch"
  | "Postponed"
  | "Abandoned"
  | "Live"
  | "FirstHalf"
  | "SecondHalf";

export type F42RoundType =
  | "Qualifier Round"
  | "Round"
  | "Quarter-Finals"
  | "Semi-Finals"
  | "3rd and 4th Place"
  | "Final";

export interface F42DateLocal {
  Offset: string;
  value: string;
}

export interface F42DateUtc {
  value: string;
}

export interface F42MatchStat {
  Type: F42MatchStatType;
  value?: string | number;
}

export type F42MatchStatType =
  | "Venue"
  | "Attendance"
  | "Postponed"
  | "Abandoned"
  | "City"
  | "Neutral";

export interface F42TeamMatchData {
  TeamRef: string;
  Side: "Home" | "Away";
  Score?: number;
  HalfTimeScore?: number;
  PenaltyShootOut?: number;
  AggregateScore?: number;
  PreMatchAgg?: number;
  ScoreAfterET?: number;
  AwayGoalWinner?: 0 | 1;
  Goal?: F42Goal[];
  Booking?: F42Booking[];
}

export interface F42Goal {
  Period: F42GoalPeriod;
  Time: number;
  PlayerRef: string;
  Type: "Goal" | "Own" | "Penalty";
}

export type F42GoalPeriod =
  | "FirstHalf"
  | "SecondHalf"
  | "ExtraFirstHalf"
  | "ExtraSecondHalf"
  | "ShootOut";

export interface F42Booking {
  Card: "Yellow" | "Red";
  CardType: "Yellow" | "SecondYellow" | "StraightRed";
  Period: F42GoalPeriod;
  Time: number;
  PlayerRef: string;
  Reason?: F42BookingReason;
}

export type F42BookingReason =
  | "Foul"
  | "Hand"
  | "Referee abuse"
  | "Crowd interaction"
  | "Fight"
  | "Time wasting"
  | "Argument"
  | "Excessive celebration"
  | "Dive"
  | "Foul and Abusive Language"
  | "Dissent"
  | "Not Retreating"
  | "Other"
  | "Other reason";

export interface F42CollectionTypes {
  DetailTypes?: F42DetailTypes;
  TimeStampAccuracyTypes?: F42TimeStampAccuracyTypes;
  TimingTypes?: F42TimingTypes;
}

export interface F42DetailTypes {
  DetailType?: F42DetailType[];
}

export interface F42DetailType {
  detail_id: number;
  name: string;
}

export interface F42TimeStampAccuracyTypes {
  TimeStampAccuracyType?: F42TimeStampAccuracyType[];
}

export interface F42TimeStampAccuracyType {
  timestamp_accuracy_id: number;
  name: string;
}

export interface F42TimingTypes {
  TimingType?: F42TimingType[];
}

export interface F42TimingType {
  timing_id: number;
  name: string;
}

export interface F42Squads {
  AdditionalPlayers?: F42AdditionalPlayers;
  Team?: F42Team[];
  Duplicates?: F42Duplicates;
}

export interface F42AdditionalPlayers {
  Player?: F42Player[];
}

export interface F42Team {
  uID: string;
  Name: string;
  SYMID?: string;
  Player?: F42Player[];
  TeamOfficial?: F42TeamOfficial[];
}

export interface F42Player {
  uID: string;
  Name: string;
  Position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  Stat?: F42PlayerStat[];
}

export interface F42PlayerStat {
  Type: F42PlayerStatType;
  value?: string | number;
}

export type F42PlayerStatType =
  | "first_name"
  | "last_name"
  | "known_name"
  | "middle_name"
  | "birth_date"
  | "birth_place"
  | "first_nationality"
  | "weight"
  | "height"
  | "jersey_num"
  | "real_position"
  | "real_position_side"
  | "country"
  | "join_date"
  | "preferred_foot";

export interface F42TeamOfficial {
  Type: F42TeamOfficialType;
  uID: string;
  country?: string;
  PersonName: F42PersonName;
}

export type F42TeamOfficialType =
  | "Manager"
  | "Assistant Manager"
  | "Chairman"
  | "President"
  | "Physio"
  | "Scout";

export interface F42PersonName {
  First?: string;
  Last?: string;
  BirthDate?: string;
  JoinDate?: string;
  join_date?: string;
}

export interface F42Duplicates {
  Duplicate?: F42Duplicate[];
}

export interface F42Duplicate {
  uID: string;
  first_name?: string;
  last_name?: string;
  teams?: string;
}

export interface F42Standings {
  TeamStandings?: F42TeamStandings[];
  PointsDeduction?: F42PointsDeduction[];
}

export interface F42TeamStandings {
  Matchday?: number;
  Round?: F42Round;
  TeamRecord?: F42TeamRecord[];
}

export interface F42Round {
  Name: F42RoundName;
}

export interface F42RoundName {
  id: string;
  value?: string;
}

export interface F42TeamRecord {
  TeamRef: string;
  Standing: F42Standing;
}

export interface F42Standing {
  Type: "Full";
  Against: number;
  AwayAgainst: number;
  AwayDrawn: number;
  AwayFor: number;
  AwayLost: number;
  AwayPPG?: number;
  AwayPlayed: number;
  AwayPoints: number;
  AwayPosition: number;
  AwayWon: number;
  Drawn: number;
  For: number;
  HomeAgainst: number;
  HomeDrawn: number;
  HomeFor: number;
  HomeLost: number;
  HomePPG?: number;
  HomePlayed: number;
  HomePoints: number;
  HomePosition: number;
  HomeWon: number;
  Lost: number;
  PPG?: number;
  Played: number;
  Points: number;
  Position: number;
  StartDayPosition: number;
  Won: number;
}

export interface F42PointsDeduction {
  TeamRef: string;
  DateApplied?: string;
  Points?: number;
  Total?: number;
  Reason?: string;
}

export function getPlayerStat(
  player: F42Player,
  statType: F42PlayerStatType
): string | number | undefined {
  const stat = player.Stat?.find(s => s.Type === statType);
  return stat?.value;
}

export function getPlayerFirstName(player: F42Player): string | undefined {
  return getPlayerStat(player, "first_name") as string | undefined;
}

export function getPlayerLastName(player: F42Player): string | undefined {
  return getPlayerStat(player, "last_name") as string | undefined;
}

export function getPlayerKnownName(player: F42Player): string | undefined {
  return getPlayerStat(player, "known_name") as string | undefined;
}

export function getPlayerFullName(player: F42Player): string {
  const knownName = getPlayerKnownName(player);
  if (knownName) return knownName;
  
  const firstName = getPlayerFirstName(player);
  const lastName = getPlayerLastName(player);
  
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  
  return player.Name;
}

export function getPlayerBirthDate(player: F42Player): string | undefined {
  return getPlayerStat(player, "birth_date") as string | undefined;
}

export function getPlayerNationality(player: F42Player): string | undefined {
  return getPlayerStat(player, "first_nationality") as string | undefined;
}

export function getPlayerCountry(player: F42Player): string | undefined {
  return getPlayerStat(player, "country") as string | undefined;
}

export function getPlayerHeight(player: F42Player): number | undefined {
  const height = getPlayerStat(player, "height");
  if (typeof height === "string") {
    const parsed = parseInt(height, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return height as number | undefined;
}

export function getPlayerWeight(player: F42Player): number | undefined {
  const weight = getPlayerStat(player, "weight");
  if (typeof weight === "string") {
    const parsed = parseInt(weight, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return weight as number | undefined;
}

export function getPlayerJerseyNumber(player: F42Player): number | string | undefined {
  return getPlayerStat(player, "jersey_num");
}

export function getPlayerRealPosition(player: F42Player): string | undefined {
  return getPlayerStat(player, "real_position") as string | undefined;
}

export function getPlayerRealPositionSide(player: F42Player): string | undefined {
  return getPlayerStat(player, "real_position_side") as string | undefined;
}

export function getPlayerJoinDate(player: F42Player): string | undefined {
  return getPlayerStat(player, "join_date") as string | undefined;
}

export function filterPlayersByPosition(
  team: F42Team,
  position: F42Player["Position"]
): F42Player[] {
  return team.Player?.filter(p => p.Position === position) || [];
}

export function getGoalkeepers(team: F42Team): F42Player[] {
  return filterPlayersByPosition(team, "Goalkeeper");
}

export function getDefenders(team: F42Team): F42Player[] {
  return filterPlayersByPosition(team, "Defender");
}

export function getMidfielders(team: F42Team): F42Player[] {
  return filterPlayersByPosition(team, "Midfielder");
}

export function getForwards(team: F42Team): F42Player[] {
  return filterPlayersByPosition(team, "Forward");
}

export function getMatchVenue(match: F42MatchData): string | undefined {
  return match.Stat?.find(s => s.Type === "Venue")?.value as string | undefined;
}

export function getMatchAttendance(match: F42MatchData): number | undefined {
  const attendance = match.Stat?.find(s => s.Type === "Attendance")?.value;
  if (typeof attendance === "number") return attendance;
  if (typeof attendance === "string") {
    const parsed = parseInt(attendance, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

export function getMatchCity(match: F42MatchData): string | undefined {
  return match.Stat?.find(s => s.Type === "City")?.value as string | undefined;
}

export function isNeutralVenue(match: F42MatchData): boolean {
  return match.Stat?.some(s => s.Type === "Neutral") || false;
}

export function getHomeTeam(match: F42MatchData): F42TeamMatchData | undefined {
  return match.TeamData.find(t => t.Side === "Home");
}

export function getAwayTeam(match: F42MatchData): F42TeamMatchData | undefined {
  return match.TeamData.find(t => t.Side === "Away");
}

export function getTeamStanding(
  standings: F42Standings,
  teamRef: string,
  matchday?: number
): F42Standing | undefined {
  if (!standings.TeamStandings) return undefined;
  
  let teamStandings = standings.TeamStandings;
  if (matchday !== undefined) {
    teamStandings = teamStandings.filter(ts => ts.Matchday === matchday);
  }
  
  for (const ts of teamStandings) {
    const record = ts.TeamRecord?.find(tr => tr.TeamRef === teamRef);
    if (record) return record.Standing;
  }
  
  return undefined;
}

export function getTeamPointsDeduction(
  standings: F42Standings,
  teamRef: string
): F42PointsDeduction | undefined {
  return standings.PointsDeduction?.find(pd => pd.TeamRef === teamRef);
}

export function getTeamFromSquads(
  squads: F42Squads,
  teamRef: string
): F42Team | undefined {
  return squads.Team?.find(t => t.uID === teamRef);
}

export function getPlayerFromSquads(
  squads: F42Squads,
  playerRef: string
): F42Player | undefined {
  if (!squads.Team) return undefined;
  
  for (const team of squads.Team) {
    const player = team.Player?.find(p => p.uID === playerRef);
    if (player) return player;
  }
  
  return squads.AdditionalPlayers?.Player?.find(p => p.uID === playerRef);
}

export function getGoalScorers(teamData: F42TeamMatchData): string[] {
  if (!teamData.Goal) return [];
  
  return teamData.Goal
    .filter(g => g.Type !== "Own")
    .map(g => g.PlayerRef);
}

export function getBookedPlayers(teamData: F42TeamMatchData): string[] {
  if (!teamData.Booking) return [];
  
  return [...new Set(teamData.Booking.map(b => b.PlayerRef))];
}

export function getRedCardPlayers(teamData: F42TeamMatchData): string[] {
  if (!teamData.Booking) return [];
  
  return [...new Set(
    teamData.Booking
      .filter(b => b.Card === "Red")
      .map(b => b.PlayerRef)
  )];
}

export function getSortedStandings(
  teamStandings: F42TeamStandings
): F42TeamRecord[] {
  if (!teamStandings.TeamRecord) return [];
  
  return [...teamStandings.TeamRecord].sort((a, b) => {
    return a.Standing.Position - b.Standing.Position;
  });
}

export function getMatchesByTeam(
  matches: F42MatchData[],
  teamRef: string
): F42MatchData[] {
  return matches.filter(m => 
    m.TeamData.some(td => td.TeamRef === teamRef)
  );
}

export function getMatchesByMatchday(
  matches: F42MatchData[],
  matchday: number
): F42MatchData[] {
  return matches.filter(m => m.MatchInfo.MatchDay === matchday);
}

