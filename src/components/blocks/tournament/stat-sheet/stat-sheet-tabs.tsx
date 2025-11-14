'use client';

import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/ui/motion-tabs"
import type { TeamDocument } from "../../../../../prismicio-types"
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { StatSheetTeamsTable } from "./stat-sheet-teams-table"

type StatSheetTabsProps = {
    prismicTeams: TeamDocument[]
    f30TeamStats: Map<string, F30SeasonStatsResponse>
    f1FixturesData: F1FixturesResponse | null
}

export function StatSheetTabs({ prismicTeams, f30TeamStats, f1FixturesData }: StatSheetTabsProps) {
    return (
        <Tabs defaultValue="teams">
            <TabsList>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
            </TabsList>
            
            <TabsContents>
                <TabsContent value="teams" className="pt-4">
                    <StatSheetTeamsTable prismicTeams={prismicTeams} f30TeamStats={f30TeamStats} f1FixturesData={f1FixturesData} />
                </TabsContent>
                
                <TabsContent value="players" className="pt-4">
                    <></>
                </TabsContent>
            </TabsContents>
        </Tabs>
    )
}

