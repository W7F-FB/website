export const dev = {
    log: (...args: unknown[]) => {
      if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('⚠️ This log will only display while in dev mode →', ...args);
      }
    },
  };
  
  