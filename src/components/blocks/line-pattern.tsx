'use client';
import { createContext, useContext } from 'react';
import { getBgLinesPattern } from "@/components/ui/bg-lines";
import { cn } from '@/lib/utils';
import { flattenTransparency } from "@/lib/flatten-transparency";

interface LinePatternProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
    fill?: string;
    patternSize?: number;
    fillOpacity?: number;
}

interface LinePatternContextValue {
    color: string;
    patternSize: number;
    fillOpacity: number;
}

const LinePatternContext = createContext<LinePatternContextValue | null>(null);

export function useLinePattern() {
    const context = useContext(LinePatternContext);
    if (!context) {
        throw new Error('useLinePattern must be used within a LinePattern component');
    }
    return context;
}

const defaultColor = flattenTransparency("var(--foreground)", "var(--background)", 0.05);

export function LinePattern({ className, children, fill = defaultColor, patternSize = 8, fillOpacity = 1, ...props }: LinePatternProps) {
    return (
        <LinePatternContext.Provider value={{ color: fill, patternSize, fillOpacity }}>
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
        </LinePatternContext.Provider>
    );
}

