// Opta Feed Services
// API calls for different Opta feeds

import { OptaClient } from './client';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F9MatchResponse } from '@/types/opta-feeds/f9-match-details';
import { F24EventsResponse } from '@/types/opta-feeds/f24-match';
import { F13CommentaryResponse, F13LanguageCode } from '@/types/opta-feeds/f13-commentary';
import { F40SquadsResponse } from '@/types/opta-feeds/f40-squads-feed';

const optaClient = new OptaClient();

/**
 * F1 - Fixtures and Results Feed
 * Returns the calendar of matches for a competition including dates, venues, and results
 */
export async function getF1Fixtures(
  competitionId: string | number,
  seasonId: string | number
): Promise<F1FixturesResponse> {
  return await optaClient.getF1Fixtures(competitionId, seasonId);
}

/**
 * F3 - Competition Standings Feed
 */
export async function getF3Standings(
  competitionId: string | number,
  seasonId: string | number
): Promise<F3StandingsResponse> {
  return await optaClient.getF3Standings(competitionId, seasonId);
}


/**
 * F9 - Match Details Feed
 * Returns detailed match information including teams, venue, referee, stats, etc.
 */
export async function getF9MatchDetails(
  matchId: string | number,
  competitionId: string | number,
  seasonId: string | number
): Promise<F9MatchResponse> {
  return await optaClient.getF9MatchDetails(matchId, competitionId, seasonId);
}

/**
 * F24 - Match Events Feed
 * Returns all match events (goals, cards, substitutions, etc.)
 */
export async function getF24MatchEvents(
  matchId: string | number,
  competitionId: string | number,
  seasonId: string | number
): Promise<F24EventsResponse> {
  return await optaClient.getF24MatchEvents(matchId, competitionId, seasonId);
}

/**
 * F24b - Key Events Feed
 * Returns key match events only (goals, shots, cards, corners, fouls, substitutions, etc.)
 */
export async function getF24bKeyEvents(
  matchId: string | number,
  competitionId: string | number,
  seasonId: string | number
): Promise<F24EventsResponse> {
  return await optaClient.getF24bKeyEvents(matchId, competitionId, seasonId);
}

/**
 * F13 - Commentary Feed
 * Returns automated commentary messages for key match events in specified language
 */
export async function getF13Commentary(
  matchId: string | number,
  competitionId: string | number,
  seasonId: string | number,
  language: F13LanguageCode = 'en'
): Promise<F13CommentaryResponse> {
  return await optaClient.getF13Commentary(matchId, competitionId, seasonId, language);
}

/**
 * F40 - Squads Feed
 * Returns the squad list for a competition and season including player details,
 * transfers, loans, team officials, stadium info, and team kits
 */
export async function getF40Squads(
  competitionId: string | number,
  seasonId: string | number
): Promise<F40SquadsResponse> {
  return await optaClient.getF40Squads(competitionId, seasonId);
}