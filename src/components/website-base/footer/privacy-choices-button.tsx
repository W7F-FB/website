"use client"

import { useEffect, useRef } from "react"
import { PrivacyChoicesIcon } from "@/components/website-base/icons"
import { dev } from "@/lib/dev"

export function PrivacyChoicesButton() {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined" || scriptLoadedRef.current) return

    window.semaphore ||= []
    window.ketch ||= function (...args: unknown[]) {
      window.semaphore.push(args)
    }

    if (!document.querySelector('script[src*="ketchcdn.com"]')) {
      const script = document.createElement("script")
      script.src = "https://global.ketchcdn.com/web/v3/config/world_sevens_football/website_smart_tag/boot.js"
      script.defer = true
      script.async = true
      
      script.onload = () => {
        scriptLoadedRef.current = true
        dev.log("Ketch script loaded successfully")
      }
      
      script.onerror = () => {
        dev.log("Error loading Ketch script")
      }
      
      document.head.appendChild(script)
    } else {
      scriptLoadedRef.current = true
    }
  }, [])

  const handlePrivacyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (typeof window === "undefined") return

    try {
      if (typeof window.ketch === "function") {
        window.ketch("showPreferences")
      } else {
        dev.log("Ketch is not ready yet")
      }
    } catch (err) {
      dev.log("Error calling Ketch:", err)
    }
  }

  return (
    <div className="flex md:justify-end pb-4">
      <button
        type="button"
        onClick={handlePrivacyClick}
        className="text-muted-foreground opacity-50 hover:opacity-100 transition-opacity text-sm flex items-center gap-2 cursor-pointer"
        aria-label="Manage privacy preferences"
      >
        <span>Your Privacy Choices</span>
        <PrivacyChoicesIcon size={30} />
      </button>
    </div>
  )
}

declare global {
  interface Window {
    semaphore: unknown[]
    ketch: (...args: unknown[]) => void
  }
}

