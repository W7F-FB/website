import { SessionBlock } from "@/components/blocks/tournament/schedule/session-block"
import { H3, P } from "@/components/website-base/typography"
import { CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Session {
    title: string
    gatesOpen?: string
    matches?: string
    time: string
    isBreak?: boolean
    icon?: React.ComponentType<{ size?: number }>
}

interface ScheduleDayProps {
    session: string
    note?: string
    tournamentSlug: string
    sessions: Session[]
}



export function ScheduleDay({ session, note, tournamentSlug, sessions }: ScheduleDayProps) {
    return (
        <div>
            {note && (
                <P className="text-sm py-6 flex items-center gap-2"><CircleAlert className="w-4 h-4" /> {note}</P>
            )}
            <div className="px-6 py-4 bg-card flex items-center justify-between">
                <H3 className="uppercase text-base md:text-2xl">{session}</H3>
                <Button asChild size="sm" variant="outline">
                    <Link href={`/tournament/${tournamentSlug}/schedule`}><span>Match Schedule</span></Link>
                </Button>
            </div>

            {sessions.map((session, i) =>
                session.isBreak ? (
                    <p key={i} className="flex items-center gap-2 text-muted-foreground text-sm py-6 uppercase">
                        <CircleAlert className="w-4 h-4" />
                        {session.time}
                    </p>
                ) : (
                    <SessionBlock key={i} {...session} />
                )
            )}
        </div>
    )
}