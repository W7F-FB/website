export const dev = {
    log: (...args: unknown[]) => {
      if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('⚠️ This log will only display while in dev mode →', ...args);
      }
    },
    error: (error: Error | unknown, context?: Record<string, unknown>) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const timestamp = new Date().toISOString();
      const url = typeof window !== 'undefined' ? window.location.href : 'server';
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server';
      
      console.error('='.repeat(80));
      console.error('ERROR LOGGED');
      console.error('='.repeat(80));
      console.error('Message:', errorObj.message);
      console.error('Name:', errorObj.name);
      console.error('Stack:', errorObj.stack);
      console.error('Timestamp:', timestamp);
      console.error('URL:', url);
      console.error('User Agent:', userAgent);
      
      if (context) {
        console.error('Context:', JSON.stringify(context, null, 2));
      }
      
      if (errorObj.stack) {
        console.error('\nFull Stack Trace:');
        console.error(errorObj.stack);
      }
      
      console.error('='.repeat(80));
    },
  };
  
  