// Opta Feed Services
// API calls for different Opta feeds

import { OptaClient } from './client';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';

const optaClient = new OptaClient();

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
 * F1 - Fixtures Feed
 */

export async function getF1Fixtures(
  competitionId: string | number,
  seasonId: string | number
): Promise<F1FixturesResponse> {
  return await optaClient.getF1Fixtures(competitionId, seasonId);
}