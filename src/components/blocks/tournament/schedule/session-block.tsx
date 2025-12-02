
interface SessionBlockProps {
    title: string
    gatesOpen?: string
    matches?: string
    time: string
    icon?: React.ComponentType<{ size?: number }>
}

export function SessionBlock({ title, gatesOpen, matches, time, icon: Icon }: SessionBlockProps) {
    return (
        <div className="px-3 py-3">
            {gatesOpen && (
                <div className="flex items-center justify-between gap-6 mb-6 mt-4 flex-nowrap">
                    <span className="text-base md:text-2xl font-medium font-headers text-accent-foreground whitespace-nowrap">Gates Open</span>
                    <div className="flex-1 border-t border-dotted border-muted"></div>
                    <span className="text-base md:text-2xl text-accent-foreground uppercase whitespace-nowrap">{gatesOpen}</span>
                </div>
            )}
            <div className="flex items-center gap-2 md:gap-6 flex-nowrap justify-between">
                <div className="flex items-center gap-2 md:gap-4 flex-nowrap">
                    {Icon && (
                        <div className="hidden md:block">
                            <Icon size={28} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1 items-start md:flex-row md:items-center">
                        <span className="text-base md:text-xl text-nowrap font-bold font-headers leading-none">{title}</span>
                        {matches && <span className="text-muted-foreground text-sm md:text-md md:mt-1.5">{matches}</span>}
                    </div>
                </div>
                <div className="hidden md:block flex-1 border-t border-dotted border-muted"></div>
                <div className="text-sm md:text-2xl text-accent-foreground whitespace-nowrap md:mt-1.5">{time}</div>
            </div>
        </div>
    )
}
