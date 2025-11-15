'use client';

import { useMemo, useState, useEffect } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContents,
    TabsContent,
    useTabs,
} from "@/components/ui/motion-tabs"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import { getTeamShortName } from "@/types/opta-feeds/f30-season-stats"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { StatSheetTeamsTable } from "./stat-sheet-teams-table"
import { StatSheetPlayersTable } from "./stat-sheet-players-table"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { PrismicNextImage } from "@prismicio/next"
import { useIsMobile } from "@/hooks/use-mobile"
import type { StatSheetLeaderValue } from "./use-stat-sheet-players-table"

type StatSheetTabsProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    f1FixturesData: F1FixturesResponse | null
}

export function StatSheetTabs({ prismicTeams, f30TeamStats, f1FixturesData }: StatSheetTabsProps) {
    const [selectedTeamId, setSelectedTeamId] = useState<string>("")
    const [leaderView, setLeaderView] = useState<StatSheetLeaderValue>("goals")

    return (
        <Tabs defaultValue="teams">
            <StatSheetTabsContent
                prismicTeams={prismicTeams}
                f30TeamStats={f30TeamStats}
                f1FixturesData={f1FixturesData}
                selectedTeamId={selectedTeamId}
                onTeamSelect={setSelectedTeamId}
                leaderView={leaderView}
                onLeaderViewChange={setLeaderView}
            />
        </Tabs>
    )
}

type StatSheetTabsContentProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    f1FixturesData: F1FixturesResponse | null
    selectedTeamId: string
    onTeamSelect: (teamId: string) => void
    leaderView: StatSheetLeaderValue
    onLeaderViewChange: (value: StatSheetLeaderValue) => void
}

function StatSheetTabsContent({ 
    prismicTeams, 
    f30TeamStats, 
    f1FixturesData,
    selectedTeamId,
    onTeamSelect,
    leaderView,
    onLeaderViewChange
}: StatSheetTabsContentProps) {
    const { activeValue } = useTabs()

    useEffect(() => {
        if (activeValue === "teams") {
            const timeoutId = setTimeout(() => {
                onLeaderViewChange("goals")
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [activeValue, onLeaderViewChange])

    return (
        <>
            <StatSheetTabsHeader 
                prismicTeams={prismicTeams}
                f30TeamStats={f30TeamStats}
                selectedTeamId={selectedTeamId}
                onTeamSelect={onTeamSelect}
            />

            <TabsContents>
                <TabsContent value="teams" className="pt-4">
                    <StatSheetTeamsTable prismicTeams={prismicTeams} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} />
                </TabsContent>

                <TabsContent value="players" className="pt-4">
                    <StatSheetPlayersTable 
                        prismicTeams={prismicTeams} 
                        f30TeamStats={f30TeamStats} 
                        selectedTeamId={selectedTeamId}
                        leaderView={leaderView}
                        onLeaderViewChange={onLeaderViewChange}
                    />
                </TabsContent>
            </TabsContents>
        </>
    )
}

type StatSheetTabsHeaderProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    selectedTeamId: string
    onTeamSelect: (teamId: string) => void
}

function StatSheetTabsHeader({ prismicTeams, f30TeamStats, selectedTeamId, onTeamSelect }: StatSheetTabsHeaderProps) {
    const { activeValue } = useTabs()
    const showTeamSelect = activeValue === "players"
    const isMobile = useIsMobile()

    const sortedTeams = useMemo(() => {
        return [...prismicTeams].sort((a, b) => {
            const aSort = a.data.alphabetical_sort_string ?? a.data.name ?? ""
            const bSort = b.data.alphabetical_sort_string ?? b.data.name ?? ""
            return aSort.localeCompare(bSort, undefined, { sensitivity: "base" })
        })
    }, [prismicTeams])

    useEffect(() => {
        if (activeValue === "teams") {
            onTeamSelect("")
        }
    }, [activeValue, onTeamSelect])

    return (
        <div className="flex items-center gap-2 justify-between font-headers">
            <TabsList variant="skew">
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
            </TabsList>
            {showTeamSelect && (
                <Select 
                    clearable 
                    value={selectedTeamId}
                    onValueChange={onTeamSelect}
                >
                    <SelectTrigger className="max-w-80 [&_img]:size-6 [&_img]:mr-1">
                        <SelectValue placeholder={isMobile ? "Team" : "Select a team"} />
                    </SelectTrigger>
                    <SelectContent>
                        {sortedTeams.map(team => {
                            const teamStats = team.data.opta_id ? f30TeamStats.get(team.data.opta_id) : null
                            const teamShortName = teamStats ? getTeamShortName(teamStats) : null
                            const displayName = isMobile && teamShortName ? teamShortName : team.data.name
                            
                            return (
                                <SelectItem key={team.id} value={team.uid ?? team.id} className="font-headers h-10">
                                    <span className="flex items-center gap-2 w-full">
                                        {team.data.logo.url && (
                                            <PrismicNextImage
                                                field={team.data.logo}
                                                width={100}
                                                height={100}
                                                className="object-contain size-5"
                                            />
                                        )}
                                        <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">{displayName}</span>
                                    </span>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}

