import { NextResponse } from 'next/server';
import { dev } from '@/lib/dev';
import { REF_CAM_CONFIG } from '@/dolby/ref-cam-config';

export async function GET() {
  try {
    const { Director } = await import('@millicast/sdk');
    const data = await Director.getSubscriber({
      streamName: REF_CAM_CONFIG.streamName,
      streamAccountId: REF_CAM_CONFIG.streamAccountId,
      subscriberToken: REF_CAM_CONFIG.subscriberToken,
    });
    
    const accessible = !!data && !!data.urls && data.urls.length > 0;
    
    dev.log('Ref Cam Stream Check:', { 
      streamName: REF_CAM_CONFIG.streamName,
      accountId: REF_CAM_CONFIG.streamAccountId,
      accessible,
      data 
    });
    
    return NextResponse.json({ accessible }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    dev.log('Ref Cam Stream Check Error:', error);
    return NextResponse.json(
      { accessible: false },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}

