'use client';

import React, { useEffect, useState } from "react"
import type { F30Player, F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { getPlayerStat, getPlayers, getTeamShortName } from "@/types/opta-feeds/f30-season-stats"
import type { TeamDocument } from "../../../../../prismicio-types"

export const STAT_SHEET_LEADER_OPTIONS = [
    { label: "Scorers", value: "goals" },
    { label: "Playmakers", value: "assists" },
    { label: "Defenders", value: "defensive" },
    { label: "Goalkeepers", value: "saves" }
] as const

export type StatSheetLeaderValue = typeof STAT_SHEET_LEADER_OPTIONS[number]["value"]

type PlayerWithTeam = {
    player: F30Player
    prismicTeam: TeamDocument | undefined
    teamShortName: string | undefined
}

type PlayerRowData = {
    player: F30Player
    prismicTeam: TeamDocument | undefined
    teamShortName: string | undefined
    name: string
    position: string
    shirtNumber: number
    goals: number
    gamesPlayed: number
    timePlayed: number
    shots: number
    shotsOnTarget: number
    assists: number
    fouls: number
    cards: number
    keyPasses: number
    totalPasses: number
    successfulPasses: number
    tackles: number
    interceptions: number
    clearances: number
    blocks: number
    recoveries: number
    saves: number
    goalsConceded: number
    cleanSheets: number
    shotsAgainst: number
}

type TableRow = PlayerRowData & {
    rank: number
    displayRank: string
}

type StatSheetLeaderColumn = {
    id: string
    header: string
    formatter: (row: PlayerRowData) => string | number
    headerClassName?: string
    cellClassName?: string
    tooltip?: string | React.ReactNode
    tooltipHeader?: string | React.ReactNode
}

type StatSheetLeaderConfig = {
    label: string
    value: StatSheetLeaderValue
    primaryStat: (row: PlayerRowData) => number
    filter: (row: PlayerRowData) => boolean
    columns: StatSheetLeaderColumn[]
}

const PAGE_SIZE = 10

const formatPercentage = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
        return "0%"
    }
    return `${value.toFixed(1)}%`
}

const normalizeValue = (value: number) => (Number.isFinite(value) ? value : 0)

