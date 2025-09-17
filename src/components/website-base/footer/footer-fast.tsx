import * as React from "react"
import { cn } from "@/lib/utils"
import { PaddingGlobal } from "../padding-containers"
const FooterFast = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("relative text-center overflow-hidden", className)}
            {...props}
        >
            <PaddingGlobal className="flex justify-center opacity-5 py-16 mt-8">
                <div 
                    className="text-[8.3vw] font-headers leading-none italic font-black whitespace-nowrap" 
                    style={{ color: 'transparent', WebkitTextStroke: '0.2vw white' }}
                >
                    FAST. FORWARD.
                </div>
            </PaddingGlobal>
        </div>
    )
})

FooterFast.displayName = "FooterFast"

export { FooterFast }
