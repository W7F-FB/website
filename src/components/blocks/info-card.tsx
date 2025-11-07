import { cn } from "@/lib/utils";

interface InfoCardProps {
    subtitle: string;
    title?: string;
    description?: string;
    className?: string;
}

export function InfoCard({ subtitle, title, description, className }: InfoCardProps) {
    return (
        <div className={cn("h-full border-b", className)}>
            <div className="pb-6 space-y-2">
                <p className="font-[450] font-headers uppercase text-accent-foreground col-span-2">
                    {subtitle}
                </p>
                <span className="font-semibold font-headers">
                    {title}
                </span>
                <p className="text-muted-foreground text-sm py-2">
                    {description}
                </p>
            </div>
        </div>
    );
}

