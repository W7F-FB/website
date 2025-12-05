"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dolbyRefCamIpList } from './dolby-ref-cam-ip-list';

interface RefCamContextType {
  userIp: string | null;
  isWhitelisted: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  hasSeenDialog: boolean;
}

const RefCamContext = createContext<RefCamContextType | undefined>(undefined);

export function RefCamProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [open, setOpenState] = useState(false);
  const [hasSeenDialog, setHasSeenDialog] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const fetchUserIp = async () => {
      try {
        const response = await fetch('/api/user-ip');
        const data = await response.json();
        
        console.log('Ref Cam - IP Response:', data);
        
        if (data.ip) {
          setUserIp(data.ip);
          const isWhitelist = dolbyRefCamIpList.includes(data.ip);
          console.log('Ref Cam - IP Check:', { 
            userIp: data.ip, 
            isWhitelisted: isWhitelist,
            whitelist: dolbyRefCamIpList 
          });
          setIsWhitelisted(isWhitelist);

          if (isWhitelist) {
            const shown = sessionStorage.getItem('ref-cam-shown');
            console.log('Ref Cam - Session Check:', { shown, willOpen: !shown });
            if (!shown) {
              setOpenState(true);
              sessionStorage.setItem('ref-cam-shown', 'true');
            } else {
              setHasSeenDialog(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user IP:', error);
      }
    };

    fetchUserIp();
  }, [isMounted]);

  const setOpen = (newOpen: boolean) => {
    setOpenState(newOpen);
    if (!newOpen && isWhitelisted) {
      setHasSeenDialog(true);
    }
  };

  return (
    <RefCamContext.Provider
      value={{
        userIp,
        isWhitelisted: isMounted ? isWhitelisted : false,
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

