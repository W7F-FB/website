import { NextRequest, NextResponse } from 'next/server';
import { dev } from '@/lib/dev';

export async function GET(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const host = request.headers.get('host');
    
    let ip = forwardedFor?.split(',')[0].trim() || realIp || null;
    
    if (!ip && host?.startsWith('172.20.')) {
      ip = host.split(':')[0];
    }
    
    if (ip?.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
    
    dev.log('IP Detection:', { forwardedFor, realIp, host, detectedIp: ip });
    
    return NextResponse.json({ ip }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    dev.log('IP Detection Error:', error);
    return NextResponse.json(
      { ip: null, error: 'Failed to detect IP' },
      { status: 500 }
    );
  }
}

