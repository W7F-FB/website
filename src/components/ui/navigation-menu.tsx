"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { CaretRightIcon } from "@/components/website-base/icons"
import { useIsTablet } from "@/hooks/use-tablet"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

type NavigationMenuContextValue = {
  isTablet: boolean
  isSheetOpen: boolean
  setIsSheetOpen: (open: boolean) => void
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  isTablet: false,
  isSheetOpen: false,
  setIsSheetOpen: () => {},
})

function useNavigationMenuContext() {
  return React.useContext(NavigationMenuContext)
}

function NavigationMenuProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const isTablet = useIsTablet()
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const contextValue = React.useMemo(
    () => ({ isTablet, isSheetOpen, setIsSheetOpen }),
    [isTablet, isSheetOpen]
  )

  return (
    <NavigationMenuContext.Provider value={contextValue}>
      {children}
    </NavigationMenuContext.Provider>
  )
}

function MobileNavigationTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isTablet, setIsSheetOpen } = useNavigationMenuContext()

  if (!isTablet) return null

  return (
    <button
      type="button"
      onClick={() => setIsSheetOpen(true)}
      className={cn(
        "flex flex-col justify-center items-center gap-1.5 p-2",
        className
      )}
      aria-label="Open navigation menu"
      {...props}
    >
      <span className="block w-6 h-0.5 bg-foreground -skew-x-16" />
      <span className="block w-6 h-0.5 bg-foreground -skew-x-16" />
      <span className="block w-6 h-0.5 bg-foreground -skew-x-16" />
    </button>
  )
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  mobileFooter,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
  mobileFooter?: React.ReactNode
}) {
  const { isTablet, isSheetOpen, setIsSheetOpen } = useNavigationMenuContext()

  return (
    <>
      {!isTablet && (
        <NavigationMenuPrimitive.Root
          data-slot="navigation-menu"
          data-viewport={viewport}
          delayDuration={50}
          className={cn(
            "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
            className
          )}
          {...props}
        >
          {children}
          {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
      )}
      {isTablet && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="flex flex-col p-0 gap-0">
            <div className="flex items-center justify-between px-6 py-4 pr-12 border-b shrink-0">
              <SheetTitle className="text-lg font-headers uppercase">Main Menu</SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-6 p-0">
                {children}
              </nav>
            </div>
            {mobileFooter && (
              <div className="px-6 py-4 border-t shrink-0">
                {mobileFooter}
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

function NavigationMenuList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  const { isTablet } = useNavigationMenuContext()

  if (isTablet) {
    return (
      <div
        data-slot="navigation-menu-list"
        className={cn("flex flex-col gap-6 pb-6", className)}
      >
        {children}
      </div>
    )
  }

  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.List>
  )
}

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  const { isTablet } = useNavigationMenuContext()

  if (isTablet) {
    return (
      <div
        data-slot="navigation-menu-item"
        className={cn("flex flex-col lg:gap-2 gap-4", className)}
      >
        {children}
      </div>
    )
  }

  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Item>
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-extra-muted hover:text-accent-foreground focus:bg-extra-muted focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-extra-muted data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-extra-muted data-[state=open]:bg-extra-muted focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 px-6 rounded-none font-headers -skew-x-[var(--skew-btn)] [&>*]:skew-x-[var(--skew-btn)]"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const { isTablet } = useNavigationMenuContext()

  if (isTablet) {
    return (
      <span
        data-slot="navigation-menu-trigger"
        className={cn(
          "inline-block font-[450] font-headers uppercase text-accent-foreground mb-0 text-base whitespace-nowrap  px-4 py-3 bg-extra-muted",
          className
        )}
      >
        {children}
      </span>
    )
  }

  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <span className="inline-flex">
        <CaretRightIcon
          className="relative top-[1px] ml-2.5 size-3 transition duration-300 rotate-90 group-data-[state=open]:rotate-[270deg]"
          aria-hidden="true"
        />
      </span>
    </NavigationMenuPrimitive.Trigger>
  )
}

function DelayedChildren({ children }: { children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = React.useState(false)

  React.useEffect(() => {
    const rafId1 = requestAnimationFrame(() => {
      setShouldRender(true)
    })
    return () => {
      cancelAnimationFrame(rafId1)
    }
  }, [])

  if (!shouldRender) return null
  return <>{children}</>
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  const { isTablet } = useNavigationMenuContext()

  if (isTablet) {
    return (
      <div
        data-slot="navigation-menu-content"
        className={cn(className, "!w-full px-6")}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 lg:absolute lg:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-extra-muted group-data-[viewport=false]/navigation-menu:text-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out  group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-none group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 group-data-[viewport=false]/navigation-menu:z-50 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        "origin-left -translate-x-[0.466rem]",
        className
      )}
      {...props}
    >
      <DelayedChildren>{children}</DelayedChildren>
    </NavigationMenuPrimitive.Content>
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-150 data-[state=closed]:duration-150 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow lg:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

const SHEET_ANIMATION_DURATION = 300

function NavigationMenuLink({
  className,
  href,
  children,
  asButton = false,
  asChild = false,
  ...props
}: React.ComponentProps<typeof Link> & {
  className?: string
  asButton?: boolean
  asChild?: boolean
}) {
  const { isTablet, setIsSheetOpen } = useNavigationMenuContext()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) {
      (props.onClick as React.MouseEventHandler)(e)
    }

    if (!isTablet) return

    const targetHref = e.currentTarget.href || (typeof href === "string" ? href : href?.toString() || "")
    const url = new URL(targetHref, window.location.origin)
    const isSamePage = url.pathname === window.location.pathname
    const hasHash = url.hash.length > 0

    e.preventDefault()
    
    if (!isSamePage) {
      router.prefetch(url.pathname)
    }

    setIsSheetOpen(false)

    setTimeout(() => {
      if (isSamePage && hasHash) {
        const element = document.querySelector(url.hash)
        element?.scrollIntoView({ behavior: "smooth" })
      } else if (hasHash) {
        router.push(url.pathname + url.hash)
      } else {
        router.push(url.pathname + url.search)
      }
    }, SHEET_ANIMATION_DURATION)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as React.HTMLAttributes<HTMLElement>)
  }

  if (asButton && !isTablet) {
    return (
      <Link
        data-slot="navigation-menu-link"
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-6 py-2 text-sm font-medium hover:bg-extra-muted hover:text-accent-foreground focus:bg-extra-muted focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 rounded-none font-headers -skew-x-[var(--skew-btn)] [&>*]:skew-x-[var(--skew-btn)]",
          className
        )}
        href={href}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      data-slot="navigation-menu-link"
      className={cn(
        "hover:bg-muted/50 hover:text-accent-foreground font-medium focus:bg-muted/50 focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground !text-foreground flex flex-col gap-1 rounded-sm p-2 transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 font-headers rounded-none w-full",
        !isTablet && "px-4 min-w-60",
        isTablet && "px-3",
        className
      )}
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

function NavSheetLink({
  children,
  href,
}: {
  children: React.ReactElement
  href?: string
}) {
  const { isTablet, setIsSheetOpen } = useNavigationMenuContext()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isTablet) return

    const targetHref = href || e.currentTarget.href
    if (!targetHref) return

    const url = new URL(targetHref, window.location.origin)
    const isSamePage = url.pathname === window.location.pathname
    const hasHash = url.hash.length > 0

    e.preventDefault()

    if (!isSamePage) {
      router.prefetch(url.pathname)
    }

    setIsSheetOpen(false)

    setTimeout(() => {
      if (isSamePage && hasHash) {
        const element = document.querySelector(url.hash)
        element?.scrollIntoView({ behavior: "smooth" })
      } else if (hasHash) {
        router.push(url.pathname + url.hash)
      } else {
        router.push(url.pathname + url.search)
      }
    }, SHEET_ANIMATION_DURATION)
  }

  return React.cloneElement(children, {
    onClick: handleClick,
  } as React.HTMLAttributes<HTMLElement>)
}

export {
  NavigationMenu,
  NavigationMenuProvider,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
  MobileNavigationTrigger,
  useNavigationMenuContext,
  NavSheetLink,
}

export { NavigationMenuContentAnimated } from "./navigation-menu-animated"
