export interface StatMetadata {
  stat: string;
  abbr: string;
  label: string;
  category?: 'attacking' | 'defending' | 'passing' | 'goalkeeping' | 'discipline' | 'general';
  f30Key?: string;
  f15Key?: string;
  f9Key?: string;
}

const F30_STATS: Record<string, Omit<StatMetadata, 'f30Key' | 'f15Key' | 'f9Key'>> = {
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
    abbr: "TK",
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
};

const F15_STATS: Record<string, Omit<StatMetadata, 'f30Key' | 'f15Key' | 'f9Key' | 'category'>> = {
  "total goals": {
    stat: "goals",
    abbr: "G",
    label: "Goals"
  },
  "total assists": {
    stat: "assists",
    abbr: "A",
    label: "Assists"
  },
  "total mins played": {
    stat: "minutes",
    abbr: "MIN",
    label: "Minutes Played"
  },
  "total games": {
    stat: "games",
    abbr: "GP",
    label: "Games Played"
  },
  "total pass": {
    stat: "passes",
    abbr: "P",
    label: "Passes"
  },
  "total accurate pass": {
    stat: "accuratePasses",
    abbr: "AP",
    label: "Accurate Passes"
  },
  "total pass pct": {
    stat: "passAccuracy",
    abbr: "P%",
    label: "Pass Accuracy %"
  },
  "total tackle": {
    stat: "tackles",
    abbr: "T",
    label: "Tackles"
  },
  "total won tackle": {
    stat: "tacklesWon",
    abbr: "TW",
    label: "Tackles Won"
  },
  "total tackle pct": {
    stat: "tackleSuccess",
    abbr: "T%",
    label: "Tackle Success %"
  },
  "total scoring att": {
    stat: "shots",
    abbr: "SH",
    label: "Shots"
  },
  "total ontarget scoring att": {
    stat: "shotsOnTarget",
    abbr: "SOT",
    label: "Shots On Target"
  },
  "total scoring accuracy": {
    stat: "shotAccuracy",
    abbr: "SH%",
    label: "Shot Accuracy %"
  },
  "total goal conversion": {
    stat: "conversionRate",
    abbr: "CNV%",
    label: "Conversion Rate %"
  },
  "total attempt": {
    stat: "attempts",
    abbr: "ATT",
    label: "Attempts"
  },
  "total ontarget attempt": {
    stat: "attemptsOnTarget",
    abbr: "AOTT",
    label: "Attempts On Target"
  },
  "total attempts ibox": {
    stat: "shotsInsideBox",
    abbr: "SIB",
    label: "Shots Inside Box"
  },
  "total attempts obox": {
    stat: "shotsOutsideBox",
    abbr: "SOB",
    label: "Shots Outside Box"
  },
  "total yellow card": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards"
  },
  "total red card": {
    stat: "redCards",
    abbr: "RC",
    label: "Red Cards"
  },
  "total card": {
    stat: "cards",
    abbr: "C",
    label: "Cards"
  },
  "total second yellow": {
    stat: "secondYellow",
    abbr: "2Y",
    label: "Second Yellow"
  },
  "total fouls": {
    stat: "fouls",
    abbr: "F",
    label: "Fouls"
  },
  "total was fouled": {
    stat: "fouled",
    abbr: "FD",
    label: "Fouled"
  },
  "total offside": {
    stat: "offsides",
    abbr: "OFF",
    label: "Offsides"
  },
  "total clearance": {
    stat: "clearances",
    abbr: "CL",
    label: "Clearances"
  },
  "total effective clearance": {
    stat: "effectiveClearances",
    abbr: "ECL",
    label: "Effective Clearances"
  },
  "total interception": {
    stat: "interceptions",
    abbr: "INT",
    label: "Interceptions"
  },
  "total duels won": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won"
  },
  "total duels lost": {
    stat: "duelsLost",
    abbr: "DL",
    label: "Duels Lost"
  },
  "total aerial won": {
    stat: "aerialsWon",
    abbr: "AW",
    label: "Aerials Won"
  },
  "total aerial lost": {
    stat: "aerialsLost",
    abbr: "AL",
    label: "Aerials Lost"
  },
  "total contest": {
    stat: "contests",
    abbr: "CON",
    label: "Contests"
  },
  "total won contest": {
    stat: "contestsWon",
    abbr: "CW",
    label: "Contests Won"
  },
  "total crosses": {
    stat: "crosses",
    abbr: "CR",
    label: "Crosses"
  },
  "total accurate cross": {
    stat: "accurateCrosses",
    abbr: "ACR",
    label: "Accurate Crosses"
  },
  "total cross pct": {
    stat: "crossAccuracy",
    abbr: "CR%",
    label: "Cross Accuracy %"
  },
  "total long balls": {
    stat: "longBalls",
    abbr: "LB",
    label: "Long Balls"
  },
  "total accurate long balls": {
    stat: "accurateLongBalls",
    abbr: "ALB",
    label: "Accurate Long Balls"
  },
  "total touches in opposition box": {
    stat: "touchesInBox",
    abbr: "TIB",
    label: "Touches In Box"
  },
  "total sub on": {
    stat: "substitutedOn",
    abbr: "ON",
    label: "Subbed On"
  },
  "total sub off": {
    stat: "substitutedOff",
    abbr: "OFF",
    label: "Subbed Off"
  },
  "total clean sheet": {
    stat: "cleanSheets",
    abbr: "CS",
    label: "Clean Sheets"
  },
  "total goals conceded": {
    stat: "goalsConceded",
    abbr: "GC",
    label: "Goals Conceded"
  },
  "total goals conceded ibox": {
    stat: "goalsConcededInBox",
    abbr: "GCIB",
    label: "Goals Conceded In Box"
  },
  "total goals conceded obox": {
    stat: "goalsConcededOutBox",
    abbr: "GCOB",
    label: "Goals Conceded Out Box"
  },
  "total saves": {
    stat: "saves",
    abbr: "SV",
    label: "Saves"
  },
  "total claim": {
    stat: "claims",
    abbr: "CLM",
    label: "Claims"
  },
  "total high claim": {
    stat: "highClaims",
    abbr: "HCL",
    label: "High Claims"
  },
  "total good high claim": {
    stat: "goodHighClaims",
    abbr: "GHCL",
    label: "Good High Claims"
  },
  "total punches": {
    stat: "punches",
    abbr: "PCH",
    label: "Punches"
  },
  "total keeper throws": {
    stat: "keeperThrows",
    abbr: "KT",
    label: "Keeper Throws"
  },
  "total accurate keeper throws": {
    stat: "accurateKeeperThrows",
    abbr: "AKT",
    label: "Accurate Keeper Throws"
  },
  "total won corners": {
    stat: "cornersWon",
    abbr: "CW",
    label: "Corners Won"
  },
  "total lost corners": {
    stat: "cornersLost",
    abbr: "CL",
    label: "Corners Lost"
  },
  "total takeon": {
    stat: "takeOns",
    abbr: "TO",
    label: "Take-Ons"
  },
  "total attempts conceded": {
    stat: "attemptsConceded",
    abbr: "AC",
    label: "Attempts Conceded"
  },
  "total attempts conceded ibox": {
    stat: "attemptsConcededInBox",
    abbr: "ACIB",
    label: "Attempts Conceded In Box"
  },
  "total attempts conceded obox": {
    stat: "attemptsConcededOutBox",
    abbr: "ACOB",
    label: "Attempts Conceded Out Box"
  },
  "total blocked scoring att": {
    stat: "shotsBlocked",
    abbr: "BLK",
    label: "Shots Blocked"
  },
  "total post scoring att": {
    stat: "shotsHitPost",
    abbr: "PST",
    label: "Shots Hit Post"
  },
  "total challenge lost": {
    stat: "challengesLost",
    abbr: "CHL",
    label: "Challenges Lost"
  },
  "total hand ball": {
    stat: "handballs",
    abbr: "HB",
    label: "Handballs"
  },
  "total accurate back zone pass": {
    stat: "accurateBackZonePasses",
    abbr: "ABZ",
    label: "Accurate Back Zone Passes"
  },
  "total accurate fwd zone pass": {
    stat: "accurateFwdZonePasses",
    abbr: "AFZ",
    label: "Accurate Forward Zone Passes"
  },
  "total fwd zone pass": {
    stat: "fwdZonePasses",
    abbr: "FZ",
    label: "Forward Zone Passes"
  },
  "total att assist": {
    stat: "attemptedAssists",
    abbr: "AA",
    label: "Attempted Assists"
  },
  "total saved ibox": {
    stat: "savedInBox",
    abbr: "SIB",
    label: "Saved In Box"
  },
  "total saved obox": {
    stat: "savedOutBox",
    abbr: "SOB",
    label: "Saved Out Box"
  },
  "total att pen goal": {
    stat: "penaltyGoals",
    abbr: "PG",
    label: "Penalty Goals"
  },
  "total att pen miss": {
    stat: "penaltyMisses",
    abbr: "PM",
    label: "Penalty Misses"
  },
  "total att pen target": {
    stat: "penaltiesOnTarget",
    abbr: "POT",
    label: "Penalties On Target"
  },
  "total att freekick goal": {
    stat: "freekickGoals",
    abbr: "FKG",
    label: "Free Kick Goals"
  },
  "total att freekick miss": {
    stat: "freekickMisses",
    abbr: "FKM",
    label: "Free Kick Misses"
  },
  "total att freekick post": {
    stat: "freekickPost",
    abbr: "FKP",
    label: "Free Kick Post"
  },
  "total att freekick target": {
    stat: "freekicksOnTarget",
    abbr: "FKOT",
    label: "Free Kicks On Target"
  },
  "total att freekick total": {
    stat: "freekickAttempts",
    abbr: "FKA",
    label: "Free Kick Attempts"
  },
  "total att ibox goal": {
    stat: "goalsInBox",
    abbr: "GIB",
    label: "Goals In Box"
  },
  "total att obox goal": {
    stat: "goalsOutBox",
    abbr: "GOB",
    label: "Goals Out Box"
  },
  "total att corner goal": {
    stat: "cornerGoals",
    abbr: "CG",
    label: "Corner Goals"
  },
  "total att throw goal": {
    stat: "throwInGoals",
    abbr: "TG",
    label: "Throw-In Goals"
  },
  "total att lg left": {
    stat: "attemptsLeftFoot",
    abbr: "LF",
    label: "Left Foot Attempts"
  },
  "total att lg right": {
    stat: "attemptsRightFoot",
    abbr: "RF",
    label: "Right Foot Attempts"
  },
  "total att obx left": {
    stat: "outBoxLeftFoot",
    abbr: "OBL",
    label: "Out Box Left Foot"
  },
  "total att obx right": {
    stat: "outBoxRightFoot",
    abbr: "OBR",
    label: "Out Box Right Foot"
  },
  "total att obxd left": {
    stat: "outBoxDLeftFoot",
    abbr: "OBDL",
    label: "Out Box D Left Foot"
  },
  "total att obxd right": {
    stat: "outBoxDRightFoot",
    abbr: "OBDR",
    label: "Out Box D Right Foot"
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
};

