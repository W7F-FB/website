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
            className={cn("relative text-center", className)}
            {...props}
        >
            <PaddingGlobal className="flex justify-center opacity-100 py-16 mt-8">
                <div className="hidden md:block text-[8.3vw] font-headers leading-none italic font-black whitespace-nowrap text-transparent text-stroke-[0.2vw]/muted">
                    FAST. FORWARD.
                </div>
                <div className="block md:hidden text-[12vw] font-headers leading-none italic font-black whitespace-nowrap text-transparent text-stroke-[0.3vw]/muted">
                    FAST.<br />FORWARD.
                </div>
            </PaddingGlobal>
        </div>
    )
})

FooterFast.displayName = "FooterFast"

export { FooterFast }
