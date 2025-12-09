"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Director } from '@millicast/sdk';
import { useSafeAsync } from '@/hooks/use-safe-async';
import { dev } from '@/lib/dev';
import { REF_CAM_CONFIG } from './ref-cam-config';

interface RefCamContextType {
  isAccessible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  hasSeenDialog: boolean;
}

const RefCamContext = createContext<RefCamContextType | undefined>(undefined);

export function RefCamProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAccessible, setIsAccessible] = useState(false);
  const [open, setOpenState] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useSafeAsync(
    async () => {
      try {
        const data = await Director.getSubscriber({
          streamName: REF_CAM_CONFIG.streamName,
          streamAccountId: REF_CAM_CONFIG.streamAccountId,
          subscriberToken: REF_CAM_CONFIG.subscriberToken,
        });
        
        const accessible = !!data && !!data.urls && data.urls.length > 0;
        
        dev.log('Ref Cam - Stream Check:', { 
          streamName: REF_CAM_CONFIG.streamName,
          accountId: REF_CAM_CONFIG.streamAccountId,
          accessible,
          data 
        });
        
        if (accessible) {
          setIsAccessible(true);

          try {
            const shown = sessionStorage.getItem('ref-cam-shown');
            dev.log('Ref Cam - Session Check:', { shown, willOpen: !shown });
            if (!shown) {
              setOpenState(true);
              sessionStorage.setItem('ref-cam-shown', 'true');
            } else {
              setHasSeenDialog(true);
            }
          } catch (storageError) {
            dev.error(storageError instanceof Error ? storageError : new Error(String(storageError)), {
              source: 'ref-cam-session-storage',
            });
          }
        } else {
          setIsAccessible(false);
        }
      } catch (error) {
        dev.log('Ref Cam - Stream not accessible:', error);
        setIsAccessible(false);
      }
    },
    [isMounted],
    {
      enabled: isMounted,
      onError: (_error) => {
        dev.log('Ref Cam - Check failed, stream not accessible');
        setIsAccessible(false);
      },
    }
  );

  const setOpen = (newOpen: boolean) => {
    setOpenState(newOpen);
    if (!newOpen && isAccessible) {
      setHasSeenDialog(true);
    }
  };

  return (
    <RefCamContext.Provider
      value={{
        isAccessible: isMounted ? isAccessible : false,
        open: isMounted ? open : false,
        setOpen,
        hasSeenDialog: isMounted ? hasSeenDialog : false,
      }}
    >
      {children}
    </RefCamContext.Provider>
  );
}

export function useRefCam() {
  const context = useContext(RefCamContext);
  if (context === undefined) {
    throw new Error('useRefCam must be used within a RefCamProvider');
  }
  return context;
}

