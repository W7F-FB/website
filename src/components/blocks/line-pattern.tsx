import { getBgLinesPattern } from "@/components/ui/bg-lines";
import { cn } from '@/lib/utils';

interface LinePatternProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
    fill?: string;
    patternSize?: number;
    fillOpacity?: number;
}


export function LinePattern({ className, children, fill = 'oklch(0.187 0.000 0.000)', patternSize = 8, fillOpacity = 1, ...props }: LinePatternProps) {
    return (
        <div 
            className={cn('',className)}
            style={{
                backgroundImage: getBgLinesPattern(fill, fillOpacity),
                backgroundRepeat: 'repeat',
                backgroundSize: `${patternSize}px ${patternSize}px`
            }}
            {...props}
        >
            {children}
        </div>
    );
}