const F9_STATS: Record<string, Omit<StatMetadata, 'f30Key' | 'f15Key' | 'f9Key' | 'category'>> = {
  "goals": {
    stat: "goals",
    abbr: "G",
    label: "Goals"
  },
  "goal_assist": {
    stat: "goalAssists",
    abbr: "A",
    label: "Assists"
  },
  "goal_assist_intentional": {
    stat: "intentionalAssists",
    abbr: "IA",
    label: "Intentional Assists"
  },
  "second_goal_assist": {
    stat: "secondAssists",
    abbr: "2A",
    label: "Second Assists"
  },
  "mins_played": {
    stat: "timePlayed",
    abbr: "MIN",
    label: "Minutes Played"
  },
  "game_started": {
    stat: "starts",
    abbr: "ST",
    label: "Starts"
  },
  "total_sub_on": {
    stat: "substituteOn",
    abbr: "SUB",
    label: "Subbed On"
  },
  "total_sub_off": {
    stat: "substituteOff",
    abbr: "OFF",
    label: "Subbed Off"
  },
  "yellow_card": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards"
  },
  "total_yel_card": {
    stat: "yellowCards",
    abbr: "YC",
    label: "Yellow Cards"
  },
  "red_card": {
    stat: "totalRedCards",
    abbr: "RC",
    label: "Red Cards"
  },
  "total_red_card": {
    stat: "totalRedCards",
    abbr: "RC",
    label: "Red Cards"
  },
  "second_yellow": {
    stat: "secondYellow",
    abbr: "2Y",
    label: "Second Yellow"
  },
  "total_scoring_att": {
    stat: "totalShots",
    abbr: "SH",
    label: "Shots"
  },
  "ontarget_scoring_att": {
    stat: "shotsOnTarget",
    abbr: "SOT",
    label: "Shots On Target"
  },
  "shot_off_target": {
    stat: "shotsOffTarget",
    abbr: "SOFF",
    label: "Shots Off Target"
  },
  "hit_woodwork": {
    stat: "hitWoodwork",
    abbr: "WOOD",
    label: "Hit Woodwork"
  },
  "blocked_scoring_att": {
    stat: "blockedShots",
    abbr: "BLK",
    label: "Blocked Shots"
  },
  "outfielder_block": {
    stat: "blocks",
    abbr: "BLK",
    label: "Blocks"
  },
  "att_ibox_goal": {
    stat: "goalsInsideBox",
    abbr: "GIB",
    label: "Goals Inside Box"
  },
  "att_obox_goal": {
    stat: "goalsOutsideBox",
    abbr: "GOB",
    label: "Goals Outside Box"
  },
  "att_lf_goal": {
    stat: "leftFootGoals",
    abbr: "LFG",
    label: "Left Foot Goals"
  },
  "att_rf_goal": {
    stat: "rightFootGoals",
    abbr: "RFG",
    label: "Right Foot Goals"
  },
  "att_hd_goal": {
    stat: "headedGoals",
    abbr: "HG",
    label: "Headed Goals"
  },
  "att_pen_goal": {
    stat: "penaltyGoals",
    abbr: "PG",
    label: "Penalty Goals"
  },
  "winning_goal": {
    stat: "winningGoals",
    abbr: "WG",
    label: "Winning Goals"
  },
  "own_goals": {
    stat: "ownGoals",
    abbr: "OG",
    label: "Own Goals"
  },
  "att_setpiece": {
    stat: "setPieceAttempts",
    abbr: "SPA",
    label: "Set Piece Attempts"
  },
  "total_pass": {
    stat: "totalPasses",
    abbr: "P",
    label: "Passes"
  },
  "accurate_pass": {
    stat: "successfulPasses",
    abbr: "SP",
    label: "Successful Passes"
  },
  "successful_open_play_pass": {
    stat: "successfulOpenPlayPasses",
    abbr: "SOPP",
    label: "Successful Open Play Passes"
  },
  "total_long_balls": {
    stat: "totalLongBalls",
    abbr: "LB",
    label: "Long Balls"
  },
  "accurate_long_balls": {
    stat: "successfulLongPasses",
    abbr: "SLP",
    label: "Successful Long Passes"
  },
  "leftside_pass": {
    stat: "leftsidePasses",
    abbr: "LP",
    label: "Left Side Passes"
  },
  "rightside_pass": {
    stat: "rightsidePasses",
    abbr: "RP",
    label: "Right Side Passes"
  },
  "total_att_assist": {
    stat: "keyPasses",
    abbr: "KP",
    label: "Key Passes"
  },
  "total_launches": {
    stat: "totalLaunches",
    abbr: "L",
    label: "Launches"
  },
  "accurate_launches": {
    stat: "successfulLaunches",
    abbr: "SL",
    label: "Successful Launches"
  },
  "total_layoffs": {
    stat: "totalLayoffs",
    abbr: "LO",
    label: "Lay-offs"
  },
  "accurate_layoffs": {
    stat: "successfulLayoffs",
    abbr: "SLO",
    label: "Successful Lay-offs"
  },
  "total_through_ball": {
    stat: "throughBalls",
    abbr: "TB",
    label: "Through Balls"
  },
  "accurate_through_ball": {
    stat: "successfulThroughBalls",
    abbr: "STB",
    label: "Successful Through Balls"
  },
  "total_cross": {
    stat: "totalCrosses",
    abbr: "CR",
    label: "Crosses"
  },
  "accurate_cross": {
    stat: "successfulCrosses",
    abbr: "SC",
    label: "Successful Crosses"
  },
  "total_cross_nocorner": {
    stat: "crossesOpenPlay",
    abbr: "COP",
    label: "Crosses Open Play"
  },
  "accurate_cross_nocorner": {
    stat: "successfulCrossesOpenPlay",
    abbr: "SCOP",
    label: "Successful Crosses Open Play"
  },
  "won_corners": {
    stat: "cornersWon",
    abbr: "CW",
    label: "Corners Won"
  },
  "corner_taken": {
    stat: "cornersTaken",
    abbr: "CT",
    label: "Corners Taken"
  },
  "total_corners_intobox": {
    stat: "totalCornersIntoBox",
    abbr: "CIB",
    label: "Corners Into Box"
  },
  "accurate_corners_intobox": {
    stat: "successfulCornersIntoBox",
    abbr: "SCIB",
    label: "Successful Corners Into Box"
  },
  "total_tackle": {
    stat: "totalTackles",
    abbr: "T",
    label: "Tackles"
  },
  "won_tackle": {
    stat: "tacklesWon",
    abbr: "TW",
    label: "Tackles Won"
  },
  "last_player_tackle": {
    stat: "lastManTackle",
    abbr: "LMT",
    label: "Last Man Tackles"
  },
  "times_tackled": {
    stat: "timesTackled",
    abbr: "TT",
    label: "Times Tackled"
  },
  "interception": {
    stat: "interceptions",
    abbr: "INT",
    label: "Interceptions"
  },
  "interception_won": {
    stat: "interceptionsWon",
    abbr: "INTW",
    label: "Interceptions Won"
  },
  "total_clearance": {
    stat: "totalClearances",
    abbr: "CL",
    label: "Clearances"
  },
  "effective_clearance": {
    stat: "effectiveClearances",
    abbr: "ECL",
    label: "Effective Clearances"
  },
  "head_clearance": {
    stat: "headClearances",
    abbr: "HCL",
    label: "Head Clearances"
  },
  "effective_head_clearance": {
    stat: "effectiveHeadClearances",
    abbr: "EHCL",
    label: "Effective Head Clearances"
  },
  "clearance_off_line": {
    stat: "clearancesOffLine",
    abbr: "CLO",
    label: "Clearances Off Line"
  },
  "ball_recovery": {
    stat: "recoveries",
    abbr: "REC",
    label: "Recoveries"
  },
  "total_contest": {
    stat: "duels",
    abbr: "D",
    label: "Duels"
  },
  "won_contest": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won"
  },
  "duel_won": {
    stat: "duelsWon",
    abbr: "DW",
    label: "Duels Won"
  },
  "duel_lost": {
    stat: "duelsLost",
    abbr: "DL",
    label: "Duels Lost"
  },
  "aerial_won": {
    stat: "aerialDuelsWon",
    abbr: "ADW",
    label: "Aerial Duels Won"
  },
  "aerial_lost": {
    stat: "aerialDuelsLost",
    abbr: "ADL",
    label: "Aerial Duels Lost"
  },
  "successful_fifty_fifty": {
    stat: "successfulFiftyFifty",
    abbr: "S50",
    label: "Successful 50/50s"
  },
  "challenge_lost": {
    stat: "challengesLost",
    abbr: "CHL",
    label: "Challenges Lost"
  },
  "was_fouled": {
    stat: "totalFoulsWon",
    abbr: "FW",
    label: "Fouls Won"
  },
  "fk_foul_won": {
    stat: "foulsFreeKickWon",
    abbr: "FKFW",
    label: "Free Kick Fouls Won"
  },
  "fouls": {
    stat: "totalFoulsConceded",
    abbr: "FC",
    label: "Fouls Conceded"
  },
  "fk_foul_lost": {
    stat: "foulsFreeKickLost",
    abbr: "FKFL",
    label: "Free Kick Fouls Lost"
  },
  "penalty_won": {
    stat: "foulWonPenalty",
    abbr: "FWP",
    label: "Penalties Won"
  },
  "penalty_conceded": {
    stat: "penaltiesConceded",
    abbr: "PC",
    label: "Penalties Conceded"
  },
  "total_offside": {
    stat: "offsides",
    abbr: "OFF",
    label: "Offsides"
  },
  "offside_provoked": {
    stat: "offsidesProvoked",
    abbr: "OFFP",
    label: "Offsides Provoked"
  },
  "touches": {
    stat: "touches",
    abbr: "TCH",
    label: "Touches"
  },
  "touches_in_opp_box": {
    stat: "touchesInBox",
    abbr: "TIB",
    label: "Touches In Box"
  },
  "poss_lost_all": {
    stat: "lossesOfPossession",
    abbr: "LOP",
    label: "Losses Of Possession"
  },
  "poss_lost_ctrl": {
    stat: "lossesOfPossessionControl",
    abbr: "LOPC",
    label: "Losses Of Possession (Control)"
  },
  "dispossessed": {
    stat: "dispossessed",
    abbr: "DISP",
    label: "Dispossessed"
  },
  "turnover": {
    stat: "turnovers",
    abbr: "TO",
    label: "Turnovers"
  },
  "possession_percentage": {
    stat: "possessionPercentage",
    abbr: "POSS%",
    label: "Possession %"
  },
  "successful_put_through": {
    stat: "blockedDistributionWon",
    abbr: "BDW",
    label: "Blocked Distribution Won"
  },
  "total_throws": {
    stat: "totalThrowIns",
    abbr: "TI",
    label: "Throw Ins"
  },
  "accurate_throws": {
    stat: "throwInsToOwn",
    abbr: "TIOP",
    label: "Throw Ins To Own"
  },
  "hand_ball": {
    stat: "handballs",
    abbr: "HB",
    label: "Handballs"
  },
  "goals_conceded": {
    stat: "goalsConceded",
    abbr: "GA",
    label: "Goals Conceded"
  },
  "goals_conceded_ibox": {
    stat: "goalsConcededInsideBox",
    abbr: "GCIB",
    label: "Goals Conceded Inside Box"
  },
  "goals_conceded_obox": {
    stat: "goalsConcededOutsideBox",
    abbr: "GCOB",
    label: "Goals Conceded Outside Box"
  },
  "own_goals_conceded": {
    stat: "ownGoalsConceded",
    abbr: "OGC",
    label: "Own Goals Conceded"
  },
  "attempts_conceded_ibox": {
    stat: "shotsOnConcededInsideBox",
    abbr: "SOCIB",
    label: "Shots Conceded In Box"
  },
  "attempts_conceded_obox": {
    stat: "shotsOnConcededOutsideBox",
    abbr: "SOCOB",
    label: "Shots Conceded Out Box"
  },
  "clean_sheet": {
    stat: "cleanSheets",
    abbr: "CS",
    label: "Clean Sheets"
  },
  "saves": {
    stat: "savesMade",
    abbr: "SV",
    label: "Saves"
  },
  "saved_ibox": {
    stat: "savesMadeInsideBox",
    abbr: "SVIB",
    label: "Saves Inside Box"
  },
  "saved_obox": {
    stat: "savesMadeOutsideBox",
    abbr: "SVOB",
    label: "Saves Outside Box"
  },
  "dive_save": {
    stat: "savesDiving",
    abbr: "SVD",
    label: "Diving Saves"
  },
  "stand_save": {
    stat: "savesStanding",
    abbr: "SVS",
    label: "Standing Saves"
  },
  "penalty_save": {
    stat: "savesFromPenalty",
    abbr: "SVP",
    label: "Penalty Saves"
  },
  "penalty_faced": {
    stat: "penaltiesFaced",
    abbr: "PF",
    label: "Penalties Faced"
  },
  "dive_catch": {
    stat: "catchesDiving",
    abbr: "CATD",
    label: "Diving Catches"
  },
  "stand_catch": {
    stat: "catchesStanding",
    abbr: "CATS",
    label: "Standing Catches"
  },
  "good_high_claim": {
    stat: "goodHighClaims",
    abbr: "GHCL",
    label: "Good High Claims"
  },
  "punches": {
    stat: "punches",
    abbr: "PCH",
    label: "Punches"
  },
  "cross_not_claimed": {
    stat: "crossesNotClaimed",
    abbr: "CNC",
    label: "Crosses Not Claimed"
  },
  "gk_smother": {
    stat: "goalkeeperSmother",
    abbr: "GKS",
    label: "Goalkeeper Smothers"
  },
  "keeper_pick_up": {
    stat: "keeperPickups",
    abbr: "KP",
    label: "Keeper Pickups"
  },
  "keeper_throws": {
    stat: "keeperThrows",
    abbr: "KT",
    label: "Keeper Throws"
  },
  "accurate_keeper_throws": {
    stat: "accurateKeeperThrows",
    abbr: "AKT",
    label: "Accurate Keeper Throws"
  },
  "goal_kicks": {
    stat: "goalKicks",
    abbr: "GK",
    label: "Goal Kicks"
  },
  "accurate_goal_kicks": {
    stat: "accurateGoalKicks",
    abbr: "AGK",
    label: "Accurate Goal Kicks"
  },
  "accurate_keeper_sweeper": {
    stat: "accurateKeeperSweeper",
    abbr: "AKS",
    label: "Accurate Keeper Sweeper"
  },
  "big_chance_missed": {
    stat: "bigChancesMissed",
    abbr: "BCM",
    label: "Big Chances Missed"
  },
  "big_chance_scored": {
    stat: "bigChancesScored",
    abbr: "BCS",
    label: "Big Chances Scored"
  },
  "big_chance_created": {
    stat: "bigChancesCreated",
    abbr: "BCC",
    label: "Big Chances Created"
  },
  "big_chance_saved": {
    stat: "bigChancesSaved",
    abbr: "BCSV",
    label: "Big Chances Saved"
  },
  "error_lead_to_shot": {
    stat: "errorsLeadingToShot",
    abbr: "ELS",
    label: "Errors Leading To Shot"
  },
  "error_lead_to_goal": {
    stat: "errorsLeadingToGoal",
    abbr: "ELG",
    label: "Errors Leading To Goal"
  },
  "att_fastbreak": {
    stat: "fastbreakAttempts",
    abbr: "FBA",
    label: "Fastbreak Attempts"
  },
  "goal_fastbreak": {
    stat: "fastbreakGoals",
    abbr: "FBG",
    label: "Fastbreak Goals"
  },
  "shot_fastbreak": {
    stat: "fastbreakShots",
    abbr: "FBS",
    label: "Fastbreak Shots"
  },
  "final_third_entries": {
    stat: "finalThirdEntries",
    abbr: "FTE",
    label: "Final Third Entries"
  },
  "successful_final_third_passes": {
    stat: "successfulFinalThirdPasses",
    abbr: "SFTP",
    label: "Successful Final Third Passes"
  },
  "total_final_third_passes": {
    stat: "totalFinalThirdPasses",
    abbr: "TFTP",
    label: "Total Final Third Passes"
  },
  "touches_in_final_third": {
    stat: "touchesInFinalThird",
    abbr: "TFT",
    label: "Touches In Final Third"
  },
  "poss_won_att_3rd": {
    stat: "possessionWonAttackingThird",
    abbr: "PWA3",
    label: "Possession Won Att 3rd"
  },
  "poss_won_mid_3rd": {
    stat: "possessionWonMiddleThird",
    abbr: "PWM3",
    label: "Possession Won Mid 3rd"
  },
  "poss_won_def_3rd": {
    stat: "possessionWonDefensiveThird",
    abbr: "PWD3",
    label: "Possession Won Def 3rd"
  },
  "total_back_zone_pass": {
    stat: "totalBackZonePasses",
    abbr: "BZ",
    label: "Back Zone Passes"
  },
  "accurate_back_zone_pass": {
    stat: "accurateBackZonePasses",
    abbr: "ABZ",
    label: "Accurate Back Zone Passes"
  },
  "total_fwd_zone_pass": {
    stat: "totalFwdZonePasses",
    abbr: "FZ",
    label: "Forward Zone Passes"
  },
  "accurate_fwd_zone_pass": {
    stat: "accurateFwdZonePasses",
    abbr: "AFZ",
    label: "Accurate Forward Zone Passes"
  },
  "blocked_pass": {
    stat: "blockedPasses",
    abbr: "BP",
    label: "Blocked Passes"
  },
  "blocked_cross": {
    stat: "blockedCrosses",
    abbr: "BC",
    label: "Blocked Crosses"
  },
  "effective_blocked_cross": {
    stat: "effectiveBlockedCrosses",
    abbr: "EBC",
    label: "Effective Blocked Crosses"
  },
  "total_flick_on": {
    stat: "totalFlickOns",
    abbr: "FO",
    label: "Flick Ons"
  },
  "accurate_flick_on": {
    stat: "accurateFlickOns",
    abbr: "AFO",
    label: "Accurate Flick Ons"
  },
  "total_pull_back": {
    stat: "totalPullBacks",
    abbr: "PB",
    label: "Pull Backs"
  },
  "accurate_pull_back": {
    stat: "accuratePullBacks",
    abbr: "APB",
    label: "Accurate Pull Backs"
  },
  "head_pass": {
    stat: "headPasses",
    abbr: "HP",
    label: "Head Passes"
  },
  "att_one_on_one": {
    stat: "oneOnOneAttempts",
    abbr: "1v1",
    label: "One On One Attempts"
  },
  "six_yard_block": {
    stat: "sixYardBlocks",
    abbr: "6YB",
    label: "Six Yard Blocks"
  },
  "interceptions_in_box": {
    stat: "interceptionsInBox",
    abbr: "INTB",
    label: "Interceptions In Box"
  },
  "fouled_final_third": {
    stat: "fouledFinalThird",
    abbr: "FFT",
    label: "Fouled Final Third"
  },
  "unsuccessful_touch": {
    stat: "unsuccessfulTouches",
    abbr: "UT",
    label: "Unsuccessful Touches"
  },
  "overrun": {
    stat: "overruns",
    abbr: "OR",
    label: "Overruns"
  }
};

