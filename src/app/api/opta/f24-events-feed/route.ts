import { NextRequest, NextResponse } from 'next/server';
import { getF24MatchEvents } from '@/app/api/opta/feeds';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');

  if (!matchId || !competitionId || !seasonId) {
    return NextResponse.json(
      { error: 'Missing required parameters: matchId, competitionId, seasonId' },
      { status: 400 }
    );
  }

  try {
    const data = await getF24MatchEvents(matchId, competitionId, seasonId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching F24 match events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match events' },
      { status: 500 }
    );
  }
}

