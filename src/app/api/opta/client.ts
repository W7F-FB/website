// Opta API Client
// Handles authentication and data fetching from Opta feeds

import { XMLParser } from 'fast-xml-parser';
import { F1FixturesResponse } from '@/types/opta-feeds/f1-fixtures';
import { F3StandingsResponse } from '@/types/opta-feeds/f3-standings';
import { F24EventsResponse } from '@/types/opta-feeds/f24-match';
import { F9MatchResponse } from '@/types/opta-feeds/f9-match-details';
import { F13CommentaryResponse, F13LanguageCode } from '@/types/opta-feeds/f13-commentary';
import { TM3Response } from '@/types/opta-feeds/tm3';

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
    // Build query string with authentication
    const queryParams = new URLSearchParams({
      user: this.username,
      psw: this.password,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    });

    const url = `${this.baseUrl}/competition.php?${queryParams.toString()}`;
    console.log('Opta API Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
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
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as F1FixturesResponse;
  }

  async getF3Standings(competitionId: string | number, seasonId: string | number): Promise<F3StandingsResponse> {
    const response = await this.makeRequest({
      feed_type: 'f3',
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
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

  async getTM3Squad(
    competitionId: string | number,
    seasonId: string | number
  ): Promise<TM3Response> {
    const response = await this.makeRequest({
      feed_type: 'tm3',
      competition: competitionId,
      season_id: seasonId,
    });

    const xmlText = await response.text();
    const parsed = this.xmlParser.parse(xmlText);
    return parsed as TM3Response;
  }

  // Generic method for any feed type
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
