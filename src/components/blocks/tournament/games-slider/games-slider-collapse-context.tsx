"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type GamesSliderCollapseContextType = {
  isCollapsed: boolean
  toggleCollapse: () => void
  collapsable: boolean
}

const GamesSliderCollapseContext = createContext<GamesSliderCollapseContextType | null>(null)

type GamesSliderCollapseProviderProps = {
  children: ReactNode
  collapsable?: boolean
}

export function GamesSliderCollapseProvider({ children, collapsable = false }: GamesSliderCollapseProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed(prev => !prev)

  useEffect(() => {
    const stickyDistance = collapsable && !isCollapsed ? "13.5rem" : "8rem"
    document.documentElement.style.setProperty("--default-sticky-distance", stickyDistance)
    
    return () => {
      document.documentElement.style.removeProperty("--default-sticky-distance")
    }
  }, [collapsable, isCollapsed])

  return (
    <GamesSliderCollapseContext.Provider value={{ isCollapsed, toggleCollapse, collapsable }}>
      {children}
    </GamesSliderCollapseContext.Provider>
  )
}

export function useGamesSliderCollapse() {
  const context = useContext(GamesSliderCollapseContext)
  if (!context) {
    return { isCollapsed: false, toggleCollapse: () => {}, collapsable: false }
  }
  return context
}

