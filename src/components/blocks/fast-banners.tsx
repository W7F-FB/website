import { LinePattern } from "@/components/blocks/line-pattern"

interface FastBannerProps {
    text: string
    position?: "left" | "right"
    strokeWidth?: "1px" | "1.5px"
    uppercase?: boolean
}

export function FastBanner({ text, position = "left", strokeWidth = "1px", uppercase = false }: FastBannerProps) {
    const positionClass = position === "left" ? "left-8" : "right-8"
    const strokeClass = strokeWidth === "1px" ? "text-stroke-[1px]/line-pattern" : "text-stroke-[1.5px]/line-pattern"
    const uppercaseClass = uppercase ? "uppercase" : ""
    
    return (
        <LinePattern className="flex-grow self-stretch flex items-center justify-center relative">
            <div className={`absolute top-8 ${positionClass} writing-mode-vrl text-[6vw] font-headers leading-none italic font-black whitespace-nowrap text-background ${strokeClass} select-none ${uppercaseClass}`}>
                <span className="block">{text}</span>
            </div>
        </LinePattern>
    )
}

