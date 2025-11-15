'use client';
import { F13CommentaryResponse, F13MessageType, isScoringAttempt } from "@/types/opta-feeds/f13-commentary";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from "@/components/ui/motion-tabs"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { removeW7F } from "@/lib/opta/utils";
import { SoccerIcon, SubstituteIcon, WhistleIcon, BlockIcon, BounceIcon } from "@/components/website-base/icons";

interface PlayByPlayProps extends React.ComponentProps<"div"> {
    matchId: string;
    competitionId: string;
    seasonId: string;
}

interface TimestampCellProps {
    time?: string;
    isGoal?: boolean;
}

function TimestampCell({ time, isGoal }: TimestampCellProps) {
    const isValidTimestamp = time && /^\d+'$/.test(time);
    const displayTime = isValidTimestamp ? time : null;
    
    return (
        <TableCell className="align-middle text-sm text-muted-foreground w-10 font-headers text-xxs font-medium relative pl-3">
            {isGoal && (
                <div className="absolute h-full top-0 bottom-0 left-0 w-1.5 bg-gradient-to-r from-foreground/50 to-foreground/0" />
            )}
            {displayTime || ''}
        </TableCell>
    );
}

interface EventTypeCellProps {
    type: F13MessageType;
}

function EventTypeCell({ type }: EventTypeCellProps) {
    const getIcon = () => {
        if (type === 'goal') {
            return <SoccerIcon className="size-3" />;
        }
        if (type === 'substitution') {
            return <SubstituteIcon className="size-3" />;
        }
        if (type === 'miss' || type === 'post') {
            return <BounceIcon className="size-3" />;
        }
        if (type === 'attempt saved' || type === 'save' || type === 'attempt blocked') {
            return <BlockIcon className="size-3" />;
        }
        if (type === 'yellow card' || type === 'red card' || type === 'second yellow card' || type === 'free kick lost') {
            return <WhistleIcon className="size-3" />;
        }
        return null;
    };

    return (
        <TableCell className="align-middle text-xs text-muted-foreground capitalize w-6">
            {getIcon()}
        </TableCell>
    );
}

interface CommentCellProps {
    comment: string;
    type: F13MessageType;
}

function CommentCell({ comment, type }: CommentCellProps) {
    const cleanedComment = removeW7F(comment);
    
    return (
        <TableCell className="align-center whitespace-normal">
            <div className={cn(
                "break-words text-xs",
                type === 'goal' ? 'font-semibold' : 'font-base text-muted-foreground'
            )}>{cleanedComment}</div>
        </TableCell>
    );
}

export default function PlayByPlay({ matchId, competitionId, seasonId, className }: PlayByPlayProps) {
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
    const scoringMessages = messages.filter(msg => isScoringAttempt(msg));

    return (
        <Tabs className={cn("",className)} defaultValue="all-plays">
            <TabsList className="bg-card w-full">
                <TabsTrigger value="all-plays">All Plays</TabsTrigger>
                <TabsTrigger value="scoring-chances">Scoring Chances</TabsTrigger>
            </TabsList>
            <TabsContents>
                <TabsContent value="all-plays">
                    {messages.length > 0 ? (
                        <Table className={cn()}>
                            <TableBody>
                                {messages.map((message, index) => (
                                    <TableRow key={message.id} className={cn(
                                        message.type === 'goal' ? 'bg-muted/50 hover:bg-muted/50' :
                                        index % 2 === 1 ? 'bg-muted/20 hover:bg-muted/20' : 'hover:bg-transparent'
                                    )}>
                                        <TimestampCell 
                                            time={message.time}
                                            isGoal={message.type === 'goal'}
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
                <TabsContent value="scoring-chances">
                    {scoringMessages.length > 0 ? (
                        <Table className={cn()}>
                            <TableBody>
                                {scoringMessages.map((message, index) => (
                                    <TableRow key={message.id} className={cn(
                                        message.type === 'goal' ? 'bg-muted/80 hover:bg-muted/80' :
                                        index % 2 === 1 ? 'bg-muted/20 hover:bg-muted/20' : 'hover:bg-transparent'
                                    )}>
                                        <TimestampCell 
                                            time={message.time}
                                            isGoal={message.type === 'goal'}
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
    )
}
