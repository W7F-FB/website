import { NextRequest, NextResponse } from 'next/server';
import { getF13Commentary } from '@/app/api/opta/feeds';
import { F13LanguageCode } from '@/types/opta-feeds/f13-commentary';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');
  const competitionId = searchParams.get('competitionId');
  const seasonId = searchParams.get('seasonId');
  const language = (searchParams.get('language') || 'en') as F13LanguageCode;

  if (!matchId || !competitionId || !seasonId) {
    return NextResponse.json(
      { error: 'Missing required parameters: matchId, competitionId, seasonId' },
      { status: 400 }
    );
  }

  try {
    const data = await getF13Commentary(matchId, competitionId, seasonId, language);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching F13 commentary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commentary' },
      { status: 500 }
    );
  }
}

