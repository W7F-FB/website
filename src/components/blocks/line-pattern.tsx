'use client';
import { createContext, useContext, useState, useEffect } from 'react';
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

export function LinePattern({ className, children, fill, patternSize = 8, fillOpacity = 1, ...props }: LinePatternProps) {
    const [clientColor, setClientColor] = useState<string>('rgb(243, 243, 243)');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const calculatedColor = fill || flattenTransparency("var(--foreground)", "var(--background)", 0.05);
        setClientColor(calculatedColor);
    }, [fill]);

    const displayColor = isMounted ? clientColor : 'rgb(243, 243, 243)';

    return (
        <LinePatternContext.Provider value={{ color: displayColor, patternSize, fillOpacity }}>
            <div 
                className={cn('',className)}
                style={{
                    backgroundImage: isMounted ? getBgLinesPattern(displayColor, fillOpacity) : undefined,
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

