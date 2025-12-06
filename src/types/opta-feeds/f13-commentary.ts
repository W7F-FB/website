export interface F13CommentaryResponse {
  Commentary: F13Commentary;
}

export interface F13Commentary {
  message: F13Message[];
  away_score: number;
  away_team_id: number;
  away_team_name: string;
  away_team_official: string;
  away_team_short: string;
  competition: string;
  competition_id: number;
  game_date: string;
  game_date_utc: string;
  game_id: number;
  home_score: number;
  home_team_id: number;
  home_team_name: string;
  home_team_official: string;
  home_team_short: string;
  lang_id: string;
  matchday: number;
  season: string;
  season_id: number;
  sport_id: number;
  sport_name: string;
}

export interface F13Message {
  id: number;
  comment: string;
  last_modified: string;
  last_modified_utc: string;
  minute?: number;
  period?: number;
  player_ref1?: number;
  player_ref2?: number;
  second?: number;
  team_ref1?: number;
  team_ref2?: number;
  time?: string;
  timestamp: string;
  timestamp_utc: string;
  type: F13MessageType;
}

export type F13MessageType =
  | 'start'
  | 'start delay'
  | 'end 1'
  | 'end 2'
  | 'end 14'
  | 'goal'
  | 'own goal'
  | 'miss'
  | 'post'
  | 'attempt saved'
  | 'attempt blocked'
  | 'save'
  | 'corner'
  | 'free kick won'
  | 'free kick lost'
  | 'offside'
  | 'yellow card'
  | 'red card'
  | 'second yellow card'
  | 'substitution'
  | 'lineup'
  | 'contentious referee decisions'
  | 'delay'
  | 'added time'
  | string;

export const F13_SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  FRENCH: 'fr',
  ITALIAN: 'it',
  GERMAN: 'de',
  GERMAN_SWITZERLAND: 'ds',
  SPANISH: 'es',
  PORTUGUESE: 'pt',
  DUTCH: 'nl',
  NORWEGIAN: 'no',
  SWEDISH: 'se',
  DANISH: 'dk',
  CATALAN: 'ca',
  LATIN_AMERICAN_SPANISH: 'esl',
  BRAZILIAN_PORTUGUESE: 'ptb',
  INDONESIAN: 'id',
  CHINESE: 'cn',
  ARABIC: 'ar',
} as const;

export type F13LanguageCode = typeof F13_SUPPORTED_LANGUAGES[keyof typeof F13_SUPPORTED_LANGUAGES];

export function isGoalMessage(message: F13Message): boolean {
  return message.type === 'goal';
}

export function isCardMessage(message: F13Message): boolean {
  return message.type === 'yellow card' || 
         message.type === 'red card' || 
         message.type === 'second yellow card';
}

export function isSubstitutionMessage(message: F13Message): boolean {
  return message.type === 'substitution';
}

export function isScoringAttempt(message: F13Message): boolean {
  return message.type === 'goal' || 
         message.type === 'miss' || 
         message.type === 'post' || 
         message.type === 'attempt saved' || 
         message.type === 'attempt blocked';
}

