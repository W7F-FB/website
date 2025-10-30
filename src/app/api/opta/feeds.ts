// Opta Feed Services
// API calls for different Opta feeds

import { OptaClient } from './client';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F9MatchResponse } from '@/types/opta-feeds/f9-match-details';
import { F24EventsResponse } from '@/types/opta-feeds/f24-match';

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
