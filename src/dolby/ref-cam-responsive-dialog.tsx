"use client"

import { useState, useEffect } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from '@/components/ui/responsive-dialog';
import { Status, StatusIndicator } from '@/components/ui/status';
import { Button } from '@/components/ui/button';
import { useRefCam } from './ref-cam-context';
import { REF_CAM_CONFIG } from './ref-cam-config';

export function RefCamResponsiveDialog() {
  const [mounted, setMounted] = useState(false);
  const { open, setOpen, isAccessible } = useRefCam();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAccessible) {
    return null;
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogContent className="sm:max-w-[600px]">
        <ResponsiveDialogHeader>
          <Status className="text-destructive mb-2 gap-3 w-fit mx-auto sm:mx-0 text-2xl">
            <StatusIndicator className="size-4" />
            <span className="text-foreground">W7F Ref Cam</span>
          </Status>
          <ResponsiveDialogTitle>Beyond Bancard Field Ref Cam</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Welcome to Beyond Bancard Field! All W7F fans can access the live Ref Cam at any time, as long as they are in the stadium and connected to Wifi
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <div className="w-full aspect-video">
            <iframe
              src={REF_CAM_CONFIG.iframeUrl}
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="lg" variant="secondary">Close</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

