// Opta Feed Services
// API calls for different Opta feeds

import { OptaClient } from './client';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';

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