const statMapping: Record<string, { f30Key?: string; f15Key?: string; f9Key?: string }> = {
  "goals": { f30Key: "Goals", f15Key: "total goals", f9Key: "goals" },
  "goalAssists": { f30Key: "Goal Assists", f15Key: "total assists", f9Key: "goal_assist" },
  "intentionalAssists": { f9Key: "goal_assist_intentional" },
  "secondAssists": { f30Key: "Second Goal Assists", f9Key: "second_goal_assist" },
  "timePlayed": { f30Key: "Time Played", f15Key: "total mins played", f9Key: "mins_played" },
  "gamesPlayed": { f30Key: "Games Played", f15Key: "total games" },
  "starts": { f30Key: "Starts", f9Key: "game_started" },
  "totalPasses": { f30Key: "Total Passes", f15Key: "total pass", f9Key: "total_pass" },
  "successfulPasses": { f30Key: "Total Successful Passes ( Excl Crosses & Corners ) ", f9Key: "accurate_pass" },
  "passingAccuracy": { f30Key: "Passing Accuracy", f15Key: "total pass pct" },
  "successfulOpenPlayPasses": { f30Key: "Successful Open Play Passes", f9Key: "successful_open_play_pass" },
  "totalTackles": { f30Key: "Total Tackles", f15Key: "total tackle", f9Key: "total_tackle" },
  "tacklesWon": { f30Key: "Tackles Won", f15Key: "total won tackle", f9Key: "won_tackle" },
  "tackleSuccess": { f30Key: "Tackle Success", f15Key: "total tackle pct" },
  "lastManTackle": { f30Key: "Last Man Tackle", f9Key: "last_player_tackle" },
  "timesTackled": { f30Key: "Times Tackled", f9Key: "times_tackled" },
  "totalShots": { f30Key: "Total Shots", f15Key: "total scoring att", f9Key: "total_scoring_att" },
  "shotsOnTarget": { f30Key: "Shots On Target ( inc goals )", f15Key: "total ontarget scoring att", f9Key: "ontarget_scoring_att" },
  "shotsOffTarget": { f30Key: "Shots Off Target (inc woodwork)", f9Key: "shot_off_target" },
  "shootingAccuracy": { f30Key: "Shooting Accuracy", f15Key: "total scoring accuracy" },
  "goalConversion": { f30Key: "Goal Conversion", f15Key: "total goal conversion" },
  "goalsInsideBox": { f30Key: "Goals from Inside Box", f15Key: "total att ibox goal", f9Key: "att_ibox_goal" },
  "goalsOutsideBox": { f30Key: "Goals from Outside Box", f15Key: "total att obox goal", f9Key: "att_obox_goal" },
  "leftFootGoals": { f30Key: "Left Foot Goals", f9Key: "att_lf_goal" },
  "rightFootGoals": { f30Key: "Right Foot Goals", f9Key: "att_rf_goal" },
  "headedGoals": { f30Key: "Headed Goals", f9Key: "att_hd_goal" },
  "penaltyGoals": { f30Key: "Penalty Goals", f15Key: "total att pen goal", f9Key: "att_pen_goal" },
  "winningGoals": { f30Key: "Winning Goal", f9Key: "winning_goal" },
  "ownGoals": { f30Key: "Own Goal Scored", f9Key: "own_goals" },
  "yellowCards": { f30Key: "Yellow Cards", f15Key: "total yellow card", f9Key: "yellow_card" },
  "totalRedCards": { f30Key: "Total Red Cards", f15Key: "total red card", f9Key: "red_card" },
  "secondYellow": { f9Key: "second_yellow" },
  "offsides": { f30Key: "Offsides", f15Key: "total offside", f9Key: "total_offside" },
  "totalClearances": { f30Key: "Total Clearances", f15Key: "total clearance", f9Key: "total_clearance" },
  "effectiveClearances": { f15Key: "total effective clearance", f9Key: "effective_clearance" },
  "clearancesOffLine": { f30Key: "Clearances Off the Line", f9Key: "clearance_off_line" },
  "interceptions": { f30Key: "Interceptions", f15Key: "total interception", f9Key: "interception" },
  "blocks": { f30Key: "Blocks", f9Key: "outfielder_block" },
  "blockedShots": { f30Key: "Blocked Shots", f15Key: "total blocked scoring att", f9Key: "blocked_scoring_att" },
  "recoveries": { f30Key: "Recoveries", f9Key: "ball_recovery" },
  "duels": { f30Key: "Duels", f9Key: "total_contest" },
  "duelsWon": { f30Key: "Duels won", f15Key: "total duels won", f9Key: "duel_won" },
  "duelsLost": { f30Key: "Duels lost", f15Key: "total duels lost", f9Key: "duel_lost" },
  "aerialDuelsWon": { f30Key: "Aerial Duels won", f15Key: "total aerial won", f9Key: "aerial_won" },
  "aerialDuelsLost": { f30Key: "Aerial Duels lost", f15Key: "total aerial lost", f9Key: "aerial_lost" },
  "successfulFiftyFifty": { f30Key: "Successful Fifty Fifty", f9Key: "successful_fifty_fifty" },
  "totalFoulsWon": { f30Key: "Total Fouls Won", f9Key: "was_fouled" },
  "totalFoulsConceded": { f30Key: "Total Fouls Conceded", f9Key: "fouls" },
  "foulWonPenalty": { f30Key: "Foul Won Penalty", f9Key: "penalty_won" },
  "penaltiesConceded": { f30Key: "Penalties Conceded", f9Key: "penalty_conceded" },
  "totalLongBalls": { f9Key: "total_long_balls" },
  "successfulLongPasses": { f30Key: "Successful Long Passes", f9Key: "accurate_long_balls" },
  "leftsidePasses": { f30Key: "Leftside Passes", f9Key: "leftside_pass" },
  "rightsidePasses": { f30Key: "Rightside Passes", f9Key: "rightside_pass" },
  "keyPasses": { f30Key: "Key Passes (Attempt Assists)", f9Key: "total_att_assist" },
  "successfulLaunches": { f30Key: "Successful Launches", f9Key: "accurate_launches" },
  "successfulLayoffs": { f30Key: "Successful Lay-offs", f9Key: "accurate_layoffs" },
  "throughBalls": { f30Key: "Through balls", f9Key: "total_through_ball" },
  "successfulCrosses": { f30Key: "Successful Crosses open play", f15Key: "total accurate cross", f9Key: "accurate_cross_nocorner" },
  "crossingAccuracy": { f30Key: "Crossing Accuracy", f15Key: "total cross pct" },
  "cornersWon": { f30Key: "Corners Won", f15Key: "total won corners", f9Key: "won_corners" },
  "cornersTaken": { f30Key: "Corners Taken (incl short corners)", f9Key: "corner_taken" },
  "successfulCornersIntoBox": { f30Key: "Successful Corners into Box", f9Key: "accurate_corners_intobox" },
  "touchesInBox": { f30Key: "Total Touches In Opposition Box", f15Key: "total touches in opposition box", f9Key: "touches_in_opp_box" },
  "touches": { f30Key: "Touches", f9Key: "touches" },
  "lossesOfPossession": { f30Key: "Total Losses Of Possession", f9Key: "poss_lost_all" },
  "possessionPercentage": { f30Key: "Possession Percentage", f9Key: "possession_percentage" },
  "dispossessed": { f9Key: "dispossessed" },
  "substituteOn": { f30Key: "Substitute On", f15Key: "total sub on", f9Key: "total_sub_on" },
  "substituteOff": { f30Key: "Substitute Off", f15Key: "total sub off", f9Key: "total_sub_off" },
  "cleanSheets": { f30Key: "Clean Sheets", f15Key: "total clean sheet", f9Key: "clean_sheet" },
  "goalsConceded": { f30Key: "Goals Conceded", f15Key: "total goals conceded", f9Key: "goals_conceded" },
  "goalsConcededInsideBox": { f30Key: "Goals Conceded Inside Box", f15Key: "total goals conceded ibox", f9Key: "goals_conceded_ibox" },
  "goalsConcededOutsideBox": { f30Key: "Goals Conceded Outside Box", f15Key: "total goals conceded obox", f9Key: "goals_conceded_obox" },
  "ownGoalsConceded": { f30Key: "Own Goals Conceded", f9Key: "own_goals_conceded" },
  "savesMade": { f30Key: "Saves Made", f15Key: "total saves", f9Key: "saves" },
  "savesMadeInsideBox": { f30Key: "Saves Made from Inside Box", f9Key: "saved_ibox" },
  "savesMadeOutsideBox": { f30Key: "Saves Made from Outside Box", f9Key: "saved_obox" },
  "savesFromPenalty": { f30Key: "Saves from Penalty", f9Key: "penalty_save" },
  "penaltiesFaced": { f30Key: "Penalties Faced", f9Key: "penalty_faced" },
  "punches": { f30Key: "Punches", f15Key: "total punches", f9Key: "punches" },
  "goalkeeperSmother": { f30Key: "Goalkeeper Smother", f9Key: "gk_smother" },
  "hitWoodwork": { f30Key: "Hit Woodwork", f15Key: "total post scoring att", f9Key: "hit_woodwork" },
  "handballs": { f30Key: "Handballs conceded", f15Key: "total hand ball", f9Key: "hand_ball" },
  "bigChancesMissed": { f9Key: "big_chance_missed" },
  "bigChancesScored": { f9Key: "big_chance_scored" },
  "bigChancesCreated": { f9Key: "big_chance_created" },
  "bigChancesSaved": { f9Key: "big_chance_saved" },
  "errorsLeadingToShot": { f9Key: "error_lead_to_shot" },
  "errorsLeadingToGoal": { f9Key: "error_lead_to_goal" }
};

