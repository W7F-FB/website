import { NextRequest, NextResponse } from 'next/server';
import { getF2MatchPreview } from '@/app/api/opta/feeds';
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
    const data = await getF2MatchPreview(matchId);
    dev.log('F2MatchPreview', data);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    dev.log('Error fetching F2 match preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match preview' },
      { status: 500 }
    );
  }
}

