import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "../ui/card"
import { GradientBg } from "../ui/gradient-bg";

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
      <GradientBg
        className="top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] opacity-30"
        overlayColor={overlayColor}
        accentColor={accentColor}
        shadowColor={shadowColor}
      />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

function SubpageHeroMediaBanner({
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
  return (
    <Card
      className={cn("relative z-10 p-4 pl-6 bg-muted absolute bottom-8 right-8 max-w-sm overflow-hidden", className)}
      {...props}
    >
      <GradientBg
        className="inset-0 opacity-40"
        overlayColor={overlayColor}
        accentColor={accentColor}
        shadowColor={shadowColor}
      />

      <div className="relative">
        {children}
      </div>
    </Card>
  )
}

export {
  SubpageHero,
  SubpageHeroMedia,
  SubpageHeroContent,
  SubpageHeroMediaBanner,
}