function buildUnifiedStats(): Record<string, StatMetadata> {
  const unified: Record<string, StatMetadata> = {};
  const statToUnifiedKey: Record<string, string> = {};
  const f15StatToKey: Record<string, string> = {};
  const f9StatToKey: Record<string, string> = {};

  for (const [f15Key, f15Stat] of Object.entries(F15_STATS)) {
    f15StatToKey[f15Stat.stat] = f15Key;
  }

  for (const [f9Key, f9Stat] of Object.entries(F9_STATS)) {
    f9StatToKey[f9Stat.stat] = f9Key;
  }

  for (const [f30Key, f30Stat] of Object.entries(F30_STATS)) {
    const stat = f30Stat.stat;
    let unifiedKey = statToUnifiedKey[stat];
    
    if (!unifiedKey) {
      unifiedKey = stat;
      statToUnifiedKey[stat] = unifiedKey;
    }

    const f15Key = statMapping[stat]?.f15Key || f15StatToKey[stat];
    const f9Key = statMapping[stat]?.f9Key || f9StatToKey[stat];

    unified[unifiedKey] = {
      ...f30Stat,
      f30Key,
      f15Key: f15Key || undefined,
      f9Key: f9Key || undefined,
      label: f30Stat.label,
      abbr: f30Stat.abbr
    };
  }

  for (const [f15Key, f15Stat] of Object.entries(F15_STATS)) {
    const stat = f15Stat.stat;
    let unifiedKey = statToUnifiedKey[stat];
    
    if (!unifiedKey) {
      unifiedKey = stat;
      statToUnifiedKey[stat] = unifiedKey;
      
      const f9Key = statMapping[stat]?.f9Key || f9StatToKey[stat];
      const category = inferCategory(stat);
      unified[unifiedKey] = {
        ...f15Stat,
        f30Key: undefined,
        f15Key,
        f9Key: f9Key || undefined,
        label: f15Stat.label || f15Stat.abbr,
        category
      };
    } else {
      if (!unified[unifiedKey].f15Key) {
        unified[unifiedKey].f15Key = f15Key;
      }
      const f9Key = statMapping[stat]?.f9Key || f9StatToKey[stat];
      if (!unified[unifiedKey].f9Key && f9Key) {
        unified[unifiedKey].f9Key = f9Key;
      }
    }
  }

  for (const [f9Key, f9Stat] of Object.entries(F9_STATS)) {
    const stat = f9Stat.stat;
    let unifiedKey = statToUnifiedKey[stat];
    
    if (!unifiedKey) {
      unifiedKey = stat;
      statToUnifiedKey[stat] = unifiedKey;
      
      const category = inferCategory(stat);
      unified[unifiedKey] = {
        ...f9Stat,
        f30Key: undefined,
        f15Key: undefined,
        f9Key,
        label: f9Stat.label || f9Stat.abbr,
        category
      };
    } else {
      if (!unified[unifiedKey].f9Key) {
        unified[unifiedKey].f9Key = f9Key;
      }
    }
  }

  return unified;
}

