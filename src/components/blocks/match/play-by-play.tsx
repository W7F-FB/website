import { F24EventsResponse } from "@/types/opta-feeds/f24-match";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { H2 } from "@/components/website-base/typography";


interface PlayByPlayProps {
    matchEvents: F24EventsResponse;
}

export default function PlayByPlay({ matchEvents }: PlayByPlayProps) {

    return (
        <div className="space-y-6">
            <div className="pt-12 border-b ">
                <H2>Play-By-Play</H2>
            </div>
            <Tabs defaultValue="all-plays">
                <TabsList className="bg-card w-full">
                    <TabsTrigger value="all-plays">All Plays</TabsTrigger>
                    <TabsTrigger value="scoring-plays">Scoring Plays</TabsTrigger>
                </TabsList>
                <TabsContent value="all-plays">

                </TabsContent>
            </Tabs>
        </div>
    )
}
