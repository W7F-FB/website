import { LinePattern } from "@/components/blocks/line-pattern"
import { cn } from "@/lib/utils"

interface FastBannerProps {
    text: string
    position?: "left" | "right"
    strokeWidth?: "1px" | "1.5px"
    uppercase?: boolean
    className?: string
}

export function FastBanner({ text, position = "left", strokeWidth = "1px", uppercase = false, className }: FastBannerProps) {
    const positionClass = position === "left" ? "left-8" : "right-8"
    const strokeClass = strokeWidth === "1px" ? "text-stroke-[1px]/line-pattern" : "text-stroke-[1.5px]/line-pattern"
    const uppercaseClass = uppercase ? "uppercase" : ""
    
    return (
        <LinePattern className={cn("flex-grow self-stretch flex items-center justify-center relative overflow-hidden", className)}>
            <div className={`absolute top-8 ${positionClass} writing-mode-vrl text-[6vw] font-headers leading-none italic font-black whitespace-nowrap text-background ${strokeClass} select-none ${uppercaseClass}`}>
                <span className="block">{text}</span>
            </div>
        </LinePattern>
    )
}

interface FastBannerFullProps {
    className?: string
}

export function FastBannerFull({ className }: FastBannerFullProps) {
    return (
        <LinePattern className={cn("flex-grow self-stretch flex items-center justify-center relative overflow-hidden", className)}>
            <div className="absolute inset-0 flex items-center justify-center text-[12vw] lg:text-[5vw] font-headers leading-[0.85] italic font-black text-background text-stroke-[1.5px]/line-pattern select-none text-center uppercase">
                <div>
                    <span className="block">FAST.</span>
                    <span className="block">FORWARD.</span>
                </div>
            </div>
        </LinePattern>
    )
}

