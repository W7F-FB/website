import { NextRequest, NextResponse } from 'next/server';
import { getGameData } from '@/lib/data/get-game-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');

  if (!competitionId || !seasonId) {
    return NextResponse.json(
      { error: 'Missing required parameters: competitionId, seasonId' },
      { status: 400 }
    );
  }

  try {
    const matches = await getGameData(competitionId, seasonId);
    return NextResponse.json(matches, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching F1 fixtures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    );
  }
}

