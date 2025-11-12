// Opta API Client
// Handles authentication and data fetching from Opta feeds

import { XMLParser } from 'fast-xml-parser';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F24EventsResponse } from '@/types/opta-feeds/f24-match';
import { F9MatchResponse } from '@/types/opta-feeds/f9-match-details';
import { F13CommentaryResponse, F13LanguageCode } from '@/types/opta-feeds/f13-commentary';
import { F15RankingsResponse } from '@/types/opta-feeds/f15-rankings';
import { F30SeasonStatsResponse } from '@/types/opta-feeds/f30-season-stats';

export class OptaClient {
  private baseUrl: string;
  private username: string;
  private password: string;
  private xmlParser: XMLParser;

  constructor() {
    this.baseUrl = 'http://omo.akamai.opta.net';
    this.username = process.env.OPTA_USERNAME || '';
    this.password = process.env.OPTA_PASSWORD || '';

    // Configure XML parser to handle attributes properly
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'value',
      parseAttributeValue: true,
      parseTagValue: true,
    });
  }

  private async makeRequest(params: Record<string, string | number>): Promise<Response> {
    const queryParams = new URLSearchParams({
      user: this.username,
      psw: this.password,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    });

    const url = `${this.baseUrl}/competition.php?${queryParams.toString()}`;
    console.log(`[OPTA REQUEST] Fetching: ${params.feed_type} - Competition: ${params.competition}, Season: ${params.season_id}`);

    const response = await fetch(url, {
      method: 'GET',
      next: { revalidate: 300 },
    });

    console.log(`[OPTA RESPONSE] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`[OPTA ERROR] Failed to fetch ${params.feed_type}: ${response.status} ${response.statusText}`);
      throw new Error(`Opta API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  private async makeTeamRequest(params: Record<string, string | number>): Promise<Response> {
    const queryParams = new URLSearchParams({
      user: this.username,
      psw: this.password,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    });

    const url = `${this.baseUrl}/team_competition.php?${queryParams.toString()}`;
    console.log(`[OPTA TEAM REQUEST] Fetching: ${params.feed_type} - Team: ${params.team_id}, Competition: ${params.competition}, Season: ${params.season_id}`);

    const response = await fetch(url, {
      method: 'GET',
      next: { revalidate: 300 },
    });

    console.log(`[OPTA TEAM RESPONSE] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`[OPTA TEAM ERROR] Failed to fetch ${params.feed_type} for team ${params.team_id}: ${response.status} ${response.statusText}`);
      throw new Error(`Opta API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async getF1Fixtures(competitionId: string | number, seasonId: string | number): Promise<F1FixturesResponse> {
    const response = await this.makeRequest({
      feed_type: 'f1',
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    console.log('[OPTA F1] XML Response length:', xmlText.length);
    console.log('[OPTA F1] XML Response preview:', xmlText.substring(0, 500));
    
    const parsed = this.xmlParser.parse(xmlText);
    console.log('[OPTA F1] Parsed response structure:', JSON.stringify({
      hasSoccerFeed: !!parsed.SoccerFeed,
      hasSoccerDocument: !!parsed?.SoccerFeed?.SoccerDocument,
      hasTeam: !!parsed?.SoccerFeed?.SoccerDocument?.Team,
      teamCount: parsed?.SoccerFeed?.SoccerDocument?.Team?.length || 0,
      hasMatchData: !!parsed?.SoccerFeed?.SoccerDocument?.MatchData,
      matchCount: parsed?.SoccerFeed?.SoccerDocument?.MatchData?.length || 0,
    }, null, 2));
    
    return parsed as F1FixturesResponse;
  }

  async getF3Standings(competitionId: string | number, seasonId: string | number): Promise<F3StandingsResponse> {
    const response = await this.makeRequest({
      feed_type: 'f3',
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    console.log('[OPTA F3] XML Response length:', xmlText.length);
    console.log('[OPTA F3] XML Response preview:', xmlText.substring(0, 500));
    
    const parsed = this.xmlParser.parse(xmlText);
    console.log('[OPTA F3] Parsed response structure:', JSON.stringify({
      hasSoccerFeed: !!parsed.SoccerFeed,
      hasSoccerDocument: !!parsed?.SoccerFeed?.SoccerDocument,
      hasTeam: !!parsed?.SoccerFeed?.SoccerDocument?.Team,
      teamCount: parsed?.SoccerFeed?.SoccerDocument?.Team?.length || 0,
      hasCompetition: !!parsed?.SoccerFeed?.SoccerDocument?.Competition,
      hasTeamStandings: !!parsed?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings,
    }, null, 2));
    
    return parsed as F3StandingsResponse;
  }

  async getF9MatchDetails(
    matchId: string | number,
    competitionId: string | number,
    seasonId: string | number
  ): Promise<F9MatchResponse> {
    const response = await this.makeRequest({
      feed_type: 'f9',
      game_id: matchId,
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F9MatchResponse;
  }

  async getF24MatchEvents(
    matchId: string | number,
    competitionId: string | number,
    seasonId: string | number
  ): Promise<F24EventsResponse> {
    const response = await this.makeRequest({
      feed_type: 'f24',
      game_id: matchId,
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F24EventsResponse;
  }

  async getF24bKeyEvents(
    matchId: string | number,
    competitionId: string | number,
    seasonId: string | number
  ): Promise<F24EventsResponse> {
    const response = await this.makeRequest({
      feed_type: 'f24b',
      game_id: matchId,
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F24EventsResponse;
  }

  async getF13Commentary(
    matchId: string | number,
    competitionId: string | number,
    seasonId: string | number,
    language: F13LanguageCode = 'en'
  ): Promise<F13CommentaryResponse> {
    const response = await this.makeRequest({
      feed_type: 'f13',
      game_id: matchId,
      competition: competitionId,
      season_id: seasonId,
      language: language,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F13CommentaryResponse;
  }

  async getF15Rankings(
    competitionId: string | number,
    seasonId: string | number
  ): Promise<F15RankingsResponse> {
    const response = await this.makeRequest({
      feed_type: 'f15',
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F15RankingsResponse;
  }

  async getF30SeasonStats(
    competitionId: string | number,
    seasonId: string | number,
    teamId: string | number
  ): Promise<F30SeasonStatsResponse> {
    const response = await this.makeTeamRequest({
      feed_type: 'f30',
      competition: competitionId,
      season_id: seasonId,
      team_id: teamId,
    });

    const xmlText = await response.text();
    console.log(`[OPTA F30] Team ${teamId} - XML Response length:`, xmlText.length);
    console.log(`[OPTA F30] Team ${teamId} - XML Response preview:`, xmlText.substring(0, 500));
    
    const parsed = this.xmlParser.parse(xmlText);
    console.log(`[OPTA F30] Team ${teamId} - Parsed response structure:`, JSON.stringify({
      hasSeasonStatistics: !!parsed.SeasonStatistics,
      hasTeam: !!parsed?.SeasonStatistics?.Team,
      teamName: parsed?.SeasonStatistics?.Team?.name || 'N/A',
      hasPlayer: !!parsed?.SeasonStatistics?.Team?.Player,
      playerCount: Array.isArray(parsed?.SeasonStatistics?.Team?.Player) 
        ? parsed.SeasonStatistics.Team.Player.length 
        : parsed?.SeasonStatistics?.Team?.Player ? 1 : 0,
    }, null, 2));
    
    return parsed as F30SeasonStatsResponse;
  }

  async getFeed<T>(feedType: string, params: Record<string, string | number>): Promise<T> {
    const response = await this.makeRequest({
      feed_type: feedType,
      ...params,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as T;
  }
}
