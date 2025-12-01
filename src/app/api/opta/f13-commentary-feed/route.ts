import { NextRequest, NextResponse } from 'next/server';
import { getF13Commentary } from '@/app/api/opta/feeds';
import { F13LanguageCode } from '@/types/opta-feeds/f13-commentary';
import { dev } from '@/lib/dev';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');
  const language = (searchParams.get('language') || 'en') as F13LanguageCode;

  if (!matchId) {
    return NextResponse.json(
      { error: 'Missing required parameter: matchId' },
      { status: 400 }
    );
  }

  try {
    const data = await getF13Commentary(matchId, language);
    return NextResponse.json(data);
  } catch (error) {
    dev.log('Error fetching F13 commentary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commentary' },
      { status: 500 }
    );
  }
}

