import { NextRequest, NextResponse } from 'next/server';
import { getF9MatchDetails } from '@/app/api/opta/feeds';
import { dev } from '@/lib/dev';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json(
      { error: 'Missing required parameter: matchId' },
      { status: 400 }
    );
  }

  try {
    const data = await getF9MatchDetails(matchId);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=90, stale-while-revalidate=180',
      },
    });
  } catch (error) {
    dev.log('Error fetching F9 match details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match details' },
      { status: 500 }
    );
  }
}

