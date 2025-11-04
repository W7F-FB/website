import { NextRequest, NextResponse } from 'next/server';
import { getF24bKeyEvents } from '../feeds';

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
    const data = await getF24bKeyEvents(matchId, competitionId, seasonId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching F24b key events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch key events' },
      { status: 500 }
    );
  }
}

