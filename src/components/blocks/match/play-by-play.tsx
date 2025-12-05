'use client';
import { F13CommentaryResponse, F13MessageType, isScoringAttempt } from "@/types/opta-feeds/f13-commentary";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from "@/components/ui/motion-tabs"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyMessage } from "@/components/ui/empty-message";
import React from "react";
import { cn } from "@/lib/utils";
import { removeW7F } from "@/lib/opta/utils";
import { SoccerIcon, SubstituteIcon, WhistleIcon, BlockedIcon, SavedIcon, BounceIcon, ReplayIcon } from "@/components/website-base/icons";

interface PlayByPlayProps extends React.ComponentProps<"div"> {
    commentary: F13CommentaryResponse | null;
    isPreGame?: boolean;
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
        if (type === 'attempt saved' || type === 'save') {
            return <SavedIcon className="size-3" />;
        }
        if (type === 'attempt blocked') {
            return <BlockedIcon className="size-3" />;
        }
        if (type === 'yellow card') {
            return <div className="h-3.5 w-2.5 rounded-sm bg-yellow-500 mx-auto" />;
        }
        if (type === 'red card' || type === 'second yellow card') {
            return <div className="h-3.5 w-2.5 rounded-sm bg-red-600 mx-auto" />;
        }
        if (type === 'free kick lost') {
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

interface ActionCellProps {
    type: F13MessageType;
}

function ActionCell({ type }: ActionCellProps) {
    if (type !== 'goal') {
        return <TableCell className="w-16" />;
    }

    return (
        <TableCell className="w-16 align-middle">
            <Button size="sm" variant="outline" className="hidden h-7 px-2 text-xs gap-1">
                <ReplayIcon className="size-3" />
                watch
            </Button>
        </TableCell>
    );
}

export default function PlayByPlay({ commentary, className, isPreGame }: PlayByPlayProps) {
    const messages = Array.isArray(commentary?.Commentary?.message) 
        ? commentary.Commentary.message 
        : [];
    const scoringMessages = messages.filter(msg => isScoringAttempt(msg));

    if (messages.length === 0) {
        return (
            <EmptyMessage className="py-20">
                {isPreGame 
                    ? "Play by play commentary will be available once the match begins."
                    : "No commentary available"
                }
            </EmptyMessage>
        );
    }

    return (
        <Tabs className={cn("",className)}>
            <TabsList className="bg-card w-full">
                <TabsTrigger value="all-plays" className="text-xs lg:text-base">All Plays</TabsTrigger>
                <TabsTrigger value="scoring-chances" className="text-xs lg:text-base">Scoring Chances</TabsTrigger>
            </TabsList>
            <TabsContents>
                <TabsContent value="all-plays">
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
                                    <ActionCell type={message.type} />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                                        <ActionCell type={message.type} />
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyMessage className="py-20">No scoring plays</EmptyMessage>
                    )}
                </TabsContent>
            </TabsContents>
        </Tabs>
    )
}
