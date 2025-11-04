export interface F13CommentaryResponse {
  Commentary: F13Commentary;
}

export interface F13Commentary {
  away_score: string;
  away_team_id: string;
  away_team_name: string;
  competition: string;
  competition_id: string;
  game_date: string;
  game_id: string;
  home_score: string;
  home_team_id: string;
  home_team_name: string;
  lang_id: string;
  matchday: string;
  season: string;
  season_id: string;
  sport_id: string;
  sport_name: string;
  message: F13Message[];
}

export interface F13Message {
  id: string;
  comment: string;
  last_modified: string;
  last_modified_utc: string;
  minute?: string;
  period?: string;
  player_ref1?: string;
  player_ref2?: string;
  second?: string;
  time?: string;
  timestamp: string;
  type: F13MessageType;
}

export type F13MessageType =
  | 'start'
  | 'end 1'
  | 'end 2'
  | 'end 14'
  | 'goal'
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

