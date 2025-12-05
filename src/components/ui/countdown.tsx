"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useInterval } from "@/hooks/use-interval"

type CountdownProps = {
  targetDate: Date | string
  className?: string
  onComplete?: () => void
}

type TimeRemaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date()
  const total = targetDate.getTime() - now.getTime()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, total }
}

type CountdownUnitProps = {
  value: number | string
  label?: string
  className?: string
}

function CountdownUnit({ value, label, className }: CountdownUnitProps) {
  return (
    <div className={cn("inline-flex items-end gap-[0.1em]", className)}>
      <span suppressHydrationWarning>{value}</span>
      {label && <span className="text-[0.6em] mb-0.5 font-[400]">{label}</span>}
    </div>
  )
}

function SecondsUnit({ value, label, className }: CountdownUnitProps) {
  const str = value.toString()
  const firstDigit = str[0]
  const secondDigit = str[1]
  return (
    <div className={cn("inline-flex items-end gap-[0.1em]", className)}>
      <span className="inline-flex text-center overflow-hidden" suppressHydrationWarning>
        <span className="inline-block w-[1ch] text-right overflow-hidden" suppressHydrationWarning>{firstDigit}</span>
        <span className="inline-block w-[1ch] text-left overflow-hidden" suppressHydrationWarning>{secondDigit}</span>
      </span>
      {label && <span className="text-[0.6em] mb-0.5 font-[400]">{label}</span>}
    </div>
  )
}

export function Countdown({ targetDate, className, onComplete }: CountdownProps) {
  const target = useMemo(() => typeof targetDate === "string" ? new Date(targetDate) : targetDate, [targetDate])
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => calculateTimeRemaining(target))
  const [hasCompleted, setHasCompleted] = useState(false)

  const updateCountdown = useCallback(() => {
    const remaining = calculateTimeRemaining(target)
    setTimeRemaining(remaining)

    if (remaining.total <= 0 && !hasCompleted) {
      setHasCompleted(true)
      onComplete?.()
    }
  }, [target, hasCompleted, onComplete])

  useEffect(() => {
    updateCountdown()
  }, [updateCountdown])

  useInterval(updateCountdown, timeRemaining.total > 0 ? 1000 : null)

  if (timeRemaining.total <= 0) {
    return null
  }

  const { days, hours, minutes, seconds } = timeRemaining
  const pad = (n: number) => n.toString().padStart(2, "0")

  if (days >= 1) {
    return (
      <div className={cn("inline-flex items-center gap-[0.5em]", className)}>
        <CountdownUnit value={days} label={days === 1 ? "Day" : "Days"} />
        <CountdownUnit value={pad(hours)} label="Hrs" />
        <CountdownUnit value={pad(minutes)} label="Min" />
      </div>
    )
  }

  return (
    <div className={cn("inline-flex items-center gap-[0.5em]", className)}>
      <CountdownUnit value={pad(hours)} label="Hrs" />
      <CountdownUnit value={pad(minutes)} label="Min" />
      <SecondsUnit value={pad(seconds)} label="Sec" />
    </div>
  )
}