export const STAT_SHEET_LEADER_CONFIG: Record<StatSheetLeaderValue, StatSheetLeaderConfig> = {
    goals: {
        label: "Scorers",
        value: "goals",
        primaryStat: row => row.goals,
        filter: row => row.goals > 0,
        columns: [
            {
                id: "goals",
                header: "Goals",
                formatter: row => row.goals,
                headerClassName: "pl-6",
                cellClassName: "pl-6 font-semibold"
            },
            {
                id: "gamesPlayed",
                header: "GP",
                formatter: row => row.gamesPlayed,
                tooltipHeader: "Games Played",
                tooltip: "Total number of games played"
            },
            {
                id: "timePlayed",
                header: "Mins",
                formatter: row => row.timePlayed,
                tooltipHeader: "Time Played",
                tooltip: "Total minutes played"
            },
            {
                id: "shots",
                header: "Shots/On Target",
                formatter: row => `${row.shots} / ${row.shotsOnTarget}`,
                tooltip: "Total shots at goal (excluding own goals and blocked shots) / All shots which either force a goalkeeper save or score a goal"
            },
            {
                id: "assists",
                header: "Assists",
                formatter: row => row.assists
            },
            {
                id: "fouls",
                header: "Fouls",
                formatter: row => row.fouls
            },
            {
                id: "cards",
                header: "Cards",
                formatter: row => row.cards
            }
        ]
    },
    assists: {
        label: "Playmakers",
        value: "assists",
        primaryStat: row => row.assists,
        filter: row => row.assists > 0,
        columns: [
            {
                id: "assists",
                header: "Assists",
                formatter: row => row.assists,
                headerClassName: "pl-6",
                cellClassName: "pl-6 font-semibold"
            },
            {
                id: "gamesPlayed",
                header: "GP",
                formatter: row => row.gamesPlayed,
                tooltipHeader: "Games Played",
                tooltip: "Total number of games played"
            },
            {
                id: "timePlayed",
                header: "Mins",
                formatter: row => row.timePlayed,
                tooltipHeader: "Time Played",
                tooltip: "Total minutes played"
            },
            {
                id: "keyPasses",
                header: "Key Passes",
                formatter: row => row.keyPasses,
                tooltip: "The final pass or pass-cum-shot leading to the recipient of the ball having an attempt at goal without scoring"
            },
            {
                id: "totalPasses",
                header: "Passes",
                formatter: row => row.totalPasses,
                tooltip: "An aggregate of all attempted passes - excluding throw-ins, keeper throws, goal kicks and crosses"
            },
            {
                id: "successfulPasses",
                header: "Pass %",
                formatter: row => {
                    const percentage = row.totalPasses > 0 ? (row.successfulPasses / row.totalPasses) * 100 : 0
                    return formatPercentage(percentage)
                },
                tooltip: "Percentage of passes which are successfully collected by a team-mate"
            }
        ]
    },
    defensive: {
        label: "Defenders",
        value: "defensive",
        primaryStat: row => row.tackles,
        filter: row => row.tackles > 0,
        columns: [
            {
                id: "tackles",
                header: "Tackles",
                formatter: row => row.tackles,
                headerClassName: "pl-6",
                cellClassName: "pl-6 font-semibold"
            },
            {
                id: "interceptions",
                header: "INT",
                formatter: row => row.interceptions,
                tooltipHeader: "Interceptions",
                tooltip: "A player actively moves to intercept a pass"
            },
            {
                id: "recoveries",
                header: "REC",
                formatter: row => row.recoveries,
                tooltipHeader: "Recoveries",
                tooltip: "When a player takes possession of a loose ball and successfully keeps possession for at least two passes or an attacking play"
            },
            {
                id: "blocks",
                header: "Blocks",
                formatter: row => row.blocks,
                tooltip: "An outfield player blocks the ball from reaching its target"
            },
            {
                id: "clearances",
                header: "CL",
                formatter: row => row.clearances,
                tooltipHeader: "Clearances",
                tooltip: "Total number of times the ball is cleared defensively"
            }
        ]
    },
    saves: {
        label: "Goalkeepers",
        value: "saves",
        primaryStat: row => row.saves,
        filter: row => row.saves > 0,
        columns: [
            {
                id: "saves",
                header: "Saves",
                formatter: row => row.saves,
                headerClassName: "pl-6",
                cellClassName: "pl-6 font-semibold"
            },
            {
                id: "gamesPlayed",
                header: "GP",
                formatter: row => row.gamesPlayed,
                tooltipHeader: "Games Played",
                tooltip: "Total number of games played"
            },
            {
                id: "timePlayed",
                header: "Mins",
                formatter: row => row.timePlayed,
                tooltipHeader: "Time Played",
                tooltip: "Total minutes played"
            },
            {
                id: "shotsAgainst",
                header: "Shots Faced",
                formatter: row => row.shotsAgainst,
                tooltip: "The total number of shots the team has allowed their opposition teams to take"
            },
            {
                id: "goalsConceded",
                header: "GA",
                formatter: row => row.goalsConceded,
                tooltipHeader: "Goals Conceded",
                tooltip: "Total goals scored by the opposition"
            },
            {
                id: "cleanSheets",
                header: "CS",
                formatter: row => row.cleanSheets,
                tooltipHeader: "Clean Sheets",
                tooltip: "No goals conceded in the game"
            }
        ]
    }
}

const rankRows = (
    rows: PlayerRowData[],
    getValue: (row: PlayerRowData) => number
): TableRow[] => {
    const valueCounts = new Map<number, number>()
    rows.forEach(row => {
        const value = normalizeValue(getValue(row))
        valueCounts.set(value, (valueCounts.get(value) || 0) + 1)
    })

    return rows.map((row, index) => {
        const value = normalizeValue(getValue(row))
        let rank = index + 1
        
        if (index > 0) {
            const prevValue = normalizeValue(getValue(rows[index - 1]))
            if (value === prevValue) {
                for (let i = index - 1; i >= 0; i--) {
                    if (normalizeValue(getValue(rows[i])) === value) {
                        rank = i + 1
                    } else {
                        break
                    }
                }
            }
        }
        
        const count = valueCounts.get(value) || 0
        const displayRank = count > 1 ? `T${rank}` : `${rank}`

        return { ...row, rank, displayRank }
    })
}

