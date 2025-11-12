export interface StatMetadata {
  stat: string;
  abbr: string;
  label: string;
  category?: 'attacking' | 'defending' | 'passing' | 'goalkeeping' | 'discipline' | 'general';
}

export const F30_STAT_TYPES: Record<string, StatMetadata> = {
  "Goals": {
    stat: "goals",
    abbr: "G",
    label: "Goals",
    category: "attacking"
  },
  "Goal Assists": {
    stat: "goalAssists",
    abbr: "A",
    label: "Assists",
    category: "attacking"
  },
  "Assists (Intentional)": {
    stat: "intentionalAssists",
    abbr: "IA",
    label: "Intentional Assists",
    category: "attacking"
  },
  "Second Goal Assists": {
    stat: "secondAssists",
    abbr: "2A",
    label: "Second Assists",
    category: "attacking"
  },
  "Games Played": {
    stat: "gamesPlayed",
    abbr: "GP",
    label: "Games Played",
    category: "general"
  },
  "Appearances": {
    stat: "appearances",
    abbr: "APP",
    label: "Appearances",
    category: "general"
  },
  "Starts": {
    stat: "starts",
    abbr: "ST",
    label: "Starts",
    category: "general"
  },
  "Substitute On": {
    stat: "substituteOn",
    abbr: "SUB",
    label: "Subbed On",
    category: "general"
  },
  "Substitute Off": {
    stat: "substituteOff",
    abbr: "OFF",
    label: "Subbed Off",
    category: "general"
  },
  "Time Played": {
    stat: "timePlayed",
    abbr: "MIN",
    label: "Minutes Played",
    category: "general"
  },
  "Yellow Cards": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards",
    category: "discipline"
  },
  "Total Red Cards": {
    stat: "totalRedCards",
    abbr: "RC",
    label: "Red Cards",
    category: "discipline"
  },
  "Straight Red Cards": {
    stat: "straightRedCards",
    abbr: "SRC",
    label: "Straight Red Cards",
    category: "discipline"
  },
  "Total Shots": {
    stat: "totalShots",
    abbr: "SH",
    label: "Shots",
    category: "attacking"
  },
  "Shots On Target ( inc goals )": {
    stat: "shotsOnTarget",
    abbr: "S",
    label: "Shots On Target",
    category: "attacking"
  },
  "Shots Off Target (inc woodwork)": {
    stat: "shotsOffTarget",
    abbr: "SOFF",
    label: "Shots Off Target",
    category: "attacking"
  },
  "Shooting Accuracy": {
    stat: "shootingAccuracy",
    abbr: "SH%",
    label: "Shooting Accuracy %",
    category: "attacking"
  },
  "Hit Woodwork": {
    stat: "hitWoodwork",
    abbr: "WOOD",
    label: "Hit Woodwork",
    category: "attacking"
  },
  "Blocked Shots": {
    stat: "blockedShots",
    abbr: "BLK",
    label: "Blocked Shots",
    category: "attacking"
  },
  "Goals from Inside Box": {
    stat: "goalsInsideBox",
    abbr: "GIB",
    label: "Goals Inside Box",
    category: "attacking"
  },
  "Goals from Outside Box": {
    stat: "goalsOutsideBox",
    abbr: "GOB",
    label: "Goals Outside Box",
    category: "attacking"
  },
  "Left Foot Goals": {
    stat: "leftFootGoals",
    abbr: "LFG",
    label: "Left Foot Goals",
    category: "attacking"
  },
  "Right Foot Goals": {
    stat: "rightFootGoals",
    abbr: "RFG",
    label: "Right Foot Goals",
    category: "attacking"
  },
  "Headed Goals": {
    stat: "headedGoals",
    abbr: "HG",
    label: "Headed Goals",
    category: "attacking"
  },
  "Penalty Goals": {
    stat: "penaltyGoals",
    abbr: "PG",
    label: "Penalty Goals",
    category: "attacking"
  },
  "Penalties Taken": {
    stat: "penaltiesTaken",
    abbr: "PT",
    label: "Penalties Taken",
    category: "attacking"
  },
  "Goal Conversion": {
    stat: "goalConversion",
    abbr: "CNV%",
    label: "Goal Conversion %",
    category: "attacking"
  },
  "Home Goals": {
    stat: "homeGoals",
    abbr: "HG",
    label: "Home Goals",
    category: "attacking"
  },
  "Away Goals": {
    stat: "awayGoals",
    abbr: "AG",
    label: "Away Goals",
    category: "attacking"
  },
  "Winning Goal": {
    stat: "winningGoals",
    abbr: "WG",
    label: "Winning Goals",
    category: "attacking"
  },
  "Own Goal Scored": {
    stat: "ownGoals",
    abbr: "OG",
    label: "Own Goals",
    category: "general"
  },
  "Attempts from Set Pieces": {
    stat: "setPieceAttempts",
    abbr: "SPA",
    label: "Set Piece Attempts",
    category: "attacking"
  },
  "Total Passes": {
    stat: "totalPasses",
    abbr: "P",
    label: "Passes",
    category: "passing"
  },
  "Passing Accuracy": {
    stat: "passingAccuracy",
    abbr: "P%",
    label: "Pass Accuracy %",
    category: "passing"
  },
  "Total Successful Passes ( Excl Crosses & Corners ) ": {
    stat: "successfulPasses",
    abbr: "SP",
    label: "Successful Passes",
    category: "passing"
  },
  "Total Unsuccessful Passes ( Excl Crosses & Corners )": {
    stat: "unsuccessfulPasses",
    abbr: "UP",
    label: "Unsuccessful Passes",
    category: "passing"
  },
  "Open Play Passes": {
    stat: "openPlayPasses",
    abbr: "OPP",
    label: "Open Play Passes",
    category: "passing"
  },
  "Successful Open Play Passes": {
    stat: "successfulOpenPlayPasses",
    abbr: "SOPP",
    label: "Successful Open Play Passes",
    category: "passing"
  },
  "Successful Short Passes": {
    stat: "successfulShortPasses",
    abbr: "SSP",
    label: "Short Passes",
    category: "passing"
  },
  "Unsuccessful Short Passes": {
    stat: "unsuccessfulShortPasses",
    abbr: "USP",
    label: "Unsuccessful Short Passes",
    category: "passing"
  },
  "Successful Long Passes": {
    stat: "successfulLongPasses",
    abbr: "SLP",
    label: "Long Passes",
    category: "passing"
  },
  "Unsuccessful Long Passes": {
    stat: "unsuccessfulLongPasses",
    abbr: "ULP",
    label: "Unsuccessful Long Passes",
    category: "passing"
  },
  "Successful Passes Own Half": {
    stat: "successfulPassesOwnHalf",
    abbr: "SPOH",
    label: "Passes Own Half",
    category: "passing"
  },
  "Unsuccessful Passes Own Half": {
    stat: "unsuccessfulPassesOwnHalf",
    abbr: "UPOH",
    label: "Unsuccessful Passes Own Half",
    category: "passing"
  },
  "Successful Passes Opposition Half": {
    stat: "successfulPassesOppHalf",
    abbr: "SPAH",
    label: "Passes Opp Half",
    category: "passing"
  },
  "Unsuccessful Passes Opposition Half": {
    stat: "unsuccessfulPassesOppHalf",
    abbr: "UPAH",
    label: "Unsuccessful Passes Opp Half",
    category: "passing"
  },
  "Passing % Opp Half": {
    stat: "passingAccuracyOppHalf",
    abbr: "P%AH",
    label: "Pass % Opp Half",
    category: "passing"
  },
  "Forward Passes": {
    stat: "forwardPasses",
    abbr: "FP",
    label: "Forward Passes",
    category: "passing"
  },
  "Backward Passes": {
    stat: "backwardPasses",
    abbr: "BP",
    label: "Backward Passes",
    category: "passing"
  },
  "Leftside Passes": {
    stat: "leftsidePasses",
    abbr: "LP",
    label: "Left Side Passes",
    category: "passing"
  },
  "Rightside Passes": {
    stat: "rightsidePasses",
    abbr: "RP",
    label: "Right Side Passes",
    category: "passing"
  },
  "Key Passes (Attempt Assists)": {
    stat: "keyPasses",
    abbr: "KP",
    label: "Key Passes",
    category: "passing"
  },
  "Successful Launches": {
    stat: "successfulLaunches",
    abbr: "SL",
    label: "Successful Launches",
    category: "passing"
  },
  "Unsuccessful Launches": {
    stat: "unsuccessfulLaunches",
    abbr: "UL",
    label: "Unsuccessful Launches",
    category: "passing"
  },
  "Successful Lay-offs": {
    stat: "successfulLayoffs",
    abbr: "SLO",
    label: "Successful Lay-offs",
    category: "passing"
  },
  "Unsuccessful lay-offs": {
    stat: "unsuccessfulLayoffs",
    abbr: "ULO",
    label: "Unsuccessful Lay-offs",
    category: "passing"
  },
  "Through balls": {
    stat: "throughBalls",
    abbr: "TB",
    label: "Through Balls",
    category: "passing"
  },
  "Successful Crosses & Corners": {
    stat: "successfulCrossesCorners",
    abbr: "SCC",
    label: "Crosses & Corners",
    category: "passing"
  },
  "Unsuccessful Crosses & Corners": {
    stat: "unsuccessfulCrossesCorners",
    abbr: "UCC",
    label: "Unsuccessful Crosses & Corners",
    category: "passing"
  },
  "Successful Crosses open play": {
    stat: "successfulCrosses",
    abbr: "SC",
    label: "Successful Crosses",
    category: "passing"
  },
  "Unsuccessful Crosses open play": {
    stat: "unsuccessfulCrosses",
    abbr: "UC",
    label: "Unsuccessful Crosses",
    category: "passing"
  },
  "Crossing Accuracy": {
    stat: "crossingAccuracy",
    abbr: "CR%",
    label: "Crossing Accuracy %",
    category: "passing"
  },
  "Corners Won": {
    stat: "cornersWon",
    abbr: "CW",
    label: "Corners Won",
    category: "attacking"
  },
  "Corners Taken (incl short corners)": {
    stat: "cornersTaken",
    abbr: "CT",
    label: "Corners Taken",
    category: "passing"
  },
  "Successful Corners into Box": {
    stat: "successfulCornersIntoBox",
    abbr: "SCIB",
    label: "Corners Into Box",
    category: "passing"
  },
  "Unsuccessful Corners into Box": {
    stat: "unsuccessfulCornersIntoBox",
    abbr: "UCIB",
    label: "Unsuccessful Corners Into Box",
    category: "passing"
  },
  "Tackles Won": {
    stat: "tacklesWon",
    abbr: "TW",
    label: "Tackles Won",
    category: "defending"
  },
  "Tackles Lost": {
    stat: "tacklesLost",
    abbr: "TL",
    label: "Tackles Lost",
    category: "defending"
  },
  "Total Tackles": {
    stat: "totalTackles",
    abbr: "T",
    label: "Tackles",
    category: "defending"
  },
  "Tackle Success": {
    stat: "tackleSuccess",
    abbr: "T%",
    label: "Tackle Success %",
    category: "defending"
  },
  "Foul Attempted Tackle": {
    stat: "foulAttemptedTackle",
    abbr: "FAT",
    label: "Foul Attempted Tackles",
    category: "defending"
  },
  "Last Man Tackle": {
    stat: "lastManTackle",
    abbr: "LMT",
    label: "Last Man Tackles",
    category: "defending"
  },
  "Times Tackled": {
    stat: "timesTackled",
    abbr: "TT",
    label: "Times Tackled",
    category: "general"
  },
  "Interceptions": {
    stat: "interceptions",
    abbr: "INT",
    label: "Interceptions",
    category: "defending"
  },
  "Total Clearances": {
    stat: "totalClearances",
    abbr: "CL",
    label: "Clearances",
    category: "defending"
  },
  "Clearances Off the Line": {
    stat: "clearancesOffLine",
    abbr: "CLO",
    label: "Clearances Off Line",
    category: "defending"
  },
  "Blocks": {
    stat: "blocks",
    abbr: "BLK",
    label: "Blocks",
    category: "defending"
  },
  "Recoveries": {
    stat: "recoveries",
    abbr: "REC",
    label: "Recoveries",
    category: "defending"
  },
  "Duels": {
    stat: "duels",
    abbr: "D",
    label: "Duels",
    category: "general"
  },
  "Duels won": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won",
    category: "general"
  },
  "Duels lost": {
    stat: "duelsLost",
    abbr: "DL",
    label: "Duels Lost",
    category: "general"
  },
  "Ground Duels": {
    stat: "groundDuels",
    abbr: "GD",
    label: "Ground Duels",
    category: "general"
  },
  "Ground Duels won": {
    stat: "groundDuelsWon",
    abbr: "GDW",
    label: "Ground Duels Won",
    category: "general"
  },
  "Ground Duels lost": {
    stat: "groundDuelsLost",
    abbr: "GDL",
    label: "Ground Duels Lost",
    category: "general"
  },
  "Aerial Duels": {
    stat: "aerialDuels",
    abbr: "AD",
    label: "Aerial Duels",
    category: "general"
  },
  "Aerial Duels won": {
    stat: "aerialDuelsWon",
    abbr: "ADW",
    label: "Aerial Duels Won",
    category: "general"
  },
  "Aerial Duels lost": {
    stat: "aerialDuelsLost",
    abbr: "ADL",
    label: "Aerial Duels Lost",
    category: "general"
  },
  "Fifty Fifty": {
    stat: "fiftyFifty",
    abbr: "50/50",
    label: "50/50s",
    category: "general"
  },
  "Successful Fifty Fifty": {
    stat: "successfulFiftyFifty",
    abbr: "S50",
    label: "Successful 50/50s",
    category: "general"
  },
  "Successful Dribbles": {
    stat: "successfulDribbles",
    abbr: "SD",
    label: "Successful Dribbles",
    category: "attacking"
  },
  "Unsuccessful Dribbles": {
    stat: "unsuccessfulDribbles",
    abbr: "UD",
    label: "Unsuccessful Dribbles",
    category: "attacking"
  },
  "Total Fouls Won": {
    stat: "totalFoulsWon",
    abbr: "FW",
    label: "Fouls Won",
    category: "discipline"
  },
  "Total Fouls Conceded": {
    stat: "totalFoulsConceded",
    abbr: "FC",
    label: "Fouls Conceded",
    category: "discipline"
  },
  "Foul Won Penalty": {
    stat: "foulWonPenalty",
    abbr: "FWP",
    label: "Penalties Won",
    category: "discipline"
  },
  "Penalties Conceded": {
    stat: "penaltiesConceded",
    abbr: "PC",
    label: "Penalties Conceded",
    category: "discipline"
  },
  "Offsides": {
    stat: "offsides",
    abbr: "OFF",
    label: "Offsides",
    category: "attacking"
  },
  "Touches": {
    stat: "touches",
    abbr: "TCH",
    label: "Touches",
    category: "general"
  },
  "Total Touches In Opposition Box": {
    stat: "touchesInBox",
    abbr: "TIB",
    label: "Touches In Box",
    category: "attacking"
  },
  "Total Losses Of Possession": {
    stat: "lossesOfPossession",
    abbr: "LOP",
    label: "Losses Of Possession",
    category: "general"
  },
  "Possession Percentage": {
    stat: "possessionPercentage",
    abbr: "POSS%",
    label: "Possession %",
    category: "general"
  },
  "PutThrough/Blocked Distribution": {
    stat: "blockedDistribution",
    abbr: "BD",
    label: "Blocked Distribution",
    category: "general"
  },
  "PutThrough/Blocked Distribution Won": {
    stat: "blockedDistributionWon",
    abbr: "BDW",
    label: "Blocked Distribution Won",
    category: "general"
  },
  "Throw Ins to Own Player": {
    stat: "throwInsToOwn",
    abbr: "TIOP",
    label: "Throw Ins To Own",
    category: "passing"
  },
  "Throw Ins to Opposition Player": {
    stat: "throwInsToOpp",
    abbr: "TIOPP",
    label: "Throw Ins To Opp",
    category: "passing"
  },
  "Handballs conceded": {
    stat: "handballs",
    abbr: "HB",
    label: "Handballs",
    category: "discipline"
  },
  "Index": {
    stat: "index",
    abbr: "IDX",
    label: "Index",
    category: "general"
  },
  "Goals Conceded": {
    stat: "goalsConceded",
    abbr: "GA",
    label: "Goals Conceded",
    category: "defending"
  },
  "Goals Conceded Inside Box": {
    stat: "goalsConcededInsideBox",
    abbr: "GCIB",
    label: "Goals Conceded Inside Box",
    category: "defending"
  },
  "Goals Conceded Outside Box": {
    stat: "goalsConcededOutsideBox",
    abbr: "GCOB",
    label: "Goals Conceded Outside Box",
    category: "defending"
  },
  "Penalty Goals Conceded": {
    stat: "penaltyGoalsConceded",
    abbr: "PGC",
    label: "Penalty Goals Conceded",
    category: "defending"
  },
  "Own Goals Conceded": {
    stat: "ownGoalsConceded",
    abbr: "OGC",
    label: "Own Goals Conceded",
    category: "defending"
  },
  "Shots On Conceded Inside Box": {
    stat: "shotsOnConcededInsideBox",
    abbr: "SOCIB",
    label: "Shots On Conceded In Box",
    category: "defending"
  },
  "Shots On Conceded Outside Box": {
    stat: "shotsOnConcededOutsideBox",
    abbr: "SOCOB",
    label: "Shots On Conceded Out Box",
    category: "defending"
  },
  "Total Shots Conceded": {
    stat: "totalShotsConceded",
    abbr: "SA",
    label: "Shots Against",
    category: "defending"
  },
  "Clean Sheets": {
    stat: "cleanSheets",
    abbr: "CS",
    label: "Clean Sheets",
    category: "defending"
  },
  "GK Successful Distribution": {
    stat: "gkSuccessfulDistribution",
    abbr: "GSD",
    label: "GK Successful Distribution",
    category: "goalkeeping"
  },
  "GK Unsuccessful Distribution": {
    stat: "gkUnsuccessfulDistribution",
    abbr: "GUD",
    label: "GK Unsuccessful Distribution",
    category: "goalkeeping"
  },
  "Saves Made": {
    stat: "savesMade",
    abbr: "SV",
    label: "Saves",
    category: "goalkeeping"
  },
  "Saves Made from Inside Box": {
    stat: "savesMadeInsideBox",
    abbr: "SVIB",
    label: "Saves Inside Box",
    category: "goalkeeping"
  },
  "Saves Made from Outside Box": {
    stat: "savesMadeOutsideBox",
    abbr: "SVOB",
    label: "Saves Outside Box",
    category: "goalkeeping"
  },
  "Saves made - parried": {
    stat: "savesParried",
    abbr: "SVP",
    label: "Saves Parried",
    category: "goalkeeping"
  },
  "Saves made - caught": {
    stat: "savesCaught",
    abbr: "SVC",
    label: "Saves Caught",
    category: "goalkeeping"
  },
  "Saves from Penalty": {
    stat: "savesFromPenalty",
    abbr: "SVP",
    label: "Penalty Saves",
    category: "goalkeeping"
  },
  "Penalties Saved": {
    stat: "penaltiesSaved",
    abbr: "PS",
    label: "Penalties Saved",
    category: "goalkeeping"
  },
  "Penalties Faced": {
    stat: "penaltiesFaced",
    abbr: "PF",
    label: "Penalties Faced",
    category: "goalkeeping"
  },
  "Catches": {
    stat: "catches",
    abbr: "CAT",
    label: "Catches",
    category: "goalkeeping"
  },
  "Punches": {
    stat: "punches",
    abbr: "PCH",
    label: "Punches",
    category: "goalkeeping"
  },
  "Drops": {
    stat: "drops",
    abbr: "DRP",
    label: "Drops",
    category: "goalkeeping"
  },
  "Goalkeeper Smother": {
    stat: "goalkeeperSmother",
    abbr: "GKS",
    label: "Goalkeeper Smothers",
    category: "goalkeeping"
  },
  "Points Dropped from Winning Positions": {
    stat: "pointsDropped",
    abbr: "PD",
    label: "Points Dropped",
    category: "general"
  },
  "Points Gained from Losing Positions": {
    stat: "pointsGained",
    abbr: "PG",
    label: "Points Gained",
    category: "general"
  }
} as const;

export type F30StatType = keyof typeof F30_STAT_TYPES;

export function getF30StatMetadata(statName: string): StatMetadata | undefined {
  return F30_STAT_TYPES[statName];
}

export function getF30StatAbbr(statName: string): string {
  return F30_STAT_TYPES[statName]?.abbr || statName;
}

export function getF30StatLabel(statName: string): string {
  return F30_STAT_TYPES[statName]?.label || statName;
}

export function getF30StatsByCategory(category: StatMetadata['category']): Record<string, StatMetadata> {
  return Object.entries(F30_STAT_TYPES)
    .filter(([, meta]) => meta.category === category)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export const F30_STAT_CATEGORIES = {
  attacking: 'Attacking',
  defending: 'Defending',
  passing: 'Passing',
  goalkeeping: 'Goalkeeping',
  discipline: 'Discipline',
  general: 'General'
} as const;

