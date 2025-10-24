"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
    fixture: {
        id: string
        startTime: string
        status: string
        home: { id: string; score: number | null }
        away: { id: string; score: number | null }
        homeTeam?: { name: string; logo?: string; country?: string } | null
        awayTeam?: { name: string; logo?: string; country?: string } | null
    }
}

