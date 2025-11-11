import { SessionBlock } from "@/components/blocks/tournament/schedule/session-block"
import { H3, P } from "@/components/website-base/typography"
import { CircleAlert } from "lucide-react"

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
    sessions: Session[]
}



export function ScheduleDay({ session, note, sessions }: ScheduleDayProps) {
    return (
        <div>
            {note && (
                <P className="text-sm py-6 flex items-center gap-2"><CircleAlert className="w-4 h-4" /> {note}</P>
            )}
            <div className="px-6 py-4 bg-card">
                <H3 className="uppercase">{session}</H3>
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