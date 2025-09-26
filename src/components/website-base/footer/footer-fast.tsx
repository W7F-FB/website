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
            <PaddingGlobal className="flex justify-center opacity-50 py-16 mt-8">
                <div className="text-[8.3vw] font-headers leading-none italic font-black whitespace-nowrap text-transparent text-stroke-[0.2vw]/muted">
                    FAST. FORWARD.
                </div>
            </PaddingGlobal>
        </div>
    )
})

FooterFast.displayName = "FooterFast"

export { FooterFast }
