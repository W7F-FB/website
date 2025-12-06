"use client"

import dynamic from 'next/dynamic';

const RefCamProvider = dynamic(
  () => import('./ref-cam-context').then((mod) => ({ default: mod.RefCamProvider })),
  { ssr: false }
);

const RefCamResponsiveDialog = dynamic(
  () => import('./ref-cam-responsive-dialog').then((mod) => ({ default: mod.RefCamResponsiveDialog })),
  { ssr: false }
);

const RefCamFloatingButton = dynamic(
  () => import('./ref-cam-floating-button').then((mod) => ({ default: mod.RefCamFloatingButton })),
  { ssr: false }
);

export function RefCamClientWrapper() {
  return (
    <RefCamProvider>
      <></>
      <RefCamResponsiveDialog />
      <RefCamFloatingButton />
    </RefCamProvider>
  );
}

