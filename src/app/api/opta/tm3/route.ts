import { NextRequest, NextResponse } from 'next/server';
import { getTM3Squad } from '../feeds';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');

  console.log('TM3 API Route called with params:', { competitionId, seasonId });

  if (!competitionId || !seasonId) {
    return NextResponse.json(
      { error: 'Missing required parameters: competitionId, seasonId' },
      { status: 400 }
    );
  }

  try {
    console.log('Fetching TM3 squad data...');
    const data = await getTM3Squad(competitionId, seasonId);
    
    // Normalize squad to always be an array
    const squads = Array.isArray(data.teamSquads.squad) 
      ? data.teamSquads.squad 
      : [data.teamSquads.squad];
    
    console.log('TM3 squad data received, teams count:', squads.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TM3 squad:', error);
    return NextResponse.json(
      { error: 'Failed to fetch squad data' },
      { status: 500 }
    );
  }
}