export function useStatSheetPlayersTable(
    prismicTeams: TeamDocument[],
    f30TeamStats: Map<string, F30SeasonStatsResponse>,
    leaderView: StatSheetLeaderValue,
    selectedTeamId?: string
) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null)
    const [pageIndex, setPageIndex] = useState(0)
    const [teamSelectValue, setTeamSelectValue] = useState<string>("")

    const allPlayersWithTeams: PlayerWithTeam[] = []
    f30TeamStats.forEach((stats, teamOptaId) => {
        const players = getPlayers(stats)
        const prismicTeam = prismicTeams.find(t => t.data.opta_id === teamOptaId)
        const teamShortName = getTeamShortName(stats)
        players.forEach(player => {
            allPlayersWithTeams.push({
                player,
                prismicTeam,
                teamShortName
            })
        })
    })

    const playerRows: PlayerRowData[] = allPlayersWithTeams.map(({ player, prismicTeam, teamShortName }) => {
        const goals = Number(getPlayerStat(player, "Goals") ?? 0)
        const gamesPlayed = Number(getPlayerStat(player, "Games Played") ?? 0)
        const timePlayed = Number(getPlayerStat(player, "Time Played") ?? 0)
        const shots = Number(getPlayerStat(player, "Total Shots") ?? 0)
        const shotsOnTarget = Number(getPlayerStat(player, "Shots On Target ( inc goals )") ?? 0)
        const assists = Number(getPlayerStat(player, "Goal Assists") ?? 0)
        const fouls = Number(getPlayerStat(player, "Total Fouls Conceded") ?? 0)
        const yellowCards = Number(getPlayerStat(player, "Yellow Cards") ?? 0)
        const redCards = Number(getPlayerStat(player, "Total Red Cards") ?? 0)
        const totalCards = yellowCards + redCards
        const keyPasses = Number(getPlayerStat(player, "Key Passes (Attempt Assists)") ?? 0)
        const totalPasses = Number(getPlayerStat(player, "Total Passes") ?? 0)
        const successfulPasses = Number(getPlayerStat(player, "Total Successful Passes ( Excl Crosses & Corners )") ?? 0)
        const tackles = Number(getPlayerStat(player, "Total Tackles") ?? 0)
        const interceptions = Number(getPlayerStat(player, "Interceptions") ?? 0)
        const clearances = Number(getPlayerStat(player, "Total Clearances") ?? 0)
        const blocks = Number(getPlayerStat(player, "Blocks") ?? 0)
        const recoveries = Number(getPlayerStat(player, "Recoveries") ?? 0)
        const saves = Number(getPlayerStat(player, "Saves Made") ?? 0)
        const goalsConceded = Number(getPlayerStat(player, "Goals Conceded") ?? 0)
        const cleanSheets = Number(getPlayerStat(player, "Clean Sheets") ?? 0)
        const totalShotsConceded = Number(getPlayerStat(player, "Total Shots Conceded") ?? 0)
        const derivedShotsAgainst = totalShotsConceded > 0 ? totalShotsConceded : saves + goalsConceded

        const displayName = player.known_name ||
            `${player.first_name || ''} ${player.last_name || ''}`.trim()

        return {
            player,
            prismicTeam,
            teamShortName,
            name: displayName,
            position: player.position || '',
            shirtNumber: player.shirtNumber || 0,
            goals,
            gamesPlayed,
            timePlayed,
            shots,
            shotsOnTarget,
            assists,
            fouls,
            cards: totalCards,
            keyPasses,
            totalPasses,
            successfulPasses,
            tackles,
            interceptions,
            clearances,
            blocks,
            recoveries,
            saves,
            goalsConceded,
            cleanSheets,
            shotsAgainst: derivedShotsAgainst
        }
    })

    const leaderConfig = STAT_SHEET_LEADER_CONFIG[leaderView]

    let filteredRows = playerRows.filter(leaderConfig.filter)
    
    if (selectedTeamId) {
        filteredRows = filteredRows.filter(row => 
            row.prismicTeam?.uid === selectedTeamId || row.prismicTeam?.id === selectedTeamId
        )
    }
    
    const sortedRows = [...filteredRows].sort((a, b) => leaderConfig.primaryStat(b) - leaderConfig.primaryStat(a))
    const tableData = rankRows(sortedRows, leaderConfig.primaryStat)

    const totalPages = tableData.length === 0 ? 0 : Math.ceil(tableData.length / PAGE_SIZE)
    const pageCount = Math.max(totalPages, 1)

    useEffect(() => {
        if (pageIndex > pageCount - 1) {
            setPageIndex(pageCount - 1)
        }
    }, [pageIndex, pageCount])

    useEffect(() => {
        setPageIndex(0)
    }, [leaderView, selectedTeamId])

    useEffect(() => {
        setHoveredRow(null)
    }, [pageIndex, leaderView, selectedTeamId])

    useEffect(() => {
        setTeamSelectValue(selectedTeamId ?? "")
    }, [selectedTeamId])

    const paginatedRows = tableData.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE)
    const canPreviousPage = pageIndex > 0
    const canNextPage = pageIndex < pageCount - 1 && totalPages > 0
    const currentPage = totalPages === 0 ? 0 : Math.min(pageIndex + 1, totalPages)

    const handleTeamSelect = (teamId: string) => {
        setTeamSelectValue(teamId)
    }

    const handleTeamClear = () => {
        setTeamSelectValue("")
    }

    return {
        paginatedRows,
        hoveredRow,
        setHoveredRow,
        pageIndex,
        setPageIndex,
        canPreviousPage,
        canNextPage,
        currentPage,
        totalPages,
        pageCount,
        teamSelectValue,
        onTeamSelect: handleTeamSelect,
        onTeamClear: handleTeamClear,
    }
}
