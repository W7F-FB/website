'use client';
import { F13CommentaryResponse } from "@/types/opta-feeds/f13-commentary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { H2 } from "@/components/website-base/typography";
import { useEffect, useState } from "react";

interface PlayByPlayProps {
    matchId: string;
    competitionId: string;
    seasonId: string;
}

export default function PlayByPlay({ matchId, competitionId, seasonId }: PlayByPlayProps) {
    const [commentary, setCommentary] = useState<F13CommentaryResponse | null>(null);

    useEffect(() => {
        async function fetchCommentary() {
            const fetchUrl = `/api/opta/f13-commentary-feed?matchId=${matchId}&competitionId=${competitionId}&seasonId=${seasonId}&language=en`;
            console.log('F13 Request URL:', fetchUrl);
            const response = await fetch(fetchUrl);
            const data = await response.json();
            console.log('F13 Commentary Response:', data);
            setCommentary(data);
        }
        fetchCommentary();
    }, [matchId, competitionId, seasonId]);

    const messages = commentary?.Commentary?.message || [];
    const scoringMessages = messages.filter(msg => 
        msg.type === 'goal' || msg.type === 'miss' || msg.type === 'post' || msg.type === 'attempt saved'
    );

    return (
        <div className="space-y-6">
            <div className="pt-12 border-b">
                <H2>Play-By-Play</H2>
            </div>
            <Tabs defaultValue="all-plays">
                <TabsList className="bg-card w-full">
                    <TabsTrigger value="all-plays">All Plays</TabsTrigger>
                    <TabsTrigger value="scoring-plays">Scoring Plays</TabsTrigger>
                </TabsList>
                <TabsContent value="all-plays">
                    {messages.length > 0 ? (
                        <div className="space-y-2">
                            {messages.map((message) => (
                                <div key={message.id} className="p-3 border rounded">
                                    <div className="text-sm text-muted-foreground">
                                        {message.time || `${message.period}H ${message.minute}:${message.second}`}
                                    </div>
                                    <div className="font-medium">{message.comment}</div>
                                    <div className="text-xs text-muted-foreground mt-1 capitalize">{message.type}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">No commentary available</div>
                    )}
                </TabsContent>
                <TabsContent value="scoring-plays">
                    {scoringMessages.length > 0 ? (
                        <div className="space-y-2">
                            {scoringMessages.map((message) => (
                                <div key={message.id} className="p-3 border rounded">
                                    <div className="text-sm text-muted-foreground">
                                        {message.time || `${message.period}H ${message.minute}:${message.second}`}
                                    </div>
                                    <div className="font-medium">{message.comment}</div>
                                    <div className="text-xs text-muted-foreground mt-1 capitalize">{message.type}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">No scoring plays</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
