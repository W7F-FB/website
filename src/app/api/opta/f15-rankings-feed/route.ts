import { NextRequest, NextResponse } from 'next/server';
import { getF15Rankings } from '@/app/api/opta/feeds';
import { dev } from '@/lib/dev';

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
    const rankings = await getF15Rankings(competitionId, seasonId);
    return NextResponse.json(rankings, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    dev.log('Error fetching F15 rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}

