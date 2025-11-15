'use client';
import { F13CommentaryResponse, F13MessageType } from "@/types/opta-feeds/f13-commentary";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from "@/components/ui/motion-tabs"
import { H2 } from "@/components/website-base/typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";

interface PlayByPlayProps extends React.ComponentProps<"div"> {
    matchId: string;
    competitionId: string;
    seasonId: string;
}

interface TimestampCellProps {
    time?: string;
    period?: string;
    minute?: string;
    second?: string;
}

function TimestampCell({ time, period, minute, second }: TimestampCellProps) {
    return (
        <TableCell className="align-middle text-sm text-muted-foreground w-[120px]">
            {time || `${period}H ${minute}:${second}`}
        </TableCell>
    );
}

interface EventTypeCellProps {
    type: F13MessageType;
}

function EventTypeCell({ type }: EventTypeCellProps) {
    return (
        <TableCell className="align-middle text-xs text-muted-foreground capitalize w-[150px]">
            {type}
        </TableCell>
    );
}

interface CommentCellProps {
    comment: string;
    type: F13MessageType;
}

function CommentCell({ comment, type }: CommentCellProps) {
    const isGoalOrPenaltyGoal = type === 'goal' || 
        (typeof type === 'string' && type.toLowerCase().includes('penalty') && type.toLowerCase().includes('goal'));
    
    return (
        <TableCell className="align-top whitespace-normal">
            <div className={cn(
                "break-words",
                isGoalOrPenaltyGoal ? 'font-medium' : 'font-light text-muted-foreground'
            )}>{comment}</div>
        </TableCell>
    );
}

export default function PlayByPlay({ matchId, competitionId, seasonId, className, ...props }: PlayByPlayProps) {
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
        <div className={cn("space-y-6", className)} {...props}>
            <div className="border-b">
                <H2>Play-By-Play</H2>
            </div>
            <Tabs defaultValue="all-plays">
                <TabsList className="bg-card w-full">
                    <TabsTrigger value="all-plays">All Plays</TabsTrigger>
                    <TabsTrigger value="scoring-chances">Scoring Chances</TabsTrigger>
                </TabsList>
                <TabsContents>
                    <TabsContent value="all-plays">
                        {messages.length > 0 ? (
                            <Table>
                                <TableBody>
                                    {messages.map((message, index) => (
                                        <TableRow key={message.id} className={cn(
                                            index % 2 === 1 ? 'bg-muted/20 hover:bg-muted/20' : 'hover:bg-transparent'
                                        )}>
                                            <TimestampCell 
                                                time={message.time}
                                                period={message.period}
                                                minute={message.minute}
                                                second={message.second}
                                            />
                                            <EventTypeCell type={message.type} />
                                            <CommentCell comment={message.comment} type={message.type} />
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No commentary available</div>
                        )}
                    </TabsContent>
                    <TabsContent value="scoring-plays">
                        {scoringMessages.length > 0 ? (
                            <Table>
                                <TableBody>
                                    {scoringMessages.map((message, index) => (
                                        <TableRow key={message.id} className={cn(
                                            index % 2 === 1 ? 'bg-muted/20 hover:bg-muted/20' : 'hover:bg-transparent'
                                        )}>
                                            <TimestampCell 
                                                time={message.time}
                                                period={message.period}
                                                minute={message.minute}
                                                second={message.second}
                                            />
                                            <EventTypeCell type={message.type} />
                                            <CommentCell comment={message.comment} type={message.type} />
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No scoring plays</div>
                        )}
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </div>
    )
}
