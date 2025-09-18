import * as React from "react"
import { cn, createGrainGradientBackground } from "@/lib/utils"

function SubpageHero({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative overflow-hidden w-full grid grid-cols-[auto_1fr]", className)}
      {...props}
    />
  )
}

function SubpageHeroMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative h-full overflow-hidden", className)}
      {...props}
    />
  )
}

function SubpageHeroContent({
  className,
  children,
  overlayColor,
  accentColor,
  shadowColor,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
  overlayColor?: string;
  accentColor?: string;
  shadowColor?: string;
}) {
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
      className={cn("relative z-10 pb-24 pt-36 px-18 min-h-[20rem] flex flex-col gap-4 max-w-3xl w-full bg-muted", className)}
      {...props}
    >
      <div 
        className="absolute top-0 bottom-0 -right-[0.5rem] -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-muted/20 backdrop-blur-sm border-r border-foreground/10" 
      />
      <div 
        className="absolute top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-muted" 
      />
      <div 
        className="absolute top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] opacity-30" 
        style={backgroundStyle}
      />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

export {
  SubpageHero,
  SubpageHeroMedia,
  SubpageHeroContent,
}