function inferCategory(stat: string): StatMetadata['category'] {
  if (stat.includes('goal') || stat.includes('shot') || stat.includes('assist') || stat.includes('attempt') || stat.includes('corner') || stat.includes('dribble') || stat.includes('offside') || stat.includes('touch')) {
    return 'attacking';
  }
  if (stat.includes('tackle') || stat.includes('clearance') || stat.includes('interception') || stat.includes('block') || stat.includes('recovery')) {
    return 'defending';
  }
  if (stat.includes('pass') || stat.includes('cross') || stat.includes('launch') || stat.includes('layoff') || stat.includes('through') || stat.includes('throw')) {
    return 'passing';
  }
  if (stat.includes('save') || stat.includes('catch') || stat.includes('punch') || stat.includes('claim') || stat.includes('keeper') || stat.includes('smother') || stat.includes('drop')) {
    return 'goalkeeping';
  }
  if (stat.includes('card') || stat.includes('foul') || stat.includes('handball') || stat.includes('penalty')) {
    return 'discipline';
  }
  return 'general';
}

export const STAT_TYPES: Record<string, StatMetadata> = buildUnifiedStats();

export type F30StatType = keyof typeof F30_STATS;
export type F15StatType = keyof typeof F15_STATS;
export type F9StatType = keyof typeof F9_STATS;

