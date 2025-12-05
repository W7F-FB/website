"use client"

import { useState } from "react"
import { Status, StatusIndicator } from "@/components/ui/status"
import { Countdown } from "@/components/ui/countdown"
import type { TournamentStatus as TournamentStatusType } from "@/app/(website)/(subpages)/tournament/utils"
import { Subtitle } from "@/components/website-base/typography"
import { cn } from "@/lib/utils"

type Props = {
  status: TournamentStatusType
  targetDate: Date | null
  className?: string
}

export function TournamentStatus({ status, targetDate, className }: Props) {
  const [hasCountdownCompleted, setHasCountdownCompleted] = useState(false)

  const effectiveStatus = status === "Upcoming" && hasCountdownCompleted ? "Live" : status

  if (effectiveStatus === "Upcoming" && targetDate) {
    return (
      <div className="flex flex-col gap-2 items-start">
        <Subtitle className="mb-0 text-xs text-muted-foreground">Opening Whistle Iminent</Subtitle>
        <Status
          className={cn(className, "gap-3.5 inline-flex")}
        >
          <StatusIndicator className="text-primary min-w-2.5 size-2.5" />
          <Countdown targetDate={targetDate} onComplete={() => setHasCountdownCompleted(true)} />
        </Status>
      </div>
    )
  }

  if (effectiveStatus === "Live") {
    return (
      <Status className={className}>
        <StatusIndicator className="text-destructive size-2.5" />
        Live
      </Status>
    )
  }

  if (effectiveStatus === "Complete") {
    return (
      <Status className={className}>
        Complete
      </Status>
    )
  }

  return null
}

