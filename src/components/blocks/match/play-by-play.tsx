import { F24EventsResponse } from "@/types/opta-feeds/f24-match";
import { PrismicImage } from "@prismicio/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface PlayByPlayProps {
    matchEvents: F24EventsResponse;
}

export default function PlayByPlay({ matchEvents }: PlayByPlayProps) {
    return (
        <div>
            <Tabs defaultValue="all-play">
                <TabsList>
                    <TabsTrigger value="all-plays">All Plays</TabsTrigger>
                    <TabsTrigger value="scoring-plays">Scoring Plays</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}