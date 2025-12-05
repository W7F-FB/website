"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const ResponsiveDialogContext = React.createContext<{ isMobile: boolean }>({
    isMobile: false,
})

function useResponsiveDialog() {
    return React.useContext(ResponsiveDialogContext)
}

function ResponsiveDialog({
    children,
    ...props
}: React.ComponentProps<typeof Dialog>) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <ResponsiveDialogContext.Provider value={{ isMobile }}>
                <Drawer {...props}>{children}</Drawer>
            </ResponsiveDialogContext.Provider>
        )
    }

    return (
        <ResponsiveDialogContext.Provider value={{ isMobile }}>
            <Dialog {...props}>{children}</Dialog>
        </ResponsiveDialogContext.Provider>
    )
}

function ResponsiveDialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogTrigger>) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerTrigger {...props} />
    }

    return <DialogTrigger {...props} />
}

function ResponsiveDialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof DialogContent>) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return (
            <DrawerContent className={className} {...props} suppressHydrationWarning>
                {children}
            </DrawerContent>
        )
    }

    return (
        <DialogContent
            className={cn("sm:max-w-[425px]", className)}
            showCloseButton={showCloseButton}
            {...props}
            suppressHydrationWarning
        >
            {children}
        </DialogContent>
    )
}

function ResponsiveDialogHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerHeader className={cn("text-left", className)} {...props} />
    }

    return <DialogHeader className={className} {...props} />
}

function ResponsiveDialogFooter({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerFooter className={cn("pt-2", className)} {...props} />
    }

    return <DialogFooter className={className} {...props} />
}

function ResponsiveDialogTitle({
    ...props
}: React.ComponentProps<typeof DialogTitle>) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerTitle {...props} />
    }

    return <DialogTitle {...props} />
}

function ResponsiveDialogDescription({
    ...props
}: React.ComponentProps<typeof DialogDescription>) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerDescription {...props} />
    }

    return <DialogDescription {...props} />
}

function ResponsiveDialogClose({
    ...props
}: React.ComponentProps<typeof DialogClose>) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return <DrawerClose {...props} />
    }

    return <DialogClose {...props} />
}

function ResponsiveDialogBody({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const { isMobile } = useResponsiveDialog()

    if (isMobile) {
        return (
        <div className="max-h-[60vh] overflow-y-auto">
            <div className={cn("px-4 pt-6 pb-4", className)} {...props}>
                {children}
            </div>
        </div>
    )}

    return <div className={className} {...props}>{children}</div>
}

export {
    ResponsiveDialog,
    ResponsiveDialogTrigger,
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogFooter,
    ResponsiveDialogTitle,
    ResponsiveDialogDescription,
    ResponsiveDialogClose,
    ResponsiveDialogBody,
    useResponsiveDialog,
}
