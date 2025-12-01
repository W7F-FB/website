import { NextRequest, NextResponse } from 'next/server';
import { getF30SeasonStats } from '@/app/api/opta/feeds';
import { dev } from '@/lib/dev';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');
  const teamId = searchParams.get('teamId');

  if (!competitionId || !seasonId || !teamId) {
    return NextResponse.json(
      { error: 'Missing required parameters: competitionId, seasonId, teamId' },
      { status: 400 }
    );
  }

  try {
    const seasonStats = await getF30SeasonStats(competitionId, seasonId, teamId);
    return NextResponse.json(seasonStats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    dev.log('Error fetching F30 season statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season statistics' },
      { status: 500 }
    );
  }
}

