export interface StatMetadata {
  stat: string;
  abbr: string;
  label?: string;
}

export const F15_STAT_TYPES: Record<string, StatMetadata> = {
  "total goals": {
    stat: "goals",
    abbr: "G",
    label: "Goals"
  },
  "total goals ranking": {
    stat: "goals",
    abbr: "G",
    label: "Goals Rank"
  },
  "total assists": {
    stat: "assists",
    abbr: "A",
    label: "Assists"
  },
  "total assists ranking": {
    stat: "assists",
    abbr: "A",
    label: "Assists Rank"
  },
  "total mins played": {
    stat: "minutes",
    abbr: "MIN",
    label: "Minutes Played"
  },
  "total mins played ranking": {
    stat: "minutes",
    abbr: "MIN",
    label: "Minutes Rank"
  },
  "total games": {
    stat: "games",
    abbr: "GP",
    label: "Games Played"
  },
  "total games ranking": {
    stat: "games",
    abbr: "GP",
    label: "Games Rank"
  },
  "total pass": {
    stat: "passes",
    abbr: "P",
    label: "Passes"
  },
  "total pass ranking": {
    stat: "passes",
    abbr: "P",
    label: "Passes Rank"
  },
  "total accurate pass": {
    stat: "accuratePasses",
    abbr: "AP",
    label: "Accurate Passes"
  },
  "total accurate pass ranking": {
    stat: "accuratePasses",
    abbr: "AP",
    label: "Accurate Passes Rank"
  },
  "total pass pct": {
    stat: "passAccuracy",
    abbr: "P%",
    label: "Pass Accuracy %"
  },
  "total pass pct ranking": {
    stat: "passAccuracy",
    abbr: "P%",
    label: "Pass Accuracy Rank"
  },
  "total tackle": {
    stat: "tackles",
    abbr: "T",
    label: "Tackles"
  },
  "total tackle ranking": {
    stat: "tackles",
    abbr: "T",
    label: "Tackles Rank"
  },
  "total won tackle": {
    stat: "tacklesWon",
    abbr: "TW",
    label: "Tackles Won"
  },
  "total won tackle ranking": {
    stat: "tacklesWon",
    abbr: "TW",
    label: "Tackles Won Rank"
  },
  "total tackle pct": {
    stat: "tackleSuccess",
    abbr: "T%",
    label: "Tackle Success %"
  },
  "total tackle pct ranking": {
    stat: "tackleSuccess",
    abbr: "T%",
    label: "Tackle Success Rank"
  },
  "total scoring att": {
    stat: "shots",
    abbr: "SH",
    label: "Shots"
  },
  "total scoring att ranking": {
    stat: "shots",
    abbr: "SH",
    label: "Shots Rank"
  },
  "total ontarget scoring att": {
    stat: "shotsOnTarget",
    abbr: "SOT",
    label: "Shots On Target"
  },
  "total ontarget scoring att ranking": {
    stat: "shotsOnTarget",
    abbr: "SOT",
    label: "Shots On Target Rank"
  },
  "total scoring accuracy": {
    stat: "shotAccuracy",
    abbr: "SH%",
    label: "Shot Accuracy %"
  },
  "total scoring accuracy ranking": {
    stat: "shotAccuracy",
    abbr: "SH%",
    label: "Shot Accuracy Rank"
  },
  "total goal conversion": {
    stat: "conversionRate",
    abbr: "CNV%",
    label: "Conversion Rate %"
  },
  "total goal conversion ranking": {
    stat: "conversionRate",
    abbr: "CNV%",
    label: "Conversion Rate Rank"
  },
  "total attempt": {
    stat: "attempts",
    abbr: "ATT",
    label: "Attempts"
  },
  "total attempt ranking": {
    stat: "attempts",
    abbr: "ATT",
    label: "Attempts Rank"
  },
  "total ontarget attempt": {
    stat: "attemptsOnTarget",
    abbr: "AOTT",
    label: "Attempts On Target"
  },
  "total ontarget attempt ranking": {
    stat: "attemptsOnTarget",
    abbr: "AOTT",
    label: "Attempts On Target Rank"
  },
  "total attempts ibox": {
    stat: "shotsInsideBox",
    abbr: "SIB",
    label: "Shots Inside Box"
  },
  "total attempts ibox ranking": {
    stat: "shotsInsideBox",
    abbr: "SIB",
    label: "Shots Inside Box Rank"
  },
  "total attempts obox": {
    stat: "shotsOutsideBox",
    abbr: "SOB",
    label: "Shots Outside Box"
  },
  "total attempts obox ranking": {
    stat: "shotsOutsideBox",
    abbr: "SOB",
    label: "Shots Outside Box Rank"
  },
  "total yellow card": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards"
  },
  "total yellow card ranking": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards Rank"
  },
  "total red card": {
    stat: "redCards",
    abbr: "RC",
    label: "Red Cards"
  },
  "total red card ranking": {
    stat: "redCards",
    abbr: "RC",
    label: "Red Cards Rank"
  },
  "total card": {
    stat: "cards",
    abbr: "C",
    label: "Cards"
  },
  "total card ranking": {
    stat: "cards",
    abbr: "C",
    label: "Cards Rank"
  },
  "total second yellow": {
    stat: "secondYellow",
    abbr: "2Y",
    label: "Second Yellow"
  },
  "total second yellow ranking": {
    stat: "secondYellow",
    abbr: "2Y",
    label: "Second Yellow Rank"
  },
  "total fouls": {
    stat: "fouls",
    abbr: "F",
    label: "Fouls"
  },
  "total fouls ranking": {
    stat: "fouls",
    abbr: "F",
    label: "Fouls Rank"
  },
  "total was fouled": {
    stat: "fouled",
    abbr: "FD",
    label: "Fouled"
  },
  "total was fouled ranking": {
    stat: "fouled",
    abbr: "FD",
    label: "Fouled Rank"
  },
  "total offside": {
    stat: "offsides",
    abbr: "OFF",
    label: "Offsides"
  },
  "total offside ranking": {
    stat: "offsides",
    abbr: "OFF",
    label: "Offsides Rank"
  },
  "total clearance": {
    stat: "clearances",
    abbr: "CL",
    label: "Clearances"
  },
  "total clearance ranking": {
    stat: "clearances",
    abbr: "CL",
    label: "Clearances Rank"
  },
  "total effective clearance": {
    stat: "effectiveClearances",
    abbr: "ECL",
    label: "Effective Clearances"
  },
  "total effective clearance ranking": {
    stat: "effectiveClearances",
    abbr: "ECL",
    label: "Effective Clearances Rank"
  },
  "total interception": {
    stat: "interceptions",
    abbr: "INT",
    label: "Interceptions"
  },
  "total interception ranking": {
    stat: "interceptions",
    abbr: "INT",
    label: "Interceptions Rank"
  },
  "total duels won": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won"
  },
  "total duels won ranking": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won Rank"
  },
  "total duels lost": {
    stat: "duelsLost",
    abbr: "DL",
    label: "Duels Lost"
  },
  "total duels lost ranking": {
    stat: "duelsLost",
    abbr: "DL",
    label: "Duels Lost Rank"
  },
  "total aerial won": {
    stat: "aerialsWon",
    abbr: "AW",
    label: "Aerials Won"
  },
  "total aerial won ranking": {
    stat: "aerialsWon",
    abbr: "AW",
    label: "Aerials Won Rank"
  },
  "total aerial lost": {
    stat: "aerialsLost",
    abbr: "AL",
    label: "Aerials Lost"
  },
  "total aerial lost ranking": {
    stat: "aerialsLost",
    abbr: "AL",
    label: "Aerials Lost Rank"
  },
  "total contest": {
    stat: "contests",
    abbr: "CON",
    label: "Contests"
  },
  "total contest ranking": {
    stat: "contests",
    abbr: "CON",
    label: "Contests Rank"
  },
  "total won contest": {
    stat: "contestsWon",
    abbr: "CW",
    label: "Contests Won"
  },
  "total won contest ranking": {
    stat: "contestsWon",
    abbr: "CW",
    label: "Contests Won Rank"
  },
  "total crosses": {
    stat: "crosses",
    abbr: "CR",
    label: "Crosses"
  },
  "total cross ranking": {
    stat: "crosses",
    abbr: "CR",
    label: "Crosses Rank"
  },
  "total accurate cross": {
    stat: "accurateCrosses",
    abbr: "ACR",
    label: "Accurate Crosses"
  },
  "total accurate cross ranking": {
    stat: "accurateCrosses",
    abbr: "ACR",
    label: "Accurate Crosses Rank"
  },
  "total cross pct": {
    stat: "crossAccuracy",
    abbr: "CR%",
    label: "Cross Accuracy %"
  },
  "total cross pct ranking": {
    stat: "crossAccuracy",
    abbr: "CR%",
    label: "Cross Accuracy Rank"
  },
  "total long balls": {
    stat: "longBalls",
    abbr: "LB",
    label: "Long Balls"
  },
  "total long balls ranking": {
    stat: "longBalls",
    abbr: "LB",
    label: "Long Balls Rank"
  },
  "total accurate long balls": {
    stat: "accurateLongBalls",
    abbr: "ALB",
    label: "Accurate Long Balls"
  },
  "total accurate long balls ranking": {
    stat: "accurateLongBalls",
    abbr: "ALB",
    label: "Accurate Long Balls Rank"
  },
  "total touches in opposition box": {
    stat: "touchesInBox",
    abbr: "TIB",
    label: "Touches In Box"
  },
  "total touches in opposition box ranking": {
    stat: "touchesInBox",
    abbr: "TIB",
    label: "Touches In Box Rank"
  },
  "total sub on": {
    stat: "substitutedOn",
    abbr: "ON",
    label: "Subbed On"
  },
  "total sub on ranking": {
    stat: "substitutedOn",
    abbr: "ON",
    label: "Subbed On Rank"
  },
  "total sub off": {
    stat: "substitutedOff",
    abbr: "OFF",
    label: "Subbed Off"
  },
  "total sub off ranking": {
    stat: "substitutedOff",
    abbr: "OFF",
    label: "Subbed Off Rank"
  },
  "total clean sheet": {
    stat: "cleanSheets",
    abbr: "CS",
    label: "Clean Sheets"
  },
  "total clean sheet ranking": {
    stat: "cleanSheets",
    abbr: "CS",
    label: "Clean Sheets Rank"
  },
  "total goals conceded": {
    stat: "goalsConceded",
    abbr: "GC",
    label: "Goals Conceded"
  },
  "total goals conceded ranking": {
    stat: "goalsConceded",
    abbr: "GC",
    label: "Goals Conceded Rank"
  },
  "total goals conceded ibox": {
    stat: "goalsConcededInBox",
    abbr: "GCIB",
    label: "Goals Conceded In Box"
  },
  "total goals conceded ibox ranking": {
    stat: "goalsConcededInBox",
    abbr: "GCIB",
    label: "Goals Conceded In Box Rank"
  },
  "total goals conceded obox": {
    stat: "goalsConcededOutBox",
    abbr: "GCOB",
    label: "Goals Conceded Out Box"
  },
  "total goals conceded obox ranking": {
    stat: "goalsConcededOutBox",
    abbr: "GCOB",
    label: "Goals Conceded Out Box Rank"
  },
  "total saves": {
    stat: "saves",
    abbr: "SV",
    label: "Saves"
  },
  "total saves ranking": {
    stat: "saves",
    abbr: "SV",
    label: "Saves Rank"
  },
  "total claim": {
    stat: "claims",
    abbr: "CLM",
    label: "Claims"
  },
  "total claim ranking": {
    stat: "claims",
    abbr: "CLM",
    label: "Claims Rank"
  },
  "total high claim": {
    stat: "highClaims",
    abbr: "HCL",
    label: "High Claims"
  },
  "total high claim ranking": {
    stat: "highClaims",
    abbr: "HCL",
    label: "High Claims Rank"
  },
  "total good high claim": {
    stat: "goodHighClaims",
    abbr: "GHCL",
    label: "Good High Claims"
  },
  "total good high claim ranking": {
    stat: "goodHighClaims",
    abbr: "GHCL",
    label: "Good High Claims Rank"
  },
  "total punches": {
    stat: "punches",
    abbr: "PCH",
    label: "Punches"
  },
  "total punches ranking": {
    stat: "punches",
    abbr: "PCH",
    label: "Punches Rank"
  },
  "total keeper throws": {
    stat: "keeperThrows",
    abbr: "KT",
    label: "Keeper Throws"
  },
  "total keeper throws ranking": {
    stat: "keeperThrows",
    abbr: "KT",
    label: "Keeper Throws Rank"
  },
  "total accurate keeper throws": {
    stat: "accurateKeeperThrows",
    abbr: "AKT",
    label: "Accurate Keeper Throws"
  },
  "total accurate keeper throws ranking": {
    stat: "accurateKeeperThrows",
    abbr: "AKT",
    label: "Accurate Keeper Throws Rank"
  },
  "total won corners": {
    stat: "cornersWon",
    abbr: "CW",
    label: "Corners Won"
  },
  "total won corners ranking": {
    stat: "cornersWon",
    abbr: "CW",
    label: "Corners Won Rank"
  },
  "total lost corners": {
    stat: "cornersLost",
    abbr: "CL",
    label: "Corners Lost"
  },
  "total lost corners ranking": {
    stat: "cornersLost",
    abbr: "CL",
    label: "Corners Lost Rank"
  },
  "total takeon": {
    stat: "takeOns",
    abbr: "TO",
    label: "Take-Ons"
  },
  "total takeon ranking": {
    stat: "takeOns",
    abbr: "TO",
    label: "Take-Ons Rank"
  },
  "total attempts conceded": {
    stat: "attemptsConceded",
    abbr: "AC",
    label: "Attempts Conceded"
  },
  "total attempts conceded ranking": {
    stat: "attemptsConceded",
    abbr: "AC",
    label: "Attempts Conceded Rank"
  },
  "total attempts conceded ibox": {
    stat: "attemptsConcededInBox",
    abbr: "ACIB",
    label: "Attempts Conceded In Box"
  },
  "total attempts conceded ibox ranking": {
    stat: "attemptsConcededInBox",
    abbr: "ACIB",
    label: "Attempts Conceded In Box Rank"
  },
  "total attempts conceded obox": {
    stat: "attemptsConcededOutBox",
    abbr: "ACOB",
    label: "Attempts Conceded Out Box"
  },
  "total attempts conceded obox ranking": {
    stat: "attemptsConcededOutBox",
    abbr: "ACOB",
    label: "Attempts Conceded Out Box Rank"
  },
  "total blocked scoring att": {
    stat: "shotsBlocked",
    abbr: "BLK",
    label: "Shots Blocked"
  },
  "total blocked scoring att ranking": {
    stat: "shotsBlocked",
    abbr: "BLK",
    label: "Shots Blocked Rank"
  },
  "total post scoring att": {
    stat: "shotsHitPost",
    abbr: "PST",
    label: "Shots Hit Post"
  },
  "total post scoring att ranking": {
    stat: "shotsHitPost",
    abbr: "PST",
    label: "Shots Hit Post Rank"
  },
  "total challenge lost": {
    stat: "challengesLost",
    abbr: "CHL",
    label: "Challenges Lost"
  },
  "total challenge lost ranking": {
    stat: "challengesLost",
    abbr: "CHL",
    label: "Challenges Lost Rank"
  },
  "total hand ball": {
    stat: "handballs",
    abbr: "HB",
    label: "Handballs"
  },
  "total hand ball ranking": {
    stat: "handballs",
    abbr: "HB",
    label: "Handballs Rank"
  },
  "total accurate back zone pass": {
    stat: "accurateBackZonePasses",
    abbr: "ABZ",
    label: "Accurate Back Zone Passes"
  },
  "total accurate back zone pass ranking": {
    stat: "accurateBackZonePasses",
    abbr: "ABZ",
    label: "Accurate Back Zone Passes Rank"
  },
  "total accurate fwd zone pass": {
    stat: "accurateFwdZonePasses",
    abbr: "AFZ",
    label: "Accurate Forward Zone Passes"
  },
  "total accurate fwd zone pass ranking": {
    stat: "accurateFwdZonePasses",
    abbr: "AFZ",
    label: "Accurate Forward Zone Passes Rank"
  },
  "total fwd zone pass": {
    stat: "fwdZonePasses",
    abbr: "FZ",
    label: "Forward Zone Passes"
  },
  "total fwd zone pass ranking": {
    stat: "fwdZonePasses",
    abbr: "FZ",
    label: "Forward Zone Passes Rank"
  },
  "total att assist": {
    stat: "attemptedAssists",
    abbr: "AA",
    label: "Attempted Assists"
  },
  "total att assist ranking": {
    stat: "attemptedAssists",
    abbr: "AA",
    label: "Attempted Assists Rank"
  },
  "total saved ibox": {
    stat: "savedInBox",
    abbr: "SIB",
    label: "Saved In Box"
  },
  "total saved ibox ranking": {
    stat: "savedInBox",
    abbr: "SIB",
    label: "Saved In Box Rank"
  },
  "total saved obox": {
    stat: "savedOutBox",
    abbr: "SOB",
    label: "Saved Out Box"
  },
  "total saved obox ranking": {
    stat: "savedOutBox",
    abbr: "SOB",
    label: "Saved Out Box Rank"
  },
  "total att pen goal": {
    stat: "penaltyGoals",
    abbr: "PG",
    label: "Penalty Goals"
  },
  "total att pen goal ranking": {
    stat: "penaltyGoals",
    abbr: "PG",
    label: "Penalty Goals Rank"
  },
  "total att pen miss": {
    stat: "penaltyMisses",
    abbr: "PM",
    label: "Penalty Misses"
  },
  "total att pen miss ranking": {
    stat: "penaltyMisses",
    abbr: "PM",
    label: "Penalty Misses Rank"
  },
  "total att pen target": {
    stat: "penaltiesOnTarget",
    abbr: "POT",
    label: "Penalties On Target"
  },
  "total att pen target ranking": {
    stat: "penaltiesOnTarget",
    abbr: "POT",
    label: "Penalties On Target Rank"
  },
  "total att freekick goal": {
    stat: "freekickGoals",
    abbr: "FKG",
    label: "Free Kick Goals"
  },
  "total att freekick goal ranking": {
    stat: "freekickGoals",
    abbr: "FKG",
    label: "Free Kick Goals Rank"
  },
  "total att freekick miss": {
    stat: "freekickMisses",
    abbr: "FKM",
    label: "Free Kick Misses"
  },
  "total att freekick miss ranking": {
    stat: "freekickMisses",
    abbr: "FKM",
    label: "Free Kick Misses Rank"
  },
  "total att freekick post": {
    stat: "freekickPost",
    abbr: "FKP",
    label: "Free Kick Post"
  },
  "total att freekick post ranking": {
    stat: "freekickPost",
    abbr: "FKP",
    label: "Free Kick Post Rank"
  },
  "total att freekick target": {
    stat: "freekicksOnTarget",
    abbr: "FKOT",
    label: "Free Kicks On Target"
  },
  "total att freekick target ranking": {
    stat: "freekicksOnTarget",
    abbr: "FKOT",
    label: "Free Kicks On Target Rank"
  },
  "total att freekick total": {
    stat: "freekickAttempts",
    abbr: "FKA",
    label: "Free Kick Attempts"
  },
  "total att freekick total ranking": {
    stat: "freekickAttempts",
    abbr: "FKA",
    label: "Free Kick Attempts Rank"
  },
  "total att ibox goal": {
    stat: "goalsInBox",
    abbr: "GIB",
    label: "Goals In Box"
  },
  "total att ibox goal ranking": {
    stat: "goalsInBox",
    abbr: "GIB",
    label: "Goals In Box Rank"
  },
  "total att obox goal": {
    stat: "goalsOutBox",
    abbr: "GOB",
    label: "Goals Out Box"
  },
  "total att obox goal ranking": {
    stat: "goalsOutBox",
    abbr: "GOB",
    label: "Goals Out Box Rank"
  },
  "total att corner goal": {
    stat: "cornerGoals",
    abbr: "CG",
    label: "Corner Goals"
  },
  "total att corner goal ranking": {
    stat: "cornerGoals",
    abbr: "CG",
    label: "Corner Goals Rank"
  },
  "total att throw goal": {
    stat: "throwInGoals",
    abbr: "TG",
    label: "Throw-In Goals"
  },
  "total att throw goal ranking": {
    stat: "throwInGoals",
    abbr: "TG",
    label: "Throw-In Goals Rank"
  },
  "total att lg left": {
    stat: "attemptsLeftFoot",
    abbr: "LF",
    label: "Left Foot Attempts"
  },
  "total att lg left ranking": {
    stat: "attemptsLeftFoot",
    abbr: "LF",
    label: "Left Foot Attempts Rank"
  },
  "total att lg right": {
    stat: "attemptsRightFoot",
    abbr: "RF",
    label: "Right Foot Attempts"
  },
  "total att lg right ranking": {
    stat: "attemptsRightFoot",
    abbr: "RF",
    label: "Right Foot Attempts Rank"
  },
  "total att obx left": {
    stat: "outBoxLeftFoot",
    abbr: "OBL",
    label: "Out Box Left Foot"
  },
  "total att obx left ranking": {
    stat: "outBoxLeftFoot",
    abbr: "OBL",
    label: "Out Box Left Foot Rank"
  },
  "total att obx right": {
    stat: "outBoxRightFoot",
    abbr: "OBR",
    label: "Out Box Right Foot"
  },
  "total att obx right ranking": {
    stat: "outBoxRightFoot",
    abbr: "OBR",
    label: "Out Box Right Foot Rank"
  },
  "total att obxd left": {
    stat: "outBoxDLeftFoot",
    abbr: "OBDL",
    label: "Out Box D Left Foot"
  },
  "total att obxd left ranking": {
    stat: "outBoxDLeftFoot",
    abbr: "OBDL",
    label: "Out Box D Left Foot Rank"
  },
  "total att obxd right": {
    stat: "outBoxDRightFoot",
    abbr: "OBDR",
    label: "Out Box D Right Foot"
  },
  "total att obxd right ranking": {
    stat: "outBoxDRightFoot",
    abbr: "OBDR",
    label: "Out Box D Right Foot Rank"
  },
  "first name": {
    stat: "firstName",
    abbr: "FN",
    label: "First Name"
  },
  "last name": {
    stat: "lastName",
    abbr: "LN",
    label: "Last Name"
  }
} as const;

export type F15StatType = keyof typeof F15_STAT_TYPES;

export function getStatMetadata(statType: string): StatMetadata | undefined {
  return F15_STAT_TYPES[statType];
}

export function isRankingStat(statType: string): boolean {
  return statType.endsWith(" ranking");
}

export function getBaseStatType(statType: string): string {
  return statType.replace(" ranking", "");
}

