// Opta Feed Services
// API calls for different Opta feeds

import { OptaClient } from './client';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F9MatchResponse } from '@/types/opta-feeds/f9-match';
import { F13CommentaryResponse, F13LanguageCode } from '@/types/opta-feeds/f13-commentary';
import { F24EventDetailsFeed } from '@/types/opta-feeds/f24-match-events';
import { F40SquadsResponse } from '@/types/opta-feeds/f40-squads-feed';
import { F15RankingsResponse } from '@/types/opta-feeds/f15-rankings';
import { F30SeasonStatsResponse } from '@/types/opta-feeds/f30-season-stats';

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
  matchId: string | number
): Promise<F9MatchResponse> {
  return await optaClient.getF9MatchDetails(matchId);
}

/**
 * F13 - Commentary Feed
 * Returns automated commentary messages for key match events in specified language
 */
export async function getF13Commentary(
  matchId: string | number,
  language: F13LanguageCode = 'en'
): Promise<F13CommentaryResponse> {
  return await optaClient.getF13Commentary(matchId, language);
}

export async function getF24Events(
  matchId: string | number
): Promise<F24EventDetailsFeed> {
  return await optaClient.getF24Events(matchId);
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

/**
 * F15 - Rankings Feed
 * Returns rankings data for matches, teams and players
 */
export async function getF15Rankings(
  competitionId: string | number,
  seasonId: string | number
): Promise<F15RankingsResponse> {
  return await optaClient.getF15Rankings(competitionId, seasonId);
}

/**
 * F30 - Season Statistics Feed
 * Returns accumulative performance statistics for every player in a team for a specific competition
 */
export async function getF30SeasonStats(
  competitionId: string | number,
  seasonId: string | number,
  teamId: string | number
): Promise<F30SeasonStatsResponse> {
  return await optaClient.getF30SeasonStats(competitionId, seasonId, teamId);
}
