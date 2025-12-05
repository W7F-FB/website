"use client"

import { RefCamProvider } from "./ref-cam-context";
import { RefCamResponsiveDialog } from "./ref-cam-responsive-dialog";
import { RefCamFloatingButton } from "./ref-cam-floating-button";

export function RefCamWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RefCamProvider>
      {children}
      <RefCamResponsiveDialog />
      <RefCamFloatingButton />
    </RefCamProvider>
  );
}

