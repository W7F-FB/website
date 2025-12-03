"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cn } from "@/lib/utils"
import { useNavigationMenuContext } from "./navigation-menu"

const ANIMATION_DURATION = 200

function NavigationMenuContentAnimated({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  const { isTablet } = useNavigationMenuContext()
  const [isVisible, setIsVisible] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (isTablet) return

    const element = contentRef.current
    if (!element) return

    const handleStateChange = () => {
      const state = element.getAttribute("data-state")
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      if (state === "open") {
        setIsVisible(true)
      } else if (state === "closed") {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false)
        }, ANIMATION_DURATION)
      }
    }

    handleStateChange()

    const observer = new MutationObserver(handleStateChange)
    observer.observe(element, { attributes: true, attributeFilter: ["data-state"] })
    
    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isTablet])

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
      ref={contentRef}
      data-slot="navigation-menu-content"
      forceMount
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full py-2 lg:absolute lg:w-auto",
        "group-data-[viewport=false]/navigation-menu:text-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:pt-2  group-data-[viewport=false]/navigation-menu:rounded-none group-data-[viewport=false]/navigation-menu:duration-200 group-data-[viewport=false]/navigation-menu:z-50 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        "origin-left -translate-x-[0.466rem]",
        !isVisible && "hidden",
        className
      )}
      {...props}
    >
      <div className="bg-extra-muted border shadow overflow-hidden p-2">
        {children}
      </div>
    </NavigationMenuPrimitive.Content>
  )
}

export { NavigationMenuContentAnimated }
