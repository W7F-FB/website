import * as React from "react"

import { cn, createGrainGradientBackground } from "@/lib/utils"

export const DEFAULT_GRADIENT_COLORS = {
  overlay: "#232b37",
  accent: "#0c224a",
  shadow: "#232b37",
} as const

interface GradientBgProps extends React.ComponentProps<"div"> {
  overlayColor?: string;
  accentColor?: string;
  shadowColor?: string;
  accentOpacity?: number;
}

export function GradientBg({
  className,
  overlayColor = DEFAULT_GRADIENT_COLORS.overlay,
  accentColor = DEFAULT_GRADIENT_COLORS.accent,
  shadowColor = DEFAULT_GRADIENT_COLORS.shadow,
  accentOpacity = 1,
  ...props
}: GradientBgProps) {
  const backgroundImage = createGrainGradientBackground(
    overlayColor,
    accentColor,
    shadowColor,
    accentOpacity
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

