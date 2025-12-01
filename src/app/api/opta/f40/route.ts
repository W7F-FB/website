import { NextRequest, NextResponse } from 'next/server';
import { getF40Squads } from '../feeds';
import { dev } from '@/lib/dev';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');

  dev.log('F40 API Route called with params:', { competitionId, seasonId });

  if (!competitionId || !seasonId) {
    return NextResponse.json(
      { error: 'Missing required parameters: competitionId, seasonId' },
      { status: 400 }
    );
  }

  try {
    dev.log('Fetching F40 squads...');
    const data = await getF40Squads(competitionId, seasonId);
    dev.log('F40 squads received, team count:', data?.SoccerFeed?.SoccerDocument?.Team?.length || 0);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    dev.log('Error fetching F40 squads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch squads' },
      { status: 500 }
    );
  }
}

