import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/ui/motion-tabs"
import { ScheduleDay } from "@/components/blocks/tournament/schedule/schedule-day"
import { SoccerIcon, ChampionIcon } from "@/components/website-base/icons"

interface ScheduleTabsProps {
    tournamentSlug: string
}

export function ScheduleTabs({ tournamentSlug }: ScheduleTabsProps) {
    return (
        <Tabs defaultValue="tab1">
            <TabsList variant="skew" className="w-full !h-18">
                <TabsTrigger value="tab1" className=" flex-col items-center justify-center">
                    <div>Fri, Dec 5th</div>
                    <div className="text-sm text-muted-foreground/75 font-medium">Session 1</div>
                </TabsTrigger>
                <TabsTrigger value="tab2" className="flex-col items-center justify-center">
                    <div>Sat, Dec 6th</div>
                    <div className="text-sm text-muted-foreground/75 font-medium">Sessions 2 & 3</div>
                </TabsTrigger>
                <TabsTrigger value="tab3" className="flex-col items-center justify-center">
                    <div>Sun, Dec 7th</div>
                    <div className="text-sm text-muted-foreground/75 font-medium">Session 4</div>
                </TabsTrigger>
            </TabsList>
            <TabsContents>
                <TabsContent value="tab1">
                    <div>
                        <ScheduleDay
                            session="Session 1"
                            note="Session 1: All eight clubs compete in one match each"
                            tournamentSlug={tournamentSlug}
                            sessions={[
                                { title: "Session 1 Matches", gatesOpen: "3:00 PM", matches: "4 Matches", time: "5:00 - 9:00 PM", icon: SoccerIcon },
                            ]}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="tab2">
                    <div>
                        <ScheduleDay
                            session="Session 2"
                            note="Sessions 2 & 3: All eight clubs compete in two matches each"
                            tournamentSlug={tournamentSlug}
                            sessions={[
                                { title: "Session 2 Matches", gatesOpen: "9:30 AM", matches: "4 Matches", time: "11:30 - 3:30 PM", icon: SoccerIcon },
                                { title: "Break", time: "3:30 - 4:30 PM Intersession Break", isBreak: true },
                            ]}
                        />
                        <ScheduleDay
                            session="Session 3"
                            tournamentSlug={tournamentSlug}
                            sessions={[
                                { title: "Session 3 Matches", gatesOpen: "4:00 PM", matches: "4 Matches", time: "4:30 - 8:30 PM", icon: SoccerIcon },
                            ]}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="tab3">
                    <div>
                        <ScheduleDay
                            session="Session 4"
                            note="Session 4: Four clubs participate in the semi-final matches, the third place match and The Final"
                            tournamentSlug={tournamentSlug}
                            sessions={[
                                { title: "Semi-Finals", gatesOpen: "9:30 AM", matches: "2 Matches", time: "11:30 - 3:30 PM", icon: SoccerIcon },
                                { title: "3rd Place Match", time: "3:00 - 4:00 PM", icon: SoccerIcon },
                                { title: "Championship Match", time: "4:30 - 5:30 PM", icon: ChampionIcon },
                            ]}
                        />
                    </div>
                </TabsContent>
            </TabsContents>
        </Tabs>
    )
}