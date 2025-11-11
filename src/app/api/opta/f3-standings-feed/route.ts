import { NextRequest, NextResponse } from 'next/server';
import { getF3Standings } from '@/app/api/opta/feeds';

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
    const standings = await getF3Standings(competitionId, seasonId);
    return NextResponse.json(standings, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching F3 standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}

