"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VideoRecordIcon } from '@/components/website-base/icons';
import { StatusIndicator } from '@/components/ui/status';
import { useRefCam } from './ref-cam-context';

export function RefCamFloatingButton() {
  const [mounted, setMounted] = useState(false);
  const { isWhitelisted, hasSeenDialog, setOpen } = useRefCam();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isWhitelisted || !hasSeenDialog) {
    return null;
  }

  return (
    <Button
      onClick={() => setOpen(true)}
      variant="secondary"
      className="fixed bottom-6 right-6 z-50 size-12 p-0"
      aria-label="Open Ref Cam"
    >
      <VideoRecordIcon className="size-8" />
      <StatusIndicator className="absolute -top-1 -right-1 size-3 text-destructive" />
    </Button>
  );
}

