'use client';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { cn } from "@/lib/utils"
import { PrismicNextImage } from "@prismicio/next"
import type { TeamDocument } from "../../../../../prismicio-types"
import { CaretRightIcon } from "@/components/website-base/icons"
import { STAT_SHEET_LEADER_CONFIG, STAT_SHEET_LEADER_OPTIONS, type StatSheetLeaderValue, useStatSheetPlayersTable } from "./use-stat-sheet-players-table"

type StatSheetPlayersTableProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    selectedTeamId?: string
    leaderView: StatSheetLeaderValue
    onLeaderViewChange: (value: StatSheetLeaderValue) => void
}

export function StatSheetPlayersTable({ prismicTeams, f30TeamStats, selectedTeamId, leaderView, onLeaderViewChange }: StatSheetPlayersTableProps) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    const {
        paginatedRows,
        hoveredRow,
        setHoveredRow,
        setPageIndex,
        canPreviousPage,
        canNextPage,
        currentPage,
        totalPages,
        pageCount
    } = useStatSheetPlayersTable(prismicTeams, f30TeamStats, leaderView, selectedTeamId)
    const leaderColumns = STAT_SHEET_LEADER_CONFIG[leaderView].columns

    return (
        <div>
            <div className="flex gap-0">
                <div className="border-r border-border/40">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead hasSelect>
                                    {hasMounted ? (
                                        <Select
                                            value={leaderView}
                                            onValueChange={value => onLeaderViewChange(value as StatSheetLeaderValue)}
                                        >
                                            <SelectTrigger
                                                size="tableHeader"
                                                className="px-0 text-left font-headers text-base font-semibold"
                                            >
                                                <SelectValue placeholder="Goals Leaders" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STAT_SHEET_LEADER_OPTIONS.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <button
                                            type="button"
                                            className="px-0 text-left font-headers text-base font-semibold"
                                        >
                                            {STAT_SHEET_LEADER_OPTIONS.find(o => o.value === leaderView)?.label || "Goals Leaders"}
                                        </button>
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map((row, index) => (
                                <TableRow
                                    key={row.player.player_id}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={cn(hoveredRow === index && "bg-muted/30 hover:bg-muted/30")}
                                >
                                    <TableCell className="h-12 py-0 font-medium font-headers lg:pr-10 pr-3">
                                        <div className="flex items-center lg:gap-3 gap-2">
                                            <span className="text-muted-foreground/80 lg:text-[0.7rem] text-[0.6rem] lg:w-6 w-4">{row.displayRank}</span>
                                            <div className="grid grid-cols-[auto_1fr] gap-2.5">
                                                {row.prismicTeam?.data.logo && (
                                                    <div className="relative lg:size-6 size-5 flex-shrink-0 self-center">
                                                        <PrismicNextImage
                                                            field={row.prismicTeam.data.logo}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col items-start">
                                                    <span className="overflow-hidden lg:max-w-none max-w-22 text-ellipsis text-xs">{row.name}</span>
                                                    <span className="text-muted-foreground/80 font-normal text-[0.65rem]">
                                                        #{row.shirtNumber} • {row.position}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="overflow-x-auto flex-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {leaderColumns.map(column => (
                                    <TableHead
                                        key={column.id}
                                        className={cn(column.headerClassName)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className="mt-0.5">{column.header}</span>
                                            {column.tooltip && (
                                                <Tooltip>
                                                    <TooltipTrigger className="size-3" />
                                                    <TooltipContent header={column.tooltipHeader}>
                                                        {typeof column.tooltip === 'string' ? <p>{column.tooltip}</p> : column.tooltip}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRows.map((row, index) => (
                                <TableRow
                                    key={row.player.player_id}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={cn("h-12 py-0 text-base hover:bg-transparent", hoveredRow === index && "bg-muted/30 hover:bg-muted/30")}
                                >
                                    {leaderColumns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            className={cn(column.cellClassName)}
                                        >
                                            {column.formatter(row)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="bg-muted/50 border-t border-border font-medium h-[54px] flex items-center justify-end gap-4 px-4">
                <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
                        disabled={!canPreviousPage}
                    >
                        <CaretRightIcon className="rotate-180" size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
                        disabled={!canNextPage}
                    >
                        <CaretRightIcon size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