export const F30_STAT_TYPES = F30_STATS;
export const F15_STAT_TYPES = F15_STATS;
export const F9_STAT_TYPES = F9_STATS;

export function getF30StatMetadata(statName: string): StatMetadata | undefined {
  return STAT_TYPES[statName] || Object.values(STAT_TYPES).find(s => s.f30Key === statName);
}

export function getF15StatMetadata(statName: string): StatMetadata | undefined {
  return Object.values(STAT_TYPES).find(s => s.f15Key === statName);
}

export function getF9StatMetadata(statName: string): StatMetadata | undefined {
  return Object.values(STAT_TYPES).find(s => s.f9Key === statName);
}

export function getStatMetadata(statName: string): StatMetadata | undefined {
  const directMatch = STAT_TYPES[statName] || getF30StatMetadata(statName) || getF15StatMetadata(statName) || getF9StatMetadata(statName);
  if (directMatch) return directMatch;
  
  if (isRankingStat(statName)) {
    const baseStatType = getBaseStatType(statName);
    return getStatMetadata(baseStatType);
  }
  
  return undefined;
}

export function getF30StatAbbr(statName: string): string {
  const metadata = getF30StatMetadata(statName);
  return metadata?.abbr || statName;
}

export function getF15StatAbbr(statName: string): string {
  const metadata = getF15StatMetadata(statName);
  return metadata?.abbr || statName;
}

export function getF9StatAbbr(statName: string): string {
  const metadata = getF9StatMetadata(statName);
  return metadata?.abbr || statName;
}

export function getF30StatLabel(statName: string): string {
  const metadata = getF30StatMetadata(statName);
  return metadata?.label || statName;
}

export function getF15StatLabel(statName: string): string {
  const metadata = getF15StatMetadata(statName);
  return metadata?.label || statName;
}

export function getF9StatLabel(statName: string): string {
  const metadata = getF9StatMetadata(statName);
  return metadata?.label || statName;
}

export function getF30StatsByCategory(category: StatMetadata['category']): Record<string, StatMetadata> {
  return Object.entries(STAT_TYPES)
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

export function isRankingStat(statType: string): boolean {
  return statType.endsWith(" ranking");
}

export function getBaseStatType(statType: string): string {
  return statType.replace(" ranking", "");
}
