
interface SessionBlockProps {
    title: string
    gatesOpen?: string
    matches?: string
    time: string
    icon?: React.ComponentType<{ size?: number }>
}

export function SessionBlock({ title, gatesOpen, matches, time, icon: Icon }: SessionBlockProps) {
    return (
        <div className="px-3 py-6">
            {gatesOpen && (
                <div className="flex items-center justify-between gap-6 mb-12 mt-4 flex-nowrap">
                    <span className="text-2xl font-medium font-headers text-accent-foreground whitespace-nowrap">Gates Open</span>
                    <div className="flex-1 border-t-1 border-dotted border-muted"></div>
                    <span className="text-2xl text-accent-foreground uppercase whitespace-nowrap">{gatesOpen}</span>
                </div>
            )}
            <div className="flex items-center gap-6 flex-nowrap justify-between">
                <div className="flex items-center gap-4 flex-nowrap">
                    {Icon && <Icon size={28} />}
                    <span className="text-xl font-bold font-headers leading-none">{title} Matches</span>
                    {matches && <span className="text-muted-foreground text-md">{matches}</span>}
                </div>
                <div className="flex-1 border-t-1 border-dotted border-muted"></div>
                <div className="text-2xl text-accent-foreground whitespace-nowrap">{time}</div>
            </div>
        </div>
    )
}
