import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "../ui/card"
import { GradientBg } from "../ui/gradient-bg";

function SubpageHero({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative overflow-hidden w-full grid grid-cols-1 lg:grid-cols-[auto_1fr]", className)}
      {...props}
    />
  )
}

function SubpageHeroMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative h-80 lg:h-full overflow-hidden", className)}
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
      className={cn("relative z-10 pb-12 lg:pb-24 pt-12 lg:pt-36 px-6 lg:px-18 min-h-80 flex flex-col gap-4 max-w-3xl w-full bg-extra-muted", className)}
      {...props}
    >
      <div
        className="absolute top-0 bottom-0 -right-[0.5rem] -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-secondary/15 backdrop-blur-sm border-r border-foreground/10"
      />
      <div
        className="absolute top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-extra-muted"
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
      className={cn("relative z-10 p-4 pl-6 bg-extra-muted absolute bottom-8 left-4 right-4 lg:left-auto lg:right-8 max-w-sm overflow-hidden border-none", className)}
      {...props}
    >
      <div className="absolute w-3 h-full bg-gradient-to-r from-primary to-transparent -left-1 top-0 bottom-0 z-10"></div>
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

function SubpageHeroSecondary({
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
      className={cn("relative overflow-hidden w-full bg-extra-muted text-center", className)}
      {...props}
    >
      <div
        className="absolute inset-0 bg-secondary/15 border-b border-foreground/10"
      />
      <div
        className="absolute inset-0 bg-extra-muted"
      />
      <GradientBg
        className="inset-0 opacity-30"
        overlayColor={overlayColor}
        accentColor={accentColor}
        shadowColor={shadowColor}
      />
      <div className="relative z-10 py-18 px-6 lg:px-18 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export {
  SubpageHero,
  SubpageHeroMedia,
  SubpageHeroContent,
  SubpageHeroMediaBanner,
  SubpageHeroSecondary,
}
