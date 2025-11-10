import * as React from "react"

import { cn, createGrainGradientBackground } from "@/lib/utils"

interface GradientBgProps extends React.ComponentProps<"div"> {
  overlayColor?: string;
  accentColor?: string;
  shadowColor?: string;
}

export function GradientBg({
  className,
  overlayColor,
  accentColor,
  shadowColor,
  ...props
}: GradientBgProps) {
  const backgroundImage = createGrainGradientBackground(
    overlayColor || "var(--muted)",
    accentColor || "var(--primary)",
    shadowColor || "var(--accent)"
  );

  const backgroundStyle = {
    backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: '100% 100%',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div
      className={cn("absolute", className)}
      style={backgroundStyle}
      {...props}
    />
  );
}

