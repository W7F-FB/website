"use client"

import { RefCamProvider } from "@/dolby/ref-cam-context";
import { RefCamResponsiveDialog } from "@/dolby/ref-cam-responsive-dialog";
import { RefCamFloatingButton } from "@/dolby/ref-cam-floating-button";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RefCamProvider>
      {children}
      <RefCamResponsiveDialog />
      <RefCamFloatingButton />
    </RefCamProvider>
  );
}

